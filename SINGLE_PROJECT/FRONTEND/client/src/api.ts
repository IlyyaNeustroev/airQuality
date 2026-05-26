const API_URL = "http://localhost:5000";

interface AnalyticsData {
  today_kwh: number;
  today_delta_pct: number;
  now_kw: number;
  month_kwh: number;
  budget_kwh: number;
  save_pct: number;

  hourly_consumption: number[];
  weekly_aqi: number[];

  zones: {
    label: string;
    percent: number;
  }[];
}

interface Zone {
  id: string;
  name: string;
  power: number;
  temp: number;
  status: "on" | "off" | "auto";
}

interface ControlState {
  global_mode: string;
  zones: Zone[];
}

interface UpdateControlPayload {
  action?: "all_on" | "all_off" | "all_auto";
  target_temp?: number;
  fan_speed?: number;
}

// история логов
export interface Log {
  id: string;
  time: string;     // ISO-away строка или "YYYY-MM-DD HH:MM:SS"
  type: "alert" | "action" | "system" | "ml";
  sensor: string;
  room: string;
  message: string;
  value?: string;
}

export interface LogsResponse {
  logs: Log[];
  from: string;
  to: string;
  filter: {
    type: string;
    level: string;
  };
}

// мониторинг
export interface Sensor {
  id: string;
  room: string;
  co2: number;
  temp: number;
  hum: number;
  aqi: number;
  status: "online" | "warning" | "critical";
}

export interface MonitoringData {
  summary: {
    total: number;
    online: number;
    warning: number;
    critical: number;
  };
  sensors: Sensor[];
}

// Настройки системы и ML
export interface MlSettings {
  enabled: boolean;
  auto_retrain: boolean;
  forecast_horizon_hours: number;
  update_interval_minutes: number;
  threshold_good: number;
  threshold_moderate: number;
}

interface SystemSettings {
  log_level: string;
  db_host: string;
  db_port: number;
}

interface NotificationsSettings {
  email_enabled: boolean;
  tg_enabled: boolean;
  web_push: boolean;
}

export interface ModelInfo {
  name: string;
  version: string;
  accuracy: number;
  train_date: string;
  dataset_size: number;
  features: string[];
}

export interface SettingsResponse {
  settings: {
    ml: MlSettings;
    system: SystemSettings;
    notifications: NotificationsSettings;
  };
  model_info: ModelInfo;
}

export async function fetchRealtimeData() {
  const response = await fetch(`${API_URL}/api/dashboard/realtime`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function fetchAnalyticsData(): Promise<AnalyticsData> {
  const response = await fetch(`${API_URL}/api/analytics`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function fetchControlState(): Promise<ControlState> {
  const response = await fetch(`${API_URL}/api/control`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function updateControlState(payload: UpdateControlPayload): Promise<ControlState> {
  const response = await fetch(`${API_URL}/api/control`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function fetchLogs(
  params: {
    from?: string;
    to?: string;
    type?: string;  // all, alert, action, system, ml
    level?: string; // all, Critical, Warning, Info
    limit?: number;
  }
): Promise<LogsResponse> {
  const url = new URL(`${API_URL}/api/logs`);
  if (params.from) url.searchParams.append("from", params.from);
  if (params.to)   url.searchParams.append("to", params.to);
  if (params.type) url.searchParams.append("type", params.type);
  if (params.level) url.searchParams.append("level", params.level);
  if (params.limit) url.searchParams.append("limit", String(params.limit));

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function fetchMonitoringData(): Promise<MonitoringData> {
  const response = await fetch(`${API_URL}/api/monitoring`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function fetchSettings(): Promise<SettingsResponse> {
  const response = await fetch(`${API_URL}/api/settings`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function updateSettings(changes: object): Promise<SettingsResponse> {
  const response = await fetch(`${API_URL}/api/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}