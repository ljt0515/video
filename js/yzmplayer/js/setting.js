var YZM = {
  versions: (function () {
    var u = navigator.userAgent,
      app = navigator.appVersion
    return {
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
      iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
      weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
      qq: u.match(/\sQQ/i) == ' qq', //是否QQ
    }
  })(),
  onLoadedDanmaku: function (dm) {
    $('.yzmplayer-watching-number').text(dm.watchnum)
    $('.danmuku-num').text(dm.dancount)
  },
  compare: function(i) {
    var o = function(n, t) {
      return n - t;
    };
    return function(n, t) {
      var e = n[i], r = t[i];
      return o(e, r);
    };
  },
  secret: function(n, t, e) {
    var i = "LSEHx";
    t = CryptoJS.MD5(t).toString();
    var o = CryptoJS.enc.Utf8.parse(t.substring(0, 16)), u = CryptoJS.enc.Utf8.parse(t.substring(16));
    if (e) {
       return CryptoJS.AES.decrypt(n, u, {
        iv: o,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);
    }
    return CryptoJS.AES.encrypt(n, u, {
      iv: o,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
  },
  start: function () {
    YZM.waittime = 1
    config.logo = '/static/upload/logo.png'
    up.pbgjz = '草,操,妈,逼,滚,网址,网站,支付宝,企,关注,wx,微信,qq,QQ,1,2,3,4,5,6,7,8,9,0,好卡,com,cn,top,net'
    up.trysee = '3'
    config.sendtime = '1'
    config.color = '#ff6429'
    config.group_x = null
    config.dmrule = 'javascript:void(0);'
    danmuon = 'on'
    // YZM.load();
    $.ajax({
      url: '/video/Parse.html?url='+parent.MacPlayer.PlayUrl,
      dataType: 'json',
      timeout:3000,
      success: function (e) {
        if(e.data.url =="") {
          $("body").html("<iframe border=\"0\" src=\"https://dmjx.m3u8.tv/?url=" + parent.MacPlayer.PlayUrl + "\" width=\"100%\" height=\"100%\"\n" +
              "                marginwidth=\"0\" framespacing=\"0\" marginheight=\"0\" frameborder=\"0\" scrolling=\"no\"\n" +
              "                   vspale=\"0\" noresize=\"\">\n </iframe>")
          return
        }

        if(e.data.pu===""){
          if(e.data.url.indexOf("http")!=-1){
            YZM.play(e.data.url)
          }else{
            var url = CryptoJS.AES.decrypt(e.data.url, CryptoJS.enc.Utf8.parse(CryptoJS.MD5("rXjWvXl6")), {
              iv:CryptoJS.enc.Utf8.parse('NXbHoWJbpsEOin8b'),
              mode:CryptoJS.mode.CBC,
              padding: CryptoJS.pad.ZeroPadding
            }).toString(CryptoJS.enc.Utf8);
            YZM.play(url)
          }
        }else{
          var _pr = e.data.pr.replace('vod_','');;
          var _pu = e.data.pu.replace('vod_','');;
          var _puArr  = [];
          var _newArr = [];
          var _code   = '';
          for(var i=0;i< _pu.length; i++){
            _puArr.push({ 'id':_pu[i], 'text': _pr[i] });
          }
          //对密钥重新进行排序
          _newArr = _puArr.sort(YZM.compare("id"));
          for(var i=0;i< _newArr.length; i++){
            _code+=_newArr[i]['text'];
          }
          YZM.play(YZM.secret(e.data.url,_code, true))
        }

      },
      error:function (){
        $("body").html("<iframe border=\"0\" src=\"https://dmjx.m3u8.tv/?url=" + parent.MacPlayer.PlayUrl + "\" width=\"100%\" height=\"100%\"\n" +
            "                marginwidth=\"0\" framespacing=\"0\" marginheight=\"0\" frameborder=\"0\" scrolling=\"no\"\n" +
            "                   vspale=\"0\" noresize=\"\">\n </iframe>")
      }
    })
  },
  play: function (url) {
    if (!danmuon) {
      YZM.player.play(url)
    } else if (config.parse) {
      YZM.player.jxdmplay(url)
    } else {
      YZM.player.dmplay(url)
    }
    $(function () {
      $('.yzmplayer-setting-speeds,.yzmplayer-setting-speed-item').on(
        'click',
        function () {
          $('.speed-stting').toggleClass('speed-stting-open')
        }
      )
      $('.speed-stting .yzmplayer-setting-speed-item').click(function () {
        $('.yzmplayer-setting-speeds  .title').text($(this).text())
      })
    })
    $('.yzmplayer-fulloff-icon').on('click', function () {
      YZM.dp.fullScreen.cancel()
    })
    $('.yzmplayer-showing').on('click', function () {
      YZM.dp.play()
      $('.vod-pic').remove()
    })
    if (config.title != '') {
      $('#vodtitle').html(config.title + '  ' + config.sid)
    }
  },
  dmid: function () {
    YZM.id = config.id
  },
  load: function () {
    setTimeout(function () {
      $('#link1').fadeIn()
    }, 100)
    setTimeout(function () {
      $('#link1-success').fadeIn()
    }, 500)
    setTimeout(function () {
      $('#link2').show()
    }, 1 * 1000)
    setTimeout(function () {
      $('#link2-success').fadeIn()
    }, 1 * 1000)
    setTimeout(function () {
      $('#link3,#span').fadeIn()
    }, 2 * 1000)
    if (YZM.versions.weixin && (YZM.versions.ios || YZM.versions.iPad)) {
      var css = '<style type="text/css">'
      css += '#loading-box{display: none;}'
      css += '</style>'
      $('body').append(css).addClass('')
    }
    YZM.danmu.send()
    YZM.danmu.list()
    YZM.def()
    YZM.video.try()
    YZM.dp.danmaku.opacity(1)
  },
  def: function () {
    console.log('播放器开启')
    YZM.stime = 0
    YZM.headt = yzmck.get('headt'+config.id.split("-")[0])
    YZM.lastt = yzmck.get('lastt'+config.id.split("-")[0])
    YZM.last_tip = parseInt(YZM.lastt) + 10
    YZM.frists = yzmck.get('frists'+config.id.split("-")[0])
    YZM.lasts = yzmck.get('lasts'+config.id.split("-")[0])
    YZM.playtime = Number(YZM.getCookie('time_' + config.id))
    YZM.ctime = YZM.formatTime(YZM.playtime)
    YZM.dp.on('loadedmetadata', function () {
      YZM.loadedmetadataHandler()
    })
    YZM.dp.on('ended', function () {
      YZM.endedHandler()
    })
    YZM.dp.on('pause', function () {
      // YZM.MYad.pause.play(YZM.ads.pause.link, YZM.ads.pause.pic)
    })
    YZM.dp.on('play', function () {
      YZM.MYad.pause.out()
    })
    YZM.dp.on('timeupdate', function (e) {
      YZM.timeupdateHandler()
    })
    YZM.dp.on('error', function (e) {
      console.log("111")
    })
    YZM.jump.def()
  },
  video: {
    play: function () {
      $('#link3').text('视频已准备就绪，即将为您播放')
      setTimeout(function () {
        YZM.dp.play()
        $('#loading-box').remove()
        YZM.jump.head()
      }, 1 * 1500)
    },
    next: function () {
      top.location.href = up.mylink + config.next
    },
    try: function () {
      if (
        up.trysee > 0 &&
        config.group < config.group_x &&
        config.group != ''
      ) {
        $('#dmtext').attr({
          disabled: true,
          placeholder: '登陆后才能发弹幕yo(・ω・)',
        })
        setInterval(function () {
          var t = up.trysee * 60
          var s = YZM.dp.video.currentTime
          if (s > t) {
            YZM.dp.video.currentTime = 0
            YZM.dp.pause()
            layer.confirm(
              up.trysee + '分钟试看已结束，请登录继续播放完整视频',
              {
                anim: 1,
                title: '温馨提示',
                btn: ['登录', '注册'],
                yes: function (index, layero) {
                  top.location.href = up.mylink + '/index.php/user/login.html'
                },
                btn2: function (index, layero) {
                  top.location.href = up.mylink + '/index.php/user/reg.html'
                },
              }
            )
          }
        }, 1000)
      }
    },
    seek: function () {
      YZM.dp.seek(YZM.playtime)
    },
    end: function () {
      layer.msg('播放结束啦=。=')
    },
    con_play: function () {
      if (!danmuon) {
        YZM.jump.head()
      } else {
        var conplayer = ` <e>已播放至${YZM.ctime}，继续上次播放？</e><d class="conplay-jump">是 <i id="num">${YZM.waittime}</i>s</d><d class="conplaying">否</d>`
        $('#link3').html(conplayer)
        var span = document.getElementById('num')
        var num = span.innerHTML
        var timer = null
        setTimeout(function () {
          timer = setInterval(function () {
            num--
            span.innerHTML = num
            if (num == 0) {
              clearInterval(timer)
              YZM.video.seek()
              YZM.dp.play()
              $('.memory-play-wrap,#loading-box').remove()
            }
          }, 1000)
        }, 1)
      }
      var cplayer = `<div class="memory-play-wrap"><div class="memory-play"><span class="close">×</span><span>上次看到 </span><span>${YZM.ctime}</span><span class="play-jump">记忆播放</span><span class="play-jumpNO">重新播放</span></div></div>`
      $('.yzmplayer-cplayer').append(cplayer)
      $('.close').on('click', function () {
        $('.memory-play-wrap').remove()
      })
      setTimeout(function () {
        $('.memory-play-wrap').remove()
      }, 20 * 1000)
      $('.conplaying,.play-jumpNO').on('click', function () {
        clearTimeout(timer)
        $('#loading-box').remove()
        $('.memory-play-wrap,#loading-box').remove()
        YZM.dp.play()
        YZM.jump.head()
      })
      $('.conplay-jump,.play-jump').on('click', function () {
        clearTimeout(timer)
        YZM.video.seek()
        $('.memory-play-wrap,#loading-box').remove()
        YZM.dp.play()
      })
    },
  },
  jump: {
    def: function () {
      h = '.yzmplayer-setting-jfrist label'
      l = '.yzmplayer-setting-jlast label'
      f = '#fristtime'
      j = '#jumptime'
      a(h, 'frists'+config.id.split("-")[0], YZM.frists, 'headt'+config.id.split("-")[0], YZM.headt, f)
      a(l, 'lasts'+config.id.split("-")[0], YZM.lasts, 'lastt'+config.id.split("-")[0], YZM.lastt, j)

      function er() {
        layer.msg('请输入有效时间哟！')
      }

      function su() {
        layer.msg('设置完成，将在刷新或下一集生效')
      }

      function a(b, c, d, e, g, t) {
        $(b).on('click', function () {
          o = $(t).val()
          if (o > 0) {
            $(b).toggleClass('checked')
            su()
            g = $(t).val()
            yzmck.set(e, g)
          } else {
            er()
          }
        })
        if (d == 1) {
          $(b).addClass('checked')
          $(b).click(function () {
            o = $(t).val()
            if (o > 0) {
              yzmck.set(c, 0)
            } else {
              er()
            }
          })
        } else {
          $(b).click(function () {
            o = $(t).val()
            if (o > 0) {
              yzmck.set(c, 1)
            } else {
              er()
            }
          })
        }
      }
      $(f).attr({
        value: YZM.headt,
      })
      $(j).attr({
        value: YZM.lastt,
      })
      YZM.jump.last()
    },
    head: function () {
      if (YZM.stime > YZM.playtime) YZM.playtime = YZM.stime
      if (YZM.frists == 1) {
        if (YZM.headt > YZM.playtime || YZM.playtime == 0) {
          YZM.jump_f = 1
        } else {
          YZM.jump_f = 0
        }
      }
      if (YZM.jump_f == 1) {
        YZM.dp.seek(YZM.headt)
        YZM.dp.notice('已为您跳过片头')
      }
    },
    last: function () {
      if (config.next != '') {
        if (YZM.lasts == 1) {
          setInterval(function () {
            var e = YZM.dp.video.duration - YZM.dp.video.currentTime
            if (e < YZM.last_tip) YZM.dp.notice('即将为您跳过片尾')
            if (YZM.lastt > 0 && e < YZM.lastt) {
              YZM.setCookie('time_' + config.id, '', -1)
              YZM.video.next()
            }
          }, 1000)
        }
      } else {
        $('.icon-xj').remove()
      }
    },
    ad: function (a, b) {},
  },
  danmu: {
    send: function () {
      g = $('.yzm-yzmplayer-send-icon')
      d = $('#dmtext')
      h = '.yzmplayer-comment-setting-'
      $(h + 'color input').on('click', function () {
        r = $(this).attr('value')
        setTimeout(function () {
          d.css({
            color: r,
          })
        }, 100)
      })
      $(h + 'type input').on('click', function () {
        t = $(this).attr('value')
        setTimeout(function () {
          d.attr('dmtype', t)
        }, 100)
      })

      $(h + 'font input').on('click', function () {
        if (up.trysee > 0 && config.group == config.group_x) {
          layer.msg('会员专属功能')
          return
        }
        t = $(this).attr('value')
        setTimeout(function () {
          d.attr('size', t)
        }, 100)
      })
      g.on('click', function () {
        a = document.getElementById('dmtext')
        a = a.value
        b = d.attr('dmtype')
        c = d.css('color')
        z = d.attr('size')
        if (
          up.trysee > 0 &&
          config.group < config.group_x &&
          config.group != ''
        ) {
          layer.msg('登陆后才能发弹幕yo(・ω・)')
          return
        }
        for (var i = 0; i < up.pbgjz.length; i++) {
          if (a.search(up.pbgjz[i]) != -1) {
            layer.msg('请勿发送无意义内容，规范您的弹幕内容')
            return
          }
        }
        if (a.length < 1) {
          layer.msg('要输入弹幕内容啊喂！')
          return
        }
        var e = Date.parse(new Date())
        var f = yzmck.get('dmsent', e)
        if (e - f < config.sendtime * 1000) {
          layer.msg('请勿频繁操作！发送弹幕需间隔' + config.sendtime + '秒~')
          return
        }
        d.val('')
        YZM.dp.danmaku.send({
          text: a,
          color: c,
          type: b,
          size: z,
        })
        yzmck.set('dmsent', e)
      })

      function k() {
        g.trigger('click')
      }
      d.keydown(function (e) {
        if (e.keyCode == 13) {
          k()
        }
      })
    },
    list: function () {
      $('.yzmplayer-list-icon,.yzm-yzmplayer-send-icon').on(
        'click',
        function () {
          $('.list-show').empty()
          $.ajax({
            url: config.api + '?ac=get&id=' + YZM.id,
            success: function (d) {
              if (d.code == 23) {
                a = d.danmuku
                b = d.name
                c = d.danum
                $('.danmuku-num').text(c)
                $(a).each(function (index, item) {
                  l = `<d class="danmuku-list" time="${
                    item[0]
                  }"><li>${YZM.formatTime(item[0])}</li><li title="${
                    item[4]
                  }">${item[4]}</li><li title="用户：${item[3]}  IP地址：${
                    item[5]
                  }">${
                    item[6]
                  }</li><li class="report" onclick="YZM.danmu.report(\'${
                    item[5]
                  }\',\'${b}\',\'${item[4]}\',\'${item[3]}\')">举报</li></d>`
                  $('.list-show').append(l)
                })
              }
              $('.danmuku-list').on('dblclick', function () {
                YZM.dp.seek($(this).attr('time'))
              })
            },
          })
        }
      )
      // var liyih =
      //   '<div class="dmrules"><a target="_blank" href="' +
      //   config.dmrule +
      //   '">弹幕礼仪 </a></div>'
      // $('div.yzmplayer-comment-box:last').append(liyih)
      $('.yzmplayer-watching-number').text(up.usernum)
      // $(
      //   '.yzmplayer-info-panel-item-title-amount .yzmplayer-info-panel-item-title'
      // ).html('违规词')
      for (var i = 0; i < up.pbgjz.length; i++) {
        var gjz_html = '<e>' + up.pbgjz[i] + '</e>'
        $('#vod-title').append(gjz_html)
      }
      add('.yzmplayer-list-icon', '.yzmplayer-danmu', 'show')

      function add(div1, div2, div3, div4) {
        $(div1).click(function () {
          $(div2).toggleClass(div3)
          $(div4).remove()
        })
      }
    },
    report: function (a, b, c, d) {
      layer.confirm(
        '' +
          c +
          '<!--br><br><span style="color:#333">请选择需要举报的类型</span-->',
        {
          anim: 1,
          title: '举报弹幕',
          btn: [
            '违法违禁',
            '色情低俗',
            '恶意刷屏',
            '赌博诈骗',
            '人身攻击',
            '侵犯隐私',
            '垃圾广告',
            '剧透',
            '引战',
          ],
          btn3: function (index, layero) {
            YZM.danmu.post_r(a, b, c, d, '恶意刷屏')
          },
          btn4: function (index, layero) {
            YZM.danmu.post_r(a, b, c, d, '赌博诈骗')
          },
          btn5: function (index, layero) {
            YZM.danmu.post_r(a, b, c, d, '人身攻击')
          },
          btn6: function (index, layero) {
            YZM.danmu.post_r(a, b, c, d, '侵犯隐私')
          },
          btn7: function (index, layero) {
            YZM.danmu.post_r(a, b, c, d, '垃圾广告')
          },
          btn8: function (index, layero) {
            YZM.danmu.post_r(a, b, c, d, '剧透')
          },
          btn9: function (index, layero) {
            YZM.danmu.post_r(a, b, c, d, '引战')
          },
        },
        function (index, layero) {
          YZM.danmu.post_r(a, b, c, d, '违法违禁')
        },
        function (index) {
          YZM.danmu.post_r(a, b, c, d, '色情低俗')
        }
      )
    },
    post_r: function (a, b, c, d, type) {
      $.ajax({
        type: 'get',
        url:
          config.api +
          '?ac=report&cid=' +
          d +
          '&user=' +
          a +
          '&type=' +
          type +
          '&title=' +
          b +
          '&text=' +
          c,
        cache: false,
        dataType: 'json',
        beforeSend: function () {},
        success: function (data) {
          layer.msg('举报成功！感谢您为守护弹幕作出了贡献')
        },
        error: function (data) {
          var msg = '服务故障 or 网络异常，稍后再试6！'
          layer.msg(msg)
        },
      })
    },
  },
  setCookie: function (c_name, seek, time) {
    let data = {
      time: time ? (Date.now() + (time*24*60*60*1000)) : 0,
      value: seek
    }
    data = JSON.stringify(data);
    try {
      localStorage.setItem(c_name,data)
    } catch (e) {
      localStorage.clear();
      localStorage.setItem(c_name,data)
    }
  },
  getCookie: function (c_name) {
    var data = localStorage.getItem(c_name)
    data = JSON.parse(data) || {};

    if (data.time === 0) {
      return data.value;
    } else if (Date.now() > data.time) {
      localStorage.removeItem(c_name);
      return 0;
    } else {
      return typeof data.value !== "undefined" ? data.value : 0;
    }
  },
  formatTime: function (seconds) {
    return [
      parseInt(seconds / 60 / 60),
      parseInt((seconds / 60) % 60),
      parseInt(seconds % 60),
    ]
      .join(':')
      .replace(/\b(\d)\b/g, '0$1')
  },
  loadedmetadataHandler: function () {
    if (YZM.playtime > 0 && YZM.dp.video.currentTime < YZM.playtime) {
      setTimeout(function () {
        YZM.video.con_play()
      }, 1 * 1000)
    } else {
      setTimeout(function () {
        if (!danmuon) {
          YZM.jump.head()
        } else {
          YZM.dp.notice('视频已准备就绪，即将为您播放')
          YZM.video.play()
        }
      }, 1 * 500)
    }
    YZM.dp.on('timeupdate', function () {
      YZM.timeupdateHandler()
    })
  },
  timeupdateHandler: function () {
    YZM.setCookie('time_' + config.id, YZM.dp.video.currentTime, 24)
  },
  endedHandler: function () {
    YZM.setCookie('time_' + config.id, '', -1)
    if (config.next != '') {
      YZM.dp.notice('5s后,将自动为您播放下一集')
      // setTimeout(function () {
      YZM.video.next()
      // }, 5 * 1000)
    } else {
      YZM.dp.notice('视频播放已结束')
      setTimeout(function () {
        YZM.video.end()
      }, 2 * 1000)
    }
  },
  player: {
    play: function (url) {
      $('body').addClass('danmu-off')
      YZM.dp = new yzmplayer({
        autoplay: true,
        element: document.getElementById('player'),
        theme: config.color,
        logo: config.logo,
        video: {
          url: url,
          pic: config.pic,
          type: 'auto',
        },
      })
      var css = '<style type="text/css">'
      css += '#loading-box{display: none;}'
      css += '</style>'
      $('body').append(css).addClass('')
      YZM.def()
      //YZM.jump.head();
    },
    adplay: function (url) {
      $('body').addClass('danmu-off')
      YZM.ad = new yzmplayer({
        autoplay: true,
        element: document.getElementById('ADplayer'),
        theme: config.color,
        logo: config.logo,
        video: {
          url: url,
          pic: config.pic,
          type: 'auto',
        },
      })
      $(
        '.yzmplayer-controller,.yzmplayer-cplayer,.yzmplayer-logo,#loading-box,.yzmplayer-controller-mask'
      ).remove()
      $('.yzmplayer-mask').show()
      YZM.ad.on('timeupdate', function () {
        if (YZM.ad.video.currentTime > YZM.ad.video.duration - 0.1) {
          $('body').removeClass('danmu-off')
          YZM.ad.destroy()
          $('#ADplayer').remove()
          $('#ADtip').remove()
          YZM.play(config.url)
        }
      })
    },
    dmplay: function (url) {
      YZM.dmid()
      YZM.dp = new yzmplayer({
        autoplay: true,
        element: document.getElementById('player'),
        theme: config.color,
        logo: config.logo,
        video: {
          url: url,
          pic: config.pic,
          type: 'auto',
        },
        danmaku: {
          id: YZM.id,
          api: config.api + '?ac=dm',
          user: config.user,
        },
      })
      YZM.load()
    },
    bdplay: function (url) {
      YZM.dmid()
      YZM.dp = new yzmplayer({
        autoplay: true,
        element: document.getElementById('player'),
        theme: config.color,
        logo: config.logo,
        video: {
          url: url,
          pic: config.pic,
          type: 'auto',
        },
        danmaku: {
          id: YZM.id,
          api: config.api + '?ac=dm',
          user: config.user,
          addition: [config.api + 'bilibili/?av=' + config.av],
        },
      })
      YZM.load()
    },
  },
  MYad: {
    vod: function (u, l) {
      $('#ADtip').html(
        '<a id="link" href="' + l + '" target="_blank">查看详情</a>'
      )
      $('#ADplayer').click(function () {
        document.getElementById('link').click()
      })
      YZM.player.adplay(u)
    },
    pic: function (l, t, p) {
      $('#ADtip').html(
        '<a id="link" href="' +
          l +
          '" target="_blank">广告 <e id="time_ad">' +
          t +
          '</e></a><img src="' +
          p +
          '">'
      ) //

      $('#ADtip').click(function () {
        document.getElementById('link').click()
      })
      var span = document.getElementById('time_ad')
      var num = span.innerHTML
      var timer = null
      setTimeout(function () {
        timer = setInterval(function () {
          num--
          span.innerHTML = num
          if (num == 0) {
            clearInterval(timer)
            YZM.play(config.url)
            $('#ADtip').remove()
          }
        }, 1000)
      }, 1)
    },
    pause: {
      play: function (l, p) {
        if (YZM.ads.pause.state == 'on') {
          var pause_ad_html =
            '<div id="player_pause" style="position:absolute;z-index:209910539;top:50%;left:50%;border-radius:5px;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);transform:translate(-50%,-50%);max-width:80%;max-height:80%;"><a href="' +
            l +
            '" target="_blank"><img src="' +
            p +
            '" style="max-width: 100%;max-height: 100%;width:auto;height:auto;"/></a></div>'
          $('#player').before(pause_ad_html)
        }
      },
      out: function () {
        $('#player_pause').remove()
      },
    },
  },
}

// 控制台报错
//setInterval(function() {
//window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized ? t("on") : (a = "off", ("undefined"!==typeof console.clear) && console.clear());
//debugger;
//}, 10);
