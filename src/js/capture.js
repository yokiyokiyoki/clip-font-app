const {  desktopCapturer, screen } = require('electron')
const { bounds: { width, height } } = screen.getPrimaryDisplay()

import Draw from "./draw"

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





