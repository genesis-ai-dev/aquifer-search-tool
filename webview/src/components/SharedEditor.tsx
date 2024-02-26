import {
  Editor,
  usxStringToJson,
} from '@biblionexus-foundation/platform-editor';
// import { RefSelector } from 'platform-bible-react';
import { useState } from 'react';
import '../styles/editorStyles.css';

const usx = `
<?xml version="1.0" encoding="utf-8"?>
<usx version="3.0">
  <book code="PSA" style="id">World English Bible (WEB)</book>
  <para style="h">Psalms</para>
  <chapter number="1" style="c" sid="PSA 1" />
  <para style="ms1">BOOK 1</para>
  <para style="q1">
    <verse number="1" style="v" sid="PSA 1:1" />Blessed is the man who doesn’t walk in the counsel of the wicked,</para>
  <para style="q2" vid="PSA 1:1">nor stand on the path of sinners,</para>
  <para style="q2" vid="PSA 1:1">nor sit in the seat of scoffers;<verse eid="PSA 1:1" /></para>
</usx>
`;
const usj = usxStringToJson(usx);

export default function App() {
  const defaultScrRef: string = 'GEN 1:1';
  const [scrRef, setScrRef] = useState(defaultScrRef);

  return (
    <>
      <form className="ref-selector">
        {/* <RefSelector handleSubmit={setScrRef} scrRef={scrRef} /> */}
        <input
          type="text"
          placeholder="Bible Passage..."
          value={scrRef}
          onChange={(e) => setScrRef(e.target.value)}
          name="passage"
        />
      </form>
      <Editor
        usj={usj}
        scrRef={scrRef}
        setScrRef={setScrRef}
        logger={console}
      />
    </>
  );
}
