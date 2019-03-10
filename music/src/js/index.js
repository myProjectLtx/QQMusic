var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body);
var songList;                                      //数据列表
var controlmanager;                                //{index:当前播放音频，len:数据长度}
var timer
var audio = new root.audioManager();               //当前音频对应的对象
function bindClick(){
    $scope.on("play:change",function(event,index,flag){   //自定义事件
        audio.setAudioSource(songList[index].audio);      //加载音频
        if(audio.status == "play"||flag){                 //是播放状态
            rotated(0);                                   //旋转角度为0
            audio.play();                                 
            root.processor.start();                       //开始计时
        }
        $('.img-wrapper').attr('data-deg',0);
        $('.img-wrapper').css({
            'transform':'rotateZ(0deg)',
            'transition':'none'
        })
        root.processor.renderAllTime(songList[index].duration)  //音频总时间
        root.render(songList[index]);
        root.processor.updata(0);                               //更新左侧时间和进度条位置
    })
    //移动端click有300ms延迟
    $scope.on("click",".prev-btn",function(){
        var index = controlmanager.prev();                      //点击前进按钮
        $scope.trigger("play:change",index);
    })
    $scope.on("click",".next-btn",function(){                   //点击后退按钮
        var index = controlmanager.next();
        $scope.trigger("play:change",index);
    })
    $scope.on("click",".play-btn",function(){                   //点击播放按钮
        if(audio.status == "play"){                             
            audio.pause();                                      
            clearInterval(timer);                               
            root.processor.stop();                              //计时停止
        }else{
            root.processor.start();                             //计时开始
            audio.play();                                       
            var deg = $('.img-wrapper').attr('data-deg');       //获取圆盘图片旋转角度
            rotated(deg)
        }
        $(this).toggleClass("playing");                         
    })
    $scope.on("click",".list-btn",function(){                   //点击歌单列表按钮
        root.playList.show(controlmanager);                     //展示歌单列表
    })
}
function bindTouch(){
    var $slidePoint = $scope.find(".slider-point");
    var offset = $scope.find(".pro-wrapper").offset();
    var left = offset.left;
    var width = offset.width;
    //绑定拖拽事件 开始拖拽 ： 取消进度条渲染
    $slidePoint.on("touchstart",function(){
        root.processor.stop();
    }).on("touchmove",function(e){
        //计算拖拽的百分比 更新我们的当前时间和进度条
        var x = e.changedTouches[0].clientX;
        var percent = (x - left) / width;
        if(percent > 1 || percent < 0){
            percent = 0;
        }
        root.processor.updata(percent)
    }).on("touchend",function(e){
        //计算百分百 跳转播放 重新开始进度条渲染 
        var x = e.changedTouches[0].clientX;
        var percent = (x - left) / width;
        if(percent > 1 || percent < 0){
            percent = 0;
        }
        var curDuration = songList[controlmanager.index].duration;
        var curTime = curDuration * percent;
        audio.jumpToplay(curTime);
        root.processor.start(percent);
        $scope.find(".play-btn").addClass("playing");
    })
}
//获取数据
function getData(url){
    $.ajax({
        type : "GET",
        url : url,
        success : function(data){
            bindClick();
            bindTouch();
            root.playList.renderList(data);
            controlmanager = new root.controlManager(data.length);
            songList = data;
            $scope.trigger("play:change",0);
            
        },
        error : function(){
            console.log("error")
        }
    })
    
}
//圆盘旋转角度
function rotated(deg){
    clearInterval(timer);
    deg = +deg
    timer = setInterval(function(){
        deg += 2;
        $('.img-wrapper').attr('data-deg',deg);
        $('.img-wrapper').css({
            'transform':'rotateZ(' + deg + 'deg)',
            'transition':'all 1s ease-out'
        })
    },200);
}
getData("../mock/data.json")