import * as vscode from "vscode";
import { AquiferSidePanel } from "./aquiferSidePanel";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "aquifer-side-panel",
      new AquiferSidePanel(context.extensionUri),
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  );
}

export function deactivate() {}
