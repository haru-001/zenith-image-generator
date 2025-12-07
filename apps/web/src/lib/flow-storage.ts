export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: string;
  timestamp: number;
  model: string;
  seed?: number;
  duration?: number;
  isBlurred?: boolean;
  isUpscaled?: boolean;
}

export interface FlowSession {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  images: GeneratedImage[];
}

const FLOW_STORAGE_KEY = "zenith-flow-sessions";

export function loadFlowSessions(): FlowSession[] {
  try {
    const data = localStorage.getItem(FLOW_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveFlowSessions(sessions: FlowSession[]) {
  localStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify(sessions));
}

export function createFlowSession(): FlowSession {
  const session: FlowSession = {
    id: `flow-${Date.now()}`,
    name: `Flow ${new Date().toLocaleString("zh-CN")}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    images: [],
  };
  const sessions = loadFlowSessions();
  sessions.unshift(session);
  saveFlowSessions(sessions);
  return session;
}

export function updateFlowSession(sessionId: string, images: GeneratedImage[]) {
  const sessions = loadFlowSessions();
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx !== -1) {
    sessions[idx].images = images;
    sessions[idx].updatedAt = Date.now();
    saveFlowSessions(sessions);
  }
}

export function deleteFlowSession(sessionId: string) {
  const sessions = loadFlowSessions().filter((s) => s.id !== sessionId);
  saveFlowSessions(sessions);
}

// Flow input settings storage
export interface FlowInputSettings {
  aspectRatioIndex: number;
  resolutionIndex: number; // 0=1K, 1=2K - independent of aspect ratio
  prompt: string;
}

const FLOW_INPUT_SETTINGS_KEY = "zenith-flow-input-settings";

export function loadFlowInputSettings(): FlowInputSettings {
  try {
    const data = localStorage.getItem(FLOW_INPUT_SETTINGS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // ignore
  }
  return {
    aspectRatioIndex: 0,
    resolutionIndex: 0,
    prompt: "",
  };
}

export function saveFlowInputSettings(settings: FlowInputSettings) {
  localStorage.setItem(FLOW_INPUT_SETTINGS_KEY, JSON.stringify(settings));
}
