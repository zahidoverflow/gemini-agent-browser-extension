import { z } from 'zod';
import { MessageSchemas } from './schema';

export type MessageType = keyof typeof MessageSchemas;

export interface Message<T extends MessageType> {
    type: T;
    payload: z.infer<typeof MessageSchemas[T]['payload']>;
}

export interface MessageResponse<T extends MessageType> {
    payload: z.infer<typeof MessageSchemas[T]['response']>;
    error?: string;
}

export type Handler<T extends MessageType> = (
    payload: z.infer<typeof MessageSchemas[T]['payload']>,
    sender?: chrome.runtime.MessageSender
) => Promise<z.infer<typeof MessageSchemas[T]['response']>> | z.infer<typeof MessageSchemas[T]['response']>;
