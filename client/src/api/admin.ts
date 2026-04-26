import service from "@/utils/request";

export function login(data: { username: string; password: string }) {
  return service.post("/api/login", data);
}

export function register(data: { username: string; password: string; email?: string }) {
  return service.post("/api/register", data);
}
