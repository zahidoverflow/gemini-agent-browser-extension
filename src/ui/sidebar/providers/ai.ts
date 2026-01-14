export interface AIProvider {
    generateText(prompt: string, context?: any): Promise<string>;
    streamText(prompt: string, context?: any, onChunk?: (chunk: string) => void): Promise<string>;
}

export class MockProvider implements AIProvider {
    async generateText(prompt: string, _context?: any): Promise<string> {
        return `Mock response to: "${prompt}"`;
    }

    async streamText(prompt: string, _context?: any, onChunk?: (chunk: string) => void): Promise<string> {
        const response = `Mock response to: "${prompt}"`;
        const chunks = response.split(' ');

        for (const chunk of chunks) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
            if (onChunk) onChunk(chunk + ' ');
        }

        return response;
    }
}
