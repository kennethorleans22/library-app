export const BASE_URL = "https://library-backend-production-b9cf.up.railway.app";

// Bungkus fetch: otomatis pasang alamat server, header JSON,
// dan lempar error kalau server menjawab gagal.
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Terjadi kesalahan pada server");
  }

  return json as T;
}