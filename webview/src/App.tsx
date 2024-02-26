import { vscode } from './utilities/vscode';
import { useState, useEffect } from 'react';
import {
  VSCodeOption,
  VSCodeBadge,
  VSCodeProgressRing,
  VSCodePanels,
  VSCodePanelView,
  VSCodePanelTab,
} from '@vscode/webview-ui-toolkit/react';
import ParsedTipTapHTML from './components/ParsedTipTapHTML';
import MediaTypeTag from './components/MediaTypeTag';
import './App.css';
import SharedEditor from './components/SharedEditor';

function App() {
  const [parsedData, setData] = useState<SearchResult | null>(null);
  const [itemContent, setItemContent] = useState<ResourceResult | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [passage, setPassage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (e: any) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;

    if (name === 'searchTerm') {
      setSearchTerm(value.trim());
    } else if (name === 'passage') {
      setPassage(value.trim());
    }
    setIsLoading(true); // Set loading to true when sending a message
    vscode.postMessage({ command: `search-${name}`, data: value });
  };

  const handleSelectItem = (item: SearchResultItem) => {
    setIsLoading(true); // Set loading to true when sending a message
    vscode.postMessage({ command: 'retrieve-item-by-id', data: item.id });
  };

  useEffect(() => {
    const handleReceiveMessage = (event: MessageEvent) => {
      const message = event.data;
      switch (message.command) {
        case 'sendData': {
          const data: SearchResult | ResourceResult = message.data;

          if ('totalItemCount' in data) {
            setData(data);
          } else {
            setItemContent(data);
          }
          setIsLoading(false); // Set loading to false when data is received
          break;
        }
      }
    };
    window.addEventListener('message', handleReceiveMessage);
    return () => {
      window.removeEventListener('message', handleReceiveMessage);
    };
  }, []);

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
      <VSCodePanels>
        <VSCodePanelTab title="Aquifer" id="Aquifer">
          Aquifer
        </VSCodePanelTab>
        <VSCodePanelTab title="Shared Editor" id="Shared Editor">
          Shared Editor
        </VSCodePanelTab>

        <VSCodePanelView
          id="Aquifer"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
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
                backgroundColor:
                  'var(--vscode-editor-inactiveSelectionBackground)',
                justifyContent: 'center',
              }}
            >
              {(isLoading && <VSCodeProgressRing />) || (
                <>
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
                </>
              )}
            </div>
            {(isLoading && <VSCodeProgressRing />) || (
              <div
                className="selected-item-display"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  backgroundColor:
                    'var(--vscode-editor-inactiveSelectionBackground)',
                }}
              >
                {parsedData ? (
                  itemContent ? (
                    <ParsedTipTapHTML jsonContent={itemContent} />
                  ) : (
                    'Please select a resource from the results above'
                  )
                ) : (
                  'Please search for resources above'
                )}
                <pre>{JSON.stringify(itemContent, null, 2)}</pre>
              </div>
            )}
          </div>
        </VSCodePanelView>
        <VSCodePanelView
          id="Shared Editor"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            width: '100%',
          }}
        >
          <SharedEditor />
        </VSCodePanelView>
      </VSCodePanels>
    </div>
  );
}

export default App;
