import { ContentData, SupportedLanguage } from "./types";

const TRANSLATED_EL_ID = "__subbo-translated"
function insertInvisibleDomElement(id: string, content: string, dataset: Record<string, string>) {
    const el = document.createElement('div');
    el.id = id;
    el.innerText = content;
    el.style.height = "0";
    el.style.overflow = 'hidden';

    for(const [k,v] of Object.entries(dataset)) {
        el.dataset[k] = v;
    }

    document.body.appendChild(el);
}

export function insertTranslatedSubsIntoDOM(c: ContentData) {
    insertInvisibleDomElement(TRANSLATED_EL_ID, c.body, {"language": c.language})
}

export function getTranslatedSubsFromDOM() {
    const el = document.getElementById(TRANSLATED_EL_ID);
    if (el === null) {
        return undefined;
    }

    return {
        content: el.innerText,
        language: el.dataset.language as SupportedLanguage,
    }
}