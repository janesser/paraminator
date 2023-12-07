# Paraminator

![Paraminator Banner](images/banner.png)

Paraminator is a Firefox extension that modifies URLs by replacing query parameters with plausible misinformation. This tool focuses on parameters typically used for tracking, like `utm_source` and `utm_medium`, but it can also handle any other parameters that turn up in a URL.

## Features

- Randomize UTM parameters on the fly
- Option to enable/disable the extension globally or per domain
- Customizable parameter values via a user-editable JSON file
- Logging for visited domains and their associated parameters
- User interface for controlling which parameters are randomized
- Written largely by GPT4, because I'm not a web developer and JS isn't Python

## Installation

Paraminator is not yet available on the Firefox Add-ons store, but it can be installed manually in Firefox by following these steps:

1. Clone or download the repository to your local machine.
2. Open the Firefox browser and navigate to `about:debugging`.
3. Click on "This Firefox" (in newer versions) or "Load Temporary Add-on".
4. Navigate to the directory where you saved the Paraminator extension.
5. Select the `manifest.json` file and click "Open".
6. The extension is now installed in developer mode and can be used until you restart Firefox.

## Usage

After installation, the Paraminator icon should be visible in your browser's toolbar. Clicking on it will open the popup interface where you can enable or disable the extension as required. To customize parameters or to set per-domain settings, navigate to the extension's options page.

## Configuration

To customize the parameters that Paraminator will randomize, edit the `params.json` file included in the extension's root directory. You can add or remove parameters and configure the list of potential replacement values.

Below is an example structure of the `params.json` file:

```json
{
  "utm_source": ["google", "facebook", "twitter"],
  "utm_medium": ["cpc", "display", "email"],
  "custom_param": ["custom1", "custom2", "custom3"]
}
```

## Contributing

Contributions are welcome! If you'd like to contribute to the Paraminator project, please open an issue or submit a pull request.

## License

Paraminator is licensed under the [MIT License](https://mit-license.org/).
