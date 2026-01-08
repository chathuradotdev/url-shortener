export interface Article {
    id: string;
    slug: string;
    title: string;
    description: string;
    category: string;
    icon: string; // Emoji
    content: string; // Markdown-like
    lastUpdated: string;
    tags?: string[];
    relatedIds?: string[];
}

export const knowledgeBase: Article[] = [
    {
        id: "1",
        slug: "getting-started",
        title: "Getting Started",
        description: "Everything you need to know to start shrinking links.",
        category: "Basics",
        icon: "🚀",
        tags: ["intro", "basics", "create", "alias"],
        content: `
# Welcome to Pixel URL Shortener

We are excited to help you manage and track your links efficiently. This platform is designed for speed, reliability, and powerful analytics.

## How to Create Your First Link

1. **Paste your Long URL**: On the dashboard, find the input box.
2. **Customize (Optional)**: Add a custom alias (e.g., \`my-brand\`) or set a password.
3. **Click Type**: We create a short, shareable link instantly.

## Key Terminology

- **Alias**: The custom ending of your short link (e.g., \`pixel.io/sale\`).
- **Target URL**: The destination website visitors are sent to.
- **Interim Page**: A transition screen shown before redirection.
- **QR Code**: A scannable image that takes mobile users to your link.
        `,
        lastUpdated: "2025-01-01",
        relatedIds: ["2", "4"]
    },
    {
        id: "2",
        slug: "smart-targeting",
        title: "Smart Targeting (Geo & Time)",
        description: "Route visitors to different destinations based on their location or time.",
        category: "Advanced Features",
        icon: "🌍",
        tags: ["geo", "location", "country", "time", "date", "redirect"],
        content: `
# Smart Targeting

Connect with a global audience by sending them to the right place every time, or schedule links to change destinations based on the time of day.

## Geo Targeting (Location)

When a user clicks your link, we detect their country from their IP address.
- **If they match a rule**: We send them to the specific URL you set for that country.
- **If they don't match**: We send them to your main (default) URL.

### Setting Up Geo Rules
1. Go to **Edit Link** on your dashboard.
2. Scroll to **Smart Targeting**.
3. Check **Enable Geo-Targeting**.
4. Enter a **Country Code** (e.g., \`US\`) and **Target URL**.
5. Click **Add (+)**.

## Time Targeting (Schedule)

Perfect for limited-time offers, restaurant menus (breakfast vs dinner), or support shifts.

### Setting Up Time Rules
1. In the **Smart Targeting** section, find **Time Targeting**.
2. Select **Start Time** and **End Time**.
3. Choose applicable **Days** (e.g., Mon-Fri).
4. Enter the **Destinaton URL**.
5. Click **Add Rule**.

> **Note**: Time targeting uses the visitor's *local time* (if detectable) or falls back to server time.
        `,
        lastUpdated: "2025-01-01",
        relatedIds: ["1", "3"]
    },
    {
        id: "3",
        slug: "interim-pages",
        title: "Interim Pages",
        description: "Engage users with a greeting before they redirect.",
        category: "Advanced Features",
        icon: "⏱️",
        tags: ["wait", "delay", "message", "count", "screen"],
        content: `
# Interim Pages

Create a branded moment before your user leaves.

## What is an Interim Page?

Instead of an instant redirect, the user sees a "Greeting Screen" for a few seconds. This is perfect for:
- Branding your transitions.
- Displaying important notices ("You are leaving our site...").
- Showing "Thank You" messages.

## Configuration Options

- **Message**: The text displayed (e.g., "Hold tight! Taking you to the offer...").
- **Delay**: How long the screen stays visible (1-60 seconds).
- **Visitor Limit**: Only show this screen to the first N visitors.
- **"I Need More Time"**: Users can pause the countdown if they need to read your message.
        `,
        lastUpdated: "2025-01-01",
        relatedIds: ["2"]
    },
    {
        id: "4",
        slug: "analytics-guide",
        title: "Understanding Analytics",
        description: "Deep dive into your click data.",
        category: "Reporting",
        icon: "📊",
        tags: ["stats", "data", "clicks", "visitors", "referrers"],
        content: `
# Analytics Dashboard

Knowledge is power. Pixel tracks every click to give you actionable insights.

## Metrics We Track

- **Total Clicks**: Raw number of visits.
- **Unique Visitors**: Distinct users (estimated via IP/Cookies).
- **Referrers**: Where your traffic is coming from (Twitter, Facebook, Direct).
- **Devices & OS**: Are your users on Mobile (iPhone) or Desktop (Windows)?
- **Locations**: Top countries and cities.

> **Pro Tip:** Use these insights to optimize your marketing campaigns. If most users are on Mobile, ensure your destination page is mobile-friendly!
        `,
        lastUpdated: "2025-01-01",
        relatedIds: ["1"]
    },
    {
        id: "5",
        slug: "api-access",
        title: "API Access",
        description: "Integrate shortening into your own applications.",
        category: "Developers",
        icon: "🔌",
        tags: ["api", "dev", "code", "rest", "endpoints"],
        content: `
# Developer API

Automate your workflow with our robust REST API.

## Authentication

All API requests require an API_KEY. You can generate one in your **Account Settings**.

\`\`\`bash
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Endpoints

### Shorten a URL
- **POST** \`/api/shorten\`
- Body: \`{ "url": "https://mysite.com", "alias": "custom-name" }\`

### Get Analytics
- **GET** \`/api/analytics/{shortCode}\`
- Returns detailed stats for a specific link.

> **Rate Limits**: Free accounts are limited to 100 requests per minute.
        `,
        lastUpdated: "2025-01-01",
        relatedIds: ["1"]
    },
    {
        id: "6",
        slug: "account-management",
        title: "Account Management",
        description: "Managing your profile, billing, and security.",
        category: "Account",
        icon: "👤",
        tags: ["password", "email", "billing", "profile"],
        content: `
# Managing Your Account

Keep your account secure and up to date.

## Updating Profile
Go to **Settings > Profile** to change your:
- Display Name
- Email Address
- Avatar

## Security
We recommend using a strong password. You can reset your password anytime from the login page or settings.

## Plan & Billing
View your current usage and upgrade to **Pro** for:
- Unlimited Links
- Custom Domains
- Extended Analytics History
        `,
        lastUpdated: "2025-01-01",
        relatedIds: ["1"]
    },
    {
        id: "7",
        slug: "burn-after-reading",
        title: "Burn After Reading",
        description: "Create self-destructing links for secure sharing.",
        category: "Advanced Features",
        icon: "🔥",
        tags: ["security", "self-destruct", "private", "limit"],
        content: `
# Burn After Reading 🔥

Share sensitive information securely with links that self-destruct after being visited.

## How it Works

When you enable **Burn After Reading** on a link, you set a specific **Visit Limit** (e.g., 1 visit). Once that limit is reached, the link is permanently destroyed.

- **1 Visit**: The recipient sees the content once. If they refresh or try to share the link, it shows a "Burnt" message (Status 410).
- **Secure**: The data is gone forever. No history is kept of the destination for subsequent visitors.

## How to Enable

1. Create a new link.
2. Toggle **Burn After Reading (Premium)**.
3. Set the **Visit Limit** (Default is 1).
4. Share the link.

> **Warning**: Test this carefully! If YOU click the link to test it, that counts as the 1 visit, and it will be burnt for your recipient.
        `,
        lastUpdated: "2025-01-02",
        relatedIds: ["1", "3"]
    },
    {
        id: "8",
        slug: "social-previews",
        title: "Custom Social Previews",
        description: "Control how your links look on Facebook, Twitter, and LinkedIn.",
        category: "Advanced Features",
        icon: "🖼️",
        tags: ["social", "og", "meta", "facebook", "twitter", "preview"],
        content: `
# Custom Social Media Previews

Take control of your brand's appearance. Instead of showing the generic preview of your destination URL (or often nothing at all), you can define exactly what people see when you share your short link.

## Why use this?
- **CTR**: Custom titles and images increase Click-Through Rates significantly.
- **Myths & Clickbait**: You can create intriguing previews that don't match the destination metadata exactly.
- **Branding**: Ensure your logo or campaign image is always front and center.

## How to Configure

1. In the shortener form, open the **Social Media Preview (Premium)** section.
2. **Title**: The bold headline users see (e.g., "Exclusive 50% Off!").
3. **Description**: The 1-2 lines of text under the headline.
4. **Image URL**: A link to a public image (JPG/PNG) you want to use as the thumbnail.

The system generates Open Graph (OG) and Twitter Card tags automatically for your short link.
        `,
        lastUpdated: "2025-01-02",
        relatedIds: ["1", "4"]
    },
    {
        id: "9",
        slug: "branded-domains",
        title: "Branded Domains",
        description: "Use your own custom domain for short links.",
        category: "Advanced Features",
        icon: "🏷️",
        tags: ["domain", "brand", "cname", "dns", "custom"],
        content: `
# Branded Domains

Build trust and authority by using your own domain name for your short links (e.g., \`links.mybrand.com\` instead of our generic domain).

## Why use a Branded Domain?

- **Trust**: Users are more likely to click a link that looks like your official website.
- **Branding**: Every share promotes YOUR brand, not ours.
- **Deliverability**: Custom domains often have better deliverability in emails and SMS.

## How to Setup

### 1. Choose a Domain
You can use a subdomain (e.g., \`go.mysite.com\`) or a dedicated short domain (e.g., \`mysite.link\`). We recommend a subdomain of your main site.

### 2. Configure DNS
You need to add a **CNAME Record** in your DNS provider (GoDaddy, Namecheap, Cloudflare, etc.).

- **Type**: CNAME
- **Host/Name**: The subdomain you chose (e.g., \`go\` or \`links\`).
- **Value/Target**: \`cname.pixel-shortener.com\` (or whatever the generic app domain is).
- **TTL**: Automatic or 1 Hour.

### 3. Verify in Dashboard
1. Go to your **Dashboard > Domains**.
2. Click **Add Domain**.
3. Enter your full domain (e.g., \`go.mysite.com\`).
4. Click **Verify**.

Once verified, you will see a green "Active" badge.

## Using Your Domain
When creating a new short link, simply select your branded domain from the dropdown menu (if you have multiple) before clicking Shorten.
        `,
        lastUpdated: "2026-01-08",
        relatedIds: ["1", "6"]
    }
];

export const categories = Array.from(new Set(knowledgeBase.map(a => a.category)));
