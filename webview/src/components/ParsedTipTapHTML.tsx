import React, { useMemo } from "react";

import { Mark, Extension } from "@tiptap/core";
// import { useEditor, EditorContent } from '@tiptap/react';
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
// import TextStyle from '@tiptap/extension-text-style';
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { generateHTML } from "@tiptap/html";

const CustomTextStyle = Extension.create({
  name: "customTextStyle",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          textColor: {
            default: null,
            renderHTML: (attributes) => {
              if (!attributes.textColor) {
                return {};
              }
              return { style: `color: ${attributes.textColor}` };
            },
          },
          backgroundColor: {
            default: null,
            renderHTML: (attributes) => {
              if (!attributes.backgroundColor) {
                return {};
              }
              return {
                style: `background-color: ${attributes.backgroundColor}`,
              };
            },
          },
        },
      },
      {
        types: ["heading"],
        attributes: {
          paddingBottom: {
            default: null,
            renderHTML: () => {
              return { style: `padding-top: 1rem; padding-bottom: 1rem` };
            },
          },
        },
      },
      {
        types: ["paragraph"],
        attributes: {
          paddingBottom: {
            default: null,
            renderHTML: () => {
              return { style: `padding-bottom: 1rem` };
            },
          },
        },
      },
    ];
  },
});

const extensions = [
  StarterKit,
  Image,
  Link,
  Underline,
  Highlight,
  Subscript,
  Superscript,
  CustomTextStyle, // Use your custom text style extension here
  Mark.create({ name: "bibleReference", renderHTML: () => ["span"] }),
  Mark.create({ name: "resourceReference", renderHTML: () => ["span"] }),
];

interface TipTapNode {
  type?: string;
  content?: TipTapNode[];
}

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

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{
          __html: output,
        }}
      />
    </div>
  );
};
export default ParsedTipTapHTML;
