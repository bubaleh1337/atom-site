# ATOM — Production Business Website

[![Live site](https://img.shields.io/badge/Live-atom.com.kz-0A66C2?style=for-the-badge)](https://atom.com.kz/)
[![Languages](https://img.shields.io/badge/Languages-RU%20%7C%20KZ%20%7C%20EN-222222?style=for-the-badge)](#)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

A production multilingual website for **ATOM**, an operating advertising-production business in Atyrau, Kazakhstan.

This is not a demo project: the site is live on the company's real domain and is used in its customer-acquisition flow.

**Live:** https://atom.com.kz/

## What I built

I designed, developed, tested and deployed the website end to end, including the public-facing experience and the lead-processing workflow behind the contact form.

### Customer-facing website

- Responsive landing page for desktop and mobile
- Separate **Russian, Kazakh and English** versions
- Service catalogue and portfolio sections
- WhatsApp conversion links with pre-filled service context
- Lead form with service selection and consent handling
- Company reviews, contacts and embedded map
- Privacy-policy pages in all supported languages

### Lead pipeline

The lead form is connected to a server-side Vercel Function:

1. A customer submits a request on the website
2. Input is validated and normalized server-side
3. The lead is stored in **Supabase / PostgreSQL**
4. UTM attribution, referrer, locale and page URL are stored with the lead
5. The business receives notifications through **Telegram** and **email**
6. Leads can move through statuses such as `new`, `contacted`, `quoted`, `won` and `lost`

## Production hardening

- Supabase **Row Level Security**
- No public database write policy
- Server-side use of the Supabase service key
- Honeypot field for bot filtering
- Basic per-IP rate limiting
- Fast-submit bot check
- Server-side sanitization and validation
- Consent capture for personal-data processing
- Environment-based secrets
- Responsive and multilingual release checks

## SEO

- Canonical URLs
- `hreflang` for RU / KZ / EN
- Open Graph metadata
- Schema.org `ProfessionalService` structured data
- `robots.txt`
- `sitemap.xml`
- Semantic page titles and descriptions

## Architecture

```text
Browser
  │
  ├── Static HTML / CSS / JavaScript
  │
  └── POST /api/lead
          │
          ├── Validation + anti-spam checks
          ├── Supabase / PostgreSQL
          ├── Telegram notification
          └── Email notification via Resend
```

## Tech stack

**Frontend**  
`HTML5` `CSS3` `JavaScript`

**Backend / Data**  
`Vercel Serverless Functions` `Supabase` `PostgreSQL`

**Integrations**  
`Telegram Bot API` `Resend` `WhatsApp`

**Deployment / Web**  
`Vercel` `Custom domain` `SEO` `Responsive Web Design`

## Repository structure

```text
atom-site/
├── api/
│   └── lead.js
├── assets/
│   ├── images/
│   ├── site.js
│   └── styles.css
├── en/
├── kz/
├── supabase/
│   └── setup.sql
├── index.html
├── privacy.html
├── robots.txt
├── sitemap.xml
├── vercel.json
└── README_SETUP_RU.md
```

## QA focus

I tested the project as a production product, including:

- responsive layouts on desktop and mobile
- RU / KZ / EN navigation and content
- lead submission and required-field validation
- service preselection
- Supabase persistence
- Telegram and email notifications
- WhatsApp links
- UTM and referrer tracking
- privacy and consent flow
- SEO files and metadata
- production deployment on the custom domain

## Security note

Secrets, tokens and service credentials are not stored in the public repository. The public code contains only environment-variable references and an example environment configuration.

## Links

- **Live website:** https://atom.com.kz/
- **Repository:** https://github.com/bubaleh1337/atom-site
- **Developer:** [Ekaterina Pupykina](https://github.com/bubaleh1337)
