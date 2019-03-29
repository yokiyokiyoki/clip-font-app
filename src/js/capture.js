const { ipcRenderer, clipboard, nativeImage, remote, desktopCapturer, screen } = require('electron')

//screen.getPrimaryDisplay() 可以获取主屏幕的大小和缩放比例, 缩放比例在高分屏中适用, 在高分屏中屏幕的物理尺寸和窗口尺寸并不一致, 一般会有2倍3倍等缩放倍数, 所以为了获取到高清的屏幕截图, 需要在屏幕尺寸基础上乘以缩放倍数
const { bounds: { width, height }, scaleFactor } = screen.getPrimaryDisplay()

desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: {
        width: width * scaleFactor,
        height: height * scaleFactor,
    }
}, async(error, sources) => {
    if (error) return console.log(error)
    let imgSrc = sources[0].thumbnail.toDataURL()
    
    //先保存一份全屏的截图到canvas里面
    let fullScreenCtx=await initFullScreenCanvas(document.querySelector('.bg'),imgSrc)
    
    console.log(sources,imgSrc)
    const $canvas=document.querySelector('.image-canvas')
    let ctx = $canvas.getContext('2d');
    // startX, startY 为鼠标点击时初始坐标
    // diffX, diffY 为鼠标初始坐标与 box 左上角坐标之差，用于拖动
    let startX, startY, diffX, diffY;
    // 是否拖动，初始为 false
    let dragging = false;
          
    // 鼠标按下
    document.onmousedown = function(e) {
        //鼠标按下的定点坐标
        startX = e.pageX;
        startY = e.pageY;
          
        // 允许拖动
        dragging = true;
          
        
        console.log(startX,startY,diffX,diffY,scaleFactor)
    };
           
    // 鼠标移动
    document.onmousemove = function(e) {
        e.stopPropagation()
        e.preventDefault()
        if(dragging){
            // 计算坐标差值（宽高）
            diffX = e.pageX-startX ;
            diffY = e.pageY-startY;
            //没有拉伸距离会报错
            if(!diffY||!diffX)return
            let x,y
            //计算真正的x，y坐标，根据距离在鼠标定点的左右来判断，即大于0
            if(diffX>0){
                startX 
            }else{
                x=e.pageX
            }

            if(diffY>0){
                y=startY
            }else{
                y=e.pageY
            }
            
            //外层canvas距离是7px
            let margin = 7
            let radius = 5

            //宽高需赋值绝对值为正
            $canvas.height=(Math.abs(diffY)+ margin * 2)
            $canvas.width=(Math.abs(diffX) + margin * 2)
            
            $canvas.style.left=`${x- margin}px`
            $canvas.style.top=`${y- margin}px`
            
            $canvas.style.display='block'
            
            
            //获取矩形坐标在整个fullscreen的位置，生成imageData传入回矩形
            let imageData = fullScreenCtx.getImageData(startX , startY , Math.abs(diffX)*scaleFactor , Math.abs(diffY)*scaleFactor )
            ctx.putImageData(imageData, margin , margin )

            ctx.fillStyle = '#ffffff'
            ctx.strokeStyle = '#67bade'
            ctx.lineWidth = 2*scaleFactor
            
            ctx.strokeRect(margin ,margin , Math.abs(diffX), Math.abs(diffY));

            // console.log(startX,startY,diffX,diffY,fullScreenCtx,imageData)
            console.log(startX,startY,imageData)
            
        }
    };
           
    // 鼠标抬起
    document.onmouseup = function(e) {
        // 禁止拖动
        dragging = false;
        
    };
    console.log($canvas)
})




async function initFullScreenCanvas($bg,imageSrc){
    $bg.style.backgroundImage = `url(${imageSrc})`
    $bg.style.backgroundSize = `${width}px ${height}px`
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    let img = await new Promise(resolve => {
        let img = new Image()
        img.src = imageSrc
        if (img.complete) {
            resolve(img)
        } else {
            img.onload = () => resolve(img)
        }
    })

    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)

    return ctx;
}
