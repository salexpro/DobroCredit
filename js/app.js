$(document).foundation();

// Проверка заполнения анкеты
// if ($.cookie('profile') != 1) {
//     $.get('/php/service/new/user/get.php', { 'uid': uid }, isprofile);
//     console.log('Проверка регистрации');
//     function isprofile(data) {
//         var u_icq = $.parseJSON(data).data[0].users[0].icq;
//         if (u_icq != 111111) {
//             $('#uexit').after('<a href="/index/11" class="alert label">Заполните профиль до конца</a>');
//         } else {
//             $.cookie('profile', 1, { path: '/' });
//         }
//     }
// }

// Авторизация
sendFrm549160=function(){
    var o=$('#frmLg549160')[0],pos=_uGetOffset(o);
    // document.body.insertBefore(o2,document.body.firstChild);
    // $(o2).css({top:(pos['top'])+'px',left:(pos['left'])+'px',width:o.offsetWidth+'px',height:o.offsetHeight+'px',display:''}).html('<div align="left" style="padding:5px;"><div class="myWinLoad"></div></div>');
    _uPostForm('frmLg549160',{type:'POST',url:'/index/sub/',error:function() {
        // $('#blk549160').html('<div align="left" style="padding:10px;"><div class="myWinLoadSF" title="Невозможно выполнить запрос, попробуйте позже"></div></div>');
        _uWnd.alert('<div class="myWinError">Невозможно выполнить запрос, попробуйте позже</div>','',{w:250,h:90,tm:3000,pad:'15px'});
        // setTimeout("$('#blk549160').css('display','none');",'1500');
    }});
}


// Восстановление пароля
function recover(data) {
    var resp = $.parseJSON(data);
    status.html(resp.stat);
    if (resp.stat.indexOf('myWinLoadSD') == -1) {
        _uWnd.alert(resp.win, '', { w: 250, h: 90, tm: 3000 });
    }
}
function pass_recover(form) {
    var mail = $('[type="text"]', form).val();
    var status = $('#rec_msg', form);
    status.html('<div class="myWinLoadS" title="Загрузка..."></div>');
    if (mail != '') {
        $.post('/php/ulogin/recover.php', {
            mail: mail,
        }, recover);
    } else {
        status.html('<div class="myWinLoadSF" title="Поле не заполнено"></div>');
        _uWnd.alert('<div style="margin-top:15px" class="myWinError">Поле не заполнено</div>', '', { w: 250, h: 90, tm: 3000 });
    }
}

$('.login_form_forgot').click(function() {
    new _uWnd('Prm', 'Напоминание пароля', 300, 100, { autosize: 1, closeonesc: 1 },
        '<form onsubmit=\'pass_recover(this);return false;\'><div class="row"><div class="small-5">E-mail или Логин:</div><div class="small-7"><input maxlength=\'50\' type=\'text\' size=\'20\'></div><div class="row column small-12 align-right align-middle"><span id=\'rec_msg\'></span> <input class=\'button\' type=\'submit\' value=\'Вспомнить\'></div>'
    );
});

// Off-canvas

if(Foundation.MediaQuery.current=='medium'||Foundation.MediaQuery.current=='small'){
    $('#cats').addClass('off-canvas position-right').removeClass('show-for-large');
}
$(window).on('changed.zf.mediaquery', function(event, newSize, oldSize) {
    console.log(newSize)
    if(newSize=='medium'){
        $('#cats').addClass('off-canvas position-right').removeClass('show-for-large');
    }
    if(newSize=='large'){
        $('.off-canvas-wrapper-inner').removeClass('is-off-canvas-open is-open-right');
        $('#cats').removeClass('off-canvas position-right');
    }
});