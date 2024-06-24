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
import { stripReferenceTypesFromTipTapJSON, TipTapNode } from "./tiptapUtils";

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

interface ParsedTipTapHTMLProps {
  jsonContent: ResourceResult;
}

export const tiptapRawHTML = (jsonContent: ResourceResult): string => {
  if (jsonContent.grouping.mediaType === "Text" && jsonContent.content.tiptap) {
    const strippedContent = stripReferenceTypesFromTipTapJSON(
      jsonContent.content.tiptap as TipTapNode
    );
    return strippedContent ? generateHTML(strippedContent, extensions) : "";
  }
  return "";
};

const ParsedTipTapHTML: React.FC<ParsedTipTapHTMLProps> = ({ jsonContent }) => {
  const output = useMemo(() => {
    if (jsonContent.grouping.mediaType === "Text" && jsonContent.content.tiptap) {
      const strippedContent = stripReferenceTypesFromTipTapJSON(
        jsonContent.content.tiptap as TipTapNode
      );
      return strippedContent && generateHTML(strippedContent, extensions);
    }
    return null;
  }, [jsonContent]);

  if (!output) {
    return <div>No text content available</div>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: output,
      }}
    />
  );
};
export default ParsedTipTapHTML;
