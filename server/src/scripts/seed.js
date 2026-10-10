import 'dotenv/config';
import dns from 'dns';
import mongoose from 'mongoose';
import Tool from './models/Tool.js';

// Force Node.js to use Google and Cloudflare DNS servers for SRV resolution
dns.setServers(['8.8.8.8', '1.1.1.1']);

const tools = [
  { name: 'Tool 1', description: 'Description for Tool 1', category: 'Category 1' },
  { name: 'Tool 2', description: 'Description for Tool 2', category: 'Category 2' },
  { name: 'Tool 3', description: 'Description for Tool 3', category: 'Category 3' }
];

async function seed() {
  if (process.env.NODE_ENV === 'production') {
    console.error('Refusing to seed a production database.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Tool.deleteMany({});
    console.log('Cleared existing Tools');

    const created = await Tool.insertMany(tools);
    console.log(`Added ${created.length} tools to the database.`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }  
}

seed();