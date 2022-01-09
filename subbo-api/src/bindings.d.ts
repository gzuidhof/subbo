export interface Env {
    // Added by Cloudflare Sites
    __STATIC_CONTENT: KVNamespace
    DEEPL_AUTH_KEY: string
    SUBBO_SUBS_CACHE: KVNamespace
}

declare module '__STATIC_CONTENT_MANIFEST' {
  const manifest: string
  export default manifest
}
