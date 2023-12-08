// popup.js - Interactions for Paraminator popup UI

document.addEventListener('DOMContentLoaded', async () => {
    const toggleExtensionCheckbox = document.getElementById('toggle-extension');
    const clearLogButton = document.getElementById('clear-log');
    const logContainer = document.getElementById('log-container');
  
    // Helper function to update the log display
    function updateLogDisplay(logs) {
      // Clear existing logs
      logContainer.innerHTML = '';
  
      // Add each log to the container
      for (const [domain, params] of Object.entries(logs)) {
        const domainItem = document.createElement('div');
        domainItem.textContent = domain;
        domainItem.classList.add('domain-item');
  
        const paramsList = document.createElement('ul');
        for (const param of params) {
          const paramItem = document.createElement('li');
          paramItem.textContent = param;
          paramItem.classList.add('param-item');
          paramsList.appendChild(paramItem);
        }
  
        domainItem.appendChild(paramsList);
        logContainer.appendChild(domainItem);
      }
    }
  
    // Get the current state and log from storage
    const storageData = await browser.storage.local.get(['enabled', 'log']);
    toggleExtensionCheckbox.checked = storageData.enabled ?? true; // default to enabled
    updateLogDisplay(storageData.log || {});
  
    // Handle the enable/disable toggle change
    toggleExtensionCheckbox.addEventListener('change', async (event) => {
      const isEnabled = event.target.checked;
      await browser.storage.local.set({ enabled: isEnabled });
  
      // Optional: send a message to background/content scripts if needed
      // browser.runtime.sendMessage({ action: 'toggleEnabled', value: isEnabled });
    });
  
    // Handle clearing the log
    clearLogButton.addEventListener('click', async () => {
      await browser.storage.local.remove('log');
      logContainer.innerHTML = ''; // Clear the UI
    });
  });
  