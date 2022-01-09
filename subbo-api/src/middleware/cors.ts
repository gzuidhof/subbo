import { Context, MiddlewareNextFunction } from "sunder";

export async function cors(ctx: Context<{}>, next: MiddlewareNextFunction) {
    ctx.response.set("Access-Control-Allow-Origin", "*");
    ctx.response.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    ctx.response.set("Access-Control-Allow-Headers", "Authorization, Content-Type");

    if (ctx.request.method === "OPTIONS") {
        return; // The next handler is not called
    }

    try {
        await next();
    } catch (e) {
        ctx.response.set("Access-Control-Allow-Origin", "*");
        ctx.response.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        ctx.response.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
        throw e;
    }

    ctx.response.set("Access-Control-Allow-Origin", "*");
        ctx.response.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        ctx.response.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
}

