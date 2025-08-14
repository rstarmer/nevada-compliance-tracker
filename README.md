# Nevada LLC Compliance Tracker

A simple compliance management tool for Nevada LLCs to track federal and state obligations.

## Features

- **Dashboard**: Overview of compliance status with summary cards
- **Obligations Management**: Track due dates for Nevada and federal requirements
- **Document Library**: Store compliance-related documents (framework ready)
- **Alerts**: Stay informed about regulation changes and upcoming deadlines
- **Simple Authentication**: Access code protection

## Preloaded Compliance Items

### Nevada State Requirements
- Annual List of Managers/Members
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

## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Database**: Vercel Postgres
- **Icons**: Lucide React
- **Deployment**: Vercel

## Local Development

1. **Clone and install dependencies**:
   ```bash
   cd nevada-compliance-tracker
   npm install
   ```

2. **Set up environment variables**:
   Create `.env.local`:
   ```
   POSTGRES_URL=your_postgres_connection_string
   ACCESS_CODE=your_access_code
   NV_ANNIVERSARY_MONTH=8
   ```

3. **Initialize database**:
   ```bash
   npm run seed
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## Vercel Deployment

### Quick Deploy

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/nevada-compliance-tracker.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in project settings

3. **Environment Variables** (Required):
   ```
   POSTGRES_URL=your_vercel_postgres_url
   ACCESS_CODE=demo-123
   NV_ANNIVERSARY_MONTH=8
   ```

4. **Add Vercel Postgres**:
   - Go to Storage tab in Vercel dashboard
   - Create new Postgres database
   - Copy connection string to POSTGRES_URL

5. **Seed the database**:
   ```bash
   # After deployment, run locally with production POSTGRES_URL
   POSTGRES_URL="your_production_url" npm run seed
   ```

### Alternative: CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add POSTGRES_URL
vercel env add ACCESS_CODE
vercel env add NV_ANNIVERSARY_MONTH

# Deploy to production
vercel --prod

# Seed database
vercel env pull .env.local
npm run seed
```

## Usage

1. **Access the app**: Visit your deployed URL
2. **Login**: Enter your access code (default: `demo-123`)
3. **Dashboard**: View compliance status overview
4. **Manage Obligations**: Add new items or update status
5. **Documents**: Ready for file upload implementation

## Configuration

### Nevada Anniversary Month
Set `NV_ANNIVERSARY_MONTH` (1-12) to match your LLC's formation month. This automatically calculates due dates for:
- Annual List of Managers/Members
- State Business License Renewal

### Access Code
Change `ACCESS_CODE` environment variable to secure your installation.

## Next Steps

This MVP provides the foundation for:
- File upload functionality
- Document linking to obligations
- Email notifications
- Integration with Nevada SilverFlume
- API integrations with IRS/state systems
- Multi-user support

## Support

For issues or questions, refer to the original project documentation or create an issue in the repository.

## License

Private use for the intended Nevada LLC.
