const path = require('path');
const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const { sanitizeHtml } = require('./helpers.js');
const {saveError} = require("./errorHandler");

const analyzeHTML = async (HTML) => {
    let bodyContent = HTML.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1];
    bodyContent = sanitizeHtml(bodyContent);

    const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: `Analyze the following HTML and determine if there is a message indicating that the subscription has been canceled. Return a JSON object with result true or false without code formatting if a message indicating that the subscription has been canceled is found: \n\n${bodyContent}`}],
        model: 'gpt-4o',
    });

    const aiResponse = completion.choices[0].message.content;
    const aiResponseJson = JSON.parse(aiResponse);

    return aiResponseJson.result;
};

const analyzeAndStoreUnsubscribeMethod = async (domain, link) => {
    const puppeteer = require('puppeteer');
    const { saveRepository, repository } = require('./repository');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(link, { waitUntil: 'networkidle2' });

    try {
        let errorDetected = false;

        page.on('requestfailed', request => {
            console.error(`Request failed: ${request.url()} - ${request.failure().errorText}`);
            errorDetected = true;
        });

        page.on('response', response => {
            if (!response.ok()) {
                console.error(`HTTP error: ${response.status()} - ${response.url()}`);
                errorDetected = true;
            }
        });

        if (errorDetected) {
            throw new Error('Failed to load the unsubscribe page');
        }

        const html = await page.content();
        let bodyContent = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1];
        bodyContent = sanitizeHtml(bodyContent);

        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: `Analyze the following HTML and determine if there is a message indicating that the subscription has been canceled or if there is any additional action required to cancel the subscription. Return a JSON object with result true or false without code formatting if a message indicating that the subscription has been canceled is found; otherwise, look for the element in the HTML that allows the subscription to be canceled. Return only an unformatted JSON with type indicating the html element and selector with the "selector" of the element to interact with to complete the cancellation: \n\n${bodyContent}`}],
            model: 'gpt-4o',
        });

        const aiResponse = completion.choices[0].message.content;
        const aiResponseJson = JSON.parse(aiResponse);
        let result = false;
        if (Object(aiResponseJson).hasOwnProperty('result')) {
            repository[domain] = {
                type: 'message',
            }
            if (aiResponseJson.result) {
                result = true
            }
        } else {
            repository[domain] = {
                type: 'selector',
                selector: aiResponseJson.selector,
            }
        }
        saveRepository(repository);
        return result;

    } catch (error) {
        const screenshotPath = path.join('puppeteer_errors', `error_${Date.now()}.png`);
        await page.screenshot({ path: screenshotPath });
        saveError(link, error, screenshotPath);
        throw error;

    } finally {
        await browser.close();
    }
};

module.exports = {
    analyzeHTML,
    analyzeAndStoreUnsubscribeMethod,
};
