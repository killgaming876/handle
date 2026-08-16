# HANDLE

**WE HANDLE IT.**

HANDLE is a premium business operating system for conversations, knowledge, workflows, tools and human handoff.

## Current experience

- Editorial marketing site with HANDLE Loop interaction
- Interactive sandbox demo
- Knowledge / connectors / workflow / human-handoff storytelling
- Premium dashboard shell with inbox, knowledge, workflows, connections, analytics, billing and settings
- Google OAuth + passwordless email authentication UI through Supabase
- Responsive mobile layouts
- GitHub Pages static export
- Reduced-motion support

## GitHub Pages

Site: https://killgaming876.github.io/handle/

The repository uses a static Next.js export. GitHub Pages can host the presentation layer and browser-side Supabase Auth, but server-side AI/tool execution should live on a backend such as Vercel, Supabase Edge Functions, or another server runtime.

## Required GitHub Actions variables

Add these repository Actions secrets:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

The Pages workflow passes them into the static build. No private provider keys belong in the frontend bundle.

## Google sign-in

In Supabase Authentication:

1. Enable the Google provider.
2. Add your Google OAuth client ID and client secret there.
3. Add the Google provider callback URL supplied by your Supabase project to the Google Cloud OAuth configuration.
4. Add the deployed HANDLE redirect URL to the Supabase Auth URL configuration:
   `https://killgaming876.github.io/handle/dashboard`
5. Keep the Google client secret in Supabase, never in GitHub source.

The public app only calls `supabase.auth.signInWithOAuth({ provider: 'google' })`.

## Local development

Use pnpm 10.14.0.

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local` and populate only the services you actually enable.

## Security

Never commit Gemini, OpenRouter, Tavily, Resend, Novu, HubSpot, Firecrawl, Exa, Trigger, database service-role, OAuth client-secret, or other private credentials.

Credentials pasted into a chat or source control should be rotated before production use.
