"use client";

import { useState, useEffect } from "react";

interface SearchBarProps {
  handle: string;
  setHandle: (handle: string) => void;
  onSearch: () => void;
  loading: boolean;
}

interface ProfileSuggestion {
  handle: string;
  displayName: string;
  avatar: string;
}

export default function SearchBar({
  handle,
  setHandle,
  onSearch,
  loading,
}: SearchBarProps) {
  const [suggestions, setSuggestions] = useState<ProfileSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch suggestions as the user types
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const query = handle.trim().replace(/^@/, "");
      if (query.length < 1) {
        setSuggestions([]);
        return;
      }

      fetch(`/api/search?q=${query}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.actors) {
            const formatted = data.actors.map((actor: any) => ({
              handle: actor.handle,
              displayName: actor.displayName,
              avatar: actor.avatar,
            }));
            setSuggestions(formatted);
            setShowSuggestions(true);
          }
        })
        .catch(() => setSuggestions([]));
    }, 300); // debounce

    return () => clearTimeout(delayDebounce);
  }, [handle]);

  const handleSelect = (selectedHandle: string) => {
    setHandle(selectedHandle);
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
      className="relative flex flex-col gap-2 mb-6"
    >
      <div className="flex gap-2 items-center">
        <input
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="Enter a handle, e.g. 'mcuban'"
          className="flex-grow border p-2 rounded"
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Loading..." : "View Analytics"}
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute top-full mt-1 left-0 w-full bg-white border rounded shadow z-10 max-h-60 overflow-y-auto">
          {suggestions.map((user) => (
            <li
              key={user.handle}
              onMouseDown={() => handleSelect(user.handle)}
              className="flex items-center gap-4 px-4 py-4 cursor-pointer hover:bg-gray-100"
            >
              <img
                src={user.avatar}
                alt={user.displayName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-medium">{user.displayName}</div>
                <div className="text-sm text-gray-500">@{user.handle}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
