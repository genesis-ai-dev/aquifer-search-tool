import React from 'react';

// START TIPTAP TO HTML CODE
// import { Editor, Mark } from "@tiptap/core";
// import Highlight from "@tiptap/extension-highlight";
// import Link from "@tiptap/extension-link";
// import Image from "@tiptap/extension-image";
// import Subscript from "@tiptap/extension-subscript";
// import Superscript from "@tiptap/extension-superscript";
// import TextStyle from "@tiptap/extension-text-style";
// import Underline from "@tiptap/extension-underline";
// import StarterKit from "@tiptap/starter-kit";

// const extensions = [
//     StarterKit,
//     Image,
//     Link,
//     Underline,
//     Highlight,
//     Subscript,
//     Superscript,
//     TextStyle,
//     Mark.create({ name: 'bibleReference', renderHTML: () => ['span'] }),
//     Mark.create({ name: 'resourceReference', renderHTML: () => ['span'] }),
// ];

// import { generateHTML } from '@tiptap/html';
// generateHTML(response.content.tiptap, extensions);

// END TIPTAP TO HTML CODE

// START TIPTAP TO HTML COMPONENT (WIP)
interface ParsedTipTapHTMLProps {
  jsonContent: SearchResultItem | null;
}

const ParsedTipTapHTML: React.FC<ParsedTipTapHTMLProps> = ({ jsonContent }) => {
  return (
    <div
    // Let's get the HTML from the JSON tiptap content and render it here
    >
      id: {jsonContent?.id}
      {JSON.stringify(jsonContent, null, 2)}
    </div>
  );
};

export default ParsedTipTapHTML;
