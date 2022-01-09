import { Env } from "../bindings";
import { SubsTranslator } from "../lib/subs";
import { SupportedLanguage } from "../lib/types";
import { Context, HttpStatus } from "sunder";

const SUPPORTED_INPUT_LANGUAGES = ["NL"];
const SUPPORTED_TARGET_LANGUAGES = ["EN", "DE"];

interface ContentDataWithPageInfo {
    page_url: string;
    subs_request_url: string;
    body: string;
    language: SupportedLanguage;
}

interface SubsRequest {
    target_language: SupportedLanguage;
    content: ContentDataWithPageInfo
}

interface SubsResponse {
    content: {
        body: string;
        language: SupportedLanguage;
    }
}

let translator: SubsTranslator;
export async function handleSubsTranslate(ctx: Context<Env>) {
    if (translator === undefined) {
        translator = new SubsTranslator(ctx.env.DEEPL_AUTH_KEY);
    }

    let req: SubsRequest;
    try {
        req = await ctx.request.json();
    } catch (e) {
        return ctx.assert(false, HttpStatus.BadRequest, `Invalid request body: ${e}`)
    }

    if (!SUPPORTED_INPUT_LANGUAGES.includes(req.content.language)) {
        return ctx.assert(false, HttpStatus.BadRequest, `Unsupported input language`);
    }

    if (!SUPPORTED_TARGET_LANGUAGES.includes(req.target_language)) {
        return ctx.assert(false, HttpStatus.BadRequest, `Unsupported output language`);
    }

    const cacheKey = "SUBS_PAGE_CACHE_V4__" + req.content.page_url;

    const cached: SubsResponse | null = await ctx.env.SUBBO_SUBS_CACHE.get(cacheKey, {type: "json"});
    if (cached) {
        cached.content.body = translator.restoreVTTTimings(req.content.body, cached.content.body);
        ctx.response.body = cached
        await ctx.env.SUBBO_SUBS_CACHE.put(cacheKey, JSON.stringify(cached), {metadata: {inserted_at: new Date().toUTCString()}});
    } else {
        const trans = await translator.translateVTT(req.content.body, req.content.language, req.target_language);
        const resp: SubsResponse = {
            content: {
                body: trans,
                language: req.target_language
            }
        }
        await ctx.env.SUBBO_SUBS_CACHE.put(cacheKey, JSON.stringify(resp), {metadata: {inserted_at: new Date().toUTCString()}});
        ctx.response.body = resp;
    }
}
