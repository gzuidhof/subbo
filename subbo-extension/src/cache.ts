import { SubsResponse, SupportedLanguage } from "./types";

const SUBS_STORAGE_PREFIX = "SUBBO_SUB_V10"

function isEmptyObject(obj: any): boolean {
    return obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype
}

export async function getSubsCacheForPageURL(pageURL: string, targetLanguage: SupportedLanguage) {
    const storageKey = `${SUBS_STORAGE_PREFIX}__${pageURL}__${targetLanguage}`;

    const val = await chrome.storage.local.get(storageKey);
    if (isEmptyObject(val)) {
        return undefined;
    }

    return val[storageKey] as SubsResponse;
}

export async function putSubsCacheForPageURL(pageURL: string, resp: SubsResponse) {
    const storageKey = `${SUBS_STORAGE_PREFIX}__${pageURL}__${resp.content.language}`;
    await chrome.storage.local.set({[storageKey]: resp});
}