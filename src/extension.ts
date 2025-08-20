import * as vscode from 'vscode';
import { ZanaiCodeIntegration } from './zanaiCodeIntegration';

export function activate(context: vscode.ExtensionContext) {
    console.log('ZanaiCode está ativo!');

    const zanaiCodeIntegration = new ZanaiCodeIntegration(context);
    context.subscriptions.push(zanaiCodeIntegration);
}

export function deactivate() {
    console.log('ZanaiCode desativado');
}