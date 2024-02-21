import { vscode } from './utilities/vscode';
import { useState, useEffect } from 'react';
import { VSCodeDropdown, VSCodeOption } from '@vscode/webview-ui-toolkit/react';

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

function App() {
  const [parsedData, setData] = useState<SearchResult | null>(null);
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

      <div className="search-display">
        <VSCodeDropdown>
          {parsedData?.items &&
            parsedData.items.length > 0 &&
            parsedData.items.map((item) => (
              <VSCodeOption key={item.id} value={item.id.toString()}>
                {item.name}
              </VSCodeOption>
            ))}
        </VSCodeDropdown>
        <pre>{JSON.stringify(parsedData, null, 2)}</pre>
      </div>

      {/* <div className="search-display">
        <div className="results-list">
          {JSON.parse(parsedData).items.map((item: SearchResultProps) => (
            <SearchResult
              key={item.id}
              id={item.id}
              name={item.name}
              localizedName={item.localizedName}
              mediaType={item.mediaType}
              // Pass other necessary data to the SearchResult component
            />
          ))}
        </div>
      </div> */}
    </div>
  );
}

export default App;
