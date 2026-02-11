import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";


const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

const { Pool } = pkg;

// Validate required environment variables
const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_NAME"];
const missingEnvVars = requiredEnvVars.filter(env => !process.env[env]);

if (missingEnvVars.length > 0) {
  console.error("❌ Missing environment variables:", missingEnvVars);
  process.exit(1);
}

if (process.env.NODE_ENV === "development") {
  console.log("DB_HOST =", process.env.DB_HOST);
  console.log("DB_NAME =", process.env.DB_NAME);
}

const resolvedHost = process.env.DB_HOST === "localhost" || !process.env.DB_HOST
  ? "127.0.0.1"
  : process.env.DB_HOST;
  
export const pool = new Pool({
  host: resolvedHost,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || undefined,
  database: process.env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// avoid throwing on startup; log and keep server running
(async () => {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    console.log("✅ PostgreSQL connected from Node");
  } catch (err) {
    console.error("❌ PG error:", err.message || err);
    console.error("   Host:", resolvedHost);
    console.error("   Port:", process.env.DB_PORT || 5432);
    console.error("   User:", process.env.DB_USER);
    console.error("   Database:", process.env.DB_NAME);
    console.error("   Password:", process.env.DB_PASSWORD);
    console.error("\n💡 To fix this:");
    console.error("   1. Verify PostgreSQL is running: Get-Service postgresql-x64-18");
    console.error("   2. Check password in .env matches PostgreSQL user password");
    console.error("   3. Or use pgAdmin to reset the postgres user password");
    // do not process.exit — let server run so routes can respond
  }
})();

// log successful connect events
pool.on("connect", () => {
  console.log("pg: client connected");
});


pool.on("error", (err) => {
  console.error("❌ Unexpected error on idle client:", err.message);
});


export default pool;


