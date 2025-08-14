# Vercel CLI Setup and Configuration Guide

This document provides step-by-step instructions for setting up and configuring the Vercel CLI for the Nevada LLC Compliance Tracker project.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- GitHub account with repository access
- Vercel account with access to the kumulus workspace

## Installation

### 1. Install Vercel CLI Globally

```bash
npm install -g vercel
```

### 2. Verify Installation

```bash
vercel --version
```

You should see a version number (e.g., `Vercel CLI 37.4.2`).

## Authentication

### 1. Login to Vercel

```bash
vercel login
```

This will open a browser window for authentication. Choose your preferred login method:
- Continue with GitHub
- Continue with GitLab  
- Continue with Bitbucket
- Continue with Email

### 2. Verify Authentication

```bash
vercel whoami
```

This should display your Vercel username.

## Workspace Configuration

### 1. List Available Workspaces

```bash
vercel teams ls
```

This will show all teams/workspaces you have access to.

### 2. Switch to Kumulus Workspace

```bash
vercel switch kumulus
```

### 3. Verify Current Workspace

```bash
vercel whoami
```

You should see `kumulus` as your current scope.

## Project Setup

### 1. Navigate to Project Directory

```bash
cd /path/to/nevada-compliance-tracker
```

### 2. Link Project to Vercel (First Time)

```bash
vercel
```

Follow the prompts:
- Set up and deploy project? **Y**
- Which scope? **kumulus**
- Link to existing project? **N** (for new projects)
- What's your project's name? **nevada-compliance-tracker**
- In which directory is your code located? **./** 

### 3. Production Deployment

```bash
vercel --prod
```

## Environment Variable Management

### 1. List Environment Variables

```bash
vercel env ls
```

### 2. Add Environment Variables

**IMPORTANT**: Use `printf` instead of `echo` to avoid newline characters.

```bash
# Authentication
printf "demo-123" | vercel env add ACCESS_CODE production
printf "demo-123" | vercel env add ACCESS_CODE development

# Nevada Configuration  
printf "8" | vercel env add NV_ANNIVERSARY_MONTH production
printf "8" | vercel env add NV_ANNIVERSARY_MONTH development
```

### 3. Pull Environment Variables Locally

```bash
vercel env pull .env.local
```

This creates a `.env.local` file with all environment variables for local development.

### 4. Remove Environment Variables

```bash
vercel env rm VARIABLE_NAME production
```

## Database Integration

### 1. Add Neon Database (via Web Interface)

The Neon Postgres database must be added through the Vercel web interface:

1. Go to your project dashboard on vercel.com
2. Navigate to **Storage** tab
3. Click **Create Database**
4. Select **Neon** from the marketplace
5. Follow the setup wizard

The following environment variables will be automatically added:
- `POSTGRES_URL`
- `POSTGRES_DATABASE`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_USER`
- And several other Neon-specific variables

### 2. Verify Database Variables

```bash
vercel env ls | grep POSTGRES
```

## Common Commands

### Deployment Commands

```bash
# Deploy to development/preview
vercel

# Deploy to production  
vercel --prod

# Deploy with custom build command
vercel --build-env NODE_ENV=production

# Deploy specific directory
vercel --cwd ./build
```

### Project Management

```bash
# List projects in current workspace
vercel projects ls

# Link existing project
vercel link

# Remove project link
vercel unlink

# Get project information
vercel inspect
```

### Logs and Debugging

```bash
# View deployment logs
vercel logs

# View function logs
vercel logs --follow

# View logs for specific deployment
vercel logs [deployment-url]
```

### Environment Variables

```bash
# List all environment variables
vercel env ls

# Add environment variable
vercel env add [name] [environment]

# Remove environment variable
vercel env rm [name] [environment]

# Pull environment variables to local file
vercel env pull [filename]
```

## Troubleshooting

### Authentication Issues

**Problem**: `Error: Please login to Vercel`
```bash
vercel logout
vercel login
```

**Problem**: `Error: Not authorized`
```bash
vercel switch kumulus
```

### Environment Variable Issues

**Problem**: Access code contains newline characters
```bash
# Wrong way (adds newline)
echo "demo-123" | vercel env add ACCESS_CODE production

# Correct way (no newline)
printf "demo-123" | vercel env add ACCESS_CODE production
```

**Problem**: Environment variables not updating
```bash
# Remove old variable
vercel env rm ACCESS_CODE production

# Add new variable
printf "demo-123" | vercel env add ACCESS_CODE production

# Redeploy
vercel --prod
```

### Deployment Issues

**Problem**: Build failures
```bash
# Check local build first
npm run build

# Check TypeScript errors
npm run typecheck

# Check linting
npm run lint
```

**Problem**: Wrong workspace deployment
```bash
# Check current workspace
vercel whoami

# Switch to correct workspace
vercel switch kumulus

# Remove old project link
rm -rf .vercel

# Redeploy
vercel --prod
```

### Database Connection Issues

**Problem**: Database environment variables missing
1. Check Vercel project dashboard → Storage
2. Ensure Neon database is connected
3. Verify environment variables exist: `vercel env ls | grep POSTGRES`

**Problem**: Local database connection fails
```bash
# Pull latest environment variables
vercel env pull .env.local

# Check .env.local file for POSTGRES_URL
cat .env.local | grep POSTGRES_URL
```

## Best Practices

### 1. Environment Management

- Always use `printf` instead of `echo` when setting environment variables
- Set variables for both `production` and `development` environments
- Pull variables locally before running scripts: `vercel env pull .env.local`

### 2. Deployment Workflow

1. Test locally: `npm run dev`
2. Check build: `npm run build`
3. Deploy to preview: `vercel`
4. Test preview deployment
5. Deploy to production: `vercel --prod`

### 3. Workspace Management

- Always verify correct workspace: `vercel whoami`
- Switch workspaces before any deployment: `vercel switch kumulus`
- Keep project linked to correct workspace

### 4. Security

- Never commit `.env.local` files
- Use environment variables for all secrets
- Regularly rotate sensitive values
- Monitor deployment logs for leaked credentials

## Integration with GitHub CLI

If you're also using GitHub CLI (`gh`), ensure both tools are authenticated:

```bash
# Check GitHub CLI status
gh auth status

# Check Vercel CLI status  
vercel whoami

# Both should show authenticated status
```

## Workflow for New Team Members

1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`
3. Switch to kumulus workspace: `vercel switch kumulus`
4. Clone repository: `git clone git@github.com:rstarmer/nevada-compliance-tracker.git`
5. Navigate to project: `cd nevada-compliance-tracker`
6. Link project: `vercel link` (select existing project)
7. Pull environment variables: `vercel env pull .env.local`
8. Install dependencies: `npm install`
9. Start development: `npm run dev`

## Command Reference Quick Guide

```bash
# Essential Commands
vercel login                    # Authenticate
vercel switch kumulus          # Switch workspace
vercel                        # Deploy to preview
vercel --prod                 # Deploy to production
vercel env pull .env.local    # Get environment variables
vercel logs                   # View logs

# Environment Variables
printf "value" | vercel env add NAME production
vercel env ls                 # List variables
vercel env rm NAME production # Remove variable

# Project Management
vercel projects ls            # List projects
vercel link                   # Link existing project
vercel inspect               # Project information
```

## Support and Resources

- [Official Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Vercel Environment Variables Guide](https://vercel.com/docs/projects/environment-variables)
- [Vercel Database Integrations](https://vercel.com/docs/storage)
- [GitHub CLI Documentation](https://cli.github.com/manual/)

For project-specific issues, refer to:
- `DEPLOYMENT.md` - Complete deployment process
- `CLAUDE.md` - Development guidelines
- `.env.example` - Environment variable template