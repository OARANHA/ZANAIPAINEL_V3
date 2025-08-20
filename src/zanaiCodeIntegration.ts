import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';

export class ZanaiCodeIntegration {
    private context: vscode.ExtensionContext;
    private statusBar: vscode.StatusBarItem;
    private outputChannel: vscode.OutputChannel;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.outputChannel = vscode.window.createOutputChannel('ZanaiCode');
        this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBar.text = '$(rocket) ZanaiCode';
        this.statusBar.command = 'zanaiCode.openDashboard';
        this.statusBar.show();

        this.setupCommands();
        this.setupEventListeners();
    }

    private setupCommands(): void {
        const commands = [
            { command: 'zanaiCode.openDashboard', callback: () => this.openDashboard() },
            { command: 'zanaiCode.downloadAgent', callback: () => this.downloadAgent() },
            { command: 'zanaiCode.listAgents', callback: () => this.listAgents() },
            { command: 'zanaiCode.refreshAgents', callback: () => this.refreshAgents() },
            { command: 'zanaiCode.showHelp', callback: () => this.showHelp() }
        ];

        commands.forEach(({ command, callback }) => {
            this.context.subscriptions.push(
                vscode.commands.registerCommand(command, callback)
            );
        });
    }

    private setupEventListeners(): void {
        // Monitor changes to .kilocode directory
        const watcher = vscode.workspace.createFileSystemWatcher(
            new vscode.RelativePattern(vscode.workspace.workspaceFolders?.[0] || '.', '.kilocode/**/*')
        );
        
        watcher.onDidChange(() => this.checkAgents());
        watcher.onDidCreate(() => this.checkAgents());
        watcher.onDidDelete(() => this.checkAgents());
        
        this.context.subscriptions.push(watcher);
    }

    private async openDashboard(): Promise<void> {
        const dashboardUrl = 'http://localhost:3000';
        vscode.env.openExternal(vscode.Uri.parse(dashboardUrl));
    }

    private async downloadAgent(): Promise<void> {
        try {
            // Quick pick to select agent from website
            const agents = await this.fetchAvailableAgents();
            
            if (agents.length === 0) {
                vscode.window.showInformationMessage('Nenhum agente disponível no website.');
                return;
            }

            const selected = await vscode.window.showQuickPick(
                agents.map(agent => ({
                    label: agent.name,
                    description: agent.description,
                    detail: agent.slug,
                    agent: agent
                })),
                { placeHolder: 'Selecione um agente para baixar' }
            );

            if (selected) {
                await this.downloadAndInstallAgent(selected.agent);
                vscode.window.showInformationMessage(`Agente "${selected.label}" baixado com sucesso!`);
            }
        } catch (error) {
            this.handleError('Erro ao baixar agente', error);
        }
    }

    private async listAgents(): Promise<void> {
        const agents = this.getLocalAgents();
        
        if (agents.length === 0) {
            vscode.window.showInformationMessage('Nenhum agente instalado.');
            return;
        }

        const items = agents.map(agent => ({
            label: agent.name,
            description: agent.description,
            detail: `Slug: ${agent.slug}`,
            agent: agent
        }));

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Selecione um agente para ver detalhes'
        });

        if (selected) {
            this.showAgentDetails(selected.agent);
        }
    }

    private async refreshAgents(): Promise<void> {
        try {
            await this.checkAgents();
            vscode.window.showInformationMessage('Agentes atualizados com sucesso!');
        } catch (error) {
            this.handleError('Erro ao atualizar agentes', error);
        }
    }

    private showHelp(): void {
        const helpText = `
ZanaiCode - Superpílula para KiloCode

Comandos disponíveis:
• zanaiCode.openDashboard - Abre o dashboard web
• zanaiCode.downloadAgent - Baixa um agente do website
• zanaiCode.listAgents - Lista agentes instalados
• zanaiCode.refreshAgents - Atualiza lista de agentes
• zanaiCode.showHelp - Mostra esta ajuda

Como funciona:
1. Crie agentes no website
2. Baixe agentes para o VS Code
3. Os agentes são instalados como Custom Modes do KiloCode
4. Use os agentes diretamente no KiloCode
        `;
        
        this.outputChannel.clear();
        this.outputChannel.appendLine(helpText);
        this.outputChannel.show();
    }

    private async fetchAvailableAgents(): Promise<any[]> {
        try {
            const response = await axios.get('http://localhost:3000/api/agents');
            return response.data.agents || [];
        } catch (error) {
            this.outputChannel.appendLine(`Erro ao buscar agentes: ${error}`);
            return [];
        }
    }

    private getLocalAgents(): any[] {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) return [];

        const kilocodePath = path.join(workspaceFolder.uri.fsPath, '.kilocode');
        if (!fs.existsSync(kilocodePath)) return [];

        const modesPath = path.join(kilocodePath, '.kilocodemodes');
        if (!fs.existsSync(modesPath)) return [];

        try {
            const modesContent = fs.readFileSync(modesPath, 'utf8');
            const modes = JSON.parse(modesContent);
            return modes.customModes || [];
        } catch (error) {
            this.outputChannel.appendLine(`Erro ao ler agentes locais: ${error}`);
            return [];
        }
    }

    private async downloadAndInstallAgent(agent: any): Promise<void> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('Nenhuma pasta de trabalho aberta');
        }

        const kilocodePath = path.join(workspaceFolder.uri.fsPath, '.kilocode');
        if (!fs.existsSync(kilocodePath)) {
            fs.mkdirSync(kilocodePath, { recursive: true });
        }

        // Download agent configuration
        const response = await axios.get(`http://localhost:3000/api/agents/${agent.id}/export`);
        const agentConfig = response.data;

        // Create or update .kilocodemodes
        const modesPath = path.join(kilocodePath, '.kilocodemodes');
        let existingModes = { customModes: [] };

        if (fs.existsSync(modesPath)) {
            const existingContent = fs.readFileSync(modesPath, 'utf8');
            existingModes = JSON.parse(existingContent);
        }

        // Add or update agent mode
        const agentMode = {
            slug: agent.slug,
            name: agent.name,
            roleDefinition: agent.roleDefinition,
            groups: agent.groups || ['read'],
            customInstructions: agent.customInstructions || ''
        };

        // Remove existing mode with same slug
        existingModes.customModes = existingModes.customModes.filter(
            (mode: any) => mode.slug !== agent.slug
        );

        existingModes.customModes.push(agentMode);

        fs.writeFileSync(modesPath, JSON.stringify(existingModes, null, 2));

        // Create rules directory if needed
        if (agent.rules && agent.rules.length > 0) {
            const rulesPath = path.join(kilocodePath, `rules-${agent.slug}`);
            if (!fs.existsSync(rulesPath)) {
                fs.mkdirSync(rulesPath, { recursive: true });
            }

            // Write rule files
            agent.rules.forEach((rule: any) => {
                const rulePath = path.join(rulesPath, rule.filename);
                fs.writeFileSync(rulePath, rule.content);
            });
        }

        this.outputChannel.appendLine(`Agente "${agent.name}" instalado com sucesso!`);
    }

    private async checkAgents(): Promise<void> {
        const agents = this.getLocalAgents();
        this.statusBar.text = `$(rocket) ZanaiCode (${agents.length})`;
        this.statusBar.tooltip = `${agents.length} agentes instalados`;
    }

    private showAgentDetails(agent: any): Promise<void> {
        const panel = vscode.window.createWebviewPanel(
            'agentDetails',
            `Detalhes do Agente: ${agent.name}`,
            vscode.ViewColumn.One,
            {}
        );

        const content = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${agent.name}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #333; }
                    .detail { margin: 10px 0; }
                    .rules { background: #f5f5f5; padding: 10px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>${agent.name}</h1>
                <div class="detail"><strong>Slug:</strong> ${agent.slug}</div>
                <div class="detail"><strong>Descrição:</strong> ${agent.description || 'Sem descrição'}</div>
                <div class="detail"><strong>Role Definition:</strong></div>
                <div class="rules">${agent.roleDefinition || 'Sem definição'}</div>
                <div class="detail"><strong>Custom Instructions:</strong></div>
                <div class="rules">${agent.customInstructions || 'Sem instruções'}</div>
            </body>
            </html>
        `;

        panel.webview.html = content;
        return new Promise(() => {});
    }

    private handleError(message: string, error: any): void {
        this.outputChannel.appendLine(`${message}: ${error}`);
        vscode.window.showErrorMessage(message);
    }

    dispose(): void {
        this.statusBar.dispose();
        this.outputChannel.dispose();
    }
}