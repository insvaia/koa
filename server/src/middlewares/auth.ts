import { Context } from "koa"; // 注意：应该从 "koa" 导入，不是 "node:vm"
import { Next } from "koa";

import jwt from "jsonwebtoken";

interface TokenPayload {
  id: number;
  username: string;
}

// 从环境变量读取密钥
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const auth = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization;

  if (!token) {
    ctx.status = 401;
    ctx.body = {
      success: false,
      message: "未提供 token，请先登录",
    };
    return;
  }

  try {
    const tokenValue = token.startsWith("Bearer ") ? token.slice(7) : token;
    const decoded = jwt.verify(tokenValue, JWT_SECRET) as TokenPayload;

    ctx.state.user = {
      id: decoded.id,
      username: decoded.username,
    };

    await next();
  } catch (error) {
    const err = error as Error;
    if (err.name === "JsonWebTokenError") {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: "无效的 token",
      };
    } else if (err.name === "TokenExpiredError") {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: "token 已过期，请重新登录",
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: "服务器内部错误",
      };
    }
  }
};

export default auth;
