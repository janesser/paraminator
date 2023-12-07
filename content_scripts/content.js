// Content script for Paraminator Firefox Extension

// Use event delegation to capture clicks on any link in the document.
document.addEventListener('click', event => {
    // Check if the clicked element is a link with a URL
    const targetElement = event.target.closest('a[href]');
    if (targetElement) {
      // Retrieve the href attribute of the link
      const originalUrl = new URL(targetElement.getAttribute('href'), document.baseURI);
  
      // Import utility functions if using a module system, otherwise ensure they are globally available
      // const { getParamDict, randomizeUrlParameters } = require('./utils.js'); // CommonJS style
      // import { getParamDict, randomizeUrlParameters } from './utils.js'; // ES6 style
  
      // Retrieve parameter dictionary and randomize URL parameters
      getParamDict().then(paramDict => {
        // Randomize the parameters on the URL
        const modifiedUrl = randomizeUrlParameters(originalUrl, paramDict);
  
        // Update the href attribute with the new URL
        targetElement.setAttribute('href', modifiedUrl.toString());
      }).catch(error => {
        console.error(`Error randomizing params: ${error}`);
      });
    }
  });
  
  // If links are dynamically added to the page, you may need to observe changes to the DOM and update links accordingly
  // The following is a simple MutationObserver to handle dynamic content. Adjust as needed for performance.
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          // If an added node is an element and contains links, update its parameters
          if (node.nodeType === Node.ELEMENT_NODE) {
            const links = node.querySelectorAll('a[href]');
            links.forEach(link => {
              const originalUrl = new URL(link.getAttribute('href'), document.baseURI);
              getParamDict().then(paramDict => {
                const modifiedUrl = randomizeUrlParameters(originalUrl, paramDict);
                link.setAttribute('href', modifiedUrl.toString());
              });
            });
          }
        });
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });