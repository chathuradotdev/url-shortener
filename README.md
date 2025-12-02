# URL Shortener Service

A complete URL shortening service built with Next.js, featuring user authentication, QR code generation, and email sharing.

## Features

### For All Users (Guest & Authenticated)
- ✅ Shorten URLs instantly
- ✅ Generate QR codes for shortened links
- ✅ Share links via email
- ✅ Click tracking

### For Authenticated Users
- ✅ View dashboard with all shortened URLs
- ✅ Track click analytics
- ✅ Persistent URL history
- ✅ Username & password authentication
- ✅ Google OAuth (requires configuration)

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: JSON file-based storage
- **QR Generation**: qrcode library
- **Email**: Nodemailer

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Optional: Google OAuth
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional: SMTP for real email sending
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Guest Users
1. Visit the homepage
2. Enter a URL to shorten
3. Get your shortened link, QR code, and share options
4. No login required!

### Registered Users
1. Click "Sign Up" to create an account
2. Log in with your credentials
3. Shorten URLs (they'll be saved to your account)
4. Visit the Dashboard to see all your links and analytics

### Google Login (Optional)
To enable Google login:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

## Project Structure

```
url-shortener/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── register/      # User registration
│   │   │   ├── shorten/       # URL shortening
│   │   │   └── email/         # Email sharing
│   │   ├── dashboard/         # User dashboard
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── [shortCode]/       # Redirect handler
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── Navbar.tsx
│   │   ├── Providers.tsx
│   │   └── ShortenerForm.tsx
│   └── lib/                   # Utilities
│       ├── auth.ts            # NextAuth configuration
│       └── db.ts              # JSON database adapter
├── data/                      # JSON database files
│   ├── users.json
│   └── urls.json
└── public/                    # Static assets
```

## Database

This project uses a simple JSON file-based database for easy setup and portability. Data is stored in:
- `data/users.json` - User accounts
- `data/urls.json` - Shortened URLs

For production, consider migrating to PostgreSQL, MongoDB, or another robust database.

## Email Configuration

By default, emails are mocked (logged to console). To send real emails:
1. Configure SMTP settings in `.env.local`
2. For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833)

## Security Notes

- Passwords are hashed using bcrypt
- JWT sessions via NextAuth
- CSRF protection enabled
- Environment variables for sensitive data

## License

MIT
