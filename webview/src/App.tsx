import { vscode } from './utilities/vscode';
import { useState, useEffect } from 'react';
import { VSCodeOption, VSCodeBadge } from '@vscode/webview-ui-toolkit/react';
import ParsedTipTapHTML from './components/ParsedTipTapHTML';
import MediaTypeTag from './components/MediaTypeTag';

function App() {
  const [parsedData, setData] = useState<SearchResult | null>(null);
  const [itemContent, setItemContent] = useState<ResourceResult | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [passage, setPassage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Destructure for easier access

    // Update the state based on the input's name attribute
    if (name === 'searchTerm') {
      setSearchTerm(value);
    } else if (name === 'passage') {
      setPassage(value);
    }
    // Post message with dynamic command based on the input's name
    vscode.postMessage({ command: `search-${name}`, data: value });
  };

  const handleSelectItem = (item: SearchResultItem) => {
    vscode.postMessage({ command: 'retrieve-item-by-id', data: item.id });
  };

  useEffect(() => {
    const handleReceiveMessage = (event: MessageEvent) => {
      const message = event.data;
      switch (message.command) {
        case 'sendData': {
          const data: SearchResult | ResourceResult = message.data;

          if ('totalItemCount' in data) {
            setData(data); // This is a list of results
          } else {
            setItemContent(data);
          }

          console.log('Passage string parsed:', parsedData);
          break;
        }
      }
    };
    window.addEventListener('message', handleReceiveMessage);
    return () => {
      window.removeEventListener('message', handleReceiveMessage);
    };
  }, [parsedData]);

  console.log('RYDER', parsedData);

  return (
    <div
      className="App"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
      }}
    >
      <header
        className="App-header"
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
        }}
      >
        <input
          type="text"
          placeholder="Bible Passage..."
          value={passage}
          onChange={handleInputChange}
          name="passage"
        />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange}
          name="searchTerm"
        />
      </header>

      <div
        className="search-display"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1rem 0',
        }}
      >
        <div
          className="search-results-header"
          style={{
            display: 'flex',
            flexFlow: 'row wrap',
            gap: '1rem',
            backgroundColor: 'var(--vscode-editor-inactiveSelectionBackground)',
          }}
        >
          <VSCodeBadge>{parsedData?.totalItemCount || 0}</VSCodeBadge>
          {parsedData?.items &&
            parsedData.items.length > 0 &&
            parsedData.items.map((item) => (
              <VSCodeOption
                style={{
                  display: 'flex',
                  flexFlow: 'row wrap',
                  gap: '1rem',
                }}
                key={item.id}
                value={item.id.toString()}
                onClick={() => handleSelectItem(item)}
              >
                {item.name}
                <MediaTypeTag mediaType={item.mediaType} />
              </VSCodeOption>
            ))}
        </div>
        <div
          className="selected-item-display"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: 'var(--vscode-editor-inactiveSelectionBackground)',
          }}
        >
          <ParsedTipTapHTML jsonContent={itemContent} />
          <pre>{JSON.stringify(itemContent, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
