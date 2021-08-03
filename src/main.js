// This is main process of Electron, started as first thing when your
// window from here.

import path from "path";
import url from "url";
import {
  app,
  Menu,
  ipcMain,
  shell,
  Tray,
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

let tray;
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

function createMainWindow() {
  const mainWindow = createWindow("main", {
    height: 600,
    width: 370,
    movable: true,
    skipTaskbar: true,
    // frame: false,
    minimizable: true,
    maximizable: true,
    closable: true,
    autoHideMenuBar: true,
    webPreferences: {
      // Two properties below are here for demo purposes, and are
      // security hazard. Make sure you know what you're doing
      // in your production app.
      nodeIntegration: true,
      contextIsolation: false,
      // Spectron needs access to remote module
      // enableRemoteModule: env.name === "test",
    },
  });

  mainWindow.setAlwaysOnTop(true);

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "app.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  if (env.name === "development") {
    mainWindow.openDevTools();
  }

  console.log("MINIMIZED: ", mainWindow.isMinimized());
}
app.on("ready", () => {
  setApplicationMenu();
  initIpc();

  // createWindow
  createMainWindow();
  ///### Notification
  // ipcMain.on("Notify", (event, arg) => {
  // const NOTIFICATION_TITLE = "RELAX!";
  // const NOTIFICATION_BODY = `Please take a Break 😴`;
  // // event.reply("Notify", "ready");
  // console.log(arg); // prints "ping"
  // new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY });
  // });
  ///### TRAY
  const icon = nativeImage.createFromPath(
    path.join(__dirname, "..", "src", "assets/pomodoro.png")
  );
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "simhub-pomodoro",
      click() {
        if (BrowserWindow.getAllWindows().length === 0) {
          createMainWindow();
        }
      },
    },
  ]);

  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
