import { vscode } from "./utilities/vscode";
import { useState, useEffect } from 'react';

// interface SearchResultProps {
//   id: number;
//   name: string;
//   localizedName: string;
//   mediaType: string;
//   // Add other props as needed
// }



function App() {
  const [parsedData, setData] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [passage, setPassage] = useState('');

  // const SearchResult = (parsedData: SearchResultProps) => {
  //   const name = parsedData.name;
  //   // Add other properties as needed
    
  //   return (
  //     <div className="search-result">
  //       <h3>{name}</h3>
  //       {/* Display other information as needed */}
        
  //       {/* Add a thumbnail and a link if required */}
  //     </div>
  //   );
  // };

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
          const data: string = message.data;
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
        <pre>Search Term: {JSON.stringify(parsedData, null, 2)}</pre>
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