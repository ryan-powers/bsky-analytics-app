'use client';

type PostCardProps = {
    text: string;
    likes: number;
    reposts: number;
    replies: number;
    label?: string;
    author?: {
      name: string;
      handle: string;
      avatar?: string | null;
    };
    createdAt?: string;
  };
  
  export default function PostCard({ text, likes, reposts, replies, label, author, createdAt }: PostCardProps) {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    };

    return (
      <div className="border rounded-lg p-4 shadow-sm bg-white">
        {label && <h3 className="text-md font-semibold mb-2">{label}</h3>}
        {author && (
          <div className="flex items-center gap-2 mb-2">
            {author.avatar && (
              <img
                src={author.avatar}
                alt={author.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div>
              <p className="font-medium">{author.name}</p>
              <p className="text-sm text-gray-500">
                @{author.handle} · {createdAt && formatDate(createdAt)}
              </p>
            </div>
          </div>
        )}
        <p className="mb-2 whitespace-pre-line">{text}</p>
        <div className="text-sm text-gray-600">
          ❤️ {likes} | 🔁 {reposts} | 💬 {replies}
        </div>
      </div>
    );
  }
  
