"use client";

interface Account {
  handle: string;
  name: string;
  avatar: string;
}

interface TestAccountsProps {
  accounts: Account[];
  onSelect: (handle: string) => void;
}

export default function TestAccounts({ accounts, onSelect }: TestAccountsProps) {
  return (
    <div className="mb-8 flex flex-col items-center">
      <p className="text-sm text-gray-600 mb-3">
        Or try one of these...
      </p>
      <div className="flex gap-6">
        {accounts.map((account) => (
          <button
            key={account.handle}
            onClick={() => onSelect(account.handle)}
            className="flex flex-col items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors group"
          >
            <img
              src={account.avatar}
              alt={account.name}
              className="w-12 h-12 rounded-full"
            />
            <span className="font-medium text-sm group-hover:underline">
              {account.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
} 