import { sql } from '@vercel/postgres';

export async function seedData() {
  try {
    // Clear existing data
    await sql`DELETE FROM documents`;
    await sql`DELETE FROM alerts`;
    await sql`DELETE FROM compliance_items`;

    // Seed Nevada & Federal compliance items
    const complianceItems = [
      // Nevada State Requirements
      {
        name: 'Nevada Annual List of Managers/Members',
        type: 'state',
        category: 'Corporate Filing',
        due_date: getAnniversaryDate(), // Last day of anniversary month
        frequency: 'Annual',
        status: 'pending',
        description: 'Required annual filing listing all managers and members of the LLC'
      },
      {
        name: 'Nevada State Business License Renewal',
        type: 'state',
        category: 'Business License',
        due_date: getAnniversaryDate(),
        frequency: 'Annual',
        status: 'pending',
        description: 'Annual renewal of Nevada state business license'
      },
      {
        name: 'Nevada Commerce Tax',
        type: 'state',
        category: 'Tax Filing',
        due_date: '2025-05-15',
        frequency: 'Annual',
        status: 'pending',
        description: 'Due if annual gross revenue exceeds $4M'
      },
      {
        name: 'Nevada Unemployment Insurance Tax',
        type: 'state',
        category: 'Payroll Tax',
        due_date: '2025-01-31',
        frequency: 'Quarterly',
        status: 'pending',
        description: 'Quarterly unemployment insurance tax filing (if employees)'
      },
      {
        name: 'Nevada Modified Business Tax',
        type: 'state',
        category: 'Payroll Tax',
        due_date: '2025-01-31',
        frequency: 'Quarterly',
        status: 'pending',
        description: 'Quarterly MBT filing (if employees)'
      },

      // Federal Requirements
      {
        name: 'Federal Income Tax Return (Form 1065)',
        type: 'federal',
        category: 'Tax Filing',
        due_date: '2025-03-15',
        frequency: 'Annual',
        status: 'pending',
        description: 'Partnership tax return (if LLC elects partnership taxation)'
      },
      {
        name: 'Federal Income Tax Return (Form 1120)',
        type: 'federal',
        category: 'Tax Filing',
        due_date: '2025-04-15',
        frequency: 'Annual',
        status: 'pending',
        description: 'Corporate tax return (if LLC elects corporate taxation)'
      },
      {
        name: 'Quarterly Federal Tax Return (Form 941)',
        type: 'federal',
        category: 'Payroll Tax',
        due_date: '2025-01-31',
        frequency: 'Quarterly',
        status: 'pending',
        description: 'Quarterly payroll tax return (if employees)'
      },
      {
        name: 'Federal Unemployment Tax (Form 940)',
        type: 'federal',
        category: 'Payroll Tax',
        due_date: '2025-01-31',
        frequency: 'Annual',
        status: 'pending',
        description: 'Annual federal unemployment tax return (if employees)'
      },
      {
        name: 'EEO Workplace Poster Update',
        type: 'federal',
        category: 'Compliance',
        due_date: '2025-01-31',
        frequency: 'Annual',
        status: 'pending',
        description: 'Ensure current Equal Employment Opportunity posters are displayed'
      },
      {
        name: 'OSHA Annual Safety Training',
        type: 'federal',
        category: 'Safety',
        due_date: '2025-06-30',
        frequency: 'Annual',
        status: 'pending',
        description: 'Annual safety training requirements for all employees'
      }
    ];

    // Insert compliance items
    for (const item of complianceItems) {
      await sql`
        INSERT INTO compliance_items (name, type, category, due_date, frequency, status, description)
        VALUES (${item.name}, ${item.type}, ${item.category}, ${item.due_date}, ${item.frequency}, ${item.status}, ${item.description})
      `;
    }

    // Seed sample alerts
    const alerts = [
      {
        title: 'IRS Form 941 Due Soon',
        description: 'Quarterly payroll tax return due January 31, 2025',
        type: 'deadline',
        source: 'IRS.gov'
      },
      {
        title: 'Nevada Annual List Reminder',
        description: 'Annual List of Managers/Members due by end of anniversary month',
        type: 'deadline',
        source: 'Nevada SilverFlume'
      },
      {
        title: 'OSHA Safety Poster Update',
        description: 'New workplace safety poster requirements effective 2025',
        type: 'update',
        source: 'OSHA.gov'
      }
    ];

    for (const alert of alerts) {
      await sql`
        INSERT INTO alerts (title, description, type, source)
        VALUES (${alert.title}, ${alert.description}, ${alert.type}, ${alert.source})
      `;
    }

    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

function getAnniversaryDate(): string {
  // Default to August (month 8) - user can configure this via env var
  const anniversaryMonth = parseInt(process.env.NV_ANNIVERSARY_MONTH || '8');
  const currentYear = new Date().getFullYear();
  
  // Get last day of anniversary month
  const lastDay = new Date(currentYear, anniversaryMonth, 0).getDate();
  return `${currentYear}-${anniversaryMonth.toString().padStart(2, '0')}-${lastDay}`;
}