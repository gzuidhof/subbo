import { SupportedLanguage } from "./types";
import { restoreShortenedVTTAfterTranslation, shortenVTTForTranslation } from "./vtt";

// Change to `api.deepl.com` for the paid API
const DEEPL_TRANSLATE_API_URL = "https://api-free.deepl.com/v2/translate";

export interface DeepLResponse {
    translations: {detected_source_language: string, text: string}[]
}

export class SubsTranslator {
    authKey: string

    constructor(authKey: string) {
        this.authKey = authKey;
    }

    async translateVTT(text: string, fromLanguage: SupportedLanguage, toLanguage: SupportedLanguage) {
        let toLang: string = toLanguage;
        if (toLang === "EN") {
            toLang = "EN-GB"
        }

        const shorten = shortenVTTForTranslation(text);
        const fd = new FormData();
        fd.set("text", shorten.text);
        fd.set("target_lang", toLang);
        fd.set("source_lang", fromLanguage);

        const resp = await fetch(DEEPL_TRANSLATE_API_URL, {
            method: "POST",
            body: fd,
            headers: {
                "Accept": "application/json",
                "Authorization": `DeepL-Auth-Key ${this.authKey}`
            },
        });
        const txt = await resp.text();
        let respJson: DeepLResponse
        try {
            respJson = JSON.parse(txt);
        } catch (e) {
            console.error("STATUS: ", resp.status);
            console.error(txt);
            // console.error(e);
            throw e;
        }
        console.log(respJson);
        return restoreShortenedVTTAfterTranslation(respJson.translations[0].text.replace("\r\n", "\n"), shorten.timings);
    }

    restoreVTTTimings(originalText: string, translatedText: string) {
        console.log("ORIGINAL", originalText.substr(0, 1000));
        const shorten = shortenVTTForTranslation(originalText);
        console.log("SHORTENED", shorten.text.substr(0, 1000), shorten.timings);
        const restored = restoreShortenedVTTAfterTranslation(translatedText, shorten.timings);
        console.log("RESTORED", restored.substr(0, 1000));
        return restored;
    }

}