# Koa + Vue 3 全栈登录注册项目

## 项目概述

这是一个基于 **Koa 3**（后端）和 **Vue 3**（前端）的全栈入门demo项目，实现了用户注册、登录和获取用户信息等基础功能。采用 pnpm 管理依赖，TypeScript 编写。

```
f:\前端\koa
├── client/          # 前端 - Vue 3 单页应用
├── server/          # 后端 - Koa 3 API 服务
└── 项目介绍.md       # 本文件
```

---

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 后端框架 | Koa | 3.x |
| 后端语言 | TypeScript | 6.0 |
| 数据库 | MySQL | (via mysql2) |
| 认证方案 | JWT + bcryptjs | |
| 前端框架 | Vue 3 (Composition API) | 3.5 |
| 前端路由 | Vue Router | 5.x |
| 构建工具 | Vite | 8.x |
| UI 组件库 | Element Plus | 2.x |
| HTTP 客户端 | Axios | 1.x |
| 包管理器 | pnpm | 10.x |

---

## 后端介绍 (`server/`)

### 目录结构

```
server/
├── .env                     # 环境变量（端口、数据库配置、JWT密钥）
├── package.json
├── tsconfig.json
└── src/
    ├── app.ts               # 入口文件，启动 Koa 服务
    ├── config/
    │   └── database.ts      # MySQL 连接池配置
    ├── controllers/
    │   └── userController.ts # 业务逻辑（注册、登录、获取用户信息）
    ├── middlewares/
    │   └── auth.ts          # JWT 认证中间件
    ├── routes/
    │   └── useRoutes.ts     # 路由定义
    └── utils/
        └── crypto.ts        # 密码加密（bcryptjs）
```

### 后端架构

```
客户端请求
    │
    v
Koa 3 应用 (端口 3001)
    │
    ├── @koa/bodyparser (解析 JSON 请求体)
    │
    v
Koa Router
    │
    ├── POST /api/register  →  无认证  →  register 控制器
    ├── POST /api/login     →  无认证  →  login 控制器
    └── GET  /api/profile   →  JWT 认证 →  getProfile 控制器
                                        │
                                   auth 中间件
                                  (验证 Token)
                                        │
                                        v
                                  MySQL 数据库 (login_demo)
```

### 关键实现

- **数据库连接**：使用 `mysql2` 连接池，启动时通过 `SELECT 1` 校验连接状态，连接失败则进程退出
- **密码处理**：使用 bcryptjs 进行哈希加密（盐值轮数 10），不存储明文密码
- **JWT 认证**：登录成功签发 7 天有效期的 Token，受保护接口通过 `Authorization: Bearer <token>` 验证
- **中间件认证**：auth 中间件支持 `Bearer <token>` 和裸 Token 两种格式，验证失败返回 401

### 环境变量 (`.env`)

| 变量 | 值 | 说明 |
|------|-----|------|
| PORT | 3001 | 后端服务端口 |
| DB_HOST | localhost | 数据库主机 |
| DB_USER | root | 数据库用户 |
| DB_PASSWORD | 123456 | 数据库密码 |
| DB_NAME | login_demo | 数据库名 |
| JWT_SECRET | (自定义) | JWT 签名密钥 |

---

## 前端介绍 (`client/`)

### 目录结构

```
client/
├── index.html                # HTML 入口
├── vite.config.ts            # Vite 配置（代理、路径别名）
├── package.json
├── tsconfig.json
└── src/
    ├── main.ts               # Vue 应用入口
    ├── App.vue               # 根组件（<router-view>）
    ├── api/
    │   └── admin.ts          # API 接口封装（login、register）
    ├── assets/
    │   └── css/style.css     # 全局样式
    ├── routes/
    │   └── index.ts          # Vue Router 路由配置
    ├── utils/
    │   └── request.ts        # Axios 实例（拦截器、Token 管理）
    └── views/
        ├── Home.vue          # 首页（登录后）
        ├── Layout.vue        # 认证布局容器
        ├── LoginView.vue     # 登录页
        └── RegisterView.vue  # 注册页
```

### 前端路由

| 路径 | 名称 | 组件 | 说明 |
|------|------|------|------|
| `/auth` | layout | Layout.vue | 认证布局，重定向到 `/auth/login` |
| `/auth/login` | login | LoginView.vue | 登录页 |
| `/auth/register` | register | RegisterView.vue | 注册页 |
| `/home` | home | Home.vue | 首页（登录后跳转） |

### 数据流

```
用户操作（填写表单）
    │
    v
Vue 组件（LoginView / RegisterView）
    │  Element Plus 表单验证
    v
API 函数（admin.ts）
    │  Axios POST 请求
    v
Axios 实例（request.ts）
    │  请求拦截器：自动附加 JWT Token
    │  响应拦截器：统一错误处理（401 自动跳转登录）
    v
Vite 开发代理（/api/* → localhost:3001）
    │
    v
Koa 后端 API
```

### 关键实现

- **Token 管理**：登录成功后 Token 存储在 `localStorage`，Axios 请求拦截器自动附加到请求头
- **错误处理**：Axios 响应拦截器统一处理 401（清除 Token 并跳转登录）、网络超时等异常
- **表单校验**：用户名 2-20 字符、密码 6-20 字符、确认密码一致性校验（Element Plus）
- **开发代理**：Vite 配置 `/api` 代理到 `http://localhost:3001`，避免跨域问题

---

## API 接口文档

| 方法 | 路径 | 认证 | 请求体 | 成功响应 |
|------|------|------|--------|----------|
| POST | `/api/register` | 否 | `{ username, password, email? }` | `{ success: true, message: "注册成功", data: { id, username, email } }` |
| POST | `/api/login` | 否 | `{ username, password }` | `{ success: true, message: "登录成功", data: { id, username, token } }` |
| GET | `/api/profile` | Bearer Token | — | `{ success: true, data: { id, username, email, created_at } }` |

错误响应格式：`{ success: false, message: "错误描述" }`，对应 HTTP 状态码 400/401/404/409/500。

---

## 数据库设计

**数据库名**：`login_demo`

**users 表**：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT (自增, 主键) | 用户 ID |
| username | VARCHAR(255) (唯一) | 用户名 |
| password | VARCHAR(255) | bcrypt 加密后的密码 |
| email | VARCHAR(255) (可空) | 邮箱 |
| created_at | TIMESTAMP (默认当前时间) | 创建时间 |
| updated_at | TIMESTAMP (自动更新) | 更新时间 |

---

## 本地开发

### 前置要求

- Node.js >= 18
- pnpm >= 10
- MySQL 服务

### 启动步骤

```bash
# 1. 初始化数据库
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS login_demo;"

# 2. 创建数据表（在 MySQL 中执行）
USE login_demo;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

# 3. 安装后端依赖并启动
cd server
pnpm install
pnpm dev          # 启动在 http://localhost:3001

# 4. 安装前端依赖并启动（新开终端）
cd client
pnpm install
pnpm dev          # 启动在 http://localhost:5173
```

---

## 项目定位

这是一个**入门级全栈 demo 项目**，适合以下场景：
- 学习 Koa 3 + TypeScript 的后端开发
- 学习 Vue 3 + Composition API 的前端开发
- 理解前后端分离架构下的认证流程（JWT）
- 作为更复杂项目的脚手架起点
