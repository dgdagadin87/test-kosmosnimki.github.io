$(document).ready(function(){

    var sock = {};
    try{
        sock = new WebSocket('ws://' + window.location.host + '/' + getConnectionName() + '/ws');
    }
    catch(err){
        sock = new WebSocket('wss://' + window.location.host + '/ws');
    }

    $('#sync-button').click(function(){

        var checkBoxes = $('.sync-checkbox');
        var items = [];

        checkBoxes.each(function(i, syncCheckbox){
            var currentItem = $(syncCheckbox);
            var isChecked = currentItem.prop('checked');
            var currentId = currentItem.attr('itemId');

            if (isChecked) {
                items.push(currentId)
            }
        });

        if (items.length < 1) {
            alert('Выберите категории для синхронизации');
            return;
        }

        sock.send(JSON.stringify({
            msg_type: 'COMMON_START_SYNC',
            msg_data: items.join(',')
        }));
    });

    sock.onopen = function(){
        console.log('Connection to server started');
    };

    sock.onmessage = function(event) {

        var data = event.data || '{}';console.log(data);
        //console.log(JSON.parse(data))
    };

    sock.onclose = function(event){
        if(event.wasClean){
            console.log('Clean connection end');
        }
        else{
            console.log('Connection broken');
        }
    };

    sock.onerror = function(error){
        console.log(error);
    };
});

function addZero(x,n) {
    while (x.toString().length < n) {
        x = '0' + x;
    }
    return x;
}

function getFullTime() {
    var d = new Date();
    var h = addZero(d.getHours(), 2);
    var m = addZero(d.getMinutes(), 2);
    var s = addZero(d.getSeconds(), 2);
    var ms = addZero(d.getMilliseconds(), 3);
    return (String(h) + String(m) + String(s) + String(ms));
}

function getLength() {

    return Object.keys(window.syncData).length;
}

function getConnectionName() {

    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    if (isOpera) {
        return 'opera';
    }

    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';
    if (isFirefox) {
        return 'firefox';
    }

    // Safari 3.0+ "[object HTMLElementConstructor]"
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    if (isSafari) {
        return 'safari';
    }

    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    if (isIE) {
        return 'ie';
    }

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;
    if (isEdge) {
        return 'edge';
    }

    // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore;
    if (isChrome) {
        return 'chrome';
    }

    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS;
    if (isBlink) {
        return 'blink';
    }
}

function renderLog() {}