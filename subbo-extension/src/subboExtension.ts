import { getSubsCacheForPageURL } from "./cache";
import { DEFAULT_TARGET_LANGUAGE } from "./constants";
import { insertTranslatedSubsIntoDOM } from "./dom";
import { flatPromise } from "./flatPromise";

const domFlatPromise = flatPromise();

function injectSubboScript() {
    const url = chrome.runtime.getURL('/subboHost.js')
    const subboScript = document.createElement('script');
    subboScript.type = 'text/javascript';
    subboScript.dataset.extensionId = chrome.runtime.id;
    subboScript.src = url;
    
    if ((document.head || document.documentElement) == null) {
        throw new Error("both head and document are null :<");
    }

    (document.head || document.documentElement).appendChild(subboScript);
}
function checkForDOM() {
    if (document.body && document.head) {
        domFlatPromise.resolve();
    } else {
        requestIdleCallback(checkForDOM);
    }
}

const langTarget = DEFAULT_TARGET_LANGUAGE;

getSubsCacheForPageURL(window.location.href, langTarget).then(async cacheValue => {
    await domFlatPromise.promise;
    if (cacheValue) {
        console.log(`[Subbo] This content has already been translated into ${langTarget}, will insert into DOM.`, cacheValue)
        insertTranslatedSubsIntoDOM(cacheValue.content);
    } else {
        console.log("[Subbo] This content hasn't been translated yet into " + langTarget)
    }
})

domFlatPromise.promise.then(() => {
    injectSubboScript();
})
requestIdleCallback(checkForDOM);
