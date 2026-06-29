import { GoogleGenAI, Type } from "@google/genai";
import { KnowledgeArticle, TicketCategory, ChatMessage } from '../types';


const API_KEY = process.env.API_KEY;


let ai: GoogleGenAI | null = null;



const getAiClient = (): GoogleGenAI | null => {
    if (ai) {
        return ai;
    }
 
    if (API_KEY) {
        ai = new GoogleGenAI({ apiKey: API_KEY });
        return ai;
    } else {
        console.error("ERRO: Chave da API do Gemini não encontrada. Defina GEMINI_API_KEY no arquivo .env.local na raiz do projeto.");
        return null;
    }
};

const model = "gemini-2.5-flash";


const formatChatHistory = (messages: ChatMessage[]): string => {
    
    return messages
        .filter(msg => msg.id !== 'init') 
        .map(msg => `${msg.sender === 'user' ? 'Usuário' : 'Agente'}: ${msg.text}`)
        .join('\n');
}

const getMissingApiKeyError = (): string => {
    return "ERRO DE CONFIGURAÇÃO: A chave de API do Gemini não foi inserida no código. Por favor, adicione sua chave no arquivo 'src/services/geminiService.ts'.";
}

export const getSmartAnswer = async (messages: ChatMessage[], knowledgeBase: KnowledgeArticle[]): Promise<string> => {
  const aiClient = getAiClient();
  if (!aiClient) {
      return getMissingApiKeyError();
  }
  try {
    const knowledgeBaseContent = knowledgeBase.map(article => `Artigo: ${article.title}\nConteúdo: ${article.content}`).join('\n\n');
    const chatHistory = formatChatHistory(messages);
    
    const prompt = `Você é um agente de suporte especialista. Sua tarefa é responder a última pergunta do usuário de forma concisa e direta, considerando todo o histórico da conversa para entender o contexto. Baseie-se exclusivamente nos artigos da base de conhecimento fornecidos. Se nenhum artigo responder à pergunta, considerando o contexto, responda EXATAMENTE com a frase: "NaoEncontrado".

Base de Conhecimento:
---
${knowledgeBaseContent}
---

Histórico da Conversa:
---
${chatHistory}
---

Responda à última mensagem do usuário com base no contexto acima.`;

    const response = await aiClient.models.generateContent({
      model,
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching smart answer from Gemini:", error);
   
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `Desculpe, ocorreu um erro ao se comunicar com a IA: ${errorMessage}`;
  }
};

export const createTicketSummary = async (messages: ChatMessage[], originalQuery: string): Promise<{ title: string; description: string; category: TicketCategory }> => {
  const aiClient = getAiClient();
  if (!aiClient) {
      return {
        title: `Chamado sobre: "${originalQuery.substring(0, 30)}..."`,
        description: `O usuário perguntou: "${originalQuery}"`,
        category: TicketCategory.Outros
      };
  }
  try {
    const chatHistory = formatChatHistory(messages);
    const validCategoriesList = Object.values(TicketCategory).join('", "');

    const prompt = `Com base em TODO o histórico da conversa de suporte, crie um título curto e uma descrição objetiva para um chamado técnico. O mais importante: categorize o problema com base no contexto completo da conversa. 

Histórico da Conversa:
---
${chatHistory}
---

Categorize o problema em uma das seguintes categorias: "${validCategoriesList}".`;

    const response = await aiClient.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "Um título curto e direto para o chamado, resumindo o problema principal."
            },
            description: {
              type: Type.STRING,
              description: "Uma descrição detalhada do problema do usuário, sintetizando as informações de toda a conversa."
            },
            category: {
              type: Type.STRING,
              description: `A categoria do problema. Deve ser EXATAMENTE uma das seguintes: "${validCategoriesList}".`
            }
          }
        }
      }
    });
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    
    const validCategories = Object.values(TicketCategory) as string[];
    if (validCategories.includes(result.category)) {
        return result as { title: string; description: string; category: TicketCategory };
    } else {
        
        return { ...result, category: TicketCategory.Outros };
    }

  } catch (error) {
    console.error("Error creating ticket summary with Gemini:", error);
   
    return {
      title: `Chamado sobre: "${originalQuery.substring(0, 30)}..."`,
      description: `O usuário perguntou: "${originalQuery}"`,
      category: TicketCategory.Outros
    };
  }
};

export const getVideoDescriptionFromLibras = async (videoBase64: string): Promise<string> => {
    const aiClient = getAiClient();
    if (!aiClient) {
      return getMissingApiKeyError();
    }
    try {
        const videoPart = {
            inlineData: {
                mimeType: 'video/webm',
                data: videoBase64,
            },
        };
        const textPart = {
            text: "Sua tarefa é atuar como um intérprete especialista em Língua Brasileira de Sinais (Libras). Transcreva *exatamente* o que está sendo sinalizado no vídeo para um texto em português. Foque na tradução literal e precisa. Se os sinais não forem claros ou você não conseguir traduzir com confiança, responda com a frase: 'Os sinais no vídeo não foram claros para tradução.'"
        };

        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: { parts: [videoPart, textPart] },
        });

        return response.text.trim();

    } catch (error) {
        console.error("Error processing Libras video with Gemini:", error);
        return "Desculpe, ocorreu um erro ao processar o vídeo. Por favor, tente novamente.";
    }
};

export const getTranscriptionFromAudio = async (audioBase64: string, mimeType: string): Promise<string> => {
    const aiClient = getAiClient();
    if (!aiClient) {
        return getMissingApiKeyError();
    }
    try {
        const audioPart = {
            inlineData: {
                mimeType,
                data: audioBase64,
            },
        };
        const textPart = {
            text: "Transcreva o áudio a seguir para texto em português."
        };

        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [audioPart, textPart] },
        });

        return response.text.trim();

    } catch (error) {
        console.error("Error transcribing audio with Gemini:", error);
        return "Desculpe, ocorreu um erro ao transcrever o áudio. Tente novamente.";
    }
};
