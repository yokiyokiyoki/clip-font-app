const {  desktopCapturer, screen } = require('electron')
const { bounds: { width, height } } = screen.getPrimaryDisplay()
const path=require('path')

//这里需要注意一下’./draw.js‘，require会报错。这是因为.目录是根目录（通过path.resolve('.')发现）
// console.log(__dirname,Draw,path.resolve('.'))
// const {Draw} = require(`${__dirname}/src/js/draw.js`)
const {Draw} = require(`./src/js/draw.js`)


desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: {
        width, height
    }
}, async(error, sources) => {
    if (error) return console.log(error)
    let screenImgUrl = sources[0].thumbnail.toDataURL()
    
    let bg=document.querySelector('.bg')
    let rect=document.querySelector('.rect')
    let draw=new Draw(screenImgUrl,bg,width,height,rect)
    document.addEventListener('mousedown',draw.startRect.bind(draw))
    document.addEventListener('mousemove',draw.drawingRect.bind(draw))
    document.addEventListener('mouseup',draw.endRect.bind(draw))
})







