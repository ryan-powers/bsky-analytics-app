# bskyStats

A web analytics dashboard for Bluesky social that provides detailed engagement metrics and visualizations for any public account.

![bskyStats Logo](/public/logo_square.png)

## Features

- **Engagement Analytics**: Track likes, reposts, and replies across posts
- **Interactive Timeline**: Filter data by 30, 60, 90, 180, or 365 days
- **Visual Insights**: 
  - Mini trend charts for quick metrics overview
  - Detailed timeline graph with toggleable metrics
  - Period-over-period percentage changes
- **Top Content**: View your most successful posts by engagement
- **Profile Overview**: Quick access to account information and statistics
- **Auto-Complete Handles**: Just enter a username - we'll add the .bsky.social

## Getting Started

### Prerequisites

- Node.js 18+
- Bluesky account for API access

### Environment Setup

Create a `.env.local` file in the root directory:
```env
BSKY_HANDLE=your.handle.bsky.social
BSKY_APP_PASSWORD=your-app-password
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/bskystats.git

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to view the application.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **API**: Bluesky Social (@atproto/api)
- **Fonts**: Geist Sans & Mono
- **Deployment**: Vercel

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## License

MIT License - feel free to use this project however you'd like.

## Acknowledgments

- Built on [Next.js](https://nextjs.org/)
- Powered by [Bluesky Social API](https://github.com/bluesky-social/atproto)
- Deployed via [Vercel](https://vercel.com)
