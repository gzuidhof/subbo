import { HttpStatus, Router, Sunder } from "sunder";
import { registerRoutes } from "./routes";
import { Env } from "./bindings";
import { cors } from "./middleware/cors";

const AUTH_TOKEN = "pPpmC4JYq9aSj7ERLpRHHpZvR649MnhJyN3B";

export function createApp() {
    const app = new Sunder<Env>();
    const router = new Router<Env>();
    registerRoutes(router);

    app.use(cors);

    app.use(async (ctx, next) => {
        if (ctx.request.headers.get("authorization") !== `Bearer ${AUTH_TOKEN}`) {
            ctx.response.status = HttpStatus.Unauthorized;
            ctx.response.body = {success: false, details: "Unauthorized (wrong auth token)"}
            return;
        }
        return next();
    });
    
    // app.use(renderErrorsAsHTML);
    // app.use(renderErrorsAsJSON);

    app.use(router.middleware);

    return app;
}