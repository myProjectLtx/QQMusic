(function($,root){
    var $scope = $(document.body);
    console.log(root)
    //渲染当前这首歌的信息
    function renderInfo(info){
        var html = '<div class="song-name">'+info.song+'</div>'+
        '<div class="singer-name">'+info.singer+'</div>'+
        '<div class="album-name">'+info.album+'</div>';
        $scope.find(".song-info").html(html)
    }
    //渲染当前这首歌的图片
    function renderImg(src){
        var img = new Image();
        img.onload = function(){
            root.blurImg(img,$scope); //高斯模糊（要修改的图片，被作用的位置）
            $scope.find(".song-img img").attr("src",src)
        }
        img.src = src;
    }
    //判断数据内是否被标记喜欢
    function renderIsLike(isLike){
        if(isLike){
            $scope.find(".like-btn").addClass("liking");
        }else{
            $scope.find(".like-btn").removeClass("liking");
            
        }
    }
    root.render = function(data){
        renderInfo(data);
        renderImg(data.image);
        renderIsLike(data.isLike)
    }
})(window.Zepto,window.player || (window.player = {}))