"use client";

interface SearchBarProps {
  handle: string;
  setHandle: (handle: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export default function SearchBar({
  handle,
  setHandle,
  onSearch,
  loading,
}: SearchBarProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
      className="flex gap-2 items-center mb-6"
    >
      <input
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        placeholder="Enter a handle, e.g. 'mcuban'"
        className="flex-grow border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Loading..." : "View Analytics"}
      </button>
    </form>
  );
} 