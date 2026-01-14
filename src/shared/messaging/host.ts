import { MessageSchemas } from './schema';
import { MessageType, Handler } from './types';

export class MessageHost {
    private handlers: Partial<Record<MessageType, Handler<any>>> = {};

    constructor() {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
            return true; // Keep channel open for async response
        });
    }

    public on<T extends MessageType>(type: T, handler: Handler<T>) {
        this.handlers[type] = handler;
    }

    private async handleMessage(
        message: any,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: any) => void
    ) {
        const { type, payload } = message;

        if (!type || !this.handlers[type as MessageType]) {
            // Ignore unknown messages
            return;
        }

        try {
            const schema = MessageSchemas[type as MessageType];
            // Validate incoming payload
            const validatedPayload = schema.payload.parse(payload);

            const handler = this.handlers[type as MessageType];
            if (handler) {
                const result = await handler(validatedPayload, sender);
                sendResponse({ payload: result });
            }
        } catch (error: any) {
            console.error(`MessageHost Error (${type}):`, error);
            sendResponse({ error: error.message });
        }
    }
}
