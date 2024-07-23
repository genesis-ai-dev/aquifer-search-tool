interface ItemGrouping {
    type: string;
    name: string;
    collectionTitle: string;
    collectionCode: string;
}

interface SearchResultItem {
    id: number;
    name: string;
    localizedName: string;
    mediaType: MediaType;
    languageCode: string;
    grouping: ItemGrouping;
}

type MediaType = "None" | "Text" | "Audio" | "Video" | "Image"

interface SearchResult {
    totalItemCount: number;
    returnedItemCount: number;
    offset: number;
    items: SearchResultItem[];
}

// TODO:Refactor with ResourceResult
interface ImageResourceResult {
    id: number;
    name: string;
    localizedName: string;
    content: {
        tiptap?: {
            type: "doc";
            content: unknown[];
        };
        url?: string;
    };
    grouping: {
        type: string;
        name: string;
        mediaType: MediaType;
        licenseInfo: {
            title: string;
            copyright: {
                holder: {
                    name: string;
                    url: string;
                };
            };
            licenses: Array<{
                eng: {
                    name: string;
                    url?: string;
                };
            }>;
            showAdaptationNoticeForEnglish: boolean;
            showAdaptationNoticeForNonEnglish: boolean;
        };
    };
    language: {
        id: number;
        code: string;
        displayName: string;
        scriptDirection: number;
    };
}

interface ResourceResult {
    id: number;
    name: string;
    localizedName: string;
    content: [{
        tiptap?: {
            type: "doc";
            content: unknown[];
        };
        url?: string;
    }];
    grouping: {
        type: string;
        name: string;
        mediaType: MediaType;
        licenseInfo: {
            title: string;
            copyright: {
                holder: {
                    name: string;
                    url: string;
                };
            };
            licenses: Array<{
                eng: {
                    name: string;
                    url?: string;
                };
            }>;
            showAdaptationNoticeForEnglish: boolean;
            showAdaptationNoticeForNonEnglish: boolean;
        };
    };
    language: {
        id: number;
        code: string;
        displayName: string;
        scriptDirection: number;
    };
}
