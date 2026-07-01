const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:3000/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  email: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as { message: string; email?: string };

  if (!res.ok) {
    throw new Error(data.message ?? "Login failed");
  }

  return data as LoginResponse;
}

export async function getHelloWorld(): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/hello-world`);
  if (!res.ok) throw new Error("Failed to fetch message");
  return res.json() as Promise<{ message: string }>;
}
