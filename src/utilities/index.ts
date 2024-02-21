/** 
 * This is a simple obfuscation to deter bots from getting this publicly useable value.
 * 
 * @remarks Ryder got permission from Jesse Winston to use this approach on February 21, 2024.
 * 
 * @param key - The key to be obfuscated - default is the key for the Aquifer API.
 * @returns The obfuscated key.
 */
export function getDecodedKey(hashedKey = "5ii857d<43757436de;gii9f595:5f3f"): string {
    function decodeHashedInputString(hashedKey: string): string {
        return hashedKey.split('').map(char => String.fromCharCode((char.charCodeAt(0) - 3) % 256)).join('');
    }
    return decodeHashedInputString(hashedKey);
}

/**
 * A helper function that returns a unique alphanumeric identifier called a nonce.
 *
 * @remarks This function is primarily used to help enforce content security
 * policies for resources/scripts being executed in a webview context.
 *
 * @returns A nonce
 */
export function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

import { Uri, Webview } from "vscode";

/**
 * A helper function which will get the webview URI of a given file or resource.
 *
 * @remarks This URI can be used within a webview's HTML as a link to the
 * given file/resource.
 *
 * @param webview A reference to the extension webview
 * @param extensionUri The URI of the directory containing the extension
 * @param pathList An array of strings representing the path to a file/resource
 * @returns A URI pointing to the file/resource
 */
export function getUri(webview: Webview, extensionUri: Uri, pathList: string[]) {
    return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}
