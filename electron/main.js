const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')
const path = require('path')
const Store = require('electron-store')

const store = new Store()
const isDev = process.env.NODE_ENV === 'development'

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#0e0e0f',
    titleBarStyle: 'default',
    icon: path.join(__dirname, '..', 'build', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  nativeTheme.themeSource = 'dark'

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// IPC handlers pour electron-store
ipcMain.handle('store:get', (_, key) => store.get(key))
ipcMain.handle('store:set', (_, key, value) => store.set(key, value))
ipcMain.handle('store:delete', (_, key) => store.delete(key))
ipcMain.handle('store:clear', () => store.clear())

// IPC handlers pour les données de progression
ipcMain.handle('progress:getAll', () => {
  return store.get('progress', {})
})

ipcMain.handle('progress:update', (_, techniqueId, data) => {
  const progress = store.get('progress', {})
  progress[techniqueId] = { ...progress[techniqueId], ...data, lastSeen: Date.now() }
  store.set('progress', progress)
  return progress[techniqueId]
})

ipcMain.handle('progress:getStreak', () => {
  const today = new Date().toDateString()
  const lastStudy = store.get('lastStudyDate', null)
  const streak = store.get('streak', 0)

  if (lastStudy === today) return streak

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const newStreak = lastStudy === yesterday.toDateString() ? streak + 1 : 1

  store.set('lastStudyDate', today)
  store.set('streak', newStreak)
  return newStreak
})

ipcMain.handle('session:save', (_, sessionData) => {
  const sessions = store.get('sessions', [])
  sessions.push({ ...sessionData, date: Date.now() })
  if (sessions.length > 100) sessions.shift()
  store.set('sessions', sessions)
  return true
})

ipcMain.handle('session:getAll', () => {
  return store.get('sessions', [])
})
