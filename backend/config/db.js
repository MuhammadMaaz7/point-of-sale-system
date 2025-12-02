import mysql from 'mysql2/promise';

let pool = null;

const connectDB = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'pos_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });

    // Test connection
    const connection = await pool.getConnection();
    console.log('✓ MySQL connected successfully');
    console.log(`✓ Database: ${process.env.DB_NAME || 'pos_db'}`);
    connection.release();
    
    return pool;
  } catch (error) {
    console.error('✗ MySQL connection error:', error.message);
    process.exit(1);
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call connectDB() first.');
  }
  return pool;
};

export { connectDB, getPool };
export default connectDB;
