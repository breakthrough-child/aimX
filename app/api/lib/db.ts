import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // use production env
  ssl: { rejectUnauthorized: false },
})

export default pool