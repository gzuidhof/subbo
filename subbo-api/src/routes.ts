import { Router } from "sunder";
import { Env } from "./bindings";
import { homeHandler } from "./handlers/home";
import { handleSubsTranslate } from "./handlers/subs";
import { serveStaticAssetsFromKV } from "./middleware/static";

export function registerRoutes(router: Router<Env>) {
    router.get("/", homeHandler);

    router.get("/static/:assetPath+", serveStaticAssetsFromKV())
    router.head("/static/:assetPath+", serveStaticAssetsFromKV())

    // Example inline route with a named parameter
    router.post("/api/v1/subs", handleSubsTranslate);

    router.get("/robots.txt", (ctx) => {
        // This disallows all bots/scrapers
        ctx.response.body = `Agent: *\nDisallow: /`;
    });
}
