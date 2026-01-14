import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AIProvider {
    generateText(prompt: string, context?: any): Promise<string>;
    streamText(prompt: string, context?: any, onChunk?: (chunk: string) => void): Promise<string>;
}

export class GeminiProvider implements AIProvider {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    async generateText(prompt: string, _context?: any): Promise<string> {
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
    }

    async streamText(prompt: string, _context?: any, onChunk?: (chunk: string) => void): Promise<string> {
        try {
            const result = await this.model.generateContentStream(prompt);
            let fullText = '';

            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                fullText += chunkText;
                if (onChunk) {
                    onChunk(chunkText);
                }
            }

            return fullText;
        } catch (error: any) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
    }
}

// Keep MockProvider for fallback
export class MockProvider implements AIProvider {
    async generateText(prompt: string, _context?: any): Promise<string> {
        return `Mock response to: "${prompt}"`;
    }

    async streamText(prompt: string, _context?: any, onChunk?: (chunk: string) => void): Promise<string> {
        const response = `Mock response to: "${prompt}"`;
        const chunks = response.split(' ');

        for (const chunk of chunks) {
            await new Promise(resolve => setTimeout(resolve, 50));
            if (onChunk) {
                onChunk(chunk + ' ');
            }
        }

        return response;
    }
}
