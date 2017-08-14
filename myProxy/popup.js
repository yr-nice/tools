var _bg = chrome.extension.getBackgroundPage();
var _expanded = null;
var _enabled = null;
var _showingMenus = true;

var _loadingEl = function() {
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
};

var _showMenus = function() {
    if(_showingMenus) return;
    
    _showingMenus = true;
    
    $('#enable_menu').slideToggle(150);
    $('#disable_menu').slideToggle(150);
    $('#import_expand').slideToggle(150);
    $('#captcha_expand').slideToggle(150);
    $('#remove_expand').slideToggle(150);
    $('#step_by_step_menu').slideToggle(150);
    $('#test_menu').slideToggle(150);
    $('#test2_menu').slideToggle(150);
};

var _hideMenus = function() {
    if(!_showingMenus) return;
    
    _showingMenus = false;
    
    $('#enable_menu').slideToggle(150);
    $('#disable_menu').slideToggle(150);
    $('#import_expand').slideToggle(150);
    $('#captcha_expand').slideToggle(150);
    $('#remove_expand').slideToggle(150);
    $('#step_by_step_menu').slideToggle(150);
    $('#test_menu').slideToggle(150);
    $('#test2_menu').slideToggle(150);
};

var _showError = function(e) {
    $('#error_msg').text('Error: ' + e);
    $('#error_msg').fadeIn(400);
    
    setTimeout(function() {
        $('#error_msg').fadeOut(600);
    }, 2100);
};

var _captchaLoading = function(se) {
    $('#captcha_data').hide();
    
    $('#captcha_load').append(_loadingEl());
    $('#captcha_load').show();
    
    if(!se && _expanded !== '#captcha')
        _toggleCaptcha();
    
    _setupLoading(true);
};

var _removeCaptchaLoading = function() {
    $('#captcha_load').hide();
    $('#captcha_load').text('');
    
    $('#captcha_data').show();
    
    $('#setup_servers').remove('.loading_div');
    $('#setup_servers').removeClass('loading');
};

var _importLoading = function(se) {
    $('#import_data').hide();
    
    $('#import_load').append(_loadingEl());
    $('#import_load').show();
    
    
    if(!se && !_bg.ProxySwitcher.importWindow && _expanded !== '#import')
        _activateImport();
    
    _setupLoading(true);
};

var _removeImportLoading = function() {
    $('#import_load').hide();
    $('#import_load').text('');
    
    $('#import_data').show();
    
    $('#setup_servers').remove('.loading_div');
    $('#setup_servers').removeClass('loading');
};

var _removeLoading = function(se) {
    if(!_bg.ProxySwitcher.hasLogin && !se) {
        $('#remove_data').hide();
    
        $('#remove_load').append(_loadingEl());
        $('#remove_load').show();
    
        if(_expanded !== '#remove')
            _activateRemove();
            
        _setupLoading(true);
    }
    else if(_bg.ProxySwitcher.hasLogin) {
        _captchaLoading();
    }
};

var _removeRemoveLoading = function() {
    $('#remove_load').hide();
    $('#remove_load').text('');
    
    $('#remove_data').show();
    
    if(_bg.ProxySwitcher.hasLogin) {
        _removeCaptchaLoading();
    }
};

var _setupLoading = function(se) {
    $('#setup_servers').text('');
    $('#setup_servers').addClass('loading');
    $('#setup_servers').append(_loadingEl());
    
    if(!se && _expanded !== '#setup')
        _activateSetup();
};

var _showLoading = function(se) {
    if(!_bg.ProxySwitcher.poploading || !_bg.ProxySwitcher.poploading.v)
        return;
        
    var p = _bg.ProxySwitcher.poploading.c;
    
    if(p === 1) {
        _captchaLoading(se);
    }
    else if(p === 2) {
        _importLoading(se);
    }
    else if(p === 3) {
        _removeLoading(se);
    }
};

var _populateServers = function() {
    $('#setup_servers').text('');
    $('#setup_servers').removeClass('loading');
     
    _bg.ProxySwitcher.populate($('#setup_servers').get(0));
};

var _populateImport = function() {    
    if(!_bg.ProxySwitcher.rawUserData || typeof _bg.ProxySwitcher.rawUserData.s !== 'string' && typeof _bg.ProxySwitcher.rawUserData.fn !== 'string') {
        $('#import_proxies').val('');
        $('#import_name').text('No File Chosen');
        $('#import_name').attr('title', '');
        return;
    }
    
    var f = _bg.ProxySwitcher.rawUserData.fn;
    if(f.length) {
        $('#import_name').text(f.length > 25 ? f.substr(0, 25) + '...' : f);
        $('#import_name').attr('title', f);
        $('#import_name').removeClass('import_placeholder');
    }
    else {
        $('#import_name').text('No File Chosen');
        $('#import_name').attr('title', '');
    }
    $('#import_proxies').val(_bg.ProxySwitcher.rawUserData.s);
};

var _expand = function(s) {
    _expanded = s;
    $(_expanded + '_holder').slideToggle(200);
    $(_expanded + '_expand').addClass('highlighted');
    $(_expanded + '_expand .arrow-up').show(10);
    $(_expanded + '_expand .arrow-down').hide(10);
};

var _contract = function() {
    $(_expanded + '_holder').slideToggle(200);
    $(_expanded + '_expand').removeClass('highlighted');
    $(_expanded + '_expand .arrow-up').hide(10);
    $(_expanded + '_expand .arrow-down').show(10);
    _expanded = null;
};

var _toggleCaptcha = function() { 
    if(_expanded === null) {
        _expand('#captcha');
    } else if(_expanded === '#captcha') {
        _contract();
    }
    else {
        _contract();
        _expand('#captcha');
    }
};

var _toggleRemove = function(u, p) {
    if(u === null && _expanded !== '#remove') {
        $('#username').val('');
        $('#password').val('');
    }
    else if(typeof u === 'string' && typeof p === 'string') {
        $('#username').val(u);
        $('#password').val(p);
    }
    
    if(_expanded === null) {
        _expand('#remove');
        $('#username').val(u || '');
        $('#password').val(p || '');
    } else if(_expanded === '#remove') {
        _contract();
    }
    else {
        _contract();
        _expand('#remove')
        $('#username').val(u || '');
        $('#password').val(p || '');
    }
};

var _activateSetup = function() {
    if(!_bg.ProxySwitcher.hasProxies() && !_bg.ProxySwitcher.poploading) return;
    
    if(_expanded === null) {
        _expand('#setup');
        _hideMenus();
    } else if(_expanded === '#setup') {
        _contract();
        _showMenus();
    }
    else {
        _contract();
        _expand('#setup');
        _hideMenus();
    }
};

var _activateCaptcha = function() {
    if(_expanded === '#captcha') {
        _toggleCaptcha();
        return;
    }
    
    _bg.ProxySwitcher.checkLogin(_toggleCaptcha);
    
    $('#captcha_image').attr({src: _bg.ProxySwitcher.captcha_url + '?t=' + Date.now()});
    $('#captcha_response').val('');
    
    _contract();
};

var _activateRemove = function() {
    if(_expanded === '#remove') {
        _toggleRemove(null);
        return;
    }
    
    _bg.ProxySwitcher.getLogin(_toggleRemove);
};

var _activateImport = function() {
    if(_expanded === null) {
        _expand('#import');
    } else if(_expanded === '#import') {
        _contract();
    }
    else {
        _contract();
        _expand('#import');
    }
};

var _activateEnable = function() {
    _bg.ProxySwitcher.enableProxy();
};

var _activateDisable = function() {
    _bg.ProxySwitcher.disableProxy();
};

var _activateStepByStep = function() {
    if(!_bg.ProxySwitcher.sbsTab) {
        chrome.tabs.create({url:'step-by-step.html'}, function(t) {
            _bg.ProxySwitcher.sbsTab = t.id;
        });
        return;
    }
    
    chrome.tabs.get(_bg.ProxySwitcher.sbsTab, function(t) {
        if(!t) {
            chrome.tabs.create({url:'step-by-step.html'}, function(t) {
                _bg.ProxySwitcher.sbsTab = t.id;
            });
            return;
        }
        
        chrome.tabs.update(_bg.ProxySwitcher.sbsTab, {active: true}, function(tt) {
            _bg.ProxySwitcher.sbsTab = tt.id;
        });
    });
};
var _callback = function(fn, ctx) {
    return function() {
        fn.apply(ctx, arguments);
    };
};

var test2 = function(){
    chrome.tabs.create({url:'http://www.zimuzu.tv/'});
}


var test = function(){
    //console.log("test");
    //console.log(_bg.ProxySwitcher.getUserProxies())
    //console.log(_bg.ProxySwitcher.rawUserData.s)
    //console.log(_bg.ProxySwitcher.proxies)
    //console.log(_bg.ProxySwitcher.userProxies)

    var curSelected = $('#setup_servers .server-item-selected');
    if(!curSelected.is('div'))
    {
        $($('#setup_servers .server-item')[0]).click();
        console.log("Testing " + $($('#setup_servers .server-item')[0]).html());
    }
    else
    {
        if(curSelected.next().is('div'))
        {
            curSelected.next().click();
            console.log("Testing " + curSelected.next().html());
        }
        else
        {

            console.log("Finished!");
            return;
        }
    }

    setTimeout(testZMZ, 1000);

};

var testZMZ = function(){

    var request = new XMLHttpRequest();
        
        request.open('GET', "http://www.zimuzu.tv/", true);
        
        request.onreadystatechange = _callback(function() 
        {
            //console.log("readyState: " + request.readyState);
            if(request.readyState === 4) 
            {
                console.log("status: " + request.status);
                if(request.status === 200) 
                {
                    $('#setup_servers .server-item-selected').css('font-weight', 'bold');
                    console.log("Success! " + $('#setup_servers .server-item-selected').html());
                    console.log("responseText: " + request.responseText);

                    chrome.tabs.create({url:'http://www.zimuzu.tv/'});
                    _hideMenus();
                    return;
                }
                else
                {
                    $('#setup_servers .server-item-selected').css('font-weight', 'normal');
                    console.log("Failed! " + $('#setup_servers .server-item-selected').html());
                }
                test();
            }
        }, this);

        request.timeout = 3000; // Set timeout to 4 seconds (4000 milliseconds)
        request.ontimeout = function () {
                 $('#setup_servers .server-item-selected').css('font-weight', 'normal');
                 console.log("Timeout! " + $('#setup_servers .server-item-selected').html());
        }
        
        request.send();

};




$('.base').on('keydown', function(e) {
    if(e.shiftKey && e.ctrlKey) {
        var handled = true;
        switch(e.which) {
            case 80:    _activateSetup();
                        break;
            case 69:    _activateEnable();
                        break;
            case 68:    _activateDisable();
                        break;
            case 73:    _activateImport();
                        break;
            case 83:    _activateCaptcha();
                        break;
            case 82:    _activateRemove();
                        break;
            case 71:    _activateStepByStep();
                        break;
            default:    handled = false;
                        break;
        }
        
        if(handled) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
});

$('#setup_expand').on('click', function(e) {
    if(e.button !== 0) return;
    console.log('setup_expand');
    _activateSetup();
});

$('#enable_menu').on('click', function(e) {
    if(e.button !== 0) return;
    if(_enabled === true) return;
    console.log('enable_menu');
    _activateEnable();
});

$('#test_menu').on('click', function(e) {
    console.log('#test_menu');
    test();
});

$('#test2_menu').on('click', function(e) {
    console.log('#test_menu');
    test2();
});

$('#disable_menu').on('click', function(e) {
    if(e.button !== 0) return;
    if(_enabled === false) return;
    console.log('disable_menu');
    _activateDisable();
});

$('#captcha_expand').on('click', function(e) {
    if(e.button !== 0) return;
    _activateCaptcha();
});

$('#captcha_response').on('keypress', function(e) {
    if(e.which == 13) {
        _bg.ProxySwitcher.checkCaptcha($('#captcha_response').get(0).value);
    }
});

$('#captcha_submit').on('click', function(e) {
    if(e.button !== 0) return;
    
    _bg.ProxySwitcher.checkCaptcha($('#captcha_response').get(0).value);
});

$('#captcha_reset').on('click', function(e) {
    if(e.button !== 0) return;
    $('#captcha_image').attr({src: _bg.ProxySwitcher.captcha_url + '?t=' + Date.now()});
    $('#captcha_response').val('');
});

$('#remove_expand').on('click', function(e) {
    if(e.button !== 0) return;
    _activateRemove();
});

$('#password').on('keypress', function(e) {
    if(e.which == 13) {
        if(_bg.ProxySwitcher.saveLogin($('#username').get(0).value, $('#password').get(0).value)) {
            _contract();
        }
    }
});

$('#remove_submit').on('click', function(e) {
    if(e.button !== 0) return;
    
    if(_bg.ProxySwitcher.saveLogin($('#username').get(0).value, $('#password').get(0).value)) {
        _contract();
    }
});

$('#remove_register').on('click', function(e) {
    if(e.button !== 0) return;
    
    chrome.tabs.query({url: 'http://best-proxy.com/english/register.php?package=surfer'}, function(t) {
        if(!t || !t.length) {
            chrome.tabs.create({url: 'http://best-proxy.com/english/register.php?package=surfer'});
            return;
        }
        
        chrome.tabs.update(t[0].id, {active:true});
    });
    
    _contract();
});

$('#import_expand').on('click', function(e) {
    if(e.button !== 0) return;
    _activateImport();
});

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
        _contract();
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

$('#import_from').on('click', function(e) {
    if(e.button !== 0) return;
    if(_bg.ProxySwitcher.importWindow) {
        chrome.windows.get(_bg.ProxySwitcher.importWindow, function(w) {
            if(!w) {
                chrome.windows.create({url: 'file_input.html', width: 430, height: 375, focused: true, type: 'popup'}, function(ww) {
                    _bg.ProxySwitcher.importWindow = ww.id;
                });
                return;
            }
        
            chrome.windows.update(_bg.ProxySwitcher.importWindow, {focused: true}, function(ww) {
                _bg.ProxySwitcher.importWindow = ww.id;
            });
        });
    }
    else {
        chrome.windows.create({url: 'file_input.html', width: 430, height: 375, focused: true, type: 'popup'}, function(w) {
            _bg.ProxySwitcher.importWindow = w.id;
        });
    }
    
    _contract();
});

$('#import_cancel').on('click', function(e) {
    if(e.button !== 0) return;
    _contract();
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

$('#step_by_step_menu').on('click', function(e) {
    if(e.button !== 0) return;
    _activateStepByStep();
});

chrome.runtime.onMessage.addListener(function(o) {
    _bg.ProxySwitcher.msgsent = false;
    
    if(o.msg === 'loading') {
        _showLoading();
        _populateImport();
    }
    else if(o.msg === 'populate') {
        _populateServers();
        _populateImport();
        
        if(_bg.ProxySwitcher.poploading && _bg.ProxySwitcher.poploading.v) {
            if(_bg.ProxySwitcher.poploading.c === 1)
                _removeCaptchaLoading();
            else if(_bg.ProxySwitcher.poploading.c === 2)
                _removeImportLoading();
            else if(_bg.ProxySwitcher.poploading.c === 3)
                _removeRemoveLoading();
                
            _bg.ProxySwitcher.poploading = null;
            
            if(_expanded !== '#setup')
                _activateSetup();
        }
        
        if(!_bg.ProxySwitcher.selected) {
            _enabled = false;
            $('#enable_menu').removeClass('disabled');
            $('#disable_menu').addClass('disabled');
        }
    }
    else if(o.msg === 'error') {
        if(typeof o.e === 'string') {
            _showError(o.e);
        }
        
        _populateServers();
        
        if(_bg.ProxySwitcher.poploading && _bg.ProxySwitcher.poploading.v) {
            if(_bg.ProxySwitcher.poploading.c === 1) {
                _removeCaptchaLoading();
                if(_expanded !== '#captcha')
                    _toggleCaptcha();
            }
            else if(_bg.ProxySwitcher.poploading.c === 2) {
                _removeImportLoading();
                _populateImport();
                if(_expanded !== '#import')
                    _activateImport();
            }
            else if(_bg.ProxySwitcher.poploading.c === 3) {
                _removeRemoveLoading();
                if(_expanded !== '#remove')
                    _activateRemove();
                if(_expanded === '#setup') {
                    _contract();
                    _showMenus();
                }
            }
            _bg.ProxySwitcher.poploading = null;
        }
    }
    else if(o.msg === 'enabled') {
        _enabled = true;
        $('#enable_menu').addClass('disabled');
        $('#disable_menu').removeClass('disabled');
        
        if(_expanded === '#setup') {
            _contract();
            _showMenus();
        }
    }
    else if(o.msg === 'disabled') {
        _enabled = false;
        $('#enable_menu').removeClass('disabled');
        $('#disable_menu').addClass('disabled');
        
        if(_expanded === '#setup') {
            _contract();
            _showMenus();
        }
    }
});

_populateServers();

_populateImport();

if(_bg.ProxySwitcher.enabled) {
    _enabled = true;
    $('#enable_menu').addClass('disabled');
    $('#disable_menu').removeClass('disabled');
}
else {
    _enabled = false;
    $('#enable_menu').removeClass('disabled');
    $('#disable_menu').addClass('disabled');
}

if(!_bg.ProxySwitcher.msgsent)
    _showLoading(true);
else {
    _bg.ProxySwitcher.msgsent = false;
    if(_bg.ProxySwitcher.loading)
        _showLoading(true);
    else
        _bg.ProxySwitcher.poploading = null;
}
    
$('.base').focus();