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
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "aquifer.translate",
      async (content: string, documentId: string) => {
        if (vscode.extensions.getExtension("project-accelerate.ai-translate")) {
          const cancellationToken = new vscode.CancellationTokenSource().token;
          const preSelectedTranslationLanguage = undefined; // This can be set or left undefined for user input
          await vscode.commands.executeCommand(
            "ai-translate.translateDocument",
            documentId,
            content,
            cancellationToken,
            preSelectedTranslationLanguage
          );
        }
      }
    )
  );
}
export function deactivate() {}
