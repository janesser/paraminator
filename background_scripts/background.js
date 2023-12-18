const replacerConfig = async () => browser.storage.sync.get()

const paramReplacer = {
    isReplacable: async origUrl => {
        if (origUrl.split('?').length <= 1)
            return false;

        for (const [key, value] of Object.entries(await replacerConfig())) {
            if (origUrl.includes(key + "=" + value))
                return false;
        }

        return true;
    },

    replace: async origUrl => {
        var url = origUrl;
        for (const [key, value] of Object.entries(await replacerConfig())) {
            const search = new RegExp("(?<=" + key + "=)[^&]*")
            replacedUrl = url.replace(search, value)
            if (replacedUrl.localeCompare(origUrl) != 0)
                console.info("Paraminator replaced URL: " + replacedUrl)
        }
    }
}

const randomizeParams = async (requestDetails) => {
    const origUrl = requestDetails.url;
    if (await paramReplacer.isReplacable(origUrl)) {
        console.debug("Paraminator replacable URL: " + origUrl)
        return { redirectUrl: paramReplacer.replace(origUrl) };
    }
}

browser.webRequest.onBeforeRequest.addListener(
    randomizeParams,
    { urls: ["<all_urls>"] },
    ["blocking"]
);

console.info("Paraminator background.js loaded.")