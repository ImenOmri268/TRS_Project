const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:imen123@localhost:5432/postgres'
});

client.connect()
  .then(() => {
    console.log('✅ Raw PostgreSQL connection successful!');
    return client.query('SELECT NOW()');
  })
  .then(res => console.log('Server time:', res.rows[0].now))
  .catch(err => console.error('❌ Connection failed:', err.message))
  .finally(() => client.end());