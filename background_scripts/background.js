// Background script for Paraminator Firefox Extension

// Use async functions to take advantage of the asynchronous nature of browser APIs
(async () => {
    // Import the utility functions if using a moduler system. If not, ensure they are globally available
    // const { getParamDict, randomizeUrlParameters } = require('./utils.js'); // CommonJS style
    // import { getParamDict, randomizeUrlParameters } from './utils.js'; // ES6 style
  
    // Alternatively, if utils.js functions are globally accessible, no need to import
  
    // Retrieve the parameter dictionary from local storage or the default params.json
    const paramDict = await getParamDict().catch(error => console.error(error));
  
    // Listen for web requests and modify URL search parameters if they match settings.
    browser.webRequest.onBeforeRequest.addListener(
      requestDetails => {
        // Only proceed if the URL has query parameters
        if (requestDetails.url.includes('?')) {
          const url = new URL(requestDetails.url);
          const randomizedUrl = randomizeUrlParameters(url, paramDict);
          
          // Check if URL was modified, if so, redirect to the new URL
          if (randomizedUrl.toString() !== requestDetails.url) {
            return { redirectUrl: randomizedUrl.toString() };
          }
        }
      },
      { urls: ["<all_urls>"] }, // Apply listener to all URLs
      ["blocking"] // Use the blocking option to allow modifying the web request
    );
  })();