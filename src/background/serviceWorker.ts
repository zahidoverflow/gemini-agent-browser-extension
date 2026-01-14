/// <reference types="chrome" />
import { MessageHost } from '../shared/messaging/host';

console.log('Background Service Worker initialized');

const host = new MessageHost();

host.on('PING', () => {
    console.log('Received PING in background');
    return { status: 'ok' };
});

host.on('LOG', (payload) => {
    const level = payload.level || 'info';
    console.log(`[${level.toUpperCase()}] Client Log:`, payload.message);
});

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});
