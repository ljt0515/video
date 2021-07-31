var MacPlayer = {
    Play: function() {
        document.write('<style>.MacPlayer{background: #000000;font-size:14px;color:#F6F6F6;margin:0px;padding:0px;position:relative;overflow:hidden;width:100%;height:100%;min-heigh:300px;}.MacPlayer table{width:100%;height:100%;}.MacPlayer #playleft{position:inherit;!important;width:100%;height:100%;}</style><div class="MacPlayer">' + '<iframe id="buffer" src="" frameBorder="0" scrolling="no" width="100%" height="100%" style="position:absolute;z-index:99998;"></iframe><iframe id="install" src="" frameBorder="0" scrolling="no" width="100%" height="100%" style="position:absolute;z-index:99998;display:none;"></iframe>' + '<table border="0" cellpadding="0" cellspacing="0"><tr><td id="playleft" valign="top" style="">&nbsp;</td></table></div>');
        this.Height = $(".MacPlayer").get(0).offsetHeight;
        this.Width = $(".MacPlayer").get(0).offsetWidth;
    },
    Init: function() {

        this.Link = decodeURIComponent(player_data.link);
        // VideoTheme.Ajax( '/video/Jiexi.html?url='+player_data.url,'get','json','',function(r){
        //     this.PlayUrl = r.data
        // });
        this.PlayId =player_data.id
        this.PlayIndex = player_data.index
        this.PlayUrl = player_data.url
        if(player_data.index+2<=player_data.length){
            this.next="/video/play/"+player_data.id+"-"+(player_data.index1+1)+"-"+(player_data.index+2)+".html"
        }
        MacPlayer.Play();
    },
    Seek: {
        Set: function (seek) {
            var key = player_data.index;
            var data = {}
            data[key]=Math.floor(seek)
            VideoTheme.LocalStorage.Set('video_player_' + player_data.id,data,7);
        },
        Get: function () {
            var cookieTime = VideoTheme.LocalStorage.Get('video_player_' + player_data.id)[player_data.index]; //调用已记录的time
            if(!cookieTime || cookieTime == undefined) { //如果没有记录值，则设置时间0开始播放
                cookieTime = 0;
            }
            return cookieTime;
        },
        Del: function () {
            localStorage.removeItem('video_player_' + player_data.id)
            if(player_data.index+2<=player_data.length){
                location.href="/video/play/"+player_data.id+"-"+(player_data.index1+1)+"-"+(player_data.index+2)+".html"
            }
        }
    }
};
MacPlayer.Init();