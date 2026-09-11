# Deployment Guide — FORMIQ Studio Projects

## Architecture

```
┌─────────────────────────────────────────────────────┐
│           Oracle Cloud VPS (shivay-general)          │
│              1 GB RAM | Ubuntu 24.04                 │
│              IP: 129.154.34.103                      │
│                                                      │
│  ┌─────────┐   ┌──────────────┐   ┌──────────────┐  │
│  │  Nginx  │──▶│ Furniture BE │   │  Agency SSR  │  │
│  │  :80    │   │  PM2 :5000   │   │  PM2 :3001   │  │
│  │  :443   │──▶│  Express     │   │  Next.js     │  │
│  └────┬────┘   └──────────────┘   └──────────────┘  │
│       │                                              │
│       ├── furniture.domain.com → static + proxy :5000│
│       ├── agency.domain.com    → proxy :3001         │
│       └── portfolio.domain.com → static files        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────┐
│   Cloudflare Workers    │
│   JourneyLogs (SSR)     │
└─────────────────────────┘
```

## Projects

| Project | Stack | Deploys To | Port |
|---------|-------|-----------|------|
| Furniture | Vite React + Express/MongoDB | VPS | 5000 |
| Agency | Next.js + Supabase | VPS | 3001 |
| Portfolio | Vite React (static) | VPS | — |
| JourneyLogs | TanStack Start | Cloudflare Workers | — |
| CRM-SASS | Next.js + MongoDB | Separate VPS (clearcrm) | — |

## Deployment Flow

### When does deployment happen?

| Trigger | When |
|---------|------|
| Release published | Anytime you create a GitHub Release |
| Scheduled | Every Friday at 7:30 PM IST (2:00 PM UTC) |
| Manual | GitHub Actions → Run workflow |

### How to deploy

#### Option 1: Create a Release (recommended)
```bash
# Tag the release
git tag v1.0.0
git push origin v1.0.0

# Then go to GitHub → Releases → Create release from tag
```

#### Option 2: GitHub CLI
```bash
gh release create v1.0.0 --title "v1.0.0" --notes "Release notes here"
```

#### Option 3: Manual trigger
GitHub repo → Actions → Deploy workflow → Run workflow

### What happens during deployment

1. GitHub Actions fetches secrets from Infisical
2. Builds frontend (Vite) and backend (TypeScript)
3. Uploads build artifacts
4. SSHs into VPS via rsync
5. Deploys .env from Infisical to VPS
6. Installs production dependencies
7. Restarts app via PM2

## Branch Protection Rules

All repos have these rules on `main`:

| Rule | Value |
|------|-------|
| Direct push to main | Blocked |
| Pull request required | Yes |
| Approvals required | 1 |
| Stale reviews dismissed | Yes |
| Status checks (lint) | Required |
| Force push | Blocked |
| Branch deletion | Blocked |
| Linear history | Required |

### Development workflow
```
1. Create feature branch:     git checkout -b feature/my-feature
2. Make changes and commit:   git commit -m "feat: add feature"
3. Push branch:               git push origin feature/my-feature
4. Create PR on GitHub:       gh pr create
5. Lint check runs automatically
6. Get 1 approval
7. Merge PR (squash or rebase)
8. Create release when ready to deploy
```

## Secrets Management (Infisical)

Dashboard: https://app.infisical.com
Project: FORMIQ_STUDIO_SERVER
Organization: FORMIQ_STUDIO

### Folder structure
```
Production/
├── /furniture    → 19 secrets (MongoDB, Razorpay, Stripe, etc.)
├── /agency       → 4 secrets (Supabase)
├── /journeylogs  → 3 secrets (Supabase, Cloudflare)
└── /portfolio    → (no secrets needed)
```

### To update a secret
1. Go to https://app.infisical.com
2. Navigate to FORMIQ_STUDIO_SERVER → Production → folder
3. Edit the secret value
4. Next deployment will automatically pick up new values

### GitHub Secrets (per repo)
| Secret | Purpose |
|--------|---------|
| INFISICAL_CLIENT_ID | Machine identity for Infisical |
| INFISICAL_CLIENT_SECRET | Machine identity secret |
| INFISICAL_PROJECT_SLUG | formiqstudio-project-jk-zk |
| VPS_HOST | VPS IP address |
| VPS_SSH_KEY | SSH private key for deployment |

## VPS Management

### SSH into server
```bash
ssh -i ~/.ssh/shivay_general ubuntu@129.154.34.103
```

### Check app status
```bash
pm2 status
pm2 logs furniture-api
pm2 logs agency
```

### Restart apps
```bash
pm2 restart furniture-api
pm2 restart agency
pm2 restart all
```

### Check resources
```bash
free -h          # RAM usage
df -h            # Disk usage
pm2 monit        # Live monitoring
```

### Nginx
```bash
sudo nginx -t                    # Test config
sudo systemctl reload nginx      # Reload config
sudo tail -f /var/log/nginx/error.log  # Error logs
```

### SSL Certificates
```bash
# Initial setup (after DNS is pointed)
sudo certbot --nginx -d yourdomain1.com -d yourdomain2.com -d yourdomain3.com

# Auto-renewal is configured via certbot.timer
sudo certbot renew --dry-run     # Test renewal
```

## DNS Setup

For each domain, add these DNS records:

| Type | Name | Value |
|------|------|-------|
| A | @ | 129.154.34.103 |
| A | www | 129.154.34.103 |

## RAM Budget

| Process | RAM |
|---------|-----|
| Ubuntu OS | ~120 MB |
| Nginx | ~15 MB |
| Furniture backend (PM2) | ~150-200 MB |
| Agency Next.js (PM2) | ~200-250 MB |
| Portfolio (static) | 0 MB |
| Total | ~500-600 MB |
| Available (of 1 GB) | ~400 MB |
| Swap (safety) | 1 GB |

## Hotfix Deployment

For urgent fixes outside the Friday schedule:

```bash
# Create and push fix
git checkout -b hotfix/critical-fix
git commit -m "fix: critical bug"
git push origin hotfix/critical-fix

# Create PR, get approval, merge

# Deploy immediately
gh release create v1.0.1-hotfix --title "Hotfix: critical bug" --notes "Emergency fix"
```

Or trigger manual deploy: GitHub → Actions → Deploy → Run workflow
