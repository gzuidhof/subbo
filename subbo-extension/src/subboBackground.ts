import { getSubsCacheForPageURL, putSubsCacheForPageURL } from "./cache";
import { DEFAULT_TARGET_LANGUAGE } from "./constants";
import { ContentDataWithPageInfo, MESSAGE_TYPE_SUBBO_RECEIVE_ORIGINAL_SUBS, SubboReceiveOriginalSubsMessage, SubsRequest, SubsResponse, SupportedLanguage } from "./types";

const AUTH_TOKEN = "DUMMY_AUTH_TOKEN";
// const API_URL = "https://subbo-api.guido.workers.dev";
const API_URL = "http://localhost:8787"
const SUBS_API_ENDPOINT = "/api/v1/subs";

async function getSubsForPage(content: ContentDataWithPageInfo, targetLanguage: SupportedLanguage) {
    const cachedValue = await getSubsCacheForPageURL(content.page_url, targetLanguage);
    if (cachedValue) {
        console.log(`Returning subs from cache storage`)
        return cachedValue;
    }
    const body: SubsRequest = {
        target_language: targetLanguage,
        content: content,
    }

    const fetchResponse = await fetch(
        `${API_URL}${SUBS_API_ENDPOINT}`,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${AUTH_TOKEN}`
        },
        body: JSON.stringify(body)}
    );
    if (fetchResponse.status !== 200) {
        throw new Error("Something went wrong: " + JSON.stringify(fetchResponse))
    }
    const txt = await fetchResponse.text();
    try {
        const resp: SubsResponse = JSON.parse(txt);
        await putSubsCacheForPageURL(content.page_url, resp)
        return resp;
    } catch(e) {
        console.error(e, txt);
        throw e;
    }
    
}

chrome.runtime.onMessageExternal.addListener(async (payload, sender, sendResponse) => {
    console.log("Received external", payload);
    if (payload.type === MESSAGE_TYPE_SUBBO_RECEIVE_ORIGINAL_SUBS) {
        const msg = payload as SubboReceiveOriginalSubsMessage;

        (async () => {
            try {
            const subs = await getSubsForPage(msg.content, DEFAULT_TARGET_LANGUAGE)
            sendResponse({ success: true, subs: subs }); //respond however you like
            } catch (e) {
                sendResponse({success: false, err: `${e} ${JSON.stringify(e)}`})
                throw e;
            }
        })()
    }
    
    return true;
});

chrome.runtime.onMessage.addListener((payload, sender, sendResponse) => {
    console.log("Received internal", payload)
    sendResponse({ received: true }); //respond however you like
    return true;
});


