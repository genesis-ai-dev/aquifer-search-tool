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

interface ResourceResult {
    id: number;
    name: string;
    localizedName: string;
    content: Array<{
        tiptap: {
            type: "doc";
            content: unknown[];
        };
    }>;
    grouping: {
        type: string;
        name: string;
        licenseInfo: null | string;
    };
    language: {
        id: number;
        code: string;
        displayName: string;
        scriptDirection: number;
    };
}

