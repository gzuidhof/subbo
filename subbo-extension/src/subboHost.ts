import { getTranslatedSubsFromDOM } from "./dom";
import { MESSAGE_TYPE_SUBBO_RECEIVE_ORIGINAL_SUBS, SubboReceiveOriginalSubsMessage } from "./types";

const extensionId = document.currentScript!.dataset.extensionId!;

//
// firefox, ie8+ 
//
// var accessor = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response');

// Object.defineProperty(XMLHttpRequest.prototype, 'response', {
//     get: function () {
//         return accessor.get.call(this);
//     },
//     set: function (str) {
//         return accessor.set.call(this, str);
//     },
//     configurable: true
// });


//
// chrome, safari (accessor == null)
//
var rawOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function () {
    const url = arguments[1];
    if (url.indexOf("/api/v3/subtitles/") !== -1) {
        //@ts-ignore
        if (!this._hooked) {
            //@ts-ignore
            this._hooked = true;
            setupHook(this);
        }
    }
    
    rawOpen.apply(this, arguments as any);
}

let translatedBefore = new Map<string, boolean>();

function setupHook(xhr: XMLHttpRequest) {
    function getter() {
        //@ts-ignore
        delete xhr.response;
        let ret = "";

        const untranslatedContent = xhr.response;
        const translatedContent = getTranslatedSubsFromDOM();

        if (!translatedContent) {
            if (translatedBefore.get(window.location.href)) {
                // Do nothing
            } else {
                translatedBefore.set(window.location.href, true);

                if (confirm(`Do you want to translate this content?\nIt will cost approx ${(untranslatedContent.length * 0.75) * 0.00002} Euro`)) {
                    // const untranslatedDOMElement = document.createElement('div');
                    // untranslatedDOMElement.id = '__subboRawSubs';
                    // untranslatedDOMElement.innerText = untranslatedContent;
                    // untranslatedDOMElement.style.height = "0";
                    // untranslatedDOMElement.style.overflow = 'hidden';
                    // document.body.appendChild(untranslatedDOMElement);
                    if (chrome && chrome.runtime) {
                        const msg: SubboReceiveOriginalSubsMessage = {
                            content: {
                                body: untranslatedContent,
                                language: "NL",
                                page_url: window.location.href,
                                subs_request_url: xhr.responseURL,
                            },
                            type: MESSAGE_TYPE_SUBBO_RECEIVE_ORIGINAL_SUBS,
                        }
                        console.debug("[Subbo] Sending:", msg);
                        chrome.runtime.sendMessage(
                            extensionId,
                            msg,
                            (response) => { 
                                console.log(response);
                                alert(`Translation into ${response.subs.content.language} done! Refresh now :)`)
                            }
                        );
                    } else {
                        console.warn("[Subbo] could not send message as Chrome runtime is missing.")
                    }
                }
            }
            
            ret = untranslatedContent;
        } else {
            ret = translatedContent.content;
        }
        setup();
        return ret;
    }

    function setter(val: any) {
        console.warn('[Subbo] Unexpected set response intercepted:', val);
    }

    function setup() {
        Object.defineProperty(xhr, 'response', {
            get: getter,
            set: setter,
            configurable: true
        });
    }
    setup();
}

console.log("[Subbo] Initialized in host page.");
