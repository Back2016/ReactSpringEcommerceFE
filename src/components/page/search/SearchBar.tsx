'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { fetchProductSuggestions } from '@/lib/api/product';
import { Search } from 'lucide-react'; // Using Lucide for icon

export default function ProductSearchBar() {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const suppressFetchRef = useRef(false);
    const router = useRouter();

    useEffect(() => {
        if (input.length < 2 || suppressFetchRef.current) {
            setSuggestions([]);
            setShowSuggestions(false);
            suppressFetchRef.current = false;
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setLoading(true);
                const result = await fetchProductSuggestions(input);
                setSuggestions(result);
                setShowSuggestions(true);
                setHighlightedIndex(-1);
            } catch (err) {
                console.error('Suggestion fetch failed', err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [input]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0) {
                    setInput(suggestions[highlightedIndex]);
                    setShowSuggestions(false);
                    suppressFetchRef.current = true;
                } else {
                    handleSearch(); // trigger search on Enter
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                break;
        }
    };

    const handleSuggestionClick = (value: string) => {
        setInput(value);
        setShowSuggestions(false);
        suppressFetchRef.current = true;
    };

    const handleSearch = () => {
        if (input.trim().length > 0) {
            router.push(`/search?query=${encodeURIComponent(input.trim())}`);
        }
    };

    return (
        <div className="w-full flex justify-center">
        <div className="relative w-full max-w-md">
            <div className="flex">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for a product..."
                    className="flex-1 px-4 py-2 border rounded-l-md shadow-sm focus:ring-black focus:border-black"
                />
                <button
                    type="button"
                    onClick={handleSearch}
                    className="px-4 bg-black text-white rounded-r-md hover:bg-neutral-800"
                    aria-label="Search"
                >
                    <Search className="w-5 h-5" />
                </button>
            </div>

            {loading && (
                <div className="absolute top-full mt-1 left-0 px-4 py-2 text-sm text-gray-500 bg-white border rounded shadow z-50">
                    Loading...
                </div>
            )}

            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 z-50 bg-white border rounded shadow mt-1 max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, idx) => (
                        <li
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${idx === highlightedIndex ? 'bg-gray-100' : ''
                                }`}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
                )}
            </div>
        </div>
    );
}
