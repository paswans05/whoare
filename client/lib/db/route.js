import mysql from "mysql2/promise";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "db",   // Docker service name
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "rootpassword",
      database: process.env.DB_NAME || "whoare",
    });

    const [rows] = await connection.execute("SELECT NOW() as current_time");
    await connection.end();

    return new Response(JSON.stringify(rows[0]), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
