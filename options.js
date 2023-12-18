const MODIFIER_ID = "#modifier"
const PARSE_RESULT = "#parse-result"

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector(MODIFIER_ID).value = JSON.stringify(result);
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get();
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);

function saveOptions(e) {
  e.preventDefault();
  try {
    const modifierSettings = JSON.parse(
      document.querySelector(MODIFIER_ID).value
    )
    browser.storage.sync.set(modifierSettings)
    console.info("config saved.")
    document.querySelector(PARSE_RESULT).innerHTML = '<span class="result-okay">Saved.</span>';
  } catch (error) {
    console.warn("bad input: " + error)
    document.querySelector(PARSE_RESULT).innerHTML = '<span class="result-error">' + error + '</span>'
  }
}

document.querySelector("form").addEventListener("submit", saveOptions);
