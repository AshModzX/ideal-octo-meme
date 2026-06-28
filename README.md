# JuttiDot com

A complete e-commerce website for a shoe shop built with Next.js, Upstash Redis, and Vercel Blob.

## Features

- Public storefront with categories and products
- Product modal views
- About page with Google Maps
- Contact form
- Protected admin panel
- Category management
- Product management with image uploads
- Vercel Blob integration for image storage
- Upstash Redis for data storage

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file from `.env.example`:

```bash
cp .env.example .env.local
```

3. Fill in the environment variables in `.env.local`:

- `ADMIN_PASSWORD`: Your secure admin password
- `SECRET_COOKIE_PASSWORD`: A random secret at least 32 characters long
- Upstash Redis and Vercel Blob credentials (see deployment instructions below)

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Seeding Initial Data

After setting up Upstash Redis, you can seed initial data by sending a POST request to `/api/seed`:

```bash
curl -X POST http://localhost:3000/api/seed
```

## Deployment on Vercel

### 1. Set up Upstash Redis

1. Go to your Vercel dashboard
2. Create a new project or select an existing one
3. Go to the **Integrations** tab
4. Search for and install **Upstash Redis**
5. Follow the prompts to create your Redis database
6. Vercel will automatically set the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` environment variables for you

### 2. Set up Vercel Blob

1. In your Vercel project, go to the **Storage** tab
2. Click **Create Database** → Select **Blob**
3. Follow the prompts to create your Blob store
4. Vercel will automatically set the `BLOB_READ_WRITE_TOKEN` for you

### 3. Set Environment Variables

In your Vercel project settings, go to **Environment Variables** and add:

- `ADMIN_PASSWORD`: Your secure admin password
- `SECRET_COOKIE_PASSWORD`: A random secret at least 32 characters long (generate one using a password manager)

### 4. Deploy

Push your code to GitHub, GitLab, or Bitbucket, then import the project into Vercel.

## Admin Panel

Access the admin panel at `/admin`. Log in using the password you set in `ADMIN_PASSWORD`.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **Upstash Redis** - Serverless Redis database
- **Vercel Blob** - File storage
- **Iron Session** - Session management
- **TypeScript** - Type safety

## License

MIT
