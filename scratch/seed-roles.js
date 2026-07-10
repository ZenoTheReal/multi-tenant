const mongoose = require('mongoose');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to', mongoose.connection.name);

  // Define simple Schema
  const RoleSchema = new mongoose.Schema({
    role: String,
    roleGroup: String,
    description: String
  }, { timestamps: true });

  const Role = mongoose.model('Role', RoleSchema);

  // Remove existing 'user' or 'customer' role
  await Role.deleteMany({ role: { $in: ['user', 'customer'] } });
  console.log('Deleted old user/customer roles');

  // Insert organizer and employee
  await Role.updateOne(
    { role: 'organizer' },
    { $set: { role: 'organizer', roleGroup: 'organization', description: 'Organization Owner' } },
    { upsert: true }
  );
  
  await Role.updateOne(
    { role: 'employee' },
    { $set: { role: 'employee', roleGroup: 'organization', description: 'Organization Employee' } },
    { upsert: true }
  );

  console.log('Roles seeded successfully');
  
  const roles = await Role.find({});
  console.log('Current Roles:', roles);

  await mongoose.disconnect();
}

seed().catch(console.error);
