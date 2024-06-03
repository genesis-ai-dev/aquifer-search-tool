import { vscode } from './utilities/vscode';
import { useState, useEffect } from 'react';
import {
  VSCodeBadge,
  VSCodeProgressRing,
  VSCodePanels,
  VSCodePanelView,
  VSCodePanelTab,
  VSCodeButton,
} from '@vscode/webview-ui-toolkit/react';
import ParsedTipTapHTML from './components/ParsedTipTapHTML';
import MediaTypeTag from './components/MediaTypeTag';
import './App.css';
// import SharedEditor from './components/SharedEditor';
import { tiptapRawHTML } from './components/ParsedTipTapHTML';
import TurndownService from 'turndown'; // Import Turndown

function App() {
  const [parsedData, setData] = useState<SearchResult | null>(null);
  const [itemContent, setItemContent] = useState<ResourceResult | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [passage, setPassage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const [isTranslationAvailable, setIsTranslationAvailable] = useState(false); // New state for translation availability

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (e: any) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;

    if (name === 'searchTerm') {
      setSearchTerm(value.trim());
    } else if (name === 'passage') {
      setPassage(value.trim());
    }
    // setIsLoading(true); // Set loading to true when sending a message
    vscode.postMessage({ command: `search-${name}`, data: value });
  };

  const handleSelectItem = (item: SearchResultItem) => {
    setIsLoading(true); // Set loading to true when sending a message
    vscode.postMessage({ command: 'retrieve-item-by-id', data: item.id });
  };

  const handleTranslationOfContent = () => {
    const tiptapRaw =
      itemContent && tiptapRawHTML({ jsonContent: itemContent });

    if (tiptapRaw) {
      const turndownService = new TurndownService();
      const markdown = turndownService.turndown(tiptapRaw);
      console.log({ markdown });
      vscode.postMessage({
        command: 'translate-content',
        data: {
          documentId: itemContent?.name,
          dataToTranslate: markdown.split('\n\n'),
        },
      });
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (event: MessageEvent) => {
      const message = event.data;
      switch (message.command) {
        case 'sendData': {
          const data: SearchResult | ResourceResult = message.data;

          if ('totalItemCount' in data) {
            setData(data);
          } else if ('content' in data) {
            setItemContent(data);
          }
          setIsLoading(false); // Set loading to false when data is received
          break;
        }
        case 'translationAvailable': {
          setIsTranslationAvailable(true); // Set translation availability to true
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

  const SearchDisplayWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => (
    <div
      className="search-display"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem 0',
      }}
    >
      {children}
    </div>
  );
  const contentShouldBeDisplayed = itemContent;
  return (
    <div
      className="App"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
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
          {contentShouldBeDisplayed ? (
            <>
              <VSCodeButton onClick={() => setItemContent(undefined)}>
                Back
              </VSCodeButton>
              {isTranslationAvailable && (
                <VSCodeButton onClick={() => handleTranslationOfContent()}>
                  Translate This Document
                </VSCodeButton>
              )}
              <SearchDisplayWrapper>
                {(isLoading && <VSCodeProgressRing />) || (
                  <div
                    className="selected-item-display"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      backgroundColor:
                        'var(--vscode-editor-inactiveSelectionBackground)',
                      padding: '2.5em 3.5em 3.5em',
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
                    {/* <pre>{JSON.stringify(itemContent, null, 2)}</pre> */}
                  </div>
                )}
              </SearchDisplayWrapper>
            </>
          ) : (
            <SearchDisplayWrapper>
              <div
                className="search-results-header"
                style={{
                  display: 'flex',
                  gap: '1rem',
                  backgroundColor:
                    'var(--vscode-editor-inactiveSelectionBackground)',
                  justifyContent: 'center',
                  flexFlow: 'column nowrap',
                }}
              >
                {(isLoading && <VSCodeProgressRing />) || (
                  <>
                    <VSCodeBadge>{parsedData?.totalItemCount || 0}</VSCodeBadge>
                    {parsedData?.items &&
                      parsedData.items.length > 0 &&
                      parsedData.items.map((item) => (
                        <div
                          key={item.id}
                          className="search-result-item"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            borderBottom:
                              '1px solid var(--vscode-editor-inactiveSelectionBackground)',
                            paddingBottom: '1rem',
                            marginBottom: '1rem',
                          }}
                          onClick={() => handleSelectItem(item)}
                        >
                          <div
                            style={{
                              fontWeight: 'bold',
                              color: 'var(--vscode-textLink-foreground)',
                            }}
                          >
                            {item.name}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              gap: '0.5rem',
                              alignItems: 'center',
                            }}
                          >
                            <MediaTypeTag mediaType={item.mediaType} />
                          </div>
                        </div>
                      ))}
                  </>
                )}
              </div>
              <div
                className="selected-item-display"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  backgroundColor:
                    'var(--vscode-editor-inactiveSelectionBackground)',
                  padding: '2.5em 3.5em 3.5em',
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
                {/* <pre>{JSON.stringify(itemContent, null, 2)}</pre> */}
              </div>
            </SearchDisplayWrapper>
          )}
        </VSCodePanelView>
        {/* <VSCodePanelView
          id="Shared Editor"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <SharedEditor />
        </VSCodePanelView> */}
      </VSCodePanels>
    </div>
  );
}

export default App;
