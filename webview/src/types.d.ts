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
    mediaType: string;
    languageCode: string;
    grouping: ItemGrouping;
}

interface SearchResult {
    totalItemCount: number;
    returnedItemCount: number;
    offset: number;
    items: SearchResultItem[];
}