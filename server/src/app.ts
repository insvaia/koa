import koa from "koa";
import { testConnection } from "./config/database";
import { bodyParser } from "@koa/bodyparser";
import userRoutes from "./routes/useRoutes";

const app = new koa();

app.use(bodyParser());
app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

const startServer = async (): Promise<void> => {
  const isDbConnected: Boolean = await testConnection();

  if (!isDbConnected) {
    console.error("无法连接到数据库，服务器启动失败");
    process.exit(1); // 退出进程
  }

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  });
};

startServer();
