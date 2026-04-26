<template>
  <div class="register-container">
    <div class="title-text">
      <h2>注册新账户</h2>
      <p>请填写注册信息</p>
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
            placeholder="请输入用户名（至少2个字符）"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            size="large"
            placeholder="请输入密码（至少6个字符）"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="formData.confirmPassword"
            type="password"
            size="large"
            placeholder="请再次输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="邮箱（选填）" prop="email">
          <el-input
            v-model="formData.email"
            size="large"
            placeholder="请输入邮箱地址"
          />
        </el-form-item>
        <el-button
          class="btn"
          type="primary"
          size="large"
          @click="handleSubmit(ruleFormRef)"
        >注册账户</el-button>
      </el-form>
      <div class="footer">
        <p>
          已有账户？<router-link to="/auth/login">立即登录</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { register } from "@/api/admin";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();

const ruleFormRef = ref<FormInstance>();

const formData = reactive({
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
});

const validateConfirmPassword = (_rule: any, value: string, callback: any) => {
  if (value !== formData.password) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 2, max: 20, message: "用户名长度必须在 2 到 20 个字符之间", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度必须在 6 到 20 个字符之间", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    { validator: validateConfirmPassword, trigger: "blur" },
  ],
  email: [
    { type: "email", message: "请输入有效的邮箱地址", trigger: "blur" },
  ],
});

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      register({
        username: formData.username,
        password: formData.password,
        email: formData.email || undefined,
      }).then(() => {
        ElMessage.success("注册成功，请登录");
        router.push("/auth/login");
      });
    }
  });
};
</script>

<style scoped lang="scss">
.register-container {
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
