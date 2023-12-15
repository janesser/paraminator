function logURL(requestDetails) {
    console.log(`Loading: ${requestDetails.url}`);
}

browser.webRequest.onBeforeRequest.addListener(logURL,
    { urls: ["<all_urls>"] }
);

function randomizeParams(requestDetails) {
    const origUrl = requestDetails.url;
    if (origUrl.includes('?') && !origUrl.includes("modified"))
        return { redirectUrl: requestDetails.url + "&modified" };
}

browser.webRequest.onBeforeRequest.addListener(randomizeParams,
    { urls: ["<all_urls>"] },
    ["blocking"]
);

console.debug("background.js loaded.")