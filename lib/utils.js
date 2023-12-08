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
