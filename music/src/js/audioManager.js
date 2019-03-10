(function($,root){
    var $scope = $(document.body);
    function audioManager(){
        this.audio = new Audio();
        this.status = "pause";
        // this.bindEvent();
    }  
    audioManager.prototype = {
        //绑定监听歌曲是否播放完成事件
        bindEvent:function(){
            $(this.audio).on("ended",function(){
                $scope.find(".next-btn").trigger("click");
            }) 
        },
        //播放
        play : function(){
            this.audio.play();
            this.status = "play";
        },
        //暂停
        pause : function(){
            this.audio.pause();
            this.status = "pause";
        },
        //加载音频
        setAudioSource : function(src){
            this.audio.src = src;
            this.audio.load();
        },
        //跳到对应播放位置
        jumpToplay : function(time){
            
            this.audio.currentTime = time;
            this.play();

        }   
    }
    root.audioManager = audioManager;
})(window.Zepto,window.player || (window.player ={}))