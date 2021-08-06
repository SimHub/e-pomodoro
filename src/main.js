// This is main process of Electron, started as first thing when your
// window from here.

import path from "path";
import url from "url";
import {
  app,
  Menu,
  ipcMain,
  shell,
  nativeImage,
  BrowserWindow,
  Notification,
} from "electron";
import appMenuTemplate from "./menu/app_menu_template";
import editMenuTemplate from "./menu/edit_menu_template";
import devMenuTemplate from "./menu/dev_menu_template";
import createWindow from "./helpers/window";

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "env";

let minimizedCount = 0;
// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}
// console.log(path.join(__dirname, ""));

const setApplicationMenu = () => {
  const menus = [appMenuTemplate, editMenuTemplate];
  if (env.name !== "production") {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// We can communicate with our window (the renderer process) via messages.
const initIpc = () => {
  ipcMain.on("need-app-path", (event, arg) => {
    event.reply("app-path", app.getAppPath());
  });
  ipcMain.on("open-external-link", (event, href) => {
    shell.openExternal(href);
  });
};
const _option = {
  height: 356,
  width: 380,
  movable: true,
  // resizable: false,
  // skipTaskbar: true,
  // frame: false,
  titleBarStyle: "hidden",
  trafficLightPosition: {
    x: 10,
    y: 10,
  },
  // minimizable: true,
  // maximizable: true,
  // closable: true,
  // autoHideMenuBar: true,
  webPreferences: {
    // Two properties below are here for demo purposes, and are
    // security hazard. Make sure you know what you're doing
    // in your production app.
    nodeIntegration: true,
    contextIsolation: false,
    // Spectron needs access to remote module
    // enableRemoteModule: env.name === "test",
  },
};

function minimizeWindow(mainWindow) {
  ipcMain.on("minimize", (event, arg) => {
    if (!arg) {
      mainWindow.setSize(356, 380, true);
      event.reply("minimize", false);
    }
    if (arg) {
      mainWindow.setSize(230, 80, true);
      event.reply("minimize", true);
    }
  });
}
function createMainWindow(option) {
  const mainWindow = createWindow("main", option);
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "app.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  mainWindow.setAlwaysOnTop(true);
  if (env.name === "development") {
    mainWindow.openDevTools();
  }
  ///### MINIMIZE WINDOW
  minimizeWindow(mainWindow);
}

app.on("ready", () => {
  setApplicationMenu();
  // initIpc();
  // createWindow
  createMainWindow(_option);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
