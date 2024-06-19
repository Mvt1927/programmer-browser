/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, Tray } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
// import { ElectronBlocker } from '@cliqz/adblocker-electron';
// import fetch from 'cross-fetch';
import { resolveHtmlPath } from './util';
import MenuBuilder from './menu';

const Positoner = require('electron-positioner');

let positioner: any;

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

let tray = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const dimensions = primaryDisplay.size;

  mainWindow = new BrowserWindow({
    show: false,
    minWidth: 300,
    width: dimensions.width / 2,
    height: dimensions.height,
    transparent: true,
    frame: false,
    //alwaysOnTop: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      contextIsolation: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  // ElectronBlocker.fromPrebuiltAdsAndTracking(fetch)
  //   .then((blocker) => {
  //     if (!mainWindow || !mainWindow.webContents.session) return;
  //     blocker.enableBlockingInSession(mainWindow.webContents.session);
  //   })
  //   .catch((e) => console.error(e));

  positioner = new Positoner(mainWindow);
  positioner.move('topRight');
  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  // Protocol handler for win32
  // event if app is already running will create new instance

  // toggle always on top
  ipcMain.on('event-toggle-always-on-top', (event, isPinned) => {
    mainWindow?.setAlwaysOnTop(isPinned);
  });

  // hide window when clicking minimize

  ipcMain.on('event-minimize', (event) => {
    event.preventDefault();
    mainWindow?.minimize();
  });

  // toggle maximize window when clicking maximize
  ipcMain.on('event-toggle-maximize', (event, isMaximized) => {
    if (isMaximized) {
      mainWindow?.maximize(); // If not maximized, maximize
    } else {
      mainWindow?.unmaximize(); // If maximized, restore to original size
      mainWindow?.restore(); // If maximized, restore to original size
    }
  });

  // open new window
  ipcMain.on('event-open-new-window', () => {
    createWindow(); // Create a new window when the event is received
  });

  // quit app when clicking close
  ipcMain.on('event-close', () => {
    mainWindow?.close();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  const menu = menuBuilder.buildMenu();
  mainWindow.webContents.on('context-menu', (_, props) => {
    const { x, y } = props;
    menu.popup({ window: mainWindow || undefined, x, y });
  });

  // open menu when clicking right click
  ipcMain.on('event-open-menu', (event, props) => {
    event.preventDefault();
    const { x, y } = props;
    menu.popup({ window: mainWindow || undefined, x, y });
  });
  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

ipcMain.on('window-move', (_event, args) => {
  positioner.move(args);
});
