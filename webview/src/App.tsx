import { vscode } from './utilities/vscode';
import { useState, useEffect } from 'react';
import {
  VSCodeDropdown,
  VSCodeOption,
  VSCodeBadge,
} from '@vscode/webview-ui-toolkit/react';
import ParsedTipTapHTML from './components/ParsedTipTapHTML';

function App() {
  const [parsedData, setData] = useState<SearchResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<SearchResultItem | null>(
    null,
  );
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
    setSelectedItem(item);
    vscode.postMessage({ command: 'retrieve-item-by-id', data: item.id });
  };

  useEffect(() => {
    const handleReceiveMessage = (event: MessageEvent) => {
      const message = event.data;
      switch (message.command) {
        case 'sendData': {
          const data: SearchResult = message.data;
          setData(data);
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
    <div className="App">
      <header className="App-header">
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
        }}
      >
        <div
          className="search-header"
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '1rem',
          }}
        >
          <VSCodeDropdown>
            {parsedData?.items &&
              parsedData.items.length > 0 &&
              parsedData.items.map((item) => (
                <VSCodeOption
                  key={item.id}
                  value={item.id.toString()}
                  onClick={() => handleSelectItem(item)}
                >
                  {item.name}
                </VSCodeOption>
              ))}
          </VSCodeDropdown>
          <VSCodeBadge>{parsedData?.totalItemCount || 0}</VSCodeBadge>
        </div>
        <div
          className="search-results"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <ParsedTipTapHTML jsonContent={selectedItem} />
          <pre>{JSON.stringify(parsedData, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
