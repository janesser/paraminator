// options.js - Script for Paraminator options page interactions

// Utils for Paraminator Firefox Extension

/**
 * Retrieves the parameter dictionary from the local storage or the default `params.json`.
 * @returns {Promise<object>} - A promise that resolves to the parameter dictionary object.
 */
function getParamDict() {
    return new Promise((resolve, reject) => {
      // Attempt to retrieve the user-customized parameters from local storage
      browser.storage.local.get('paramDict')
        .then(data => {
          if (data.paramDict) {
            resolve(data.paramDict);
          } else {
            // Fall back to the default parameters from params.json
            fetch(browser.runtime.getURL('params.json'))
              .then(response => response.json())
              .then(defaultDict => {
                resolve(defaultDict);
              })
              .catch(error => reject(`Error loading parameter dictionary: ${error}`));
          }
        })
        .catch(error => reject(`Error retrieving parameter dictionary from storage: ${error}`));
    });
  }
  
  /**
   * Saves the parameter dictionary to the local storage.
   * @param {object} paramDict - The parameter dictionary object to save.
   * @returns {Promise<void>} - A promise that resolves when the dictionary is saved.
   */
  function saveParamDict(paramDict) {
    return browser.storage.local.set({ paramDict });
  }
  
  /**
   * Randomizes a single URL parameter value based on the available options.
   * @param {string} paramName - The name of the URL parameter.
   * @param {object} paramDict - The parameter dictionary with possible values.
   * @returns {string} - The randomized value for the URL parameter.
   */
  function randomizeParamValue(paramName, paramDict) {
    const valuesArray = paramDict[paramName];
    if (Array.isArray(valuesArray) && valuesArray.length > 0) {
      const randomIndex = Math.floor(Math.random() * valuesArray.length);
      return valuesArray[randomIndex];
    } else {
      // If no values are provided for the paramName, return a string indicating the problem.
      return 'undefined';
    }
  }
  
  /**
   * Replaces the URL parameters with randomized values according to the dictionary settings.
   * @param {URL} url - The URL object to modify.
   * @param {object} paramDict - The parameter dictionary with possible values.
   * @returns {URL} - The modified URL object with randomized query parameters.
   */
  function randomizeUrlParameters(url, paramDict) {
    const searchParams = url.searchParams;
  
    // Iterate over all keys in the parameter dictionary
    for (const paramName of Object.keys(paramDict)) {
      if (searchParams.has(paramName)) {
        const newValue = randomizeParamValue(paramName, paramDict);
        searchParams.set(paramName, newValue);
      }
    }
  
    return url;
  }  

// Retrieve the parameter dictionary from storage or params.json
async function getParams() {
    try {
        const paramDictWrapper = await getParamDict(); // Fetch the object containing paramDict
        const paramDict = paramDictWrapper.paramDict || {}; // Access the actual paramDict

        return Object.keys(paramDict).length > 0
            ? paramDict
            : (await fetch('params.json').then(response => response.json()));
    } catch (error) {
        // Handle the error here (e.g., log it or throw a custom error)
        console.error('An error occurred in getParams:', error);

        // You can throw a custom error or return a default value, depending on your needs
        throw new Error('Failed to retrieve parameters');
    }
}


// Save the parameter dictionary back to storage
async function saveParams(paramDict) {
    try {
        await browser.storage.local.set({ paramDict });
    } catch (error) {
        // Handle the error here (e.g., log it or throw a custom error)
        console.error('An error occurred in saveParams:', error);

        // You can throw a custom error or handle the error in an appropriate way
        throw new Error('Failed to save parameters');
    }
}

// Function to build the parameter settings form dynamically
async function buildOptionsForm() {
    const paramsContainer = document.getElementById('params-container');

    try {
        const params = await getParams();

        // Clear the container
        paramsContainer.innerHTML = '';

        // Add input elements for each parameter
        Object.keys(params).forEach(key => {
            const wrapper = document.createElement('div');
            const label = document.createElement('label');
            label.textContent = key + ':';
            wrapper.appendChild(label);

            const input = document.createElement('input');
            input.type = 'text';
            input.id = key;
            input.value = params[key].join(', ');
            wrapper.appendChild(input);

            paramsContainer.appendChild(wrapper);
        });
    } catch (error) {
        // Handle the error here (e.g., log it or display a user-friendly message)
        console.error('An error occurred:', error);
    }
}

// Initialize the page by building the form
document.addEventListener('DOMContentLoaded', buildOptionsForm);

// Save the parameters when the form is submitted
document.getElementById('options-form').addEventListener('submit', async event => {
    event.preventDefault();
    const inputs = document.querySelectorAll('#params-container input');
    const newParams = Array.from(inputs).reduce((acc, input) => {
        acc[input.id] = input.value.split(',').map(v => v.trim());
        return acc;
    }, {});

    await saveParams(newParams);
    // Optionally, inform the user of success
    alert('Parameters saved successfully!');
});