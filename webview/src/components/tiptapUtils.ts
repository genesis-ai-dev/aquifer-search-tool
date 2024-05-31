export interface TipTapNode {
  type?: string;
  content?: TipTapNode[];
}

export function stripReferenceTypesFromTipTapJSON(
  json: TipTapNode,
  typesToStrip: string[] = ["bibleReference", "resourceReference"]
) {
  function traverseAndStrip(obj: TipTapNode): TipTapNode | null {
    if ("type" in obj && obj.type && typesToStrip.includes(obj.type)) {
      return null; // Strip out the node entirely if it's a reference type
    }
    if ("content" in obj && Array.isArray(obj.content)) {
      obj.content = obj.content
        .map(traverseAndStrip)
        .filter(Boolean) as TipTapNode[];
    }
    return obj;
  }
  return traverseAndStrip(json);
}
