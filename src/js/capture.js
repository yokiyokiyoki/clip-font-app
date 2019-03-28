const { ipcRenderer, clipboard, nativeImage, remote, desktopCapturer, screen } = require('electron')

//screen.getPrimaryDisplay() 可以获取主屏幕的大小和缩放比例, 缩放比例在高分屏中适用, 在高分屏中屏幕的物理尺寸和窗口尺寸并不一致, 一般会有2倍3倍等缩放倍数, 所以为了获取到高清的屏幕截图, 需要在屏幕尺寸基础上乘以缩放倍数
const { bounds: { width, height }, scaleFactor } = screen.getPrimaryDisplay()

desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: {
        width: width * scaleFactor,
        height: height * scaleFactor,
    }
}, (error, sources) => {
    let imgSrc = sources[0].thumbnail.toDataURL()
    console.log(sources,imgSrc)
    if (error) return console.log(error)

    const $canvas=document.querySelector('.image-canvas')
    let ctx = $canvas.getContext('2d');
    // startX, startY 为鼠标点击时初始坐标
    // diffX, diffY 为鼠标初始坐标与 box 左上角坐标之差，用于拖动
    let startX, startY, diffX, diffY;
    // 是否拖动，初始为 false
    let dragging = false;
          
    // 鼠标按下
    document.onmousedown = function(e) {
        startX = e.pageX;
        startY = e.pageY;
          
        // 允许拖动
        dragging = true;
          
        
        console.log(startX,startY,diffX,diffY,scaleFactor)
    };
           
    // 鼠标移动
    document.onmousemove = function(e) {
        if(dragging){
            // 计算坐标差值
            diffX = startX - e.target.offsetLeft;
            diffY = startY - e.target.offsetTop;
            console.log(startX,startY,diffX,diffY)
            
            let margin = 7
            let radius = 5
            $canvas.height=diffY* scaleFactor
            $canvas.width=diffX* scaleFactor
            $canvas.style.left=`${startX- margin}px`
            $canvas.style.top=`${startY- margin}px`
            $canvas.style.display='block'
            ctx.fillStyle = '#ffffff'
            ctx.strokeStyle = '#67bade'
            ctx.lineWidth = 2*scaleFactor
            ctx.strokeRect(0, 0, diffX* scaleFactor, diffY* scaleFactor);
        }
    };
           
    // 鼠标抬起
    document.onmouseup = function(e) {
        // 禁止拖动
        dragging = false;
        
    };
    console.log($canvas)
})





