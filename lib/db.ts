import mysql from "mysql2/promise";

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

type QueryResult =
  | mysql.RowDataPacket[]
  | mysql.OkPacket
  | mysql.OkPacket[]
  | mysql.ResultSetHeader;

// Function to execute queries
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  const [results] = await pool.execute<QueryResult>(sql, params);
  return results as T[]; // ✅ Ensure correct typing
}

export default { query };
