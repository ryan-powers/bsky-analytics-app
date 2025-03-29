"use client";

interface ProfileProps {
  name: string;
  handle: string;
  avatar?: string;
  description?: string;
  followersCount?: number;
}

export default function ProfileSection({
  name,
  handle,
  avatar,
  description,
  followersCount,
}: ProfileProps) {
  return (
    <a
      href={`https://bsky.app/profile/${handle}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block mb-6 p-4 bg-white rounded shadow hover:bg-gray-50 transition"
    >
      <div className="flex items-start gap-4">
        {avatar && (
          <img
            src={avatar}
            alt={name}
            className="w-16 h-16 rounded-full"
          />
        )}
        <div>
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-gray-500">
            @{handle}
            {followersCount !== undefined && (
              <> · {followersCount.toLocaleString()} followers</>
            )}
          </p>
          {description && (
            <p className="mt-1 text-gray-700 whitespace-pre-line">
              {description}
            </p>
          )}
        </div>
      </div>
    </a>
  );
} 