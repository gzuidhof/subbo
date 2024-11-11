import { HttpStatus, Router, Sunder, } from "sunder";
import { renderErrorsAsJSON } from "sunder/middleware/render";
import { registerRoutes } from "./routes";
import { Env } from "./bindings";
import { cors } from "./middleware/cors";

// If you ever put this into production you should use a real auth token (and probably store its hash in a secure way),
// as well as use constant-time comparison to prevent timing attacks.
const AUTH_TOKEN = "DUMMY_AUTH_TOKEN";

export function createApp() {
    const app = new Sunder<Env>();
    const router = new Router<Env>();
    registerRoutes(router);

    app.use(cors);

    app.use(async (ctx, next) => {
        if (ctx.request.headers.get("authorization") !== `Bearer ${AUTH_TOKEN}` && ctx.request.url.startsWith("/api/")) {
            ctx.response.status = HttpStatus.Unauthorized;
            ctx.response.body = {success: false, details: "Unauthorized (wrong auth token)"}
            return;
        }
        return next();
    });
    
    // app.use(renderErrorsAsHTML);
    app.use(renderErrorsAsJSON);

    app.use(router.middleware);

    return app;
}