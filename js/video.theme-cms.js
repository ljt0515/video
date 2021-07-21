var VideoCms = {
	'Comment': {
		'Init':function(){
			$('body').on('click', '.my_comment_submit', function(e){
		        if($("#content").val() === ''){
	                layer.msg("请输入评论内容");
	                return false;
	           }
		        VideoCms.Comment.Submit();
			});
			$('body').on('click', '.my_comment_report', function(e){
                var $that = $(this);
                if($(this).attr("data-id")){
                    VideoTheme.Ajax( '/comment/report.html?id='+$that.attr("data-id"),'get','json','',function(r){
                        $that.addClass('disabled');                       
                        layer.msg(r.msg);
                    });
                }
            });
			$('body').on('click', '.my_comment_reply', function(e){
                var $that = $(this);
                if($that.attr("data-id")){
                    var str = $that.html();
                    $('.comment_reply_form').remove();
                    if (str == '取消回复') {
                        $that.html('回复');
                        return false;
                    }
                    if (str == '回复') {
                        $('.my_comment_reply').html('回复');
                    }
                    var html = $('.comment_form').prop("outerHTML");

                    var oo = $(html);
                    oo.addClass('comment_reply_form');
                    oo.find('input[name="comment_pid"]').val( $that.attr("data-id") );

                    $that.parent().after(oo);
                    $that.html('取消回复');
                }
            });
			$('body').on('click', '.comment_ding_link', function (e) {
				var $that = $(this);
				if ($that.attr("data-id")) {

					VideoTheme.Ajax( '/comment/ding.html?id=' + $that.attr("data-id") +'&'+ '&type='+$that.attr("data-type"), 'get', 'json', '', function (r) {
						$that.addClass('disabled');
						if (r.code === 1) {
							$that.find('.ding_num').html(parseInt($that.find('.ding_num').html())+1);
						} else {
							layer.msg(r.msg);
						}
					});

				}
			});
		},
		'Show':function($page){
			VideoTheme.Ajax( '/comment/ajax.html?videoId='+$('.video_ui_comment').attr('data-id') +'&page='+$page,'get','html','',function(r){
			    $(".video_ui_comment").html(r);
			},function(){
			    $(".video_ui_comment").html('<p class="text-center"><a href="javascript:void(0)" onclick="VideoCms.Comment.Show('+$page+');">评论加载失败，点击我刷新...</a></p>');
			});
        },
		'Submit':function(){
			MAC.Gbook.Verify=1
			VideoTheme.Ajax( '/comment/save.html','post','json',$(".comment_form").serialize() + '&videoId=' + $('.video_ui_comment').attr('data-id'),function(r){
	            if(r.code===1){
	            	layer.msg(r.msg,{anim:5},function(){
					    VideoCms.Comment.Show(1);
					});
		        } else {
		        	if(MAC.Gbook.Verify===1){
		           	 	$('.captcha-img').click();
		            }
		            layer.msg(r.msg);
		        }
	        });
		}
	},
	'Message': {
		'Init':function(){
			$('body').on('click', '.message_submit', function(e){
				if($(".message_data").val() === ''){
		            layer.msg("请输入留言内容");
		            return false;
		        }
				VideoCms.Message.Submit();
			});
			$(".message_submit").bind("keydown",function(e){
				// 兼容FF和IE和Opera
				var theEvent = e || window.event;
				var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
				if (code === 13) {
					//回车执行查询
					$(".message_submit").click();
				}
			});
		},
		'Submit':function(){
			MAC.Gbook.Verify=1
			VideoTheme.Ajax( '/message/save.html','post','json',$("#myform").serialize(),function(r){
	            if(r.code==1){ 
	            	layer.msg(r.msg,{anim:5},function(){
					    location.reload();
					});	            
		        } else {
		        	if(MAC.Message.Verify===1){
		           	 	$('.captcha-img').click();
		            }
		            layer.msg(r.msg);
		        }
	        });
		}
	},
	'Score':function(){
		var hadpingfen = 0;
		$("ul.rating li").each(function(i) {
			var $title = $(this).attr("title");
			var $lis = $("ul.rating li");
			var num = $(this).index();
			var n = num + 1;
			$(this).click(function () {
					if (hadpingfen > 0) {
						layer.msg('已经评分,请务重复评分');
					}
					else {
						$lis.removeClass("active");
						$("ul.rating li:lt(" + n + ")").find(".fa").addClass("fa-star").removeClass("fa-star-o");
						$("#ratewords").html($title);
						$.getJSON('/video/score.html?id='+$('#rating').attr('data-id')+'&score='+($(this).attr('val')*2), function (r) {
							if (parseInt(r.code) == 1) {
								layer.msg(r.msg);
								hadpingfen = 1;
							}
							else {
								hadpingfen = 1;
								layer.msg(r.msg);
							}
						});
					}
				}
			).hover(function () {
				this.myTitle = this.title;
				this.title = "";
				$(this).nextAll().find(".fa").addClass("fa-star-o").removeClass("fa-star");
				$(this).prevAll().find(".fa").addClass("fa-star").removeClass("fa-star-o");
				$(this).find(".fa").addClass("fa-star").removeClass("fa-star-o");
				$("#ratewords").html($title);
			}, function () {
				this.title = this.myTitle;
				$("ul.rating li:lt(" + n + ")").removeClass("hover");
			});
		});
	},
	'Autocomplete': function() {
		var searchWidth= $('#search').width();
		try {
			$('.search_wd').autocomplete( '/video/suggest.html?mid=1', {
			    resultsClass: "autocomplete-suggestions",
			    width: searchWidth, scrollHeight: 410, minChars: 1, matchSubset: 0, cacheLength: 10, multiple: false, matchContains: true, autoFill: false,
			    dataType: "json",
			    parse: function (r) {
			        if (r.code === 1) {
			        	$(".head-dropdown").hide();
			            var parsed = [];
			            $.each(r.data, function (index, row) {
			                row.url = r.url;
			                parsed[index] = {
			                    data: row
			                };
			            });
			            return parsed;
			        } else {
			            return {data: ''};
			        }
			    },
			    formatItem: function (row, i, max) {
			        return row.keyword;
			    },
			    formatResult: function (row, i, max) {
			        return row.keyword;
			    }
			}).result(function (event, data, formatted) {
			    $(this).val(data.name);
			    location.href = "/video/detail/"+data.videoId+".html";
			});
		}
		catch(e){}
	},
	'Favorite': function() {
		if($('.favorite').length>0){
			$('body').on('click', 'a.favorite', function(e){
				
		        var $that = $(this);
		        if($that.attr("data-id")){
		            $.ajax({
		                url: '/index.php/user/ajax_ulog/?ac=set&mid='+$that.attr("data-mid")+'&id='+$that.attr("data-id")+'&type='+$that.attr("data-type"),
		                cache: false,
		                dataType: 'json',
		                success: function($r){
		                	layer.msg($r.msg);
		                }
		            });
		        }
		    });
		}
	},

	'User': {
		'IsLogin': 0,
		'Login':function(){
			VideoTheme.Layer.Div('.ajax_login');
			$('body').on('click', '.login_form_submit', function(e){
				$(this).unbind('click');
				VideoTheme.Ajax( '/login.html','post','json',$('.mac_login_form').serialize(),function(r){
					layer.msg(r.msg);
					if(r.code === 1){
						layer.msg(r.msg,{anim:5},function(){
							location.reload();
						});
					}else{
						layer.msg(r.msg);
					}
				});
			});
		},
		'Logout': function () {
			VideoTheme.Ajax('/logout.html', 'get', 'json', '', function (r) {
				MAC.Pop.Msg(100, 20, r.msg, 1000);
				if (r.code === 1) {
					location.reload();
				}
			});
		}
	}
};

$(function(){	
	VideoCms.Comment.Init();
	VideoCms.Message.Init();
	VideoCms.Autocomplete();
	VideoCms.Favorite();
});
