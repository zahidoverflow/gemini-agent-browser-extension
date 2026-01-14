export type MessageType =
    | 'PING'
    | 'ANALYZE_PAGE'
    | 'EXECUTE_ACTION';

export interface BaseMessage {
    type: MessageType;
    payload?: any;
}

export interface PingMessage extends BaseMessage {
    type: 'PING';
}

export interface AnalyzePageMessage extends BaseMessage {
    type: 'ANALYZE_PAGE';
}

export type ExtensionMessage = PingMessage | AnalyzePageMessage;
