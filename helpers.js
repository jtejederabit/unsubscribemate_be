const sanitizeHtml = (HTML) => {
    let sanitizedHTML = HTML;
    sanitizedHTML = sanitizedHTML.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    sanitizedHTML = sanitizedHTML.replace(/<svg[^>]*>[\s\S]*>[\s\S]*?<\/svg>/gi, '');
    sanitizedHTML = sanitizedHTML.replace(/<style[^>]*>[\s\S]*>[\s\S]*?<\/style>/gi, '');
    sanitizedHTML = sanitizedHTML.replace(/<audio[^>]*>[\s\S]*>[\s\S]*?<\/audio>/gi, '');
    sanitizedHTML = sanitizedHTML.replace(/<video[^>]*>[\s\S]*?<\/video>/gi, '');
    sanitizedHTML = sanitizedHTML.replace(/<img[^>]*>[\s\S]*>[\s\S]*?<\/img>/gi, '');
    sanitizedHTML = sanitizedHTML.replace(/<embed[^>]*>[\s\S]*?<\/embed>/gi, '');
    sanitizedHTML = sanitizedHTML.replace(/<canvas[^>]*>[\s\S]*?<\/canvas>/gi, '');
    sanitizedHTML = sanitizedHTML.replace(/<map[^>]*>[\s\S]*>[\s\S]*?<\/map>/gi, '');
    sanitizedHTML = sanitizedHTML.replace(/<area[^>]*>[\s\S]*?<\/area>/gi, '');

    return sanitizedHTML;
}

module.exports = {
    sanitizeHtml
};
