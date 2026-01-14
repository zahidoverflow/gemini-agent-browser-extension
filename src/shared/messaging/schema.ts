import { z } from 'zod';

const ActionSchema = z.object({
    type: z.enum(['click', 'type', 'highlight']),
    selector: z.string(),
    value: z.string().optional()
});

export const MessageSchemas = {
    PING: {
        payload: z.object({}),
        response: z.object({ status: z.literal('ok') }),
    },
    LOG: {
        payload: z.object({ message: z.string(), level: z.enum(['info', 'warn', 'error']).optional() }),
        response: z.void(),
    },
    ANALYZE_PAGE: {
        payload: z.object({}),
        response: z.object({
            title: z.string(),
            url: z.string(),
            content: z.string().optional(),
            selection: z.string().optional(),
            headings: z.array(z.string()).default([]),
            links: z.array(z.object({
                text: z.string(),
                url: z.string()
            })).default([])
        }),
    },
    EXECUTE_ACTION: {
        payload: z.object({
            action: ActionSchema
        }),
        response: z.object({ success: z.boolean(), error: z.string().optional() })
    },
    TOGGLE_RECORDING: {
        payload: z.object({ active: z.boolean() }),
        response: z.object({ status: z.literal('ok') })
    },
    RECORD_ACTION: {
        payload: z.object({ action: ActionSchema }),
        response: z.void()
    }
} as const;
