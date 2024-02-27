import React, { useMemo } from "react";

import { Mark } from "@tiptap/core";
// import { useEditor, EditorContent } from '@tiptap/react';
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { generateHTML } from "@tiptap/html";

const extensions = [
  StarterKit,
  Image,
  Link,
  Underline,
  Highlight,
  Subscript,
  Superscript,
  TextStyle,
  Mark.create({ name: "bibleReference", renderHTML: () => ["span"] }),
  Mark.create({ name: "resourceReference", renderHTML: () => ["span"] }),
];

interface TipTapNode {
  type?: string;
  content?: TipTapNode[];
}

// function getAllUniqueTypesFromTipTapJSON(json: TipTapNode) {
//   const types = new Set<string>();
//   function traverse(obj: TipTapNode) {
//     if ('type' in obj) {
//       types.add(obj.type!);
//     }
//     if ('content' in obj && Array.isArray(obj.content)) {
//       obj.content.forEach(traverse);
//     }
//   }
//   traverse(json);
//   return Array.from(types);
// }

function stripReferenceTypesFromTipTapJSON(
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

interface ParsedTipTapHTMLProps {
  jsonContent: ResourceResult | undefined;
}

const ParsedTipTapHTML: React.FC<ParsedTipTapHTMLProps> = ({ jsonContent }) => {
  //   const editor = useEditor({
  //     content: jsonContent?.content?.[0],
  //     extensions,
  //   });
  const output = useMemo(() => {
    if (jsonContent?.content?.[0]) {
      const strippedContent = stripReferenceTypesFromTipTapJSON(
        jsonContent.content[0]["tiptap"] as TipTapNode
      );
      console.log("strippedContent:", strippedContent);
      return strippedContent && generateHTML(strippedContent, extensions);
    } else {
      return null;
    }
  }, [jsonContent]);

  if (!output) {
    return <div>No content</div>;
  }

  //   let generatedHTML = '';
  //   try {
  //     generatedHTML = generateHTML(jsonContent?.content?.[0], extensions);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       const uniqueTypes = getAllUniqueTypesFromTipTapJSON(
  //         jsonContent?.content?.[0]['tiptap'] as TipTapNode,
  //       );
  //       const extensionNames = extensions
  //         .map((ext) => 'name' in ext && ext.name)
  //         .filter(Boolean);
  //       generatedHTML = `<div>Error generating HTML: ${
  //         error.message
  //       }.<br/>Unique types in content: ${uniqueTypes.join(
  //         ', ',
  //       )}.<br/>Extensions used: ${extensionNames.join(', ')}.</div>`;
  //     } else {
  //       generatedHTML = `<div>An unknown error occurred.</div>`;
  //     }
  //   }

  return (
    <div>
      {/* <EditorContent editor={editor} /> */}
      <div
        dangerouslySetInnerHTML={{
          __html: output,
        }}
      />
    </div>
  );
};
export default ParsedTipTapHTML;
