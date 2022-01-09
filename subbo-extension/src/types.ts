export type SupportedLanguage = "EN" | "NL";

export const MESSAGE_TYPE_SUBBO_RECEIVE_ORIGINAL_SUBS = "SUBBO_RECEIVE_ORIGINAL_SUBS";


export type HostIncomingMessage = SubboReceiveOriginalSubsMessage;

export interface ContentDataWithPageInfo {
    page_url: string;
    subs_request_url: string;
    body: string;
    language: SupportedLanguage;
}

export interface ContentData {
    body: string;
    language: SupportedLanguage;
}

export type SubboReceiveOriginalSubsMessage = {
    type: typeof MESSAGE_TYPE_SUBBO_RECEIVE_ORIGINAL_SUBS,
    content: ContentDataWithPageInfo
}

export interface SubsRequest {
    target_language: SupportedLanguage;
    content: ContentData
}

export interface SubsResponse {
    content: {
        body: string;
        language: SupportedLanguage;
    }
}