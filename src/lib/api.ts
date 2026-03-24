const API_BASE = "http://127.0.0.1:8000";

export interface CurrencyResult {
  result: string;
  method: string | null;
  confidence: number | null;
}

export interface ProductResult {
  result: string;
  predictions: { label: string; confidence: number }[];
  confidence: number;
}

async function uploadImage(endpoint: string, file: File | Blob) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("API error");
  }

  return res.json();
}

export async function detectCurrency(file: File | Blob) {
  return uploadImage("/detect/currency", file);
}

export async function detectProduct(file: File | Blob) {
  return uploadImage("/detect/product", file);
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}