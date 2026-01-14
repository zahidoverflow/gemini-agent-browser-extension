import { MessageSchemas } from './schema';
import { MessageType, MessageResponse } from './types';

export class MessageClient {
    static async send<T extends MessageType>(
        target: 'background' | 'tab',
        type: T,
        payload: any,
        tabId?: number
    ): Promise<MessageResponse<T>['payload']> {
        try {
            // Validate payload against schema
            const schema = MessageSchemas[type];
            const validatedPayload = schema.payload.parse(payload);

            let response: MessageResponse<T>;

            if (target === 'background') {
                response = await chrome.runtime.sendMessage({ type, payload: validatedPayload });
            } else if (target === 'tab' && tabId !== undefined) {
                response = await chrome.tabs.sendMessage(tabId, { type, payload: validatedPayload });
            } else {
                throw new Error('Invalid target or missing tabId');
            }

            if (response.error) {
                throw new Error(response.error);
            }

            return response.payload;
        } catch (error: any) {
            console.error(`MessageClient Error (${type}):`, error);
            throw error;
        }
    }
}
