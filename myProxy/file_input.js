var _bg = chrome.extension.getBackgroundPage();

_loadingEl = (function() {
    var el, l, m;
    
    el = document.createElement('div');
    el.className = 'loading_div';
    
    l = document.createElement('div');
    l.className = 'loading_img';
    
    m = document.createElement('div');
    m.className = 'loading_msg';
    m.textContent = 'Please wait, loading...';
    
    el.appendChild(l);
    el.appendChild(m);
    
    return el;
})();

var _showLoading = function(se) {
    $('#import_data').hide();
    
    $('#import_load').append(_loadingEl);
    $('#import_load').show();
};

$('#import_proxies').on('input', function(e) {
    var s = $('#import_proxies').get(0).value.match(/([0-9]{1,3})\s*\.\s*([0-9]{1,3})\s*\.\s*([0-9]{1,3})\s*\.\s*([0-9]{1,3})[^\d]+(?:[1-9]?[0-9]{1,4})/g);

    $('#import_name').text('No File Chosen');
    $('#import_name').attr('title', '');
    $('#import_name').addClass('import_placeholder');
    
    _bg.ProxySwitcher.setRawUserData(s && s.length ? s.join('\n') : '', '');
});

$('#import_save').on('click', function(e) {
    if(e.button !== 0) return;
    
    var s = $('#import_proxies').get(0).value.match(/([0-9]{1,3})\s*\.\s*([0-9]{1,3})\s*\.\s*([0-9]{1,3})\s*\.\s*([0-9]{1,3})[^\d]+(?:[1-9]?[0-9]{1,4})/g),
        a = [], sv, pt;

    if(!s || !s.length) {
        _bg.ProxySwitcher.setRawUserData('', '');
        _bg.ProxySwitcher.removeUserProxies();
        return;
    }
    
     $('#import_proxies').val(s.join('\n'));
    _bg.ProxySwitcher.setRawUserData(s.join('\n'), $('#import_name').attr('title') || '');
    
    for(var i=0; i<s.length; ++i) {
        sv = s[i].match(/([0-9]{1,3})\s*\.\s*([0-9]{1,3})\s*\.\s*([0-9]{1,3})\s*\.\s*([0-9]{1,3})/g);
        pt = s[i].replace(/([0-9]{1,3})\s*\.\s*([0-9]{1,3})\s*\.\s*([0-9]{1,3})\s*\.\s*([0-9]{1,3})/g, '').match(/[1-9]?[0-9]{1,4}/g);
        
        if(sv !== null && pt !== null)
            a.push(sv[0]+':'+pt[0]);
    }
    
    a = a.join('|');
    
    console.log(a);
    _bg.ProxySwitcher.getUserProxies(a);
});

$('#import_cancel').on('click', function(e) {
    if(e.button !== 0) return;
    chrome.runtime.sendMessage({msg: 'close_import'});
});

$('#import_browse').on('click', function(e) {
    if(e.button !== 0) return;
    $('#import_file').trigger('click');
});

$('#import_file').change(function() {
    var file = this.files[0],
        reader = new FileReader();

    reader.addEventListener('load', function() {
        var s = event.target.result.match(/([0-9]{1,3})\s*\.\s*([0-9]{1,3})\s*\.\s*([0-9]{1,3})\s*\.\s*([0-9]{1,3})[^\d]+(?:[1-9]?[0-9]{1,4})/g);
        if(s && s.length) {
            $('#import_name').text(file.name.length > 25 ? file.name.substr(0, 25) + '...' : file.name);
            $('#import_name').attr('title', file.name);
            $('#import_name').removeClass('import_placeholder');
            $('#import_proxies').val(s.join('\n'));
            
            _bg.ProxySwitcher.setRawUserData(s.join('\n'), file.name);
        }
    }, false);
    
    reader.readAsText(file);
    $('#import_file').val('');
});

chrome.runtime.onMessage.addListener(function(e) {
    if(e.msg === 'populate') {
        chrome.runtime.sendMessage({msg: 'close_import'});
        return;
    }
    
    if(!_bg.ProxySwitcher.poploading || !_bg.ProxySwitcher.poploading.v || _bg.ProxySwitcher.poploading.c !== 2)
        return;
        
    if(e.msg === 'loading') {
        _showLoading();
    }
    else if(e.msg === 'error') {
        chrome.runtime.sendMessage({msg: 'close_import'});
    }
});

if(_bg.ProxySwitcher.rawUserData && typeof _bg.ProxySwitcher.rawUserData.s === 'string' && typeof _bg.ProxySwitcher.rawUserData.fn === 'string') {
    var f = _bg.ProxySwitcher.rawUserData.fn;
    if(f.length) {
        $('#import_name').text(f.length > 25 ? f.substr(0, 25) + '...' : f);
        $('#import_name').attr('title', f);
        $('#import_name').removeClass('import_placeholder');
        $('#import_proxies').val(_bg.ProxySwitcher.rawUserData.s);
    }
}