import Router from "@koa/router";
import { register, login, getProfile } from "../controllers/userController";
import auth from "../middlewares/auth";

const router = new Router();

router.post("/api/register", register);
router.post("/api/login", login);

// 需要登录的接口（先经过 auth 中间件验证 token）
router.get("/api/profile", auth, getProfile);

export default router;
