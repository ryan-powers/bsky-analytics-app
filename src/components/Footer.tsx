export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8 py-4">
      <div className="max-w-4xl mx-auto px-4">
        <p className="text-gray-600 text-sm text-center">
          Made by{" "}
          <a
            href="https://bsky.app/profile/ryanpowers.bsky.social"
            className="text-blue-500 hover:underline"
          >
            @ryanpowers.bsky.social
          </a>
          . Github repo{" "}
          <a
            href="https://github.com/ryan-powers/bsky-analytics-app"
            className="text-blue-500 hover:underline"
          >
            here
          </a>
          .
        </p>
      </div>
    </footer>
  );
} 