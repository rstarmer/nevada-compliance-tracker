const { sql } = require('@vercel/postgres');

async function main() {
  try {
    // Initialize database tables
    await sql`
      CREATE TABLE IF NOT EXISTS compliance_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(500) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('federal', 'state', 'local')),
        category VARCHAR(100) NOT NULL,
        due_date DATE NOT NULL,
        frequency VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(500) NOT NULL,
        file_path VARCHAR(1000) NOT NULL,
        file_size BIGINT,
        mime_type VARCHAR(100),
        compliance_item_id UUID REFERENCES compliance_items(id),
        uploaded_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS alerts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(500) NOT NULL,
        description TEXT,
        type VARCHAR(20) NOT NULL CHECK (type IN ('new', 'update', 'deadline')),
        source VARCHAR(200),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Clear existing data
    await sql`DELETE FROM documents`;
    await sql`DELETE FROM alerts`;
    await sql`DELETE FROM compliance_items`;

    // Get anniversary date
    const anniversaryMonth = parseInt(process.env.NV_ANNIVERSARY_MONTH || '8');
    const currentYear = new Date().getFullYear();
    const lastDay = new Date(currentYear, anniversaryMonth, 0).getDate();
    const anniversaryDate = `${currentYear}-${anniversaryMonth.toString().padStart(2, '0')}-${lastDay}`;

    // Seed compliance items
    const complianceItems = [
      ['Nevada Annual List of Managers/Members', 'state', 'Corporate Filing', anniversaryDate, 'Annual', 'pending', 'Required annual filing listing all managers and members of the LLC'],
      ['Nevada State Business License Renewal', 'state', 'Business License', anniversaryDate, 'Annual', 'pending', 'Annual renewal of Nevada state business license'],
      ['Nevada Commerce Tax', 'state', 'Tax Filing', '2025-05-15', 'Annual', 'pending', 'Due if annual gross revenue exceeds $4M'],
      ['Nevada Unemployment Insurance Tax', 'state', 'Payroll Tax', '2025-01-31', 'Quarterly', 'pending', 'Quarterly unemployment insurance tax filing (if employees)'],
      ['Nevada Modified Business Tax', 'state', 'Payroll Tax', '2025-01-31', 'Quarterly', 'pending', 'Quarterly MBT filing (if employees)'],
      ['Federal Income Tax Return (Form 1065)', 'federal', 'Tax Filing', '2025-03-15', 'Annual', 'pending', 'Partnership tax return (if LLC elects partnership taxation)'],
      ['Federal Income Tax Return (Form 1120)', 'federal', 'Tax Filing', '2025-04-15', 'Annual', 'pending', 'Corporate tax return (if LLC elects corporate taxation)'],
      ['Quarterly Federal Tax Return (Form 941)', 'federal', 'Payroll Tax', '2025-01-31', 'Quarterly', 'pending', 'Quarterly payroll tax return (if employees)'],
      ['Federal Unemployment Tax (Form 940)', 'federal', 'Payroll Tax', '2025-01-31', 'Annual', 'pending', 'Annual federal unemployment tax return (if employees)'],
      ['EEO Workplace Poster Update', 'federal', 'Compliance', '2025-01-31', 'Annual', 'pending', 'Ensure current Equal Employment Opportunity posters are displayed'],
      ['OSHA Annual Safety Training', 'federal', 'Safety', '2025-06-30', 'Annual', 'pending', 'Annual safety training requirements for all employees']
    ];

    for (const item of complianceItems) {
      await sql`
        INSERT INTO compliance_items (name, type, category, due_date, frequency, status, description)
        VALUES (${item[0]}, ${item[1]}, ${item[2]}, ${item[3]}, ${item[4]}, ${item[5]}, ${item[6]})
      `;
    }

    // Seed alerts
    const alerts = [
      ['IRS Form 941 Due Soon', 'Quarterly payroll tax return due January 31, 2025', 'deadline', 'IRS.gov'],
      ['Nevada Annual List Reminder', 'Annual List of Managers/Members due by end of anniversary month', 'deadline', 'Nevada SilverFlume'],
      ['OSHA Safety Poster Update', 'New workplace safety poster requirements effective 2025', 'update', 'OSHA.gov']
    ];

    for (const alert of alerts) {
      await sql`
        INSERT INTO alerts (title, description, type, source)
        VALUES (${alert[0]}, ${alert[1]}, ${alert[2]}, ${alert[3]})
      `;
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

main();