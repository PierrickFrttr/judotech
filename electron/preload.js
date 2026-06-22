const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  store: {
    get: (key) => ipcRenderer.invoke('store:get', key),
    set: (key, value) => ipcRenderer.invoke('store:set', key, value),
    delete: (key) => ipcRenderer.invoke('store:delete', key),
    clear: () => ipcRenderer.invoke('store:clear'),
  },
  progress: {
    getAll: () => ipcRenderer.invoke('progress:getAll'),
    update: (techniqueId, data) => ipcRenderer.invoke('progress:update', techniqueId, data),
    getStreak: () => ipcRenderer.invoke('progress:getStreak'),
  },
  session: {
    save: (sessionData) => ipcRenderer.invoke('session:save', sessionData),
    getAll: () => ipcRenderer.invoke('session:getAll'),
  },
})
