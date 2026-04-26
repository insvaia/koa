import dotenv from "dotenv";
import mysql, {
  Pool,
  PoolConnection,
  RowDataPacket,
  ResultSetHeader,
} from "mysql2";

// 加载环境变量（必须在读取 process.env 之前）
dotenv.config();

// 定义数据库配置的类型
interface DBConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
  queueLimit: number;
}

// 读取环境变量
const dbconfig: DBConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "login_demo",
  connectionLimit: 10,
  queueLimit: 0,
};

const pool: Pool = mysql.createPool(dbconfig);
const db = pool.promise();

export interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  password: string;
  email?: string;
  created_at?: Date;
  updated_at?: Date;
}

const testConnection = async (): Promise<boolean> => {
  try {
    const [result] = await db.query<RowDataPacket[]>("SELECT 1");
    console.log("数据库连接成功");
    console.log("查询结果:", result);
    return true;
  } catch (error) {
    const err = error as Error;
    console.error("数据库连接失败:", err.message);
    return false;
  }
};

export { db, testConnection };
export type { Pool, PoolConnection, RowDataPacket, ResultSetHeader };
