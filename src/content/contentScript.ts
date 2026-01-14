import { MessageHost } from '../shared/messaging/host';
import { Recorder } from './recorder';

console.log('Gemini Agent Content Script loaded');

const host = new MessageHost();
const recorder = new Recorder();

host.on('PING', () => {
    console.log('Received PING in content script');
    return { status: 'ok' };
});

host.on('TOGGLE_RECORDING', (payload) => {
    if (payload.active) {
        recorder.start();
    } else {
        recorder.stop();
    }
    return { status: 'ok' };
});

host.on('ANALYZE_PAGE', () => {
    const selection = window.getSelection()?.toString();

    const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
        .map(h => h.textContent?.trim() || '')
        .filter(h => h.length > 0)
        .slice(0, 20); // Cap at 20 headings

    const links = Array.from(document.querySelectorAll('a[href]'))
        .map(a => ({
            text: a.textContent?.trim() || '',
            url: (a as HTMLAnchorElement).href
        }))
        .filter(l => l.text.length > 0 && l.url.startsWith('http'))
        .slice(0, 50); // Cap at 50 links

    return {
        title: document.title,
        url: window.location.href,
        content: document.body.innerText.substring(0, 1000), // Increased cap
        selection: selection || undefined,
        headings,
        links
    };
});

host.on('EXECUTE_ACTION', async (payload) => {
    const { action } = payload;
    const element = document.querySelector(action.selector) as HTMLElement;

    if (!element) {
        return { success: false, error: `Element not found: ${action.selector}` };
    }

    try {
        if (action.type === 'highlight') {
            const originalBorder = element.style.border;
            const originalBackgroundColor = element.style.backgroundColor;

            element.style.border = '2px solid #ef4444';
            element.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';

            element.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => {
                element.style.border = originalBorder;
                element.style.backgroundColor = originalBackgroundColor;
            }, 2000);

        } else if (action.type === 'click') {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.click();

        } else if (action.type === 'type') {
            if (action.value === undefined) throw new Error('Value required for type action');

            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            (element as HTMLInputElement).value = action.value;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
        }

        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
});
