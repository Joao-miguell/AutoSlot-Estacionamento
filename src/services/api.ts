// src/services/api.ts
const api = {
  defaults: { headers: {} } as any,
  post: () => Promise.resolve({ data: {} }),
  get: () => Promise.resolve({ data: {} }),
};
export default api;