import { useState, useEffect, useRef } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
    // Always start with initialValue to match SSR output
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const isHydrated = useRef(false);

    // After mount: read persisted value from localStorage
    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        } catch (error) {
            console.error(error);
        }
        isHydrated.current = true;
    }, [key]);

    // Persist to localStorage whenever value changes (but skip the initial hydration read)
    useEffect(() => {
        if (!isHydrated.current) return;
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(error);
        }
    }, [key, storedValue]);

    const setValue = (value: T | ((val: T) => T)) => {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
    };

    return [storedValue, setValue] as const;
}
