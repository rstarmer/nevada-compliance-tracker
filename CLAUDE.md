# CLAUDE.md - Nevada LLC Compliance Tracker Development Guidelines

This document provides context and guidelines for AI-assisted development on the Nevada LLC Compliance Tracker project.

## Project Overview

The Nevada LLC Compliance Tracker is a focused MVP built to solve the specific need of tracking Nevada state and federal compliance requirements for a 2-person LLC. This is a **simplified, single-tenant application** designed for rapid deployment and ease of use.

**Technology Stack:**
- **Frontend**: Next.js 15 (App Router), React 18+, TypeScript, TailwindCSS
- **Database**: Neon Postgres (via Vercel marketplace integration)
- **Authentication**: Simple access code system
- **Deployment**: Vercel (kumulus workspace)
- **Styling**: TailwindCSS with Lucide React icons

## Key Architectural Principles

1. **Simplicity First**: Keep the solution focused on Nevada LLC compliance only
2. **Single-Tenant**: No multi-organization complexity
3. **MVP Approach**: Core functionality first, enhancements later
4. **CLI-First Deployment**: Use command-line tools for 95% of operations
5. **Vercel-Optimized**: Designed specifically for Vercel Edge deployment

## Code Quality Standards

### Before Committing Code

Always run these commands to ensure code quality:

```bash
npm run lint          # ESLint checks
npm run typecheck     # TypeScript type checking  
npm run build         # Ensure production build works
npm test              # Run any test suite (if available)
```

### Code Style Guidelines

1. **No Comments**: Code should be self-documenting through clear naming
2. **TypeScript**: Use strict TypeScript with no `any` types
3. **React**: Functional components with hooks only
4. **Async/Await**: Prefer async/await over promises, especially for Next.js 15 cookies()
5. **Error Handling**: Always handle errors gracefully with user-friendly messages

## Project Structure

```
nevada-compliance-tracker/
├── src/app/              # Next.js App Router pages
│   ├── page.tsx          # Dashboard with compliance overview
│   ├── login/page.tsx    # Access code authentication
│   ├── obligations/      # Manage compliance items
│   ├── documents/        # Document library
│   ├── alerts/          # Regulatory alerts
│   └── api/             # API routes for CRUD operations
├── lib/                 # Utility modules
│   ├── db.ts           # Database connection and queries
│   └── auth.ts         # Authentication utilities
├── scripts/            # Database and deployment scripts
│   └── seed.js         # Database seeding script
├── DEPLOYMENT.md       # Complete deployment documentation
└── .env.example        # Environment variable template
```

## Database Schema

**Core Tables:**
- `compliance_items` - Nevada state and federal obligations
- `documents` - Document storage metadata  
- `alerts` - Regulatory change notifications

**Key Design Decisions:**
- UUID primary keys for all tables
- Simple status enum: pending, completed, overdue
- Focus on Nevada + Federal requirements only

## Environment Configuration

### Required Environment Variables

```bash
# Database (auto-set by Neon integration)
POSTGRES_URL=postgres://...

# Authentication  
ACCESS_CODE=demo-123

# Nevada Configuration
NV_ANNIVERSARY_MONTH=8  # LLC anniversary month (1-12)
```

### Setting Environment Variables

**For Development:**
```bash
# Copy template and fill in values
cp .env.example .env.local
```

**For Production (via Vercel CLI):**
```bash
# Use printf to avoid newline issues
printf "demo-123" | vercel env add ACCESS_CODE production
printf "8" | vercel env add NV_ANNIVERSARY_MONTH production
```

## Deployment Process

### Prerequisites

1. **Install Required CLI Tools:**
```bash
# GitHub CLI (if not already installed)
brew install gh

# Vercel CLI  
npm i -g vercel

# Authenticate with both
gh auth login
vercel login
```

2. **Switch to Correct Workspace:**
```bash
vercel switch kumulus
```

### Standard Deployment Workflow

1. **Development & Testing:**
```bash
npm run dev          # Local development
npm run lint         # Check code quality
npm run build        # Verify production build
```

2. **Git Operations:**
```bash
git add .
git commit -m "Your commit message"
git push
```

3. **Deploy to Vercel:**
```bash
vercel --prod        # Deploy to production
```

### Database Management

**Initial Setup:**
1. Create Neon database via Vercel marketplace (web interface)
2. Environment variables are automatically configured
3. Seed database: `npm run seed`

**Schema Updates:**
- Modify `lib/db.ts` for schema changes
- Update seed script in `scripts/seed.js`
- Re-run seed script for fresh data

## Development Patterns

### Authentication Check
```typescript
// Always use async pattern for Next.js 15
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE);
  return authCookie?.value === 'authenticated';
}
```

### Database Queries
```typescript
// Use connection pooling for all queries
const result = await sql`
  SELECT * FROM compliance_items 
  WHERE status = ${status}
  ORDER BY due_date ASC
`;
```

### Error Handling
```typescript
// Graceful error handling with user feedback
try {
  const result = await updateComplianceItem(id, status);
  return NextResponse.json({ success: true });
} catch (error) {
  console.error('Failed to update compliance item:', error);
  return NextResponse.json(
    { error: 'Failed to update item' }, 
    { status: 500 }
  );
}
```

## Common Tasks

### Adding a New Compliance Type

1. Update the database schema in `lib/db.ts`
2. Add new items to `scripts/seed.js`
3. Update the UI components to handle the new type
4. Test the complete flow from database to UI

### Adding a New Page

1. Create the page component in `src/app/[pagename]/page.tsx`
2. Add navigation links in the main layout
3. Implement any required API routes in `src/app/api/`
4. Follow existing patterns for authentication and error handling

### Modifying Environment Variables

**Development:**
```bash
# Edit .env.local directly
nano .env.local
```

**Production:**
```bash
# Use Vercel CLI with printf
printf "new-value" | vercel env add VARIABLE_NAME production
vercel --prod  # Redeploy to apply changes
```

## Troubleshooting Guide

### Authentication Issues
- **Access code not working**: Check for newline characters in environment variables
- **Login redirects failing**: Verify `ACCESS_CODE` is set in all environments

### Database Connection Issues  
- **Connection refused**: Verify `POSTGRES_URL` is properly set
- **Seed script failing**: Use explicit environment variable: `POSTGRES_URL="..." npm run seed`

### Build/Deployment Issues
- **Async cookies() error**: Ensure all `cookies()` calls are properly awaited
- **Type errors**: Run `npm run typecheck` locally before deploying
- **Environment variables not updating**: Use `printf` instead of `echo`, redeploy after changes

### Git/GitHub Issues
- **Push authentication failed**: Switch to SSH remote: `git remote set-url origin git@github.com:username/repo.git`
- **Branch divergence**: Force push if needed: `git push --force-with-lease`

## Performance Considerations

1. **Database Queries**: Keep queries simple, use appropriate indexes
2. **Image Optimization**: Use Next.js Image component for any images
3. **Bundle Size**: Keep dependencies minimal for edge deployment
4. **Caching**: Leverage Vercel's edge caching where appropriate

## Security Best Practices

1. **Environment Variables**: Never commit secrets to repository
2. **Input Validation**: Validate all user inputs in API routes
3. **Authentication**: Simple access code is sufficient for this MVP
4. **Database**: Use parameterized queries (already handled by Vercel SQL)

## External Integrations (Future Enhancements)

Potential integrations for future versions:
- **Nevada SilverFlume**: Automated filing integration
- **Email Notifications**: Deadline reminders
- **Document Upload**: File storage via Vercel Blob
- **Calendar Integration**: Sync deadlines with calendar apps

## CLI Command Reference

### Vercel Commands
```bash
vercel                    # Deploy to development
vercel --prod            # Deploy to production  
vercel switch [team]     # Switch workspace
vercel env ls            # List environment variables
vercel env add [name]    # Add environment variable
vercel env pull .env.local # Pull env vars locally
vercel logs              # View deployment logs
```

### GitHub Commands
```bash
gh repo create [name]    # Create new repository
gh repo view            # View repository info
gh auth status          # Check authentication
gh auth refresh         # Refresh token scopes
```

### Development Commands  
```bash
npm run dev             # Start development server
npm run build          # Production build
npm run lint           # Run ESLint
npm run typecheck      # TypeScript checking
npm run seed           # Seed database
```

## Testing Strategy

**Current State**: Basic manual testing
**Future Enhancements**: 
- Unit tests for utility functions
- Integration tests for API routes
- E2E tests for critical user flows with Playwright

## Monitoring and Debugging

1. **Logs**: Use Vercel dashboard or `vercel logs` for deployment logs
2. **Environment**: Verify variables in Vercel project settings
3. **Database**: Use Neon console for direct database access
4. **Performance**: Monitor via Vercel analytics

## Compliance Data

### Nevada Requirements
- Annual List of Managers/Members (due by anniversary month)
- State Business License Renewal
- Nevada Commerce Tax
- Nevada Unemployment Insurance Tax  
- Nevada Modified Business Tax

### Federal Requirements
- Federal Income Tax Returns (Form 1065/1120)
- Quarterly Federal Tax Return (Form 941)
- Federal Unemployment Tax (Form 940)
- EEO Workplace Poster Update
- OSHA Annual Safety Training

## Notes for AI Assistants

1. **Keep It Simple**: This is an MVP, avoid over-engineering
2. **Nevada Focus**: Don't add complexity for other states unless explicitly requested
3. **CLI-First**: Prefer command-line operations over web interfaces
4. **Test Thoroughly**: Always verify authentication, database, and deployment work
5. **Document Changes**: Update this file when making significant modifications
6. **Environment Variable Care**: Always use `printf` instead of `echo` for Vercel CLI

## Success Metrics

- ✅ **Deployment Time**: From code to production in under 10 minutes
- ✅ **Reliability**: 99%+ uptime on Vercel platform
- ✅ **Simplicity**: Single access code authentication
- ✅ **Compliance Coverage**: All major Nevada + Federal requirements tracked
- ✅ **User Experience**: Clean, responsive interface

## Resources

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

Remember: This is a focused tool for Nevada LLC compliance tracking. Keep enhancements aligned with this core purpose and maintain the simplicity that makes it deployable and maintainable.