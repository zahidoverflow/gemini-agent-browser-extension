import { MessageClient } from '../shared/messaging/client';

export class Recorder {
    private active: boolean = false;
    private boundHandleClick: (e: MouseEvent) => void;
    private boundHandleInput: (e: Event) => void;

    constructor() {
        this.boundHandleClick = this.handleClick.bind(this);
        this.boundHandleInput = this.handleInput.bind(this);
    }

    public start() {
        if (this.active) return;
        this.active = true;
        document.addEventListener('click', this.boundHandleClick, true); // Capture phase
        document.addEventListener('change', this.boundHandleInput, true);
        console.log('Recorder started');
    }

    public stop() {
        if (!this.active) return;
        this.active = false;
        document.removeEventListener('click', this.boundHandleClick, true);
        document.removeEventListener('change', this.boundHandleInput, true);
        console.log('Recorder stopped');
    }

    private async handleClick(e: MouseEvent) {
        if (!this.active) return;
        const target = e.target as HTMLElement;
        const selector = this.getSelector(target);

        await MessageClient.send('background', 'RECORD_ACTION', {
            action: { type: 'click', selector }
        });
    }

    private async handleInput(e: Event) {
        if (!this.active) return;
        const target = e.target as HTMLInputElement;
        const selector = this.getSelector(target);

        await MessageClient.send('background', 'RECORD_ACTION', {
            action: { type: 'type', selector, value: target.value }
        });
    }

    private getSelector(el: HTMLElement): string {
        if (el.id) return `#${el.id}`;
        if (el.getAttribute('data-testid')) return `[data-testid="${el.getAttribute('data-testid')}"]`;
        if (el.getAttribute('name')) return `[name="${el.getAttribute('name')}"]`;

        // Fallback: tag + nth-child (simplified)
        let path = '';
        let current = el;
        while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body) {
            let tag = current.tagName.toLowerCase();
            let parent = current.parentNode;
            let index = 1;
            if (parent) {
                const siblings = parent.children;
                for (let i = 0; i < siblings.length; i++) {
                    if (siblings[i] === current) break;
                    if (siblings[i].tagName.toLowerCase() === tag) index++;
                }
            }
            path = `${tag}:nth-of-type(${index})` + (path ? ' > ' + path : '');
            current = current.parentNode as HTMLElement;
        }
        return path;
    }
}
