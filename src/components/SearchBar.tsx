"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";

interface SearchBarProps {
  handle: string;
  setHandle: (handle: string) => void;
  onSearch: (customHandle?: string) => void;
  loading: boolean;
  error?: string;
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
  error,
}: SearchBarProps) {
  const [suggestions, setSuggestions] = useState<ProfileSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  useEffect(() => {
    if (loading || handle.trim().length < 1) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounce = setTimeout(() => {
      const query = handle.trim().replace(/^@/, "");
      fetch(`/api/search?q=${query}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.actors && data.actors.length > 0) {
            const formatted = data.actors.map((actor: any) => ({
              handle: actor.handle,
              displayName: actor.displayName,
              avatar: actor.avatar,
            }));
            setSuggestions(formatted);
            if (document.activeElement === inputRef.current) {
              setShowDropdown(true);
            }
          } else {
            setSuggestions([]);
            setShowDropdown(false);
          }
        })
        .catch(() => {
          setSuggestions([]);
          setShowDropdown(false);
        });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [handle, loading]);

  const handleSelect = (selectedHandle: string) => {
    // Ensure the handle starts with @
    const formattedHandle = selectedHandle.startsWith('@') 
      ? selectedHandle 
      : '@' + selectedHandle;
    
    setHandle(formattedHandle);
    setShowDropdown(false);
    setSuggestions([]);
    
    inputRef.current?.blur();
    
    // Pass the formatted handle to ensure @ is included
    onSearch(formattedHandle);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setShowDropdown(false);
    setSuggestions([]);
    
    inputRef.current?.blur();
    
    onSearch();
  };

  const handleFocus = () => {
    if (!handle.startsWith('@') && handle.trim() === '') {
      setHandle('@');
      
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.selectionStart = 1;
          inputRef.current.selectionEnd = 1;
        }
      }, 0);
    }
    
    if (suggestions.length > 0 && !loading) {
      setShowDropdown(true);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
        
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex].handle);
        }
        break;
        
      case 'Escape':
        setShowDropdown(false);
        break;
        
      default:
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!value.startsWith('@')) {
      setHandle('@' + value.replace(/@/g, ''));
    } else {
      setHandle(value);
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="relative flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            value={handle}
            onChange={handleInputChange}
            placeholder="@"
            className="flex-grow border p-2 rounded"
            onFocus={handleFocus}
            onBlur={() => {
              setTimeout(() => setShowDropdown(false), 100);
            }}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {showDropdown && suggestions.length > 0 && !loading && (
          <ul className="absolute top-full mt-1 left-0 w-80 md:w-96 bg-white border rounded shadow z-10 max-h-60 overflow-y-auto">
            {suggestions.map((user, index) => (
              <li
                key={user.handle}
                onMouseDown={() => handleSelect(user.handle)}
                className={`flex items-center gap-4 px-4 py-4 cursor-pointer ${
                  index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-100'
                }`}
                onMouseEnter={() => setSelectedIndex(index)}
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

      {error && (
        <p className="text-red-600 font-medium text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
