var _isChildOf = function(p, c) {
    if(p === c)
        return false;
    
    while(c && c !== p) {
        c = c.parentNode;
    }
    
    return c === p;
};

var _addListener = function(t, e, f, ctx) {
    var fn = function(e) {
	    f.call(ctx, e, this);
	};
	
	t.addEventListener(e, fn, false);
    
    return fn;
};

var _callback = function(fn, ctx) {
	return function() {
		fn.apply(ctx, arguments);
	};
};

var _map = function(a, b) {
    if(!a || !a.length) return;
    
    var m = {};
    
    if(typeof a === 'string') {
        m[a] = b;
        return m;
    }
    
    for(var i=0; i<a.length; i+=2) {
        m[a[i]] = a[i+1];
    }
    
    return m;
};

var ServerItem = function(o, t, s, p, c, n, l, us, i) {
    this.o = o;
    
    this.us = us;
    this.i = i;
    this.t = t === 1 ? 'img/icons/bypass.png' : 'img/icons/anonymous.png';
    this.s = false;
    
    this.sp = {s: s, p: p};
    this.c = c;
    
    this.holder = document.createElement('div');
	this.holder.className = 'server-item';
	this.holder.title = n + ' ('+this.c+') ' + this.sp.s +' : ' + this.sp.p;
    
    this.type = document.createElement('span');
    this.type.className = 'server-item-type';
    
    this.svpt = document.createElement('span');
    this.svpt.className = 'server-item-text server-item-sp';
    this.svpt.innerHTML = '&nbsp;' + this.sp.s + ':' + this.sp.p;
    
	this.flag = document.createElement('span');
	this.flag.className = 'server-item-flag';
	
	this.name = document.createElement('span');
	this.name.className = 'server-item-text server-item-name';
	this.name.innerHTML = n.replace(/\&nbsp;/g, ' ').substr(0, 12).replace(/\s/g, '&nbsp;');

    this.city = document.createElement('city');
    this.city.className = 'server-item-text server-item-city';
    this.city.innerHTML = l.replace(/\&nbsp;/g, ' ').substr(0, 12).replace(/\s/g, '&nbsp;');
    
    this.holder.appendChild(this.type);
    this.holder.appendChild(this.svpt);
	this.holder.appendChild(this.flag);
	this.holder.appendChild(this.name);
    this.holder.appendChild(this.city);
	
	this.init();
};

ServerItem.prototype.init = function() {
    if(this._listeners) {
        this.holder.removeEventListener('click', this._listeners.click);
        this.holder.removeEventListener('mouseover', this._listeners.mouseover);
        this.holder.removeEventListener('mouseout', this._listeners.mouseout);
    }
    
    this._listeners = this._listeners || {};
    
    this._removeHighlight();
	this.unselect();
	
    this._listeners.click = _addListener(this.holder, 'click', this.click, this);
	this._listeners.mouseover = _addListener(this.holder, 'mouseover', this.mouseOver, this);
	this._listeners.mouseout = _addListener(this.holder, 'mouseout', this.mouseOut, this);
	
	
    this.type.style.backgroundImage = 'url('+this.t+')';
    
	var c = (this.o.flags.test(this.c) ? this.c : 'unknown');
	this.flag.style.backgroundImage = 'url(img/flags/'+c+'.png)';
};

ServerItem.prototype._removeHighlight = function() {
	if(!this._h) return;
    this.holder.classList.remove('server-item-highlight');
	this._h = false;
};

ServerItem.prototype._addHighlight = function() {
	if(this._h) return;
    this.holder.classList.add('server-item-highlight');
	this._h = true;
};

ServerItem.prototype.select = function() {
	if(this.s) return;

	this.holder.classList.add('server-item-selected');
	
	this.s = true;
};

ServerItem.prototype.unselect = function() {
	if(!this.s) return;	
	
	this.holder.classList.remove('server-item-selected');
	
	this.s = false;
};

ServerItem.prototype.enable = function() {
	this.select();
	this.o.enable(this.us, this.i, this.sp, this.c);
};

ServerItem.prototype.disable = function() {
    this.unselect();
    this.o.disable();
};

ServerItem.prototype.mouseOver = function(e, t) {
    if(t === e.relatedTarget || _isChildOf(t, e.relatedTarget))
	    return;
	
	this._addHighlight();
};

ServerItem.prototype.mouseOut = function(e, t) {
    if(t === e.relatedTarget || _isChildOf(t, e.relatedTarget))
	    return;
	
	this._removeHighlight();
};

ServerItem.prototype.click = function(e) {
    if(e.button !== 0) return;
	
	if(!this.s) 
		this.enable();
    else
        this.disable();
};

var ProxySwitcher = {
    selected: null,
    enabled: null,
    loading: null,
    proxies: null,
    userProxies: null,
    hasLogin: null,
    rawUserData: null,
    sn: null,
    
    importWindow: null,
    sbsTab: null,
    poploading: null,
    msgsent: null,
    
    first_url: 'http://proxy-list.org/engine/proxylist.php?firsttime=',
    service_url: 'http://proxy-list.org/engine/proxylist.php',
    user_url: 'http://best-proxy.com/engine/proxylist.php?country=',
    captcha_url: 'http://proxy-list.org/engine/captcha.php',
    
    flags: /AD|AE|AF|AG|AI|AL|AM|AN|AO|AR|AS|AT|AU|AW|AZ|BA|BB|BD|BE|BF|BG|BH|BI|BJ|BM|BN|BO|BR|BS|BT|BW|BY|BZ|CA|CD|CF|CG|CH|CI|CK|CL|CM|CN|CO|CR|CS|CU|CV|CY|CZ|DE|DJ|DK|DM|DO|DZ|EC|EE|EG|ER|ES|ET|FI|FJ|FK|FM|FO|FR|GA|GB|GD|GE|GH|GI|GL|GM|GN|GQ|GR|GT|GU|GW|GY|HK|HN|HR|HT|HU|ID|IE|IL|IN|IO|IQ|IR|IS|IT|JM|JO|JP|KE|KG|KH|KI|KM|KN|KR|KW|KY|KZ|LA|LB|LC|LI|LK|LR|LS|LT|LU|LV|LY|MA|MC|MD|MG|MH|MK|ML|MN|MO|MP|MQ|MR|MS|MT|MU|MV|MW|MX|MY|MZ|NA|NE|NF|NG|NI|NL|NO|NP|NR|NU|NZ|OM|PA|PE|PF|PG|PH|PK|PL|PR|PT|PW|PY|QA|RO|RU|RW|SA|SB|SC|SD|SE|SG|SI|SK|SL|SM|SN|SO|SR|ST|SV|SY|SZ|TC|TD|TG|TH|TJ|TM|TN|TO|TR|TT|TV|TW|TZ|UA|UG|US|UY|UZ|VC|VE|VG|VI|VN|VU|WF|WS|YE|ZA|ZM|ZW/,
    
    type_first: 1,
    type_login: 2,
    type_user: 3,
    
    storage_keys: {
        login: 'user_login',
        proxies: 'store_proxies',
        user_proxies: 'store_user_proxies',
        selected: 'store_selected_proxy',
        enabled: 'store_enabled',
        user_data: 'raw_user_data',
        sn: 'serial_number'
    },
    
    init: function() {
        chrome.runtime.onMessage.addListener(_callback(function(e) {
            if(e.msg === 'close_import') {
                if(this.importWindow) {
                    chrome.windows.remove(this.importWindow);
                    this.importWindow = null;
                }
            }
        }, this));

        chrome.windows.onRemoved.addListener(_callback(function(w) {
            if(this.importWindow && w === this.importWindow)
                this.importWindow = null;
        }, this));

        //chrome.storage.local.clear();
        chrome.storage.local.get(
            [
                this.storage_keys.proxies, this.storage_keys.user_proxies, 
                this.storage_keys.selected, this.storage_keys.enabled, 
                this.storage_keys.user_data, this.storage_keys.sn
            ], 
            _callback(function(o) {
            var p = this.storage_keys.proxies,
                u = this.storage_keys.user_proxies,
                s = this.storage_keys.selected,
                e = this.storage_keys.enabled,
                d = this.storage_keys.user_data;
                n = this.storage_keys.sn;
                
                if(Object.prototype.hasOwnProperty.call(o, n) && o[n]) {
                    this.sn = o[n];
                }
                
                if(!this.sn) {
                    var r = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    this.sn = '';
                    for (var i=32; i>0; --i) {
                        this.sn += r[Math.round(Math.random()*(r.length - 1))];
                    }
                    chrome.storage.local.set(_map(this.storage_keys.sn, this.sn));
                }
                
                if(Object.prototype.hasOwnProperty.call(o, p) && o[p] && o[p].length) {
                    this.proxies = [];
                    for(var i=0; i<o[p].length; ++i) {
                        this.proxies.push(new ServerItem(this, o[p][i].t, o[p][i].s, o[p][i].p, o[p][i].c, o[p][i].n, o[p][i].l, false, i));
                    }
                }
                
                if(Object.prototype.hasOwnProperty.call(o, u) && o[u] && o[u].length) {
                    this.userProxies = [];
                    for(var i=0; i<o[u].length; ++i) {
                        this.userProxies.push(new ServerItem(this, o[u][i].t, o[u][i].s, o[u][i].p, o[u][i].c, o[u][i].n, o[u][i].l, true, i));
                    }
                }
                
                if(Object.prototype.hasOwnProperty.call(o, s) && o[s]) {
                    if(o[s].us && !o[s].old) {
                        this.userProxies[o[s].i].select();
                    }
                    else {
                        this.proxies[o[s].i].select();
                    }
                    
                    this.selected = o[s];
                    
                    if(Object.prototype.hasOwnProperty.call(o, e) && o[e]) {
                        this.enabled = true;
                        
                        chrome.browserAction.setIcon(_map('path', 'img/flags/'+(this.flags.test(o[s].c) ? o[s].c : 'unknown')+'.png'));
                        chrome.browserAction.setBadgeText({text: o[s].c});
            
                        chrome.proxy.settings.set({value: {mode: 'fixed_servers', rules: {
                            proxyForHttps: {host: o[s].sp.s, port: o[s].sp.p},
                            proxyForHttp: {host: o[s].sp.s, port: o[s].sp.p},
                            proxyForFtp: {host: o[s].sp.s, port: o[s].sp.p},
                            fallbackProxy: {host: o[s].sp.s, port: o[s].sp.p}
                        }}, scope: 'regular'}, function() {});
                    }
                    else {
                        chrome.browserAction.setIcon({path: 'img/disabled.png'});
                        chrome.browserAction.setBadgeText({text: ''});
        
                        chrome.proxy.settings.clear({scope: 'regular'});
                    }
                }
                else {
                    chrome.browserAction.setIcon({path: 'img/disabled.png'});
                    chrome.browserAction.setBadgeText({text: ''});
        
                    chrome.proxy.settings.clear({scope: 'regular'});
                }
                
                if(Object.prototype.hasOwnProperty.call(o, d) && typeof o[d].s === 'string' && typeof o[d].fn === 'string') {
                    this.rawUserData = o[d];
                }
                
                this.checkLogin(_callback(function() {
                    this.getProxyList(this.first_url+'&sn='+this.sn, this.type_first);
                }, this));
        }, this));
    },
    
    getProxyList: function(u, t, nl) {
        if(this.loading) return;
        
        var request = new XMLHttpRequest();
        
        request.open('GET', u, true);
        
        request.onreadystatechange = _callback(function() {
            if(request.readyState === 4) {
                this.loading = false;
                if(request.status === 200) {
                    if(request.response.indexOf('ERROR') === -1) {
                        if(nl) this.hasLogin = true;
                        this.storeProxies(request.response);
                    } else 
                        this.error(request.response.replace(/ERROR:\d:/, ''), request.response.replace(/ERROR:(\d):.*/, '$1'), t);
                }
            }
        }, this);
        
        this.loading = true;
        if(t === this.type_login) {
            this.poploading = {v: true, c: 3};
            this.msgsent = true;
            chrome.runtime.sendMessage({msg: 'loading', se: nl});
        }
        
        request.send();
    },
    
    getUserProxies: function(pl) {
        if(this.loading) return;
        
        var u = this.user_url,
            p = 'servers='+pl,
            request = new XMLHttpRequest();
        
        request.open('POST', u, true);
		
		request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		request.setRequestHeader('Content-length', p.length);
		request.setRequestHeader('Connection', 'close');
        
        request.onreadystatechange = _callback(function() {
            if(request.readyState === 4) {
                this.loading = false;
                if(request.status === 200) {
                    if(request.response.indexOf('ERROR') === -1)
                        this.storeProxies(request.response, true);
                    else 
                        this.error(request.response.replace(/ERROR:\d:/, ''), request.response.replace(/ERROR:(\d):.*/, '$1'), this.type_user);
                }
            }
        }, this);
        
        this.loading = true;
        this.poploading = {v: true, c: 2};
        this.msgsent = true;
        chrome.runtime.sendMessage({msg: 'loading'});
        
        this.userProxies = null;
        chrome.storage.local.set(_map(this.storage_keys.user_proxies, null));
        if(this.selected && this.selected.us) {
            if(this.enabled)
                this.selected.old = true;
            else
                this.selected = null;
            chrome.storage.local.set(_map(this.storage_keys.selected, this.selected));
        }
        
        request.send(p);
    },
    
    removeUserProxies: function() {
        var f = this.userProxies && this.userProxies.length;
        this.userProxies = null;
        chrome.storage.local.set(_map(this.storage_keys.user_proxies, null));
        if(this.selected && this.selected.us) {
            if(this.enabled)
                this.selected.old = true;
            else
                this.selected = null;
            chrome.storage.local.set(_map(this.storage_keys.selected, this.selected));
        }
        if(f) this.poploading = {v: true, c: 0};
        this.msgsent = true;
        chrome.runtime.sendMessage({msg: 'populate'});
    },
    
     checkCaptcha: function(c) {
        if(this.loading) return;
        
        var u = this.captcha_url + '?code='+c;
        
        var request = new XMLHttpRequest();
        request.open('GET', u, true);
        
        request.onreadystatechange = _callback(function() {
            if(request.readyState === 4) {
                this.loading = false;
                if(request.status === 200) {
                    if(request.response === 'CORRECT')
                        this.getProxyList(this.service_url+'?sn='+this.sn);
                    else
                        this.error('Incorrect CAPTCHA', 12345);
                }
            }
        }, this);
        
        this.loading = true;
        this.poploading = {v: true, c: 1};
        this.msgsent = true;
        chrome.runtime.sendMessage({msg: 'loading'});
        request.send();
    },
    
    checkLogin: function(cb) {
        chrome.storage.local.get(this.storage_keys.login, _callback(function(o) {
            var k = this.storage_keys.login, u, p;
            if(Object.prototype.hasOwnProperty.call(o, k) && o[k] && o[k].u !== null && o[k].p !== null) {
                u = o[k].u;
                p = o[k].p;
                if(typeof u === 'string' && typeof p === 'string') {
                    this.hasLogin = true;
                    this.getProxyList(this.service_url+'?email='+u+'&password='+p+'&sn='+this.sn, this.type_login);
                }
                else {
                    cb();
                }
            }
            else {
                cb();
            }
        }, this));
    },
    
    saveLogin: function(u, p) {
        if(typeof u !== 'string' || typeof p !== 'string')
            return true;
        
        if(!u.length || !p.length) {
            this.hasLogin = null;
            chrome.storage.local.set(_map(this.storage_keys.login, null));
            return true;
        }
        
        this.hasLogin = null;
        chrome.storage.local.set(_map(this.storage_keys.login, {u: u, p: p}));
        this.getProxyList(this.service_url+'?email='+u+'&password='+p+'&sn='+this.sn, this.type_login, true);
        
        return false;
    },
    
    getLogin: function(cb) {
        chrome.storage.local.get(this.storage_keys.login, _callback(function(o) {
            var k = this.storage_keys.login, u, p;
            if(Object.prototype.hasOwnProperty.call(o, k) && o[k] && o[k].u !== null && o[k].p !== null) {
                u = o[k].u;
                p = o[k].p;
                if(typeof u === 'string' && typeof p === 'string') {
                    cb(u, p);
                }
                else {
                    cb(null);
                }
            }
            else {
                cb(null);
            }
        }, this));
    },
    
    storeProxies: function(pl, us) {
        var m = pl.match(/\d\|[1-2]?[0-9]{1,2}\.[1-2]?[0-9]{1,2}\.[1-2]?[0-9]{1,2}\.[1-2]?[0-9]{1,2}\:[1-9]?[0-9]{1,4}\|(?:\w|\s)*\|(?:\w|\s)*\|[^\d]*/g),
            a = [], b = [], id = 0, r, p, l;
        
        if(!m || !m.length) {
            if(us) {
                this.userProxies = null;
            
                if(this.selected && this.selected.us) {
                    if(this.enabled) {
                        this.selected.old = true;
                    }
                    else {
                        this.selected = null;
                    }
                }
            
                chrome.storage.local.set(_map([this.storage_keys.user_proxies, b, this.storage_keys.selected, this.selected]));
                
                this.error('Unable to load proxies', 1337, this.type_user);
            }
            return;
        }
        
        us = us || false;
        
        for(var i=0; i<m.length; ++i) {
            r = m[i].split('|');
            p = r[1].split(':');
            
            if(p.length < 2) continue;
            
            l = r[4].replace(/\n|\r/g, '');
            l = l.length ? l : '-';
            
            a.push(new ServerItem(this, r[0], p[0], parseInt(p[1], 10), r[2], r[3], l, us, id));
            b.push({t: r[0], s: p[0], p: parseInt(p[1], 10), c: r[2], n: r[3], l: l});
            ++id;
        }
        
        if(us) {
            this.userProxies = a;
            
            if(this.selected && this.selected.us) {
                if(this.enabled) {
                    this.selected.old = true;
                }
                else {
                    this.selected = null;
                }
            }
            
            chrome.storage.local.set(_map([this.storage_keys.user_proxies, b, this.storage_keys.selected, this.selected]));
        } else {
            this.proxies = a;
            
            if(this.selected && !this.selected.us) {
                if(this.enabled) {
                    this.selected.old = true;
                }
                else {
                    this.selected = null;
                }
            }
                        
            chrome.storage.local.set(_map([this.storage_keys.proxies, b, this.storage_keys.selected, this.selected]));
        }
        this.msgsent = true;
        chrome.runtime.sendMessage({msg: 'populate'});
    },
    
    enable: function(us, i, sp, c) {
        if(this.selected && !this.selected.old) {
            if(this.selected.us) {
                this.userProxies[this.selected.i].unselect();
            }
            else {
                this.proxies[this.selected.i].unselect();
            }
        }
        
        this.selected = {us: us, i: i, sp: sp, c: c};
        
        chrome.storage.local.set(_map(this.storage_keys.selected, this.selected));
        
        this.enableSelected();
    },
    
    enableProxy: function() {
        if(!this.proxies && !this.userProxies)
            return;
        
        if(this.selected) {
            this.enableSelected();
            return;
        }
        
        var i = Math.floor(Math.random()*((this.proxies||[]).length + (this.userProxies||[]).length));
        
        if(this.proxies && i < this.proxies.length) {
            this.proxies[i].enable();
        }
        else if(this.userProxies) {
            if(this.proxies && i >= this.proxies.length && (i - this.proxies.length) < this.userProxies.length) {
                this.userProxies[i-this.proxies.length].enable();
            }
            else if(i < this.userProxies.length) {
                this.userProxies[i].enable();
            }
        }
    },
    
    enableSelected: function() {
        var c = this.selected.c,
            sp = this.selected.sp;
            
        this.enabled = true;
        
        chrome.storage.local.set(_map(this.storage_keys.enabled, this.enabled));
        
        chrome.browserAction.setIcon(_map('path', 'img/flags/'+(this.flags.test(c) ? c : 'unknown')+'.png'));
        chrome.browserAction.setBadgeText({text: c});
        
        chrome.proxy.settings.set({value: {mode: 'fixed_servers', rules: {
            proxyForHttps: {host: sp.s, port: sp.p},
            proxyForHttp: {host: sp.s, port: sp.p},
            proxyForFtp: {host: sp.s, port: sp.p},
            fallbackProxy: {host: sp.s, port: sp.p}, 
            bypassList: ["*://*.proxy-list.org", "*://*.best-proxy.com", "proxy-list.org", "best-proxy.com"]
        }}, scope: 'regular'}, function() {});
        
        this.msgsent = true;
        chrome.runtime.sendMessage({msg: 'enabled'});
    },
    
    disable: function() {
        if(this.selected) {
            this.selected = null;
            chrome.storage.local.set(_map(this.storage_keys.selected, this.selected));
        }
        
        this.disableProxy();
    },
    
    disableProxy: function() {
        if(!this.enabled)
            return;
            
        this.enabled = null;
        
        chrome.storage.local.set(_map(this.storage_keys.enabled, this.enabled));
        
        chrome.browserAction.setIcon({path: 'img/disabled.png'});
        chrome.browserAction.setBadgeText({text: ''});
        
        chrome.proxy.settings.clear({scope: 'regular'});
        
        this.msgsent = true;
        chrome.runtime.sendMessage({msg: 'disabled'});
    },
    
    populate: function(el) {
        if(!this.proxies && !this.userProxies)
            return;
            
        if(this.userProxies) {
            for(var i=0; i<this.userProxies.length; ++i) {
                this.userProxies[i].init();
                el.appendChild(this.userProxies[i].holder);
            }
        }
        
        if(this.proxies) {
            if(this.userProxies) {
                var h = document.createElement('hr');
                h.className = 'server-h-rule';
                el.appendChild(h);
            }
            
            for(var i=0; i<this.proxies.length; ++i) {
                this.proxies[i].init();
                el.appendChild(this.proxies[i].holder);
            }
        }
        
        if(this.selected && !this.selected.old) {
            if(this.selected.us) {
                this.userProxies[this.selected.i].select();
            }
            else {
                this.proxies[this.selected.i].select();
            }
        }
    },
    
    setRawUserData: function(s, fn) {
        this.rawUserData = {s: s, fn: fn};
        chrome.storage.local.set(_map(this.storage_keys.user_data, this.rawUserData));
    },
    
    hasProxies: function() {
        return (this.proxies && this.proxies.length > 0) || (this.userProxies && this.userProxies.length > 0);
    },
    
    error: function(e, c, t) {
        t = Number(t) || 0;
        
        if(t === this.type_login) {
            this.hasLogin = null;
            chrome.storage.local.set(_map(this.storage_keys.login, null));
            this.msgsent = true;
            chrome.runtime.sendMessage(_map(['msg', 'error', 'type', 1, 'e', e]));
            return;
        }
        
        if(c === '6') {
            this.proxies = null;
            chrome.storage.local.set(_map(this.storage_keys.proxies, null));
            if(this.selected && !this.selected.us) {
                this.selected = null;
                chrome.storage.local.set(_map(this.storage_keys.selected, this.selected));
        
                this.disableProxy();
            }
            if(t !== this.type_first) {
                this.msgsent = true;
                chrome.runtime.sendMessage({msg: 'error', e: e, c: c});
            }
            return;
        }
        
        console.log('Error:: <' + c + ',' + t + '> ' + e);
        if(t !== this.type_first) {
            this.msgsent = true;
            chrome.runtime.sendMessage({msg: 'error', e: e, c: c});
        }
    }
};

ProxySwitcher.init();