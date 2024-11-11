# subbo-extension

`subbo` is a browser extension that intercepts requests to subtitle files and translates them to a language of your choice.

It currently only supports Chromium-based browsers.

## Usage

Add the URLs of the websites you want to support to `manifest.json`, use the media player and check the URL of the subtitle file (`.vtt` or `.srt` extension) being requested.

> Pro-tip: type `vtt` in the search bar of the Network tab.

```shell
npm install
npm run build
```

Next, load the extension in your browser.

1. Open a Chromium-based browser and navigate to `chrome://extensions`
2. Enable Developer mode by ticking the checkbox in the upper-right corner
3. Click on the "Load unpacked" button
4. Select the `dist` folder

When you make changes to the code, you can reload the extension by clicking on the reload button in the extension card.
