# Koa Login Demo

一个基于 Koa 3 构建的用户登录注册示例项目，使用 JWT 进行身份认证，展示了 Koa 框架的基本用法和常见的 Web 开发模式。

## 技术栈

| 技术 | 说明 |
| --- | --- |
| [Koa](https://koajs.com/) | Node.js Web 框架（v3） |
| [MySQL2](https://github.com/sidorares/node-mysql2) | MySQL 数据库驱动（支持 Promise） |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | JWT 身份认证 |
| [bcryptjs](https://github.com/dcodeIO/bcryptjs) | 密码加密 |
| [dotenv](https://github.com/motdotla/dotenv) | 环境变量管理 |
| [koa-bodyparser](https://github.com/koajs/bodyparser) | 请求体解析 |
| [koa-router](https://github.com/koajs/router) | 路由管理 |

## 功能

- 用户注册 — 用户名、密码、邮箱（可选），密码经 bcrypt 加密存储
- 用户登录 — 用户名 + 密码校验，返回 JWT token（有效期 7 天）
- 获取个人信息 — 需在请求头携带 `Authorization: Bearer <token>` 访问

## 快速开始

### 前置条件

- Node.js >= 18
- pnpm（或 npm / yarn）
- MySQL 数据库

### 安装步骤

1. 克隆仓库：

```bash
git clone https://github.com/your-username/koa-login-demo.git
cd koa-login-demo
```

2. 安装依赖：

```bash
pnpm install
```

3. 创建数据库：

登录 MySQL 并执行以下 SQL：

```sql
CREATE DATABASE IF NOT EXISTS login_demo;
USE login_demo;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. 配置环境变量：

复制 `.env` 文件并根据本地环境修改：

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456
DB_NAME=login_demo

JWT_SECRET=my_super_secret_key_2024_xyz123_!@#
```

5. 启动服务：

```bash
# 开发模式（热重载）
pnpm dev

# 生产模式
pnpm start
```

服务默认运行在 `http://localhost:3000`。

## API 接口

### 注册

```http
POST /register
Content-Type: application/json

{
  "username": "alice",
  "password": "123456",
  "email": "alice@example.com"
}
```

### 登录

```http
POST /login
Content-Type: application/json

{
  "username": "alice",
  "password": "123456"
}
```

成功响应：

```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "id": 1,
    "username": "alice",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 获取个人信息

```http
GET /profile
Authorization: Bearer <token>
```

## 项目结构

```
koa-login-demo/
├── app.js                  # 入口文件，Koa 应用初始化
├── config/
│   └── database.js         # 数据库连接配置
├── controllers/
│   └── userController.js   # 用户注册/登录/个人信息控制器
├── middlewares/
│   └── auth.js             # JWT 认证中间件
├── routes/
│   └── userRoutes.js       # 路由定义
├── utils/
│   └── crypto.js           # bcrypt 密码加密工具
├── .env                    # 环境变量配置（不提交到仓库）
└── package.json
```

## License

[MIT](LICENSE)
