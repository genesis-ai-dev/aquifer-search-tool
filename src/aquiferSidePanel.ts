import * as vscode from 'vscode';
import { getUri, getNonce } from './utilities';
import { parseScriptureReference, ScriptureReference } from './utilities/ScriptureRef';
import { Aquifer, searchParams } from './utilities/AquiferRequest';


export class AquiferSidePanel implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;
    public static readonly viewType = 'aquiferSidePanel';
    private extensionUri: vscode.Uri;
    private aquifer = new Aquifer();
    private searchTerms?: searchParams;

    constructor(extensionUri: vscode.Uri) {
        this.extensionUri = extensionUri;
    }

    public async resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        token: vscode.CancellationToken,
    ): Promise<void> {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.extensionUri]
        };

        webviewView.webview.html = this.getWebviewContent(webviewView.webview);

        this.setWebviewMessageListener(webviewView.webview, this.extensionUri);
    }

    private getWebviewContent(webview: vscode.Webview) {
        const scriptUri = getUri(webview, this.extensionUri, ['webview', 'dist', 'assets', 'index.js']);
        const stylesUri = getUri(webview, this.extensionUri, ['webview', 'dist', 'assets', 'index.css']);
        const codiconsStyleUri = getUri(webview, this.extensionUri, ['node_modules', 'vscode-codicons', 'dist', 'codicon.css']);
        const nonce = getNonce();

        return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}'; style-src ${webview.cspSource};">
              <link href="${stylesUri}" rel="stylesheet">
              <link href="${codiconsStyleUri}" rel="stylesheet">
              <title>Dictionary Table</title>
          </head>
          <body>
              <div id="root"></div>
              <script nonce="${nonce}" type="module" src="${scriptUri}"></script>
          </body>
          </html>
        `;
    }

    private async searchResources(webview: vscode.Webview) {
        // FIXME: Set searchTerms language to eng and resourceType to None - need a language dropdown in the webview
        this.searchTerms = { ...this.searchTerms, languageCode: 'eng', resourceType: 'None' };
        const searchResults = await this.aquifer.searchResources(this.searchTerms);
        webview.postMessage({ command: 'sendData', data: searchResults });
    }

    private setWebviewMessageListener(webview: vscode.Webview, uri: vscode.Uri) {
        webview.onDidReceiveMessage(            async (message) => {
                const data = message.data;
                switch (message.command) {
                    case 'search-searchTerm':
                        console.log('searchTerm from webview:', data);
                        // Insert data into query field of searchTerms
                        if (data) {
                            this.searchTerms = { ...this.searchTerms, query: data };                        } else {
                            // Delete query field from searchTerms if it exists
                            if (this.searchTerms) {
                                delete this.searchTerms.query;
                            }
                        }
                        await this.searchResources(webview);
                        break;
                    case 'search-passage':
                        console.log('passage from webview:', data);
                        const passage: ScriptureReference = parseScriptureReference(data);
                        if (passage.bookCode) {  
                            this.searchTerms = {
                                ...this.searchTerms,
                                bookCode: passage.bookCode,
                                startChapter: passage.startChapter,
                                endChapter: passage.endChapter,
                                startVerse: passage.startVerse,
                                endVerse: passage.endVerse,
                            };
                        } else {
                            // Delete bookCode, startChapter, endChapter, startVerse, and endVerse from searchTerms if they exist
                            if (this.searchTerms) {
                                delete this.searchTerms.bookCode;
                                delete this.searchTerms.startChapter;
                                delete this.searchTerms.endChapter;
                                delete this.searchTerms.startVerse;
                                delete this.searchTerms.endVerse;
                            }
                        }
                        await this.searchResources(webview);
                        break;
                    default:
                        console.log('Received message from webview:', data);
                        break;

                    
                }
                
            }
        );
    }
}