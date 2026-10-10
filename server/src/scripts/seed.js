import 'dotenv/config';
import dns from 'dns';
import mongoose from 'mongoose';
import Skill from '../models/Skill.js';
import User from '../models/User.js';


// Force Node.js to use Google and Cloudflare DNS servers for SRV resolution
dns.setServers(['8.8.8.8', '1.1.1.1']);

const skillCategories = [
  {
    title: 'Media Production',
    skills: ['Photography', 'Videography', 'Documentary Production', 'Content Creation', 'Camera Operation'],
  },
  {
    title: 'Frontend Development',
    skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Responsive Design'],
  },
  {
    title: 'Creative Software',
    skills: ['Adobe Lightroom', 'Adobe Photoshop', 'Adobe Premiere Pro', 'Canva', 'CapCut'],
  },
  {
    title: 'Professional Skills',
    skills: ['Creative Problem Solving', 'Client Communication', 'Project Planning', 'Time Management', 'Team Collaboration'],
  },
];

// Map each display title to a category value your schema allows
const categoryMap = {
  'Media Production': 'design',
  'Frontend Development': 'frontend',
  'Creative Software': 'design',
  'Professional Skills': 'tools',
};

// Optional: set real levels/years where they differ from the defaults
const overrides = {
  React: { level: 'advanced', yearsExperience: 2 },
  'Adobe Lightroom': { level: 'advanced', yearsExperience: 4 },
};

// Build skills in the exact shape you showed, given the endorsing user
const buildSkills = (user1) => {
  let counter = 1;

  return skillCategories.flatMap(({ title, skills }) =>
    skills.map((name) => {
      const endorsedBy = [user1._id];

      return {
        _id: `SKL-${String(counter++).padStart(4, '0')}`,
        name,
        category: categoryMap[title],
        level: 'intermediate',
        yearsExperience: 1,
        endorsements: endorsedBy.length,
        endorsedBy,
        ...overrides[name],
      };
    })
  );
};

async function seed() {
  if (process.env.NODE_ENV === 'production') {
    console.error('Refusing to seed a production database.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Skill.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing Skills and Users');

    // Users first, so skills can reference their _id
    const [user1] = await User.insertMany([
      { name: 'Demo User', email: 'demo@example.com' }, // adjust to your User schema
    ]);

    const created = await Skill.insertMany(buildSkills(user1));
    console.log(`Added ${created.length} skills to the database.`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seed();