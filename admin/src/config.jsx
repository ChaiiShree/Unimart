const isLocalhost = window.location.hostname.includes('localhost');

export const BACKEND_URL = isLocalhost
  ? 'http://localhost:7860/'
  : 'https://unipalmark-backend.hf.space/';