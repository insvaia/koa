<template>
  <div class="login-container">
    <div class="title-text">
      <h2>登录您的账户</h2>
      <p>请输入您的登录信息</p>
    </div>
    <div class="form-container">
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            size="large"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            size="large"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-button
          class="btn"
          type="primary"
          size="large"
          @click="handleSubmit(ruleFormRef)"
          >登录账户</el-button
        >
      </el-form>
      <div class="footer">
        <p>
          还没有账户？<router-link to="/auth/register">立即注册</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { login } from "@/api/admin";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();

const ruleFormRef = ref<FormInstance>();

const formData = reactive({
  username: "",
  password: "",
});

const rules = reactive<FormRules>({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      min: 2,
      max: 20,
      message: "用户名长度必须在 2 到 20 个字符之间",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 6,
      max: 20,
      message: "密码长度必须在 6 到 20 个字符之间",
      trigger: "blur",
    },
  ],
});

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      login(formData).then((res: any) => {
        if (!res.data?.token) {
          return ElMessage.error("登录失败，请检查用户名和密码");
        }
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userInfo", JSON.stringify({ id: res.data.id, username: res.data.username }));
        ElMessage.success("登录成功");
        router.push("/home");
      });
    }
  });
};
</script>

<style scoped lang="scss">
.login-container {
  width: 400px;
  margin: auto;
  .title-text {
    text-align: center;
    h2 {
      font-size: 36px;
      margin-bottom: 10px;
    }
    p {
      font-size: 20px;
      color: #6b7280;
    }
  }
  .form-container {
    margin-top: 30px;
    .btn {
      margin-top: 40px;
      width: 100%;
    }
    .footer {
      padding: 30px;
      text-align: center;
    }
  }
}
</style>
