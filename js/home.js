var MAC = {
    'Url': document.URL,
    'Title': document.title,
    'UserAgent': function () {
        var ua = navigator.userAgent;//navigator.appVersion
        return {
            'mobile': !!ua.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            'ios': !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            'android': ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1, //android终端或者uc浏览器
            'iPhone': ua.indexOf('iPhone') > -1 || ua.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            'iPad': ua.indexOf('iPad') > -1, //是否iPad
            'trident': ua.indexOf('Trident') > -1, //IE内核
            'presto': ua.indexOf('Presto') > -1, //opera内核
            'webKit': ua.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            'gecko': ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') == -1, //火狐内核
            'weixin': ua.indexOf('MicroMessenger') > -1 //是否微信 ua.match(/MicroMessenger/i) == "micromessenger",
        };
    }(),
    'Copy': function (s) {
        if (window.clipboardData) {
            window.clipboardData.setData("Text", s);
        } else {
            if ($("#mac_flash_copy").get(0) == undefined) {
                $('<div id="mac_flash_copy"></div>');
            } else {
                $('#mac_flash_copy').html('');
            }
            $('#mac_flash_copy').html('<embed src=' +  '"images/_clipboard.swf" FlashVars="clipboard=' + escape(s) + '" width="0" height="0" type="application/x-shockwave-flash"></embed>');
        }
        MAC.Pop.Msg(100, 20, '复制成功', 1000);
    },
    'Home': function (o, u) {
        try {
            o.style.behavior = 'url(#default#homepage)';
            o.setHomePage(u);
        } catch (e) {
            if (window.netscape) {
                try {
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                } catch (e) {
                    MAC.Pop.Msg(150, 40, '此操作被浏览器拒绝！请手动设置', 1000);
                }
                var moz = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
                moz.setCharPref('browser.startup.homepage', u);
            }
        }
    },
    'Fav': function (u, s) {
        try {
            window.external.addFavorite(u, s);
        } catch (e) {
            try {
                window.sidebar.addPanel(s, u, "");
            } catch (e) {
                MAC.Pop.Msg(150, 40, '加入收藏出错，请使用键盘Ctrl+D进行添加', 1000);
            }
        }
    },
    'Open': function (u, w, h) {
        window.open(u, 'macopen1', 'toolbars=0, scrollbars=0, location=0, statusbars=0,menubars=0,resizable=yes,width=' + w + ',height=' + h + '');
    },
    'Cookie': {
        'Set': function (name, value, days) {
            var exp = new Date();
            exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            localStorage.setItem(name,encodeURIComponent(value))
            // document.cookie = name + "=" + encodeURIComponent(value) + ";path=/;expires=" + exp.toUTCString();
        },
        'Get': function (name) {
            localStorage.getItem(name)
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr != null) {
                return decodeURIComponent(arr[2]);
                return null;
            }
        },
        'Del': function (name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = this.Get(name);
            if (cval != null) {
                document.cookie = name + "=" + encodeURIComponent(cval) + ";path=/;expires=" + exp.toUTCString();
            }
            localStorage.removeItem(name)
        }
    },
    'GoBack': function () {
        var ldghost = document.domain;
        if (document.referrer.indexOf(ldghost) > 0) {
            history.back();
        } else {
            window.location = "//" + ldghost;
        }
    },
    'CheckBox': {
        'All': function (n) {
            $("input[name='" + n + "']").each(function () {
                this.checked = true;
            });
        },
        'Other': function (n) {
            $("input[name='" + n + "']").each(function () {
                this.checked = !this.checked;
            });
        },
        'Count': function (n) {
            var res = 0;
            $("input[name='" + n + "']").each(function () {
                if (this.checked) {
                    res++;
                }
            });
            return res;
        },
        'Ids': function (n) {
            var res = [];
            $("input[name='" + n + "']").each(function () {
                if (this.checked) {
                    res.push(this.value);
                }
            });
            return res.join(",");
        }
    },
    'Image': {
        'Lazyload': {
            'Show': function () {
                try {
                    $("img.lazy").lazy_load();
                } catch (e) {
                }
                ;
            },
            'Box': function ($id) {
                $("img.lazy").lazy_load({
                    container: $("#" + $id)
                });
            }
        }
    },
    'Ding': {
        'Init': function () {
            $('body').on('click', '.ding_link', function (e) {
                var $that = $(this);
                if ($that.attr("data-id")) {

                    VideoTheme.Ajax( '/video/ding.html?id=' + $that.attr("data-id") +'&type='+$that.attr("data-type"), 'get', 'json', '', function (r) {
                        $that.addClass('disabled');
                        if (r.code == 1) {
                            $that.find('.ding_num').html(parseInt($that.find('.ding_num').html())+1);
                        } else {
                            layer.msg(r.msg);
                        }
                    });

                }
            });
        }
    },
    'Gbook': {
        'Login': 0,
        'Verify': 0,
        'Init': function () {
            $('body').on('keyup', '.message_content', function (e) {
                MAC.Remaining($(this), 200, '.message_remaining')
            });
            $('body').on('focus', '.message_content', function (e) {
                if (MAC.Gbook.Login == 1 && MAC.User.IsLogin != 1) {
                    MAC.User.Login();
                }
            });
            $('body').on('click', '.message_submit', function (e) {
                MAC.Gbook.Submit();
            });
        },
        'Show': function ($page) {
            VideoTheme.Ajax( '/message/index?page=' + $page, 'post', 'json', '', function (r) {
                $(".mac_message_box").html(r);
            }, function () {
                $(".mac_message_box").html('留言加载失败，请刷新...');
            });
        },
        'Submit': function () {
            if ($(".message_content").val() == '') {
                MAC.Pop.Msg(100, 20, '请输入您的留言!', 1000);
                return false;
            }
            VideoTheme.Ajax( '/message/saveData', 'post', 'json', $('.message_form').serialize(), function (r) {
                MAC.Pop.Msg(100, 20, r.msg, 1000);
                if (r.code == 1) {
                    location.reload();
                } else {
                    if (MAC.Gbook.Verify == 1) {
                        MAC.Verify.Refresh();
                    }
                }
            });
        },
        'Report': function (name, id) {
            MAC.Pop.Show(400, 300, '数据报错',  '/message/report.html?id=' + id + '&name=' + encodeURIComponent(name), function (r) {

            });
        }
    },
    'Search': {
        'Init': function () {
            $('.mac_search').click(function () {
                var that = $(this);
                var url = that.attr('data-href') ? that.attr('data-href') :  '/index.php/vod/search.html';
                location.href = url + '?wd=' + encodeURIComponent($("#wd").val());
            });
        },
        'Submit': function () {

            return false;
        }
    },

    'Ulog': {
        'Init': function () {
            MAC.Ulog.Set();
            MAC.Ulog.Click();

        },
        'Get': function (mid, id, type, page, limit, call) {
            VideoTheme.Ajax( '/index.php/user/ajax_ulog/?ac=list&mid=' + mid + '&id=' + id + '&type=' + type + '&page=' + page + '&limit=' + limit, 'get', 'json', '', call);
        },
        'Set': function () {
            if ($(".mac_ulog_set").attr('data-mid')) {
                var $that = $(".mac_ulog_set");
                $.get( '/index.php/user/ajax_ulog/?ac=set&mid=' + $that.attr("data-mid") + '&id=' + $that.attr("data-id") + '&sid=' + $that.attr("data-sid") + '&nid=' + $that.attr("data-nid") + '&type=' + $that.attr("data-type"));
            }
        },
        'Click': function () {
            $('body').on('click', 'a.mac_ulog', function (e) {

                //是否需要验证登录
                if (VideoCms.User.IsLogin == 0) {
                    VideoCms.User.Login();
                    return;
                }

                var $that = $(this);
                if ($that.attr("data-id")) {
                    VideoTheme.Ajax( '/index.php/user/ajax_ulog/?ac=set&mid=' + $that.attr("data-mid") + '&id=' + $that.attr("data-id") + '&type=' + $that.attr("data-type"), 'get', 'json', '', function (r) {
                        MAC.Pop.Msg(100, 20, r.msg, 1000);
                        if (r.code == 1) {
                            $that.addClass('disabled');
                        } else {
                            $that.attr('title', r.msg);
                        }
                    });
                }
            });
        }
    },

    'Pop': {
        'Remove': function () {
            $('.mac_pop_bg').remove();
            $('.mac_pop').remove();
        },
        'RemoveMsg': function () {
            $('.mac_pop_msg_bg').remove();
            $('.mac_pop_msg').remove();
        },
        'Msg': function ($w, $h, $msg, $timeout) {
            if ($('.mac_pop_bg').length != 1) {
                MAC.Pop.Remove();
            }
            $('body').append('<div class="mac_pop_msg_bg"></div><div class="mac_pop_msg"><div class="pop-msg"></div></div>');
            $('.mac_pop_msg .pop_close').click(function () {
                $('.mac_pop_msg').remove();
            });

            $('.mac_pop_msg').width($w);
            $('.mac_pop_msg').height($h);
            $('.mac_pop_msg .pop-msg').html($msg);
            $('.mac_pop_msg_bg,.mac_pop_msg').show();
            setTimeout(MAC.Pop.RemoveMsg, $timeout);
        },
        'Show': function ($w, $h, $title, $url, $callback) {
            if ($('.mac_pop_bg').length != 1) {
                MAC.Pop.Remove();
            }

            $('body').append('<div class="mac_pop_bg"></div><div class="mac_pop"><div class="pop_top"><h2></h2><span class="pop_close">Ｘ</span></div><div class="pop_content"></div></div>');
            $('.mac_pop .pop_close').click(function () {
                $('.mac_pop_bg,.mac_pop').remove();
            });

            $('.mac_pop').width($w);
            $('.mac_pop').height($h);
            $('.pop_content').html('');
            $('.pop_top').find('h2').html($title);

            VideoTheme.Ajax($url, 'post', 'json', '', function (r) {
                $(".pop_content").html(r);
                $callback(r);
            }, function () {
                $(".pop_content").html('加载失败，请刷新...');
            });

            $('.mac_pop_bg,.mac_pop').show();
        }
    },
    'Remaining': function (obj, len, show) {
        var count = len - $(obj).val().length;
        if (count < 0) {
            count = 0;
            $(obj).val($(obj).val().substr(0, 200));
        }
        $(show).text(count);
    }
};

$(function(){
    //顶和踩初始化
    MAC.Ding.Init();
    //用户访问记录初始化
    //MAC.Ulog.Init();
});
function SelectTag(t) {
    this.child = t.child || ".btn",
        this.over = t.over || "btn-warm",
        this.all = t.all || ".all",
        this.init()
}
$.extend(SelectTag.prototype, {
    init: function() {
        var t = this;
        t._bindEvent(),
            t._select()
    },
    _bindEvent: function() {
        var t = this;
        $(t.child).click(function(e) {
            if($(this).attr("class").indexOf("text-muted") != -1){
                return;
            }
            e.preventDefault();
            var i = window.location.href , n = $(this).attr("rel") , r = $(this).attr("name");
            $(this).hasClass(t.over) || (window.location.href = t._changeURLPar(i, r, n))
        }),
            $(t.all).click(function(e) {
                e.preventDefault();
                var i = window.location.href , n = $(this).attr("name");
                $("[name=" + n + "]").removeClass(t.over), $(this).addClass(t.over), window.location.href = t._delUrlPar(i, n)
            })
    },
    _delUrlPar: function(t, e) {
        var n = "";
        if (t.indexOf("?") == -1)
            return t;
        n = t.substr(t.indexOf("?") + 1);
        var r = "" , a = "";
        if (n.indexOf("&") != -1) {
            r = n.split("&");
            for (i in r)
                r[i].split("=")[0] != e && (a = a + r[i].split("=")[0] + "=" + r[i].split("=")[1] + "&");
            return t.substr(0, t.indexOf("?")) + "?" + a.substr(0, a.length - 1)
        }
        return r = n.split("="), r[0] == e ? t.substr(0, t.indexOf("?")) : t
    },
    _changeURLPar: function(t, e, i) {
        var n = this , r = e + "=([^&]*)" , a = e + "=" + i , s = encodeURI(n._getQueryString(e));
        return t.match(r) ? t = t.replace(s, i) : t.match("[?]") ? t + "&" + a : t + "?" + a
    },
    _getQueryString: function(t) {
        var e = new RegExp("(^|&)" + t + "=([^&]*)(&|$)","i") , i = window.location.search.substr(1).match(e);
        return null != i ? decodeURI(i[2]) : null
    },
    _select: function() {
        var t = this , e = window.location.href;
        $(t.child).each(function() {
            var i = $(this).attr("name") + "=" + $(this).attr("rel")  , n = new RegExp(encodeURI(i),"g");
            if (n.test(e)) {
                $(this).addClass(t.over);
                var r = $(this).attr("name");
                $("[name=" + r + "]").eq(0).removeClass(t.over)
            } else if($(this).attr("class").indexOf("all") <0){
                $(this).removeClass(t.over)
            }
        })
    }
});
