const { app, BrowserWindow } = require("electron");

// 创建窗口
function createWindow(){
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        // 配置一些参数，方便进行模块引用
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false,
        }
    })

    // 加载文件
    win.loadFile("index.html")

    // 打开开发者工具
    win.webContents.openDevTools();
}

app.whenReady().then(()=>{
    createWindow();

    app.on('active',function(){
        if(BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})

// 关闭窗口
app.on('window-all-closed',function(){
    if(process.platform !== 'darwin') app.quit();
})