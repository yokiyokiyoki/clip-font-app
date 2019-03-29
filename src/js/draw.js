/** 
 * 绘制类
 * ScreenImgUrl是整个屏幕base64格式的快照
 * bg是背景dom
 * width是屏幕宽高
 * rect是选区canvas
 * sizeInfo 尺寸信息容器
 * toolbar 工具栏
*/
class Draw{
    constructor(screenImgUrl,bg,screenWidth,screenHeight,rect,sizeInfo,toolbar){
        this.screenImgUrl=screenImgUrl
        this.screenWidth=screenWidth
        this.screenHeight=screenHeight

        this.$bgDOM=bg
        //背景图数据存在canvas里面
        this.$bgCanvas
        this.$bgCtx
        this.initFullScreenCanvas()

        this.$rectDOM=rect
        this.$rectCtx= this.$rectDOM.getContext('2d');

        this.$sizeInfoDom=sizeInfo
        this.$toolbarDom=toolbar

        //存储位置，矩形宽高,是否可画等meta信息
        this.selectRectMeta={
            x:0, //canvas最终的left
            y:0, //canvas最终的top
            startX:0,//鼠标一开始点那个点，e.pageX
            startY:0,//鼠标一开始点那个点，e.pageY
            w:0, //向量，宽，为负说明在startX的左边
            h:0, //向量，高，为负说明在startY的左边
            drawing:false,//是否可画，mousedown为true，mouseup为false
            dragging:false,//是否可拖拽
        }

        //绑定this到原型链上,方便使用
        this.getMouseMeta=this.getMouseMeta.bind(this)
        this.setSizeInfo=this.setSizeInfo.bind(this)
    }

    //记录屏幕快照，并赋值给背景
    async initFullScreenCanvas(){
        //用backgroundSize限定，否则append图片会伸缩
        this.$bgDOM.style.backgroundImage = `url(${this.screenImgUrl})`
        this.$bgDOM.style.backgroundSize = `${this.screenWidth}px ${this.screenHeight}px`
    
        //创建新的canvas上下文作为存储，方便取出里面的imgData
        this.$bgCanvas = document.createElement('canvas')
        this.$bgCtx =  this.$bgCanvas.getContext('2d')

        //新建一个图片，用来放进canvas存图片数据
        let img = await new Promise(resolve => {
            let img = new Image()
            img.src = this.screenImgUrl
            if (img.complete) {
                resolve(img)
            } else {
                img.onload = () => resolve(img)
            }
        })
    
        this.$bgCanvas.width = width
        this.$bgCanvas.height = height
        this.$bgCtx.drawImage(img, 0, 0)
    }

    //开始按下，对应mousedown事件
    startRect(e){
        this.drawing=true

        //鼠标按下的定点坐标
        this.selectRectMeta.startX = e.pageX;
        this.selectRectMeta.startY = e.pageY;
    }
    
    //正在画矩形选区，对应mousemove
    drawingRect(e){
        if(!this.drawing)return
        

        this.getMouseMeta(e)

        //宽高需赋值绝对值为正
        this.$rectDOM.width=Math.abs(this.selectRectMeta.w)
        this.$rectDOM.height=Math.abs(this.selectRectMeta.h)
        
        
        this.$rectDOM.style.left=`${this.selectRectMeta.x}px`
        this.$rectDOM.style.top=`${this.selectRectMeta.y}px`
        
        //没有拉伸距离会报错
        if(!this.selectRectMeta.w||!this.selectRectMeta.h) return 
        //获取矩形坐标在整个fullscreen的位置，生成imageData传入回矩形选区
        let imageData = this.$bgCtx.getImageData(this.selectRectMeta.x , this.selectRectMeta.y , Math.abs(this.selectRectMeta.w) , Math.abs(this.selectRectMeta.h) )
        this.$rectCtx.putImageData(imageData, 0 ,0 )

        this.$rectCtx.fillStyle = 'white'
        this.$rectCtx.strokeStyle = 'black'
        this.$rectCtx.lineWidth = 2
        
        this.$rectCtx.strokeRect(0 ,0 , Math.abs(this.selectRectMeta.w), Math.abs(this.selectRectMeta.h));

        this.$rectDOM.style.display='block'

        //尺寸信息
        this.setSizeInfo()
    }

    getMouseMeta(e){
        // 计算坐标差值（宽高）
        this.selectRectMeta.w = e.pageX-this.selectRectMeta.startX ;
        this.selectRectMeta.h = e.pageY-this.selectRectMeta.startY;
        
        //计算真正的x，y坐标，根据距离在鼠标定点的左右来判断，即大于0
        if(this.selectRectMeta.w>0){
            this.selectRectMeta.x=this.selectRectMeta.startX 
        }else{
            this.selectRectMeta.x=e.pageX
        }

        if(this.selectRectMeta.h>0){
            this.selectRectMeta.y=this.selectRectMeta.startY
        }else{
            this.selectRectMeta.y=e.pageY
        }
        
    }

    //画完，对应mouseup事件
    endRect(e){
        this.drawing=false
    }

    //设置size-info，就是取宽高
    setSizeInfo(){
        this.$sizeInfoDom.style.display='block'
        this.$sizeInfoDom.style.left=`${this.selectRectMeta.x}px`
        this.$sizeInfoDom.style.top=`${this.selectRectMeta.y-25}px`
        this.$sizeInfoDom.innerHTML=`${Math.abs(this.selectRectMeta.w)}*${Math.abs(this.selectRectMeta.h)}`
    }
}
exports.Draw=Draw
