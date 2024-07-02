const puppeteer = require('puppeteer');
const path = require('path');
const { repository } = require('./repository');
const { saveError } = require('./errorHandler');
const { analyzeHTML, analyzeAndStoreUnsubscribeMethod } = require('./analyzer');

const processLink = async (link) => {
    try {
        const url = new URL(link);
        const domain = url.hostname.replace('www.', '');
        let analyzeAndStoreUnsubscribeMethodResult = false;
        let firstTime = false;

        if (!repository[domain]) {
            firstTime = true;
            analyzeAndStoreUnsubscribeMethodResult = await analyzeAndStoreUnsubscribeMethod(domain, link);
            if (typeof analyzeAndStoreUnsubscribeMethodResult === 'object') {
                return { link, ...analyzeAndStoreUnsubscribeMethodResult };
            }
        }

        const method = repository[domain];

        if (method.type === 'message' && firstTime) {
            if (!analyzeAndStoreUnsubscribeMethodResult) {
                return { link, success: false, message: 'Unable to unsubscribe or no unsubscribe method found' };
            } else {
                return { link, success: true, message: 'Unsubscribed successfully' };
            }
        } else if (method.type === 'message' && !firstTime) {
            const handleLinkUnsubscribeMessageOnlyResult = await handleLinkUnsubscribeMessageOnly(link);
            if (typeof handleLinkUnsubscribeMessageOnlyResult === 'object') {
                return { link, ...handleLinkUnsubscribeMessageOnlyResult };
            }
            if (handleLinkUnsubscribeMessageOnlyResult) {
                return { link, success: true, message: 'Unsubscribed successfully' };
            } else {
                return { link, success: false, message: 'Unable to unsubscribe or no unsubscribe method found' };
            }
        }

        if (method.type === 'selector') {
            try {
                const handleLinkUnsubscribeResult = await handleLinkUnsubscribe(link, method);
                if (typeof handleLinkUnsubscribeResult === 'object') {
                    return { link, ...handleLinkUnsubscribeResult };
                }
                if (handleLinkUnsubscribeResult) {
                    return { link, success: true, message: 'Unsubscribed successfully' };
                } else {
                    return { link, success: false, message: 'Unable to unsubscribe' };
                }
            } catch (error) {
                return { link, success: false, message: 'Failed to unsubscribe' };
            }
        } else {
            return { link, success: false, message: 'Unsupported unsubscribe type' };
        }
    } catch (error) {
        return { link, success: false, message: 'Error processing link' };
    }
};

const handleLinkUnsubscribeMessageOnly = async (link) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(link, { waitUntil: 'networkidle2' });

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
        return await analyzeHTML(html);

    } catch (error) {
        const screenshotPath = path.join('puppeteer_errors', `error_${Date.now()}.png`);
        await page.screenshot({ path: screenshotPath });
        saveError(link, error, screenshotPath);
        throw error;

    } finally {
        await browser.close();
    }
}

const handleLinkUnsubscribe = async (link, method) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        let errorDetected = false;

        page.on('requestfailed', request => {
            console.error(`Request failed: ${request.url()}`);
            errorDetected = true;
        });

        page.on('response', response => {
            if (!response.ok()) {
                console.error(`HTTP error: ${response.status()} - ${response.url()}`);
                errorDetected = true;
            }
        });

        await page.goto(link, { waitUntil: 'networkidle2' });

        if (errorDetected) {
            throw new Error('Failed to load the unsubscribe page');
        }

        await page.waitForSelector(method.selector, { visible: true, timeout: 5000 });

        await page.evaluate(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.scrollIntoView();
            }
        }, method.selector);

        const initialBodyContent = await page.evaluate(() => document.body.innerHTML);

        await page.click(method.selector);

        await page.waitForFunction(
            (initialContent) => document.body.innerHTML !== initialContent,
            { timeout: 60000 },
            initialBodyContent
        );

        const newHtml = await page.content();
        return await analyzeHTML(newHtml);

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
    processLink,
};
