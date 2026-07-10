const axios = require('axios');

async function run() {
  const api = axios.create({ baseURL: 'http://localhost:3000/api' });

  try {
    console.log('--- Registering Organizer ---');
    const orgUser = await api.post('/user/register', {
      email: `owner_${Date.now()}@example.com`,
      name: 'Owner Name',
      password: 'password123',
      organizationName: 'My Tech Company'
    });
    console.log('Organizer registered:', orgUser.data);

    // Get OrgCode
    const orgCode = orgUser.data.tenantId; // wait, the user object doesn't return orgCode. 
    // We need to fetch it from the DB directly since we didn't return orgCode from register

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

run();
