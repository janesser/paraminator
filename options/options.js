// options.js - Script for Paraminator options page interactions

// Retrieve the parameter dictionary from storage or params.json
async function getParams() {
    try {
        // const paramDict = await browser.storage.local.get('paramDict');
        const paramDict = await getParamDict();
        return paramDict.paramDict || (await fetch('params.json').then(response => response.json()));
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