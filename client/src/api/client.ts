import { Car, ContactMessage, AdminLoginResponse } from './types';

const API_BASE =
  typeof window !== 'undefined' &&
  window.location.hostname === 'localhost' &&
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/api'
    : '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API error (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export type CarQuery = {
  make?: string;
  search?: string;
  category?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  minPower?: number;
  maxPower?: number;
  sort?: 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc';
};

export async function fetchMakes(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/cars/makes`);
  return handleResponse<string[]>(res);
}

export async function fetchCars(query: CarQuery = {}): Promise<Car[]> {
  const params = new URLSearchParams();
  if (query.make) params.set('make', query.make);
  if (query.search) params.set('search', query.search);
  if (query.category) params.set('category', query.category);
  if (query.color) params.set('color', query.color);
  if (query.minPrice != null) params.set('min_price', String(query.minPrice));
  if (query.maxPrice != null) params.set('max_price', String(query.maxPrice));
  if (query.minPower != null) params.set('min_power', String(query.minPower));
  if (query.maxPower != null) params.set('max_power', String(query.maxPower));
  if (query.sort) params.set('sort', query.sort);

  const url =
    params.toString().length > 0
      ? `${API_BASE}/cars?${params.toString()}`
      : `${API_BASE}/cars`;

  const res = await fetch(url);
  return handleResponse<Car[]>(res);
}

export async function fetchColors(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/cars/colors`);
  return handleResponse<string[]>(res);
}

export async function fetchCar(id: string): Promise<Car> {
  const res = await fetch(`${API_BASE}/cars/${id}`);
  return handleResponse<Car>(res);
}

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  car_id?: string;
  type?: string;
};

export async function sendContact(payload: ContactPayload): Promise<ContactMessage> {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<ContactMessage>(res);
}

export type TestDrivePayload = {
  car_id: string;
  name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  message?: string;
};

export async function bookTestDrive(payload: TestDrivePayload): Promise<unknown> {
  const res = await fetch(`${API_BASE}/test-drive`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<unknown>(res);
}

export type NotifyPayload = {
  email: string;
  make?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
};

export async function subscribeNotify(payload: NotifyPayload): Promise<unknown> {
  const res = await fetch(`${API_BASE}/notify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<unknown>(res);
}

export async function adminLogin(
  email: string,
  password: string
): Promise<AdminLoginResponse> {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AdminLoginResponse>(res);
}

function authHeaders(token: string | null): HeadersInit {
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

export async function adminFetchCars(token: string): Promise<Car[]> {
  const res = await fetch(`${API_BASE}/admin/cars`, {
    headers: authHeaders(token),
  });
  return handleResponse<Car[]>(res);
}

export type AdminCarPayload = Omit<
  Car,
  'id' | 'created_at' | 'is_sold'
> & { is_sold?: boolean };

export async function adminCreateCar(
  token: string,
  payload: AdminCarPayload
): Promise<Car> {
  const body = {
    ...payload,
    gallery: payload.gallery ?? [],
  };

  const res = await fetch(`${API_BASE}/admin/cars`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  return handleResponse<Car>(res);
}

export async function adminUpdateCar(
  token: string,
  id: string,
  partial: Partial<AdminCarPayload> & { is_sold?: boolean }
): Promise<Car> {
  const res = await fetch(`${API_BASE}/admin/cars/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(partial),
  });
  return handleResponse<Car>(res);
}

export async function adminUploadImages(
  token: string,
  files: File[]
): Promise<string[]> {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));

  const res = await fetch(`${API_BASE}/admin/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return handleResponse<string[]>(res);
}

export async function adminDeleteCar(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/cars/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) {
    throw new Error(`Failed to delete car (${res.status})`);
  }
}

export async function adminFetchMessages(token: string): Promise<ContactMessage[]> {
  const res = await fetch(`${API_BASE}/admin/messages`, {
    headers: authHeaders(token),
  });
  return handleResponse<ContactMessage[]>(res);
}

export async function adminUpdateMessageStatus(
  token: string,
  id: string,
  statusValue: string
): Promise<ContactMessage> {
  const url = new URL(`${API_BASE}/admin/messages/${id}`, window.location.origin);
  url.searchParams.set('status_value', statusValue);

  const res = await fetch(url.toString(), {
    method: 'PUT',
    headers: authHeaders(token),
  });
  return handleResponse<ContactMessage>(res);
}

export type CallbackPayload = {
  name: string;
  phone: string;
  preferred_time?: string;
  message?: string;
};

export async function requestCallback(payload: CallbackPayload): Promise<unknown> {
  const res = await fetch(`${API_BASE}/callback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<unknown>(res);
}

export type ChatSession = { id: string; visitor_name?: string; created_at: string; last_message_at: string };
export type ChatMessage = { id: string; session_id: string; text: string; is_admin: boolean; created_at: string };

export async function createChatSession(): Promise<ChatSession> {
  const res = await fetch(`${API_BASE}/chat/session`, { method: 'POST' });
  return handleResponse<ChatSession>(res);
}

export async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
  const res = await fetch(`${API_BASE}/chat/${sessionId}/messages`);
  return handleResponse<ChatMessage[]>(res);
}

export async function sendChatMessage(sessionId: string, text: string): Promise<ChatMessage> {
  const res = await fetch(`${API_BASE}/chat/${sessionId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, is_admin: false }),
  });
  return handleResponse<ChatMessage>(res);
}

export async function adminFetchCallbacks(token: string): Promise<{ id: string; name: string; phone: string; preferred_time?: string; message?: string; created_at: string; status: string }[]> {
  const res = await fetch(`${API_BASE}/admin/callbacks`, { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function adminUpdateCallbackStatus(token: string, id: string, status: string): Promise<unknown> {
  const url = new URL(`${API_BASE}/admin/callbacks/${id}`, window.location.origin);
  url.searchParams.set('status_value', status);
  const res = await fetch(url.toString(), { method: 'PUT', headers: authHeaders(token) });
  return handleResponse(res);
}

export async function adminFetchChatSessions(token: string): Promise<ChatSession[]> {
  const res = await fetch(`${API_BASE}/admin/chat/sessions`, { headers: authHeaders(token) });
  return handleResponse<ChatSession[]>(res);
}

export async function adminGetChatMessages(token: string, sessionId: string): Promise<ChatMessage[]> {
  const res = await fetch(`${API_BASE}/admin/chat/sessions/${sessionId}/messages`, {
    headers: authHeaders(token),
  });
  return handleResponse<ChatMessage[]>(res);
}

export async function adminSendChatMessage(token: string, sessionId: string, text: string): Promise<ChatMessage> {
  const res = await fetch(`${API_BASE}/admin/chat/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ text }),
  });
  return handleResponse<ChatMessage>(res);
}

