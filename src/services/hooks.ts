import { useState, useEffect, useCallback } from 'react';
import { getToken } from './api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const token = getToken();
    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data.data ?? data;
}

// Generic hook: fetches data from an endpoint automatically
export function useFetch<T>(endpoint: string | null) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        if (!endpoint) return;
        setLoading(true);
        setError(null);
        try {
            const result = await apiFetch(endpoint);
            setData(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [endpoint]);

    useEffect(() => { refetch(); }, [refetch]);

    return { data, loading, error, refetch };
}

// Generic mutation hook: for POST/PUT/DELETE actions
export function useMutation() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutate = async (endpoint: string, method: string, body?: object) => {
        setLoading(true);
        setError(null);
        try {
            const result = await apiFetch(endpoint, {
                method,
                body: body ? JSON.stringify(body) : undefined,
            });
            return result;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { mutate, loading, error };
}

// Export to CSV utility
export function exportToCSV(data: object[], filename: string) {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','),
        ...data.map(row =>
            headers.map(h => {
                const val = (row as any)[h];
                const str = val === null || val === undefined ? '' : String(val);
                return `"${str.replace(/"/g, '""')}"`;
            }).join(',')
        )
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}
