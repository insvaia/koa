import { db } from "../config/database";
import jwt from "jsonwebtoken";
import { encryptPassword, comparePassword } from "../utils/crypto";
import type { Context } from "koa";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

// 从环境变量中读取密钥
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

interface RegisterBody {
  username: string;
  password: string;
  email?: string;
}

interface LoginBody {
  username: string;
  password: string;
}

// 定义用户查询结果类型
interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  password: string;
  email?: string;
}

// 注册接口
const register = async (ctx: Context) => {
  const { username, password, email } = ctx.request.body as RegisterBody;
  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { success: false, message: "用户名和密码不能为空" };
    return;
  }

  if (username.length < 2) {
    ctx.status = 400;
    ctx.body = { success: false, message: "用户名长度必须至少为2个字符" };
    return;
  }

  if (password.length < 6) {
    ctx.status = 400;
    ctx.body = { success: false, message: "密码长度必须至少为6个字符" };
    return;
  }

  try {
    // 检查用户名是否已存在
    const [rows] = await db.query<UserRow[]>(
      "SELECT id FROM users WHERE username = ?",
      [username],
    );

    if (rows && rows.length > 0) {
      ctx.status = 409;
      ctx.body = { success: false, message: "用户名已存在" };
      return;
    }

    const encryptedPassword = await encryptPassword(password);

    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
      [username, encryptedPassword, email || null],
    );

    ctx.status = 201;
    ctx.body = {
      success: true,
      message: "注册成功",
      data: {
        id: result.insertId,
        username,
        email: email || "",
      },
    };
  } catch (error) {
    console.error("注册错误", error);
    ctx.status = 500;
    ctx.body = { success: false, message: "服务器错误" };
  }
};

// 登录接口
const login = async (ctx: Context) => {
  const { username, password } = ctx.request.body as LoginBody;
  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { success: false, message: "用户名和密码不能为空" };
    return;
  }

  try {
    const [users] = await db.query<UserRow[]>(
      "SELECT id, username, password FROM users WHERE username = ?",
      [username],
    );
    if (users.length === 0) {
      ctx.status = 401;
      ctx.body = { success: false, message: "用户名或密码错误" };
      return;
    }

    const user = users[0];
    const isPasswordVaild: Boolean = await comparePassword(
      password,
      user.password,
    );
    if (!isPasswordVaild) {
      ctx.status = 401;
      ctx.body = { success: false, message: "用户名或密码错误" };
      return;
    }

    // 使用环境变量中的密钥
    const tokenData = {
      id: user.id,
      username: user.username,
    };

    const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: "7d" });

    ctx.body = {
      success: true,
      message: "登录成功",
      data: {
        id: user.id,
        username: user.username,
        token: token,
      },
    };
  } catch (error) {
    console.error("登录错误:", error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: "服务器内部错误",
    };
  }
};

// 获取用户信息接口（保持不变）
const getProfile = async (ctx: Context) => {
  const { id, username } = ctx.state.user;

  try {
    const [users] = await db.query<UserRow[]>(
      "SELECT id, username, email, created_at FROM users WHERE id = ?",
      [id, username],
    );

    if (users.length === 0) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: "用户不存在",
      };
      return;
    }

    ctx.body = {
      success: true,
      data: users[0],
    };
  } catch (error) {
    console.error("获取用户信息错误:", error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: "服务器内部错误",
    };
  }
};

export { register, login, getProfile };
