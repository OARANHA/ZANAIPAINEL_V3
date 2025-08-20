# ZanaiCode - Superpílula para KiloCode

## Descrição

ZanaiCode é uma extensão VS Code que funciona como uma "superpílula" para o KiloCode, permitindo que você crie, baixe e gerencie agentes de IA personalizados diretamente do VS Code.

## Funcionalidades

- ✅ **Criação de Agentes**: Crie agentes personalizados através do website
- ✅ **Download de Agentes**: Baixe agentes diretamente no VS Code
- ✅ **Integração com KiloCode**: Agentes são instalados como Custom Modes do KiloCode
- ✅ **Gerenciamento Completo**: Liste, atualize e gerencie seus agentes
- ✅ **Formato Padrão**: Usa o formato JSON do KiloCode (.kilocodemodes)

## Instalação

1. Baixe o arquivo .vsix da extensão
2. No VS Code, pressione `Ctrl+Shift+P` (ou `Cmd+Shift+P` no Mac)
3. Digite "Extensions: Install from VSIX..."
4. Selecione o arquivo .vsix baixado
5. Reinicie o VS Code

## Como Usar

### 1. Abrir o Dashboard

Pressione `Ctrl+Shift+P` e digite "ZanaiCode: Abrir Dashboard" para abrir o website de criação de agentes.

### 2. Baixar Agentes

1. Crie seus agentes no website
2. No VS Code, pressione `Ctrl+Shift+P`
3. Digite "ZanaiCode: Baixar Agente"
4. Selecione um agente da lista
5. O agente será automaticamente instalado no formato KiloCode

### 3. Listar Agentes

Pressione `Ctrl+Shift+P` e digite "ZanaiCode: Listar Agentes" para ver todos os agentes instalados.

### 4. Usar Agentes

Depois de baixar um agente, ele estará disponível como um Custom Mode no KiloCode:

1. Abra o KiloCode
2. Selecione o modo personalizado do seu agente
3. Use as capacidades do agente diretamente no KiloCode

## Formato dos Agentes

Os agentes são instalados no formato padrão do KiloCode:

### .kilocodemodes

```json
{
  "customModes": [
    {
      "slug": "meu-agente",
      "name": "Meu Agente Especialista",
      "roleDefinition": "Você é um especialista em...",
      "groups": [
        "read",
        ["edit", { "fileRegex": "\\.(md|ts|js)$", "description": "Arquivos de código e documentação" }]
      ],
      "customInstructions": "Siga estas diretrizes específicas..."
    }
  ]
}
```

### Regras Específicas

```
.kilocode/
├── .kilocodemodes
└── rules-meu-agente/
    ├── conhecimento.md
    └── exemplos.md
```

## Configuração

Você pode configurar a extensão nas configurações do VS Code:

- `zanaiCode.serverUrl`: URL do servidor ZanaiCode (padrão: http://localhost:3000)
- `zanaiCode.autoUpdate`: Atualizar agentes automaticamente (padrão: true)
- `zanaiCode.debugMode`: Ativar modo de depuração (padrão: false)

## Comandos Disponíveis

- `ZanaiCode: Abrir Dashboard` - Abre o website de criação de agentes
- `ZanaiCode: Baixar Agente` - Baixa um agente do website
- `ZanaiCode: Listar Agentes` - Lista agentes instalados
- `ZanaiCode: Atualizar Agentes` - Atualiza lista de agentes
- `ZanaiCode: Ajuda` - Mostra informações de ajuda

## Requisitos

- VS Code 1.74.0 ou superior
- KiloCode instalado
- Acesso ao website ZanaiCode

## Desenvolvimento

### Estrutura do Projeto

```
src/
├── extension.ts          # Ponto de entrada da extensão
├── zanaiCodeIntegration.ts # Lógica principal
└── package.json          # Configuração da extensão
```

### Compilar

```bash
npm install
npm run compile
```

### Empacotar

```bash
npm install -g vsce
vsce package
```

## Troubleshooting

### Problemas Comuns

1. **Agentes não aparecem no KiloCode**
   - Verifique se o arquivo `.kilocodemodes` foi criado corretamente
   - Reinicie o VS Code
   - Verifique as permissões do diretório `.kilocode`

2. **Erro ao baixar agentes**
   - Verifique se o website está acessível
   - Verifique a URL do servidor nas configurações
   - Verifique sua conexão com a internet

3. **Problemas de permissão**
   - Certifique-se de que o VS Code tem permissão para escrever no diretório do projeto

## Suporte

Se você encontrar algum problema ou tiver sugestões:

1. Abra uma issue no GitHub
2. Use o comando "ZanaiCode: Ajuda" para ver informações de depuração
3. Verifique o output channel "ZanaiCode" para mensagens de erro

## Licença

MIT License - veja o arquivo LICENSE para detalhes.