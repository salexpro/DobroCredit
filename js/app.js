$(document).foundation();

// Проверка заполнения анкеты
if (uid) {
    if (!$.cookie('profile')) {
        $.get('http://dobrocredit.ru/php/service/new/user/get.php', { 'uid': uid }, isprofile);

        function isprofile(data) {
            var u_icq = $.parseJSON(data).data[0].users[0].icq;
            if (u_icq != 111111) {
                $('#uexit').after('<a href="/index/11" class="alert label">Заполните профиль до конца</a>');
            } else {
                $.cookie('profile', true, { path: '/' });
            }
        }
    }
}

// Авторизация
sendFrm549160 = function() {
    var o = $('#frmLg549160')[0],
        pos = _uGetOffset(o);
    _uPostForm('frmLg549160', {
        type: 'POST',
        url: '/index/sub/',
        error: function() {
            _uWnd.alert('<div class="myWinError">Невозможно выполнить запрос, попробуйте позже</div>', '', { w: 250, h: 90, tm: 3000, pad: '15px' });
        }
    });
}
if(!is_logged){
    if(location.href.indexOf('?aut=false2')!=-1){
        new _uWnd('Name','Ошибка авторизации',400,100,{autosize:1,maxh:200,minh:100},'Увы, но что-то пошло не так. Попробуйте авторизоваться снова');
    } else if(location.href.indexOf('?aut=false3')!=-1){
        new _uWnd('Name','Ошибка авторизации',400,100,{autosize:1,maxh:300,minh:100},'Мы обнаружили, что у вас уже есть пользователь с таким E-mail. Воспользуйтесь восстановлением пароля уже существующего пользователя');
    }
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
if (Foundation.MediaQuery.current == 'medium' || Foundation.MediaQuery.current == 'small') {
    $('#cats').addClass('off-canvas position-right').removeClass('show-for-large');
}
$(window).on('changed.zf.mediaquery', function(event, newSize, oldSize) {
    console.log(newSize)
    if (newSize == 'small' || newSize == 'medium') {
        $('#cats').addClass('off-canvas position-right').removeClass('show-for-large');
    }
    if (newSize != 'small' && newSize != 'medium') {
        $('.off-canvas-wrapper-inner').removeClass('is-off-canvas-open is-open-right');
        $('#cats').removeClass('off-canvas position-right');
    }
});

// Подгрузка сео статей для областей и городов
if (loadseo) {
    var publ_url = '/php/publ/cat/cat' + pid + '.php?uri=' + uri_id;
    $.get(publ_url, function(data) {
        if (data) {
            $('.seo_publ').html(data).addClass('seo_show');
        }
    });
}

// Счетчики для городов
if (loadseo && (pid != 31038 && cid != 31038)) {
    if ($('.catalog tr').length % 2) {
        $('.board_cats_section .catalog tbody').append('<tr></tr>');
    }
    $.get('http://dobrocredit.ru/php/count/count.php?pid=' + pid + '&cid=' + cid, function(data) {
        cities = $.parseJSON(data);
        $(cities).each(function() {
            $('#catalog-item-' + this.cat_id).append('<b>' + this.goods_count + '</b>');
        });      
    });
}

// Оповещение о модерации объявления
$('.item_na .u-mpanel-l>li').click(function() {
    if ($(this).attr('class').indexOf('hidden') != -1) {
        var action = true;
    } else if ($(this).attr('class').indexOf('del') != -1) {
        var action = false;
    } else {
        var action = 'none';
    }
    if (action != 'none') {
        var nick = $(this).parents('.item_na').data('adduser');
        $.get('/index/14-0-0-1/', function(data) {
            var thread = action ? 'Ваше объявление успешно прошло модерацию' : 'Ваше объявление НЕ прошло модерацию';
            var message = action ? "Доброго времени суток, Ваше объявление успешно прошло модерацию и размещено на сайте ДоброКредит" + "\n\n" + "Всего Доброго!" + "\n" + "Кредитный портал ДоброКредит" : "Доброго времени суток, Ваше объявление не прошло модерацию и не размещено на сайте ДоброКредит из-за несоответствие правилам. Пожалуйста, внимательно изучите их перед подачей следующих объявлений." + "\n\n" + "1. Объявление должно быть уникальным! Пишите его самостоятельно, а не копируйте с других сайтов. Перед добавлением проверяйте его на антиплагиат. Если уникальность текста составляет менее 70% оно не допускается к размещению модератором и опубликовано не будет." + "\n" + "2. Не подавайте одно и то же объявление повторно, независимо от того, размещаете ли вы их в разных регионах или категориях." + "\n" + "3. Запрещено размещение объявлений, содержащих рекламную информацию о интернет-ресурсах (ссылки на порталы, форумы и т.д.)" + "\n\n" + "Всего Доброго!" + "\n" + "Кредитный портал ДоброКредит";
            var ssid = $('input[name="ssid"]', data).val();
            $.post('/index/', {
                a: '18',
                s: nick,
                subject: thread,
                message: message,
                ssid: ssid
            });
        });
    }
})

if (module_id == 'shop') {
    // Карта в обьявлении
    if (entry_title) {
        var myMap;
        ymaps.ready(init);

        function init() {
            var myGeocoder = ymaps.geocode(adress);
            myGeocoder.then(
                function(res) {
                    myMap = new ymaps.Map('map', {
                        center: res.geoObjects.get(0).geometry.getCoordinates(),
                        zoom: 12
                    });
                    myPlacemark = new ymaps.Placemark(res.geoObjects.get(0).geometry.getCoordinates(), {
                        balloonContentHeader: entry_title,
                        balloonContentBody: brief,
                        balloonContentFooter: adress
                    }, {
                        preset: 'islands#grayDotIcon',
                        iconColor: '#0D6986'
                    });
                    myMap.geoObjects.add(myPlacemark);
                },
                function(err) {
                    alert('Ошибка. Адрес не найден на карте');
                }
            );

        }
        var showmap = 1;

        $('.bitem_showmap').click(function() {
            if (showmap % 2 == 1) {
                $('.bitem_map').show();
                $(this).text('Cкрыть карту');
            } else if (showmap % 2 == 0) {
                $('.bitem_map').slideUp();
                $(this).text('Показать на карте');
            };
            showmap++;
        });
    }
}


// Pluso
(function() {
    if (window.pluso)
        if (typeof window.pluso.start == "function") return;
    if (window.ifpluso == undefined) {
        window.ifpluso = 1;
        var d = document,
            s = d.createElement('script'),
            g = 'getElementsByTagName';
        s.type = 'text/javascript';
        s.charset = 'UTF-8';
        s.async = true;
        s.src = ('https:' == window.location.protocol ? 'https' : 'http') + '://share.pluso.ru/pluso-like.js';
        var h = d[g]('body')[0];
        h.appendChild(s);
    }
})();

// Действия внизу заявки
$('.bitem_details_actions a, .write_letter').click(function(e) {
    e.preventDefault();
    if ($(this).attr('class') == 'write_letter') {
        $("html,body").animate({
            scrollTop: $('.bitem_details_actions').offset().top
        }, 500);
    }
    var action = $(this).attr('href').substr(1);
    var form = $('.bitem_form');
    var namet = $('.bitem_form [name="namet"]');
    var emailt = $('.bitem_form [name="emailt"]');
    var mess = $('.bitem_form [name="message"]');
    mess.val('');
    switch (action) {
        case 'write':
            $('.bitem_form_abuse').hide();
            $('.bitem_form_send').show();
            if (form.is(':hidden')) {
                form.slideDown();
            } else if (form.data('state') == 'write') {
                form.slideUp();
            }
            namet.val(namet.data('value'));
            emailt.val(emailt.data('value'));
            namet.parent().hide();
            emailt.parent().hide();
            mess.parent().show();
            form.data('state', 'write');
            break;
        case 'send':
            $('.bitem_form_abuse').hide();
            $('.bitem_form_send').show();
            if (form.is(':hidden')) {
                form.slideDown();
            } else if (form.data('state') == 'send') {
                form.slideUp();
            }
            namet.val('');
            emailt.val('');
            namet.parent().show();
            emailt.parent().show();
            mess.parent().hide();
            form.data('state', 'send');
            break;
        case 'abuse':
            $('.bitem_form_send').hide();
            $('.bitem_form_abuse').show();
            if (form.is(':hidden')) {
                form.slideDown();
            } else if (form.data('state') == 'abuse') {
                form.slideUp();
            }
            form.data('state', 'abuse');
            break;
        case 'favorite':
            form.slideUp();
            $.post('/shop/wishlisth', {
                    goods_id: item_id,
                    _tp_: 'xml'
                },
                function(s) {
                    var response = $(s).text();
                    var star = $('.bitem_details_actions .fa-star');
                    if (response.indexOf('Удалить') != -1) {
                        star.next().text('Удалить из избранного');
                        star.addClass('is_wished');
                    } else if (response.indexOf('Добавить') != -1) {
                        star.next().text('Добавить в избранное');
                        star.removeClass('is_wished');
                    }
                });
            break;
    }
});

// Отправка сообщения объявление
$('.bitem_form_send>form').submit(function() {
    $('#msgAdv38').html('<div class="myWinLoadS"></div>');
    _uPostForm($(this), { type: 'POST', url: '/index/32' });
    return false;
})

// Отправка жалобы объявление
var reason = '';
var text_reason = $('.bitem_form_abuse textarea');
$('.bitem_form_abuse [type="radio"]').change(function() {
    reason = $(this).val();
    if (reason == 'другая причина') {
        text_reason.show();
    } else {
        text_reason.val('').hide();
    }
});
$('.bitem_form_abuse>form').submit(function() {
    var abus = 'Нарушение в заявке - ' + reason;
    var mess = 'В [url=' + document.location.href + ']этой[/url] заявке нарушение' + "\n\n" + text_reason.val();
    var status = $('.bitem_form_status');
    status.html('<div class="myWinLoadS"></div>');
    if (reason && (reason != 'другая причина' || text_reason.val() != '')) {
        $.get('/index/14-0-0-1/', function(data) {
            var ssid = $('input[name="ssid"]', data).val();
            $.post('/index/', {
                    a: '18',
                    s: '3D',
                    subject: abus,
                    message: mess,
                    ssid: ssid
                },
                function(s) {
                    var response = $(s).text();
                    if (response.indexOf('успешно') != -1) {
                        status.html('<div class="myWinLoadSD" title="Отправлено"></div>');
                    } else if (response.indexOf('самому') != -1) {
                        status.html('<div class="myWinLoadSF" title="Отправлять жалобы самому себе - бред"></div>');
                        _uWnd.alert('<div style="margin-top:15px" class="myWinError">Отправлять жалобы самому себе - <b>бред</b></div>', '', { w: 250, h: 50, tm: 3000 });
                    } else if (response.indexOf('запретил') != -1) {
                        status.html('<div class="myWinLoadSF" title="Администратор запретил отправлять себе сообщения"></div>');
                        _uWnd.alert('<div style="margin-top:15px" class="myWinError">Администратор запретил отправлять себе сообщения</div>', '', { w: 250, h: 50, tm: 3000 });
                    } else if (response.indexOf('запрещен') != -1) {
                        status.html('<div class="myWinLoadSF" title="Доступ запрещен"></div>');
                        _uWnd.alert('<div style="margin-top:15px" class="myWinError">Доступ запрещен</div>', '', { w: 250, h: 50, tm: 3000 });
                    } else if (response.indexOf('не чаще') != -1) {
                        status.html('<div class="myWinLoadSF" title="Часто жаловаться нехорошо"></div>');
                        _uWnd.alert('<div style="margin-top:15px" class="myWinError">Часто жаловаться нехорошо</div>', '', { w: 250, h: 50, tm: 3000 });
                    }
                });
        });
    } else {
        status.html('<div class="myWinLoadSF" title="Выберите причину жалобы"></div>');
        _uWnd.alert('<div style="margin-top:15px" class="myWinError">Выберите причину жалобы</div>', '', { w: 250, h: 50, tm: 3000 });
    }
    return false;
})


// Добавление объявления
if (module_id == 'shop' && (page_id == 'add' || page_id == 'edit')) {
    // var myMap;
    // ymaps.ready(init);

    // function init() {
    //     myMap = new ymaps.Map('map', {
    //         center: [68.545095, 105.168933],
    //         zoom: 2
    //     });
    //     myPlacemark = new ymaps.Placemark([68.545095, 105.168933], {}, {
    //         preset: 'islands#grayDotIcon',
    //         iconColor: '#0D6986'
    //     });
    //     myMap.geoObjects.add(myPlacemark);

    //     function map() {
    //         if (($('#adress').val() == '' || $('#adress').val().length < 3) && $('#AddCity :selected').text() == '--- Выберите ---') {
    //             $('#map').slideUp();
    //         } else {
    //             if ($('#AddCity :selected').text() != '--- Выберите ---') {
    //                 var myGeocoder = ymaps.geocode($('#AddCity :selected').text() + ' ' + $('#adress').val());
    //             } else {
    //                 var myGeocoder = ymaps.geocode($('#adress').val());
    //             };
    //             myGeocoder.then(
    //                 function(res) {
    //                     $('#map').show();
    //                     myPlacemark.geometry.setCoordinates(res.geoObjects.get(0).geometry.getCoordinates());
    //                     if ($('#adress').val() == '') {
    //                         myMap.setCenter(res.geoObjects.get(0).geometry.getCoordinates(), 12, { duration: 1500 });
    //                     } else {
    //                         myMap.setCenter(res.geoObjects.get(0).geometry.getCoordinates(), 16, { duration: 1500 });
    //                     }
    //                 },
    //                 function(err) {
    //                     alert('Ошибка. Адрес не найден на карте');
    //                 }
    //             );
    //         };
    //     }
    //     $('#adress').keyup(function() {
    //         st = setTimeout(function() { map() }, 1500)
    //     });
    //     $('#adress').keypress(function() {
    //         clearTimeout(st)
    //     });
    //     $('#AddCity').change(function() {
    //         map();
    //     });
    // };
    $('#tb_name .manTd1').html('Тема объявления:');
    $('#tb_dscr .manTd1').html('Текст объявления:');
    $('#tb_art .manTd1').html('Контактное лицо:');
    $('#tb_stock .manTd1').html('E-mail:');
    $('#tb_warr .manTd1').html('Телефон:');
    $('#tb_img .manTd2').html($('#tb_img .manTd2').html().replace('Изображения товара', 'Изображение'));
    $('#tb-tags .manTd1').html('Ключевые слова (через запятую):');
    $('#tb_meta .manTd1:eq(0)').html('Заголовок объявления:');
    $('input[name="meta_title"]').attr('placeholder', 'Рекомендуемая длина не более 60 символов');
    $('#tb_meta .manTd1:eq(1)').html('Краткое описание объявления:');
    $('input[name="meta_dscr"]').attr('placeholder', 'Рекомендуемая длина 160 символов');
    $('#tb_price .manTd1').html('Цена:');

    $('#shop-categories').tooltipster({
        trigger: 'custom',
        content: 'Выберите пожалуйста город',
        position: 'top'
    });
    $('#shop-categories, #save_button').mouseover(function(){
        if($('#shop-categories select:last').val()=='0'){
            $('#shop-categories').tooltipster('show');
            if($(this).attr('id')=='save_button'){
                $('html, body').animate({scrollTop: $('#shop-categories').offset().top}, 500);
            }
        } else {
            $('#shop-categories').tooltipster('hide');
        }
    });

    function replace() {
        if ($('span').is('.xw-hdr-text')) { $('.xw-hdr-text').text('Добавление объявления') };
        if ($('div').is('.myWinError') && $('.myWinError').text() == 'Некорректное наименование товара') {
            $('.myWinError').text('Не указана тема объявления')
        }
        if ($('div').is('.myWinError') && $('.myWinError').text() == 'Некорректная категория товара') {
            $('.myWinError').text('Не указан Раздел/Область/Город')
        }
    }
    setInterval(replace, 100);
}


// Страница пользователя
if (page_id == 'userdetails') {

    // Подгрузка данных
    $.get('http://dobrocredit.ru/php/service/new/user/get_db.php', { 'uid': o_uid, 'gid': gid }, getuser);

    function getuser(data) {
        var user = $.parseJSON(data);
        for (field in user) {
            if (isNaN(field)) {
                if (user[field] != '') {
                    $('#' + field).prepend(user[field]);
                } else {
                    $('#' + field).closest('.row').remove();
                }
            }
        }
    }

    $('.user_header a, .user_social>span').tooltipster({theme: 'tooltipster-light'});

    // Подгрузка обьявлений пользователя
    $.get('http://dobrocredit.ru/php/service/new/user/goods.php?uid='+o_uid, function(data) {
        if (data&&(data.indexOf('Не найдено ни одного товара') == -1)) {
            if(gid==1){
                var header = 'заемщика';
            } else if(gid==2){
                var header = 'займодателя';
            } else if(gid==5){
                var header = 'брокера';
            } else {
                var header = 'пользователя';
            }
            $('.bitem_header').text('Объявления ' + header);
            $('.bitem_goods').html(data);
        } 
    });

    // Отправка предложения пользователю
    $.get('/index/14-0-0-1/', function(data) {
        $('.user_offer>form [name="ssid"]').val($('input[name="ssid"]', data).val());
    });

    $('.user_offer>form').submit(function(){
        $('#eMessage').show();
        _uPostForm($(this), { type: 'POST', url: '/index/' });
        return false;
    });

    // Отзывы
    _hcwp = window._hcwp || [];
    _hcwp.push({ widget: "Stream", widget_id: 73841 });
    (function() {
        if ("HC_LOAD_INIT" in window) return;
        HC_LOAD_INIT = true;
        var lang = (navigator.language || navigator.systemLanguage || navigator.userLanguage || "en").substr(0, 2).toLowerCase();
        var hcc = document.createElement("script");
        hcc.type = "text/javascript";
        hcc.async = true;
        hcc.src = ("https:" == document.location.protocol ? "https" : "http") + "://w.hypercomments.com/widget/hc/73841/" + lang + "/widget.js";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hcc, s.nextSibling);
    })();
}

// Регистрация и редактирование профиля

if(
    (page_id=='register')
    ||
    (location.href.indexOf('register')!=-1)
    ||
    (page_id=='useredit')
    ||
    (uri_id=='page31')
    ||
    ((module_id=='stuff')
        &&
        ((page_id=='main')
            ||
            (page_id=='section')
            ||
            (page_id=='category')
            ||
            (page_id=='add')
            ||
            (page_id=='edit')
        )
    )
    ){
    /*----- Действия при загрузке -----*/

    // Области и города
    var rq_cat = $.get('http://dobrocredit.ru/php/service/new/cats.php',getcats);
    var cats;
    function getcats(data){
        cats = $.parseJSON(data);
        var regions = [];
        for (var i = 0; i < cats.length; i++) {
            if(cats[i].type=='section'){
                regions.push([cats[i].name,cats[i].id]);
            }
        }
        regions.sort();
        for (var i = 0; i < regions.length; i++) {
            $('[name="region"]').append('<option data-id="'+regions[i][1]+'">'+regions[i][0]+'</option>')
        }
        if(page_id=='useredit'){
            loaduserdata();
        }
        if(uri_id=='page31'){
            pushstate();
        }
        if((module_id=='stuff')&&(page_id=='main'||page_id=='section'||page_id=='category')){
            pushstate2();
        }
        if(module_id=='stuff'&&(page_id=='add'||page_id=='edit')){            
            pushstate3();
        }
    }
    $('[name="region"]').change(function(){
        if($(this).val()){
            $('[name="city"]').prop('disabled',false).removeClass('selected').empty().append('<option disabled selected>Выберите город</option>');
            var reg_id = $(':selected',this).data('id');
            var cities = [];
            for (var i = 0; i < cats.length; i++) {
                if(cats[i].section!=undefined&&cats[i].section.id==reg_id){
                    cities.push([cats[i].name,cats[i].id]);
                }
            }
            cities.sort();
            for (var i=0;i<cities.length;i++) {
                $('[name="city"]').append('<option data-id="'+cities[i][1]+'">'+cities[i][0]+'</option>');
            }
        } else {
            $('[name="city"]').prop('disabled',true).removeClass('selected').empty().append('<option disabled selected>Выберите город</option>');
        }
    });

    if(page_id=='useredit'){
        var user_id = (location.href.indexOf('index/11-')!=-1) ? location.href.substr(location.href.indexOf('index/11-')+9) : uid;
        
        // Заполняем поля если анкета есть
        function loaduserdata(){
            $.get('http://dobrocredit.ru/php/service/new/user/get.php',{'uid': user_id}, getuser);
            function getuser(data){
                var user = $.parseJSON(data).data[0].users[0];
                if($.parseJSON(data).data[1]!=undefined){
                    var profile = $.parseJSON(data).data[1].profile[0]
                }
                // Заполняем профиль
                $('[name="name"]').val(user.full_name);
                $('[name="surname"]').val(user.jabber);
                $('#login b').text(user.user);
                if(user.state!=''){
                    $('[name="region"] :contains('+user.state+')').prop('selected',true);
                    $('[name="region"]').change();
                    $('[name="city"] :contains('+user.city+')').prop('selected',true);
                }
                $('[name="mail"]').val(user.email);
                $('[name="phone"]').val(user.phone);
                $('[name="skype"]').val(user.skype);
                $('[name="bday"]').val(user.birthday);
                $('[name="dday"]').val(user.birthday.substr(8,2));
                $('[name="dmo"]').val(user.birthday.substr(5,2));
                $('[name="dyear"]').val(user.birthday.substr(0,4));
                $('[name="gender"] [value="'+user.gender.code+'"]').prop('selected',true);
                $(user.options).each(function(){
                    $('#op'+this.code).prop('checked',true);
                })

                // Заполняем анкету
                if(user.icq=='111111'){
                    $('#type').html('<b>'+user.group.name+'</b><input type="hidden" name="account" value="'+user.group.id+'">').show();
                    for(field in profile){
                        isNaN(field) ? $('[name="'+field+'"]').val(profile[field]) :'';
                    }
                } else{
                    $('#type [value="'+user.group.id+'"]').prop('checked',true); 
                    $('#type').show();      
                }
                ch_acc();

                // Подгружаем социалки
                if (user.uID!='yes') {
                    $(user.signature.split(',')).each(function(){
                        $('.login_register_' + this).addClass('logged');
                    });
                    $('.newpass').remove();
                } else {
                    $('.p_social').remove();
                }

                // Убираем лоадер
                $('.register_preloader').fadeOut();
            };
        };

        // Сообщения подключения соцсетей
        var flag = ['Facebook', 'Вконтакте', 'Google', 'Яндекс', 'Twitter', 'Одноклассники'];
        var params = location.search;
        if(params.indexOf('false1')!=-1){
            _uWnd.alert('<div class="myWinError">E-mail указанный в профиле не соответствует E-mail соцсети</div>','',{w:200,h:70,tm:10000});
        } else if(params.indexOf('false2')!=-1){
            _uWnd.alert('<div class="myWinError">uID пользователи не могут привязывать соцсети</div>','',{w:200,h:70,tm:10000});
        } else if(params.indexOf('done&social')!=-1){
            _uWnd.alert('<div class="myWinSuccess">Отлично! Соцсеть '+flag[params.substr(params.indexOf('=',5)+1)-1]+' добавлена к вам в профиль.</div>','',{w:200,h:70,tm:10000}); 
        } else if(params.indexOf('del&social')!=-1){
            _uWnd.alert('<div class="myWinError">Соцсеть '+flag[params.substr(params.indexOf('=',5)+1)-1]+' удалена из профиля.</div>','',{w:200,h:70,tm:10000}); 
        }
    } else if(uri_id!='page31'&&module_id!='stuff'){
        //Убираем лоадер
        $('.register_preloader').fadeOut();
    }

    /*----- Изменения на странице -----*/

    if(uri_id!='page31'&&module_id!='stuff'){
        // Тип аккаунта
        $('#type input').change(function(){
            ch_acc();
        });
        function ch_acc() {
            var tp = $('#type [name="account"]').attr('type');
            var type = $('#type :checked').val();
            if(type==1) {
                $('.borrower,.p_type,.register td:first-child i').show();
                $('.register tbody').hide();
                $('[name="sign"]').attr('placeholder','Коротко о себе');
                $('[name="info"]').attr('placeholder','Расскажите подробно о себе, Вашей деятельности и прошлых кредитах');
            } else if(type==2||type==5) {
                $('.borrower,.register td:first-child i').hide();
                $('.register tbody').show();
                $('[name="info"]').attr('placeholder','Расскажите подробно о Ваших услугах, преимуществах и условиях');
                if(type==2){
                    $('.creditor,.p_type').show();
                    $('.broker').hide();
                    $('[name="off_title"]').attr('placeholder','В двух словах о ваших услугах. Например, Выдам частный заём');
                    $('[name="sign"]').attr('placeholder','Коротко о себе (например, Дам деньги в долг хорошим людям)');        
                } else {
                    $('.creditor,.p_type').hide();
                    $('.broker').show();
                    $('[name="off_title"]').attr('placeholder','В двух словах о ваших услугах. Например, Помогу оформить кредит.');
                    $('[name="sign"]').attr('placeholder','Коротко о себе');
                }
            }
        };
    
        // Дата рождения
        $('#birtday input').change(function(){
            $('[name="bday"]').val($('[name="dyear"]').val()+'-'+$('[name="dmo"]').val()+'-'+$('[name="dday"]').val())
        })
    
        /*----- Проверка и отправка -----*/
        
        // Валидация
        $('.register input,.register select').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'left'
        });
        $('.register form').validate({
            errorPlacement: function(error, element) {
                $(element).tooltipster('update', $(error).text());
                $(element).tooltipster('show');
            },
            success: function(label, element) {
                $(element).tooltipster('hide');
            },
            rules: {
                name: 'required',
                surname: 'required',
                login: 'required',
                password:{
                    required: true,
                    minlength: 5
                },
                region: 'required',
                city: 'required',
                mail: {
                    required: true,
                    email: true
                },
                phone: {
                    digits: true,
                    minlength: 7
                },
                dday: {
                    required: true,
                    number: true,
                    minlength: 2,
                    maxlength: 2,
                    range:[1,31]
                },
                dmo: {
                    required: true,
                    number: true,
                    minlength: 2,
                    maxlength: 2,
                    range:[1,12]
                },
                dyear: {
                    required: true,
                    number: true,
                    minlength: 4,
                    minlength: 4,
                    range:[1900,2100]
                },
                bday: 'required'
            },
            submitHandler: function(form) {
                $('.register_status').html('<div class="myWinLoadS" title="Загрузка..."></div>');
                var post_url = (page_id=='useredit') ? '/php/service/new/user/edit.php?uid=' + user_id : '/php/service/new/user/register.php';
                $.post(post_url, $(form).serialize(), getresp);
                return false;
            }
        });
    
        // Получаем ответ от сервера
        function getresp(data) {
            var resp = $.parseJSON(data);
            $('.register_status').html(resp.stat);
            if (page_id == 'useredit') {
                _uWnd.alert(resp.win, '', { w: 250, h: 90, tm: 3000 });
                if(resp.stat.indexOf('myWinLoadSD')!=-1){
                    if($.cookie('profile')!=1) {
                        // succ_win();
                        new _uWnd("Success","Успешная регистрация",350,150,{modal:1,close:0},'Поздравляем с успешной регистрацией на сайте ДоброКредит, теперь вы можете Разместить бесплатное объявление на <a href="/shop/doska-objavlenij">финансовой доске объявлений</a>, Задать вопрос на <a href="/forum">форуме</a> либо Воспользоваться <a href="/stuff">Сервисом Анонимных частных займов</a><br><sub>Через несколько секунд произойдет переадресация</sub>');
                        setTimeout(function(){location.href="/shop/0/add"}, 10000);
                    }else{
                        setTimeout(function(){location.reload()}, 500);
                    }
                }
            } else {
                if (resp.stat.indexOf('myWinLoadSD') != -1) {
                    $.post('/index/sub/', {
                        a: 2,
                        rem: 1,
                        ajax: 2,
                        user: $('.register [name="login"]').val(),
                        password: $('.register [name="password"]').val()
                    }, function(a) {
                        setTimeout(function() {
                            location.href = '/';
                        }, 500)
                    });
                } else {
                    _uWnd.alert(resp.win, '', { w: 250, h: 90, tm: 3000 });
                    grecaptcha.reset();
                }
            }
        }

    }
}


// Карта сервис
if(uri_id=='page30'||uri_id=='page32'||uri_id=='page33'){
    $.get('/map.html',getmap);
    function getmap(data) {
        $('.service_map').html(data);
        $('path').tooltipster({
            trigger: 'custom',
            theme: 'tooltipster-light'
        });
        $('path').hover(function() {
            $('path[data-region="'+$(this).data('region')+'"]').attr('data-state', 'hover');
            $(this).tooltipster('content', $(this).data('title'))
            $(this).tooltipster('show');
        }, function() {
            $(this).tooltipster('hide');
            $('path[data-region="' + $(this).data('region') + '"]').removeAttr('data-state');
        })
        $('ellipse,text').hover(function() {
            $('ellipse[data-region="' + $(this).data('region') + '"]').attr('data-state', 'hover');
        }, function() {
            $('ellipse[data-region="' + $(this).data('region') + '"]').removeAttr('data-state');
        });
    
        $('.service_map_toeast').click(function() {
            $('.service_map_west').hide();
            $('.service_map_east').show();
        })
        $('.service_map_towest').click(function() {
            $('.service_map_west').show();
            $('.service_map_east').hide();
        })
        $('path,ellipse,text,.service_map .row a').click(function() {
            var locate;
            switch ($(this)[0].tagName) {
                case 'path':
                    locate = 'region=' + $(this).data('title');
                    break;
                case 'ellipse':
                    locate = 'city=' + $(this).next().children().text();
                    break;
                case 'text':
                    locate = 'city=' + $('tspan', this).text();
                    break;
                case 'A':
                    $(this).data('iscity') ? locate = 'city=' + $(this).text() : locate = 'region=' + $(this).text();
                    break;
            }
            var link_gid;
            switch (uri_id){
                case 'page30':
                    link_gid = 1;
                    break;
                case 'page32':
                    link_gid = 2;
                    break;
                case 'page33':
                    link_gid = 5;
                    break;
            }
            location.href = '/list?gid=' + link_gid + '&' + locate;
        });
    }
}

// Поиск пользователей сервис
if(uri_id=='page31'){

    /*----- Изменения на странице -----*/
    
    $('select').change(function(){
        $(this).val() ? $(this).addClass('selected') : $(this).removeClass('selected');
    });
    
    // Меняем параметры в зависимости от группы
    function searchset(){
        gid = $('[name="gid"]').val();
        if(gid==1){
            $('.service_form_creditor,.service_form_broker').hide();
            $('.service_form_borrower').removeAttr('style');
        }else if(gid==2){
            $('.service_form_borrower,.service_form_broker').hide();
            $('.service_form_creditor').removeAttr('style');
        } else if(gid==5){
            $('.service_form_borrower,.service_form_creditor').hide();
            $('.service_form_broker').removeAttr('style');
        }
    };
    searchset();
    $('[name="gid"]').change(function(){
        searchset();
    })
    
    /*----- Действия при загрузке -----*/
    
    // Определяем функции поиска
    function searchuser(form,page) {
        $('.register_preloader').fadeIn();
        var pgn;
        page ? pgn = page : pgn = 1;

        var params = $(form).find(":input").filter(function(){return $.trim(this.value).length > 0}).serialize()+'&page='+pgn;
        history.pushState(null, null, '/index/0-31?'+params);
        $.get('http://dobrocredit.ru/php/service/new/search.php',params,schresult);
        if(page){$('html, body').animate({scrollTop: $('.service_list').offset().top}, 500);}
    }
    function schresult(data) {
        $('.register_preloader').fadeOut();
        $('.service_list').html(data);
    }
    
    // После подгрузки городов парсим URL
    function pushstate(){
        console.log('pushstate1');
        var locate = location.search.substr(1);
        var lparams = Url.parseQuery(locate);
        if(lparams){
            for (var param in lparams) {
                console.log(param+': '+lparams[param].replace(/\+/g,' '));
                $('[name="'+param+'"]').val(lparams[param].replace(/\+/g,' ')).change();
            }
            if(!lparams['region']&&lparams['city']){
                for (var i = 0; i < cats.length; i++){
                    if(cats[i].section!=undefined&&(cats[i].name == lparams['city'].replace(/\+/g,' '))){
                        $('[name="region"] :contains('+cats[i].section.name+')').prop('selected',true);
                        $('[name="region"]').change();
                        $('[name="city"] :contains('+cats[i].name+')').prop('selected',true);
                        $('[name="city"]').change();
                        searchuser('.service_form',lparams['page']);
                        return false;
                    }
                }
            } else {
                searchuser('.service_form',lparams['page']);
            }
            
        } else {
            // searchuser('.service_form',1);
        }
    }
}

// Cтарый сервис поиск
if((module_id=='stuff')&&(page_id=='main'||page_id=='section'||page_id=='category')){

    /*----- Изменения на странице -----*/

    // Валидация формы и составление поисковой ссылки
    $('.service_search input,.service_search select').tooltipster({
        trigger: 'custom',
        onlyOne: false,
        position: 'left'
    });
    $('.service_search form').validate({
        errorPlacement: function(error, element) {
            $(element).tooltipster('update', $(error).text());
            $(element).tooltipster('show');
        },
        success: function(label, element) {
            $(element).tooltipster('hide');
        },
        rules: {
            term_num: {
                 number: true,
                 range:[1,90],
                 maxlength: 2
            }
        },
        submitHandler: function(form) {
            var searchlink = /stuff/;
            var params = Url.parseQuery($(form).serialize());
            var region = $('[name="region"] :selected').data('id');
            var city = $('[name="city"] :selected').data('id');
            var place = city ? city : region;

            // Область/город + тип
            if(place){
                if(params['type']){
                    searchlink += place+'-1-3-0-0-';
                } else {
                    searchlink += place+'-1-4-0-0-';
                }
            } else {
                if(params['type']){
                    searchlink += '2-1-12-0-0-';
                } else {
                    searchlink += '1-1-12-0-0-';
                }
            }

            // Сумма
            searchlink += params['sum'];
            
            // Срок займа
            if(params['term_num']){
                if(params['term']){
                    searchlink += '-0-' + params['term_num'];
                }else{
                    searchlink += '-' + params['term_num'] + '-0';
                }
            }
            
            // Переходим по сформированной ссылке
            location.href = searchlink+'?type=' + params['type'] + '&region=' + region + '&city=' + city + '&sum=' + params['sum'] + '&term=' + params['term'] + '&term_num=' + params['term_num'];
            return false;
        }
    });

    /*----- Действия при загрузке -----*/

    // Подгружаем последние заявки и предложения
    $.get('http://dobrocredit.ru/php/service/service.php',{cat:1},function(data){
        $('.service_bid tbody').append(data);
    });
    $.get('http://dobrocredit.ru/php/service/service.php',{cat:2},function(data){
        $('.service_offer tbody').append(data);
    });


    // После подгрузки городов парсим URL
    function pushstate2(){
        console.log('pushstate2');
        var locate = location.search.substr(1);
        var lparams = Url.parseQuery(locate);
        if(lparams){
            for (var param in lparams) {
                console.log(param+': '+lparams[param].replace(/\+/g,' '));
                if(param == 'term_num'){
                    $('[name="'+param+'"]').val(lparams[param]);
                } else if(param=='region'||param=='city'){
                    $('[name="'+param+'"] [data-id="'+lparams[param]+'"]').prop('selected',true).change();
                } else {
                    $('[name="'+param+'"][value="'+lparams[param]+'"]').prop('checked',true);
                }
            }
        }
        $('.register_preloader').fadeOut();
    }
}

// Старый сервис добавление заявки
if(module_id=='stuff'&&(page_id=='add'||page_id=='edit')){

    /*----- Изменения на странице -----*/
    $('[type="radio"]').change(function(){
        var valname = $(this).val();
        destroytooltip();
        if(valname=='other2'){
            $('.service_add form').append('<input type="hidden" name="aemail">')
        } else if(valname=='aemail'){
            $('[name="aemail"]').remove();
        } else if(valname=='filter2'){
            $('[name="sum"]').prop('disabled',false);
        } else if(valname=='filter3'){
            $('[name="sum"]').prop('disabled',true);
            if(!$('[value="aemail"]').is(':checked')){
                $('[value="aemail"]').prop('checked',true);
                $('[name="aemail"]').remove();
            }
        } 
        $(this).parent().parent().find('[type="number"]').attr('name',valname);
        inittooltip();
    })

    $('[name="city"]').change(function(){
        $('.ocat_city').val($(':selected',this).data('id'));
    });

    $('[name="attach"]').change(function(){
        $(this).parent().next().toggleClass('hide');
    })

    // Валидация
    function destroytooltip(){
        $('.service_add input,.service_add select').tooltipster('destroy');
    }
    function inittooltip(){
        $('.service_add input,.service_add select').tooltipster({
            trigger: 'custom',
            onlyOne: false,
            position: 'left'
        });
    }
    inittooltip();
    $('.service_add form').validate({
        errorPlacement: function(error, element) {
            $(element).tooltipster('update', $(error).text());
            $(element).tooltipster('show');
        },
        success: function(label, element) {
            $(element).tooltipster('hide');
        },
        rules: {
            aname: {
                required: true,
                number: true,
                range: [3000,100000000  ]
            },
            filter3: {
                required: true,
                number: true,
                range: [1,29]
            },
            filter2: {
                required: true,
                number: true,
                range: [1,90]
            },
            aemail: {
                required: true,
                number: true
            },
            other2: {
                required: true,
                number: true
            },
            region: 'required',
            city: 'required'
        },
        submitHandler: function(form) {

            //Фильтр по сумме
            var bpsum = $(this).val();
            var filter1 = $('[name="filter1"]');
            if (bpsum >= 3000 && bpsum < 10000) {
                filter1.val(1);
            } else if (bpsum >= 10000 && bpsum < 50000) {
                filter1.val(2);
            } else if (bpsum >= 50000 && bpsum <= 100000000) {
                filter1.val(3);
            }

            //Вычисляем сложный процент
            var summ = Number($('[name="aname"]').val());
            var proc = Number($('[name="other2"]').val()) / 100;
            var procstavka = proc / 12;
            var srok = Number($('[name="filter2"]').val());
            var result = srok * (summ * (procstavka + (procstavka / (Math.pow((1 + procstavka), srok) - 1))));
            var m = Math.pow(10, 2);
            if (!isNaN(result)) {
                $('[name="aemail"]').val(Math.round(result * m) / m);
            }
            //Сабмитим форму
            openery();
            return false;
        }
    });

    /*----- Действия при загрузке -----*/
    $('.service_add form').removeAttr('onsubmit');
    
    if(page_id=='edit'){
        var tempfl3 = $('.tempedit [name="filter3"]');
        var tempfl2 = $('.tempedit [name="filter2"]');
        if(tempfl3.length){
            $('.service_add_inner [value="filter3"]').prop('checked',true).change();
            $('.service_add_inner [name="filter3"]').val(tempfl3.val());
        }
        if(tempfl2.length){
            $('.service_add_inner [value="filter2"]').prop('checked',true).change();
            $('.service_add_inner [name="filter2"]').val(tempfl2.val());
            if(tempother2){
                $('.service_add_inner [value="other2"]').prop('checked',true).change();
                $('.service_add_inner [name="other2"]').val(tempother2);
            }
        }
        function pushstate3(){
            console.log('pushstate3');
            $('.tempedit #uCatsMenu7 :checked').each(function() {
                if($(this).val()!=1||$(this).val()!=2){
                    for (var i = 0; i < cats.length; i++){
                        if((cats[i].section!=undefined)&&(cats[i].id == $(this).val())){
                            $('[name="region"] :contains('+cats[i].section.name+')').prop('selected',true);
                            $('[name="region"]').change();
                            $('[name="city"] :contains('+cats[i].name+')').prop('selected',true);
                            $('[name="city"]').change();
                            return false;
                        }
                    }
                }
            })
        }
    }
}

// Кредитный калькулятор
if (uri_id == 'page6') {
    function toformat(str) {
        str = str + '';
        return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    }

    $(function() {
        $('[name="amount"]').keyup(function(e) {﻿
            if (e.which != 37 && e.which != 38 && e.which != 39 && e.which != 40) {
                var val = $(this).val();

                val = val.replace(' ', '');
                val = val.replace(' ', '');
                val = val.replace(' ', '');
                val = val.replace(' ', '');
                val = val.replace(' ', '');

                if (val.substr(0, 1) == 0) {
                    val = val.substr(1, val.length);
                }
                if (val * 1 > $(".calc_tabs li.is-active").data("max") * 1) {
                    val = $(".calc_tabs li.is-active").data("max") * 1;
                }
                $('.calc_slider').slider("value", val);
                $(this).val(toformat(val));
            }﻿
        });﻿
        $(".calc_tabs li").on("click", function(e) {
            e.preventDefault();

            $(".calc_tabs li").removeClass('is-active');
            $(this).addClass('is-active');

            $(".calc_tabs li a").attr('aria-selected', 'false');
            $('a', this).attr('aria-selected', 'true');

            // Slider
            var type_date = $(".calc_tabs li.is-active").data();
            var max = type_date.max;
            var step = type_date.step;

            $(".calc_unit2").text(toformat(max / 2));
            $(".calc_unit3").text(toformat(max));

            $('[name="amount"]').val(0);

            $('.calc_slider').slider({
                range: "min",
                value: 37,
                min: 0,
                max: max,
                step: step,
                slide: function(event, ui) {
                    $('[name="amount"]').val(toformat(ui.value));
                }
            });

        });

        // Slider
        var type_date = $(".calc_tabs li.is-active").data();
        var max = type_date.max;
        var step = type_date.step;

        $('.calc_slider').slider({
            range: "min",
            value: 37,
            min: 0,
            max: max,
            step: step,
            slide: function(event, ui) {
                $('[name="amount"]').val(toformat(ui.value));
            }
        });
    });

    $(function() {
        (function() {
            $('.calc_submit').click(function() {
                calculateCredit();
                $('.calc_result').show()
            })

            function calculateCredit() {
                var total = parseInt($('[name="amount"]').val().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
                var period = $('[name="period"]').val();
                var percent = parseFloat($('[name="percent"]').val());

                var currency = $('[name=currency]').val();
                $('.calc_result').empty();
                $('.calc_result').append('<tr><th>Месяц</th><th>Остаток по кредиту (' + currency + ')</th><th>Еже&shy;месячный платеж (' + currency + ')</th></tr>');

                var left = total;
                var sum_pay = 0;
                var month_percent = percent / 12 / 100;

                if ($('[name="pay_type"]').val() == 'Аннуитетные платежи (равные)') {
                    var e = Math.pow(1 + month_percent, period);
                    var k = (month_percent * e) / (e - 1);
                    var month_pay = Math.round(k * total * 100) / 100;

                    for (var i = 0; i < period; i++) {
                        $('.calc_result').append('<tr><td>' + (i + 1) + '</td><td>' + left + '</td><td>' + month_pay + '</td></tr>'); // <td>' + percent + '%</td>
                        left = Math.round((left + left * month_percent - month_pay) * 100) / 100;
                        sum_pay = Math.round((sum_pay + month_pay) * 100) / 100;
                    }
                } else {
                    var month_pay = Math.round(total / period * 100) / 100;

                    for (var i = 0; i < period; i++) {
                        var this_month_pay = Math.round((left * month_percent + month_pay) * 100) / 100;

                        $('.calc_result').append('<tr><td>' + (i + 1) + '</td><td>' + left + '</td><td>' + this_month_pay + '</td></tr>');
                        left = Math.round((left + left * month_percent - this_month_pay) * 100) / 100;
                        sum_pay = Math.round((sum_pay + this_month_pay) * 100) / 100;
                    }
                }

                $('.calc_result').append('<tr><td colspan="3">Итого:</td></tr><tr><td>' + period + '</td><td>' + total + '</td><td>' + sum_pay + '</td></tr>'); // <td class="result2">' + percent + '%</td>
            }
        })();
    });
    
    $('.calc_inner i').tooltipster({
        theme: 'tooltipster-light',
        contentAsHTML: true,
        position: 'right'
    });

    var credit_details = false;
    try {
        credit_details = [
            ["Потребительский кредит", "3 месяца, 6 месяцев, 1 год, 2 года, 3 года, 5 лет, 10 лет", "15%, 20%, 25%, 30%, 35%"],
            ["Быстрый кредит", "3 месяца, 6 месяцев, 1 год, 2 года, 3 года, 5 лет", "15%, 20%, 25%, 30%, 35%, 40%"],
            ["Кредитная карта", "1 год, 2 года, 3 года", "14%, 16%, 18%, 20%, 25%"],
            ["Автокредит", "1 год, 2 года, 3 года, 5 лет, 10 лет", "15%, 20%, 25%"],
            ["Ипотека", "5 лет, 10 лет, 15 лет, 20 лет, 25 лет", "5%, 10%, 15%"],
            ["Целевой кредит", "3 месяца, 6 месяцев, 1 год, 2 года, 3 года, 5 лет, 10 лет", "15%, 20%, 25%"],
            ["Кредит ИП", "3 месяца, 6 месяцев, 1 год, 2 года, 3 года, 5 лет, 10 лет", "10%, 15%, 20%"],
            ["Кредит бизнесу", "3 месяца, 6 месяцев, 1 год, 2 года, 3 года, 5 лет, 10 лет", "10%, 15%, 20%"]
        ];
    } catch (e) {
        alert('Ошибка в заполнении данных калькулятора');
    }
}

if(module_id=='dir'||module_id=='load'){  
    // var usrarids = {};
    // function ustarrating(id, mark) {
    //     if (!usrarids[id]) {
    //         usrarids[id] = 1;
    //         $(".u-star-li-"+id).hide();
    //         _uPostForm('', {type:'POST', url:'/dir/', data:{'a':'65','id':id,'mark':mark,'mod':'dir','ajax':'2'}});
    //     }
    // }
    $('.banks_search_switch>a').click(function(){
        $('.banks_search_switch>a').removeAttr('aria-selected');
        $(this).attr('aria-selected','true');
    });
    $('.banks_search_switch input').change(function(){
        var action = $('.banks_search_input').attr('action');
        (action == '/dir/') ? $('.banks_search_input').attr('action','/dir/?nko') : $('.banks_search_input').attr('action','/dir/');
    })
}
