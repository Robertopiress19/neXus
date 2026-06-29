
# neXus - Agente de Suporte Interativo (Protótipo INOVAAPPS 2025)

## Visão Geral

O **neXus** é um protótipo de agente de suporte inteligente projetado para otimizar e modernizar o atendimento de TI em ambientes corporativos. A solução combina uma interface de chat intuitiva com o poder da Inteligência Artificial Generativa do Google (Gemini) para fornecer respostas instantâneas baseadas em uma base de conhecimento, automatizar a criação de chamados e facilitar a comunicação entre usuários e a equipe de suporte.

Este projeto foi desenvolvido como uma solução para o **Desafio INOVAAPPS 2025**, focando em inovação, usabilidade e acessibilidade.

---

## ✨ Funcionalidades Principais

-   **Assistente Virtual Inteligente (Nexus):** Um chatbot que compreende e responde a perguntas em linguagem natural.
-   **Base de Conhecimento Integrada:** O assistente consulta artigos técnicos internos para fornecer soluções precisas e imediatas para problemas comuns.
-   **Criação Automática de Chamados:** Quando um problema não pode ser resolvido com a base de conhecimento, um chamado é criado automaticamente, com título, descrição e categoria gerados por IA para garantir padronização e clareza.
-   **Processamento de Múltiplas Consultas:** O sistema é capaz de identificar, em uma única mensagem do usuário, múltiplos problemas distintos, respondendo aos que conhece e abrindo chamados para os desconhecidos.
-   **Painel de Atendimento para Agentes:** Uma visão de dashboard para a equipe de suporte, com filtros avançados para gerenciar, priorizar e interagir com os chamados.
-   **Comunicação Bidirecional nos Chamados:** Um sistema de "mini-chat" dentro de cada chamado permite que atendentes e usuários troquem mensagens até a resolução do problema.
-   **Acessibilidade Multi-Modal:**
    -   **Comando de Voz:** Transcrição de áudio para texto para abrir chamados.
    -   **Suporte a Libras:** Interpretação de vídeos em Língua Brasileira de Sinais para texto, permitindo a abertura de chamados por pessoas com deficiência auditiva.
-   **Persistência de Dados:** O histórico de conversas e os chamados são salvos no `localStorage` do navegador, simulando um banco de dados e mantendo o estado entre sessões.
-   **Design Responsivo:** Interface adaptada para uma experiência de uso otimizada em desktops e dispositivos móveis.

---

## 🚀 Tecnologias Utilizadas

-   **Frontend:**
    -   **React:** Biblioteca para construção de interfaces de usuário reativas e componentizadas.
    -   **TypeScript:** Superset do JavaScript que adiciona tipagem estática para maior robustez e manutenibilidade do código.
    -   **Tailwind CSS:** Framework de CSS utility-first para estilização rápida e consistente.
-   **Inteligência Artificial:**
    -   **Google Gemini (`@google/genai`):** Utilizado para:
        -   Compreensão e resposta a perguntas (NLU/NLG).
        -   Geração de resumos e categorização para chamados.
        -   Transcrição de áudio (Speech-to-Text).
        -   Interpretação de vídeo (Libras-to-Text).
-   **APIs do Navegador:**
    -   **WebRTC (`navigator.mediaDevices`):** Para acesso à câmera e ao microfone para as funcionalidades de Libras e comando de voz.
    -   **Web Storage API (`localStorage`):** Para persistência de dados no lado do cliente.

---

## 📂 Arquitetura do Projeto

O projeto é estruturado de forma modular para facilitar a manutenção e escalabilidade.

```
/
├── public/
├── src/
│   ├── components/    # Componentes React reutilizáveis (cards, modais, etc.)
│   ├── data/          # Dados estáticos, como a base de conhecimento (knowledgeBase.ts)
│   ├── services/      # Lógica de comunicação com APIs externas (geminiService.ts)
│   ├── types.ts       # Definições de tipos e interfaces do TypeScript
│   ├── App.tsx        # Componente principal que gerencia o estado e a navegação
│   └── index.tsx      # Ponto de entrada da aplicação React
├── index.html         # Arquivo HTML raiz
└── README.md          # Este arquivo
```

---

## ⚙️ Configuração e Execução

Este projeto foi desenvolvido para rodar diretamente no navegador, sem a necessidade de um passo de compilação (`build`) ou um servidor de desenvolvimento local.

### 1. Pré-requisitos

-   Um navegador moderno (Chrome, Firefox, Edge).
-   Uma chave de API do Google Gemini.

### 2. Configurando a Chave de API

Para que as funcionalidades de Inteligência Artificial funcionem, é **essencial** configurar sua chave de API do Google Gemini como uma variável de ambiente.

1.  Obtenha sua chave de API no [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Na raiz do projeto, crie um arquivo chamado `.env.local` (use o `.env.local.example` como modelo).
3.  Dentro dele, adicione a linha: `GEMINI_API_KEY=sua_chave_aqui`.

> O arquivo `.env.local` está no `.gitignore` e **nunca** é enviado ao repositório, mantendo sua chave segura.


### 3. Execução

Primerio dê **npm install** para instalar as dependências.
Após isso, dê **npm run dev** para executar

---

## 👣 Como Utilizar (Passo a Passo)

### 1. Autenticação

A aplicação simula um sistema de login com dois perfis pré-configurados.

-   **Perfil de Usuário:** `usuario@inovaapps.com`
-   **Perfil de Atendente:** `atendente@inovaapps.com`

Use um dos e-mails acima na tela de login para acessar a respectiva interface.

### 2. Visão do Usuário e Interação com a IA

Ao logar como `usuario@inovaapps.com`, você poderá interagir com o assistente Nexus.

#### O que o Nexus sabe responder?

A base de conhecimento atual do Nexus inclui os seguintes tópicos:

-   **Problemas com Computador:**
    -   Não liga
    -   Está lento
    -   Apresenta Tela Azul (BSOD)
    -   Está sem conexão com a internet
-   **Problemas com Periféricos:**
    -   Mouse ou teclado não funcionam
-   **Problemas com Infraestrutura:**
    -   Ar condicionado não gela
    -   Ar condicionado apresenta mau odor, gotejamento ou barulhos estranhos

#### Simulação de Consulta Mista (Resposta + Criação de Chamado)

O grande diferencial do Nexus é sua capacidade de entender múltiplos problemas em uma única mensagem.

**Exemplo de Pergunta do Usuário:**
> "meu ar condicionado não gela e tem mal odor. E estou com problemas na trave do meu gol"

**Resposta Esperada do Nexus (em duas partes):**
1.  **Resposta Baseada no Conhecimento:** O Nexus primeiro responderá sobre o ar condicionado, fornecendo as soluções que constam em sua base de dados para os problemas de refrigeração e mau odor.
2.  **Criação de Chamado:** Em seguida, ele informará que não encontrou informações sobre "problemas na trave do gol" e que um chamado técnico foi aberto automaticamente para que a equipe de suporte investigue essa questão específica.

### 3. Visão do Atendente

Ao logar como `atendente@inovaapps.com`, você será direcionado ao painel de gerenciamento de chamados, onde poderá visualizar, filtrar e interagir com os tickets abertos pelos usuários.

---

## 🏆 Critérios Atendidos (Desafio INOVAAPPS)

-   **Inovação e Criatividade:**
    -   Uso de IA generativa para criar uma experiência de suporte conversacional e proativa.
    -   Implementação de funcionalidades de acessibilidade de ponta, como a interpretação de Libras, que amplia o alcance da solução.
-   **Qualidade e Execução Técnica:**
    -   Arquitetura de componentes bem definida com React e TypeScript.
    -   Código limpo, modular e de fácil manutenção.
    -   Integração robusta com a API do Gemini, incluindo tratamento de erros e fallbacks.
-   **Usabilidade e Experiência do Usuário (UX):**
    -   Interfaces distintas e otimizadas para cada perfil (usuário e atendente).
    -   Design limpo, responsivo e intuitivo, com feedback visual claro para todas as ações.
    -   Fluxos de trabalho simplificados que reduzem o esforço do usuário e do atendente.
-   **Impacto e Relevância:**
    -   Solução com potencial real para reduzir custos operacionais, aumentar a eficiência da equipe de suporte e melhorar a satisfação dos colaboradores.

---

## 🌟 Diferenciais e Funcionalidades Adicionais

-   **Inteligência de Análise Semântica:** A capacidade de decompor uma única frase do usuário em múltiplos problemas e tratá-los individualmente em uma única chamada de API otimizada.
-   **Plataforma de Comunicação Integrada:** O sistema de chat dentro dos chamados transforma um simples sistema de tickets em uma plataforma de atendimento completa.
-   **Acessibilidade como Pilar Central:** O suporte a Libras e voz demonstra um compromisso com a inclusão.
-   **Simulação de Persistência Real:** O uso do `localStorage` confere ao protótipo um comportamento realista, onde os dados não se perdem ao recarregar a página.
