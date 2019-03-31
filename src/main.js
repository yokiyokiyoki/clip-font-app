const { app, BrowserWindow,  globalShortcut ,Tray,Menu,ipcMain} = require('electron')

const path=require('path')

let win

let srcPath=path.join(__dirname,"../src")

let clip=true
function createTray () {
    tray = new Tray(`${srcPath}/images/font.png`) // 指定图片的路径
    const contextMenu = Menu.buildFromTemplate([
        { label: 'clip', type: 'checkbox',click(){
            clip=!clip
        },checked:true },
        { label: 'about', type: 'checkbox' },
        { label: 'exit'}
    ])
    tray.setToolTip('图图识字')
    tray.setContextMenu(contextMenu)
    globalShortcut.register('CmdOrCtrl+Shift+V', captureScreen)
}


function createCaptureWindow() {
    // 创建浏览器窗口，只允许创建一个
    if(win)return console.info('只能有一个CaptureWindow')
    const { screen } = require('electron') //因为ready才可以引入
    let { width, height } = screen.getPrimaryDisplay().bounds
    win = new BrowserWindow({ 
        // window 使用 fullscreen,  mac 设置为 undefined, 不可为 false
        fullscreen: process.platform !== 'darwin' || undefined, // win
        width,
        height,
        x: 0,
        y: 0,
        transparent: true,
        frame: false,
        skipTaskbar: true,
        autoHideMenuBar: true,
        movable: false,
        resizable: false,
        enableLargerThanScreen: true, // mac
        hasShadow: false,
    })

    win.setAlwaysOnTop(true, 'screen-saver') // mac
    win.setVisibleOnAllWorkspaces(true) // mac
    win.setFullScreenable(false) // mac


    // 然后加载应用的 index.html。
    win.loadFile(path.join(__dirname,'../index.html'))

    // 打开开发者工具
    win.webContents.openDevTools()

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null
    })

    globalShortcut.register('Esc', () => {
        if (win) {
            win.close()
            win = null
        }
    })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createTray)


// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (win === null) {
        createCaptureWindow()
    }
})

function captureScreen(){
    if(clip){
        createCaptureWindow()
    }
}

ipcMain.on('clip-page', (event, {type,msg}) => {
    if(type==='close'){
        if (win) {
            win.close()
            win = null
        }
    }
    
})