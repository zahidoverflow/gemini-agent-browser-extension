import { useState, useCallback } from 'react';
import { MessageClient } from '../../../shared/messaging/client';

export function useExtension() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const ping = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await MessageClient.send('background', 'PING', {});
            return res;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const analyzePage = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Find active tab first
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab?.id) throw new Error('No active tab found');

            const res = await MessageClient.send('tab', 'ANALYZE_PAGE', {}, tab.id);
            return res;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        ping,
        analyzePage
    };
}
