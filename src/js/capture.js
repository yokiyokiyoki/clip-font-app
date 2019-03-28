const { ipcRenderer, clipboard, nativeImage, remote, desktopCapturer, screen } = require('electron')
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
})
