if (typeof(window.clk) === 'undefined') window.clk = new Object();
// IEは10以降は保証、9以下は一部動かないかも
(function() {
    var vertion = '3.0.0';
    clk.update = false;
    if (typeof(clk.vertion) === 'undefined') clk.vertion = '0';
    if (vertion > clk.vertion) {
        clk.update = true; clk.vertion = vertion;
    }
})();
if (clk.update) {
    if (typeof(Object.keys) === 'undefined') {
        Object.keys = function(o){var k=[]; for(var i in o){if(o.hasOwnProperty(i)){ k.push(i);}} return k; };
        Array.prototype.indexOf = function(e){var l=this.length>>>0;var f=Number(arguments[1])||0;f = (f < 0)?Math.ceil(f):Math.floor(f);if(f<0)f+=l;for(;f<l;f++){if(f in this&&this[f]===e)return f;}return -1;};
    }
    clk.check = new Object();
    clk.check.def = function(args, undefined_var){
        if (typeof(args) === 'undefined') args = undefined_var;
        return args;
    }
    clk.check.nullvar = function(args, nullvar){
        if (typeof(args) === 'undefined' || args === null) args = nullvar;
        return args;
    }
    // 複数のキーを優先順位ごとに指定できる (['a', 'b']でaがあればbよりも優先)
    clk.check.key = function(ary, key, nullvar) {
        ary = clk.check.nullvar(ary, new Object());
        key = clk.check.def(key, new Array());
        if (Object.prototype.toString.call(key) !== '[object Array]') key = [key];
        nullvar = clk.check.def(nullvar, '');
        for (var i = 0; i < key.length; i++) {
            if (typeof(ary[key[i]])!=='undefined') return ary[key[i]];
        }
        return nullvar;
    }
    clk.check.array = function(args){
        var args_type = typeof(args);
        if (args_type !== 'undefined') {
            if (args_type !== 'object') {
                args = [args];
            } else if(args === null) args = new Array();
        } else args = new Array();
        return args;
    }
    clk.check.setobj = function(obj, nullvar){
        nullvar = clk.check.def(nullvar, new Object());
        var obj_type = typeof(obj);
        if (obj_type === 'object') { return ((obj_type === null) ? nullvar : obj); }
        else if (obj_type === 'undefined') { return new Object(); }
        else { var tmp = obj; obj = new Object(); obj[tmp] = ''; return obj; }
    }
    // キーが存在するかどうかのチェック
    clk.check.exists = function(obj, key){
        var type_obj, type_key, temp;
        if (typeof(obj) !== 'object' && typeof(key) === 'object') {
            temp = obj; obj = key; key = temp;
        }
        type_obj = typeof(obj), type_key = typeof(key)
        if (type_obj === 'undefined') return false;
        if (type_key === 'number') key = key.toString();
        if (type_key === 'undefined') {
            return true;
        } else {
            if (type_obj === 'object') {
                return Object.keys(obj).indexOf(key) >= 0;
            } else {
                return true;
            }
        }
    }
    // 変数用に使うもの
    clk.v = new Object();
    clk.v.querys = new Object();
    clk.v.style = new Object();
    clk.v.href = location.href;
    clk.v.use_cookie = false;
    clk.v.date_default = 'Y-m-d';
    clk.v.defaultAnsynch = true;
    clk.v.userAgent = window.navigator.userAgent.toLowerCase();
    clk.v.urlrg = ['!','+','#','$','&','\'','(',')','*',',','/',':',';','=','?','@','[',']'];
    clk.v.re = new Object();
    clk.v.re.time = /\d+[\-\/\:]\d+/;
    clk.get = new Object();
    // デフォルトで今日の日付
    clk.get.date = function(format_str, date){
        format_str = clk.check.def(format_str, '');
        date = clk.check.def(date, new Date());
    
        var d = date;
        switch (typeof(d)){
            case 'string':
                d = new Date(d);
                if (String(d) === "Invalid Date"){
                    console.log(String(date) + ' <日付形式じゃないです>');
                    return date;
                }
                break;
        }
        switch (typeof(format_str)){
            case 'string':
                if (format_str === '') format_str = clk.v.date_default;
                break;
            default:
                format_str = 'Y-m-d';
                break;
        }
        var rp = format_str;
        var year = d.getFullYear();
        rp = rp.replace(/Y/, year);
        rp = rp.replace(/y/, year.toString().slice(-2));
        var month = d.getMonth() + 1;
        rp = rp.replace(/n/, month);
        rp = rp.replace(/m/, ("0" + month).slice(-2));
        var day = d.getDate();
        rp = rp.replace(/j/, day);
        rp = rp.replace(/d/, ("0" + day).slice(-2));
        var week = d.getDay();
        rp = rp.replace(/w/, week);
        rp = rp.replace(/WW/, [ "日", "月", "火", "水", "木", "金", "土" ][week]);
        var hour = d.getHours();
        var hour2 = hour % 12;
        var hour2i = (hour / 12 < 1) ? 0 : 1;
        rp = rp.replace(/G/, hour);
        rp = rp.replace(/g/, hour2);
        rp = rp.replace(/H/, ("0" + hour).slice(-2));
        rp = rp.replace(/h/, ("0" + hour2).slice(-2));
        rp = rp.replace(/AA/, ["午前", "午後"][hour2i]);
        var minute = d.getMinutes();
        rp = rp.replace(/I/, minute);
        rp = rp.replace(/i/, ("0" + minute).slice(-2));
        var second = d.getSeconds();
        rp = rp.replace(/S/, second);
        rp = rp.replace(/s/, ("0" + second).slice(-2));
    
        rp = rp.replace(/A/, ["AM", "PM"][hour2i]);
        rp = rp.replace(/a/, ["am", "pm"][hour2i]);
        rp = rp.replace(/W/, [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ][week]);
        return rp;
    }
    clk.get.date_32 = function(date) {
        date = clk.check.def(date, new Date());
        return Number(clk.get.date('YmdHis', date)).toString(32);
    }
    clk.get.date_until = function(date){
        date = clk.check.def(date, new Date());
        d_until = new Date(clk.get.date('Y-m-dT00:00:00', date));
        d_until.setDate(date.getDate() + 1);
        d_until.setMilliseconds(d_until.getMilliseconds() - 1);
        return d_until;
    }
    clk.get.ext = function(link){
        link = String(clk.check.nullvar(link, ''));
        var m = link.match(/\.([^\.]*)$/)
        if (m) {
            m = m[1].match(/^\w*/);
            if (m)
                return m[0];
            else
                return '';
        } else {
            return '';
        }
    }
    clk.get.request = function(path, decode_flag, auto_type){
        path = clk.check.nullvar(path, clk.v.href);
        decode_flag = Boolean(clk.check.nullvar(decode_flag, true));
        auto_type = Boolean(clk.check.nullvar(auto_type, false));
        var rq = new Object();
        var query_str = decodeURI((path.replace(/^([^#]*)#.*$/,"$1") + "?").replace(/^.*?\?|.$/g, ""))
            .replace(/\+/g, ' ').replace(/&/g, '\\\n\r\\');
        if (decode_flag) query_str = query_str.replace(/%(\w\w)/g, function(m, m1){
            return String.fromCharCode(parseInt(m1, 16));
        });
        var spl = query_str.split('\\\n\r\\');
        var keys = Object.keys(spl);
        for (var i = 0; i < keys.length; i++) {
            var spl2 = (spl[i] + "=").split("=");
            if ((spl2[0])!=='') {
                var value = spl2[1];
                if (typeof(value) === 'string' && auto_type) {
                    if (value === '') {}
                    else if (value.match(clk.v.re.time)){
                        var newDate = new Date(value);
                        if (newDate.toString() !== "Invalid Date") value = newDate;
                    } else if (!isNaN(value)){
                        value = Number(value);
                    } else {
                        try{
                            var e = eval(value);
                            switch (typeof(e)){
                                case 'number':
                                case 'string':
                                case 'undefined':
                                    break;
                                default:
                                    value = e;
                                    break;
                            }
                        } catch(e) {}
                    }
                }
                rq[spl2[0]] = value;
            }
        }
        return rq;
    }
    // デフォルトのGETの取得
    clk.v.request = clk.get.request();

    clk.get.delimiter = function(re) {
        var delimiter = null;
        var braceDelimiters = clk.v.braceDelimiters;
        if (ret = re.match(/^([^a-zA-Z0-9\\]).*([^a-zA-Z0-9\\])[a-zA-Z]*$/)) {
            // デリミタが正しい組み合わせになっているかをチェック
            var dummy = ret, leftDlmt = ret, rightDlmt = ret;
            if (braceDelimiters[leftDlmt] && rightDlmt === braceDelimiters[leftDlmt] ||
                leftDlmt === rightDlmt
            ) {
                delimiter = leftDlmt;
            }
        }
        return delimiter;
    }
    clk.get.split_space = function(str){
        str = clk.check.def(str, '');
        return str.split(/\s+/).filter(function(value){return value !== ''});
    }
    clk.get.hook_search = function(keyword, tag_mode, w_mode){
        keyword = clk.check.def(keyword, '');
        tag_mode = Boolean(clk.check.def(tag_mode, false));
        w_mode = Boolean(clk.check.def(w_mode, false));
        var hook_class = function(value, mode, mode_not, mode_tag){
            this.value = clk.check.def(value, '');
            this.mode = clk.check.def(mode, '');
            this.mode_not = Boolean(clk.check.def(mode_not, false));        
            this.mode_tag = Boolean(clk.check.def(mode_tag, tag_mode));
        }
        var hook_list = new Array();
        var hook_mode = '';
        var hook_not = false;
        var hook_tag = tag_mode;
        var hook_value;
        var keywords = clk.get.split_space(keyword).map(function(v){
            this.escape = function(v){
                return (' ' + v).replace(/\\\\/g,"\\\?")
                    .replace(/\\\|/g, "\\\:").replace(/\\\&/g, "\\\;").replace(/\\\ /g, "\\\_")
                    .replace(/\|\|/g," OR ").replace(/\&\&/g," AND ").replace(/(\s+)\-/g, ' NOT ').replace(/(\s+)\#/g, ' TAG ')
                    .replace(/^\s+/, "");
            }
            this.revive = function(v){
                return v.replace(/\\\:/g,"|").replace(/\\\;/g,"&")
                    .replace(/\\\_/g," ").replace(/\\\?/g,"\\")
            }
            var ret = this.escape(v);
            var ret = clk.get.split_space(ret+' ').map(function(re){
            switch(re){
                case "OR":
                    hook_mode = '|';
                    return null;
                case "AND":
                    hook_mode = '&';
                    return null;
                case "NOT":
                    hook_not = true;
                    return null;
                case "TAG":
                    hook_tag = true;
                    return null;
                default:
                    var delimiter = clk.get.delimiter(re);
                    var add_val = this.revive(re);
                    // 正規表現だった場合の変形
                    if (delimiter === '/'){
                        var v;
                        try {
                            add_val = eval(add_val);
                        } catch(e) {}
                    }
    
                    if (typeof(add_val) === 'string' && w_mode) {
                        var hw = clk.to.herfWidth(add_val);
                        var fw = clk.to.fullWidth(add_val);
                        if (hw !== fw) {
                            add_val = [new hook_class(hw, '', false, hook_tag), new hook_class(fw, '|', false, hook_tag)];
                        }
                    }
                    if (hook_mode === '') {
                        // 追加
                        if (add_val !== ''){
                            hook_value = [new hook_class(add_val, '', hook_not, hook_tag)];
                            hook_list.push(hook_value);
                            hook_not = false;
                            hook_tag = false;
                            return hook_value;
                        } else {
                            hook_not = false;
                            hook_tag = false;
                            return null;
                        }
                    } else {
                        // 前のリスト増分
                        if (add_val !== ''){
                            hook_value.push(new hook_class(add_val, hook_mode, hook_not, hook_tag));
                        }
                        hook_mode = '';
                        hook_not = false;
                        hook_tag = false;
                        return null;
                    }
                    }
                }
            ).filter(function(v){return v !== null;});
            return ret;
        }).filter(function(v){return v.length > 0;});
        return keywords;
    }
    clk.get.search = function(subject, keyword) {
        var str = " " + subject.replace(/[\[](.*)[\]]/, " [ $1 ] ").replace("/[\#\s]+/g"," ") + " ";
        var result = true;
        var keywords = keyword;
        if (!Array.isArray(keywords)) keywords = clk.get.hook_search(keywords, w_mode);
        
        var s_search = function(value){
            var or_trigger = false;
            var l_result = true, m_result;
            value.filter(function(hook){
                if (Array.isArray(hook)) {
                    m_result = s_search(hook);
                } else {
                    or_trigger = hook.mode === '|';
                    if (Array.isArray(hook.value)) {
                        m_result = s_search(hook.value);
                    } else {
                        var hook_val = hook.value;
                        if (typeof(hook_val) === "string") {
                            if (hook.mode_tag) {
                                hook_val = " " + hook_val + " ";
                            }
                        }
                        m_result = str.match(hook_val);
                    }
                }
                m_result = Boolean(m_result);
                m_result = (function(a, b){return Boolean((a & !b) | (!a & b));})(m_result, hook.mode_not);
                if (or_trigger) {
                    l_result = l_result || Boolean(m_result);
                    or_trigger = false;
                } else {
                    l_result = l_result && Boolean(m_result);
                }
            });
            return l_result;
        }
        keywords.filter(function(v){
            result = result && s_search(v);
        });
        return result;
    }
    
    clk.get.max_page = function(array, max, reverse){
        array = clk.check.nullvar(array, new Array());
        max = Number(clk.check.nullvar(max, 200));
        reverse = Boolean(clk.check.nullvar(reverse, false));
        var current = -1;
        var recursion = function(arg_array){
            if (reverse) arg_array = arg_array.reverse();
            return arg_array.filter(function(value){
                if (Array.isArray(value)){
                    return recursion(value)
                } else {
                    current++;
                    return false;
                }
            });
        }
        recursion(array);
        return Math.floor(current / max) + 1;
    }
    clk.get.from_page = function(array, page, max){
        array = clk.check.nullvar(array, new Array());
        page = Number(clk.check.nullvar(page, 1));
        max = Number(clk.check.nullvar(max, 200));
        var r_array = new Array();
        var current = -1;
        var min_current = max * (page - 1);
        var max_current = max * page - 1;
        var recursion = function(arg_array){
            return arg_array.filter(function(value){
                if (Array.isArray(value)){
                    return recursion(value)
                } else {
                    current++;
                    var r_bool = (min_current <= current) && (current <= max_current) ;
                    if (r_bool){
                        r_array.push(value);
                    }
                    return r_bool;
                }
            });
        }
        recursion(array);
        return r_array;
    }
    
    clk.to = new Object();
    clk.to.json2str = function(json_arg) {
        switch (typeof(json_arg)) {
            case "string":
                {
                    return json_arg;
                    break;
                }
            case "object":
                {
                    try {
                        return JSON.stringify(json_arg)
                    } catch (e) {
                        console.log(e);
                    }
                }
        }
        return null;
    }
    clk.to.merge = function(obj_a, obj_b, null_blank){
        if (typeof(obj_b) !== 'undefined' && obj_b === null && Boolean(clk.check.def(null_blank, true))) return new Object();
        obj_a = clk.check.setobj(obj_a);
        obj_b = clk.check.setobj(obj_b);
        var keys_b = Object.keys(obj_b);
        for (var i=0; i<keys_b.length; i++) {
            var k = keys_b[i];
            obj_a[k] = obj_b[k];
        }
        return obj_a;
    }
    clk.to.request_array = function(path, decode_flag, auto_type){
        return clk.get.request(path, decode_flag, auto_type);
    }
    clk.to.form_array = function(data, upload_match_class) {
        var obj = new Object();
        if (typeof(data) === 'object') {
            if (typeof(data.elements) !== 'undefined') {
                var elem = data.elements;
                for (var i = 0; i < elem.length; i++) {
                    name = elem[i].name;
                    if (typeof(elem[i].files) === 'undefined' || elem[i].files !== null) {
                        value = elem[i].files
                    } else {
                        value = elem[i].value;
                    }
                    if (value === null) continue;
                    if (name !== '') obj[name] = value;
                }
            } else {
                return data;
            }
        }
        return obj;
    }
    clk.to.querystr = function(data, urlencoded, no_value_equal, no_name_send){
        data = clk.check.def(data, '');
        urlencoded = Boolean(clk.check.def(urlencoded, false));
        no_value_equal = Boolean(clk.check.def(no_value_equal, false));
        no_name_send = Boolean(clk.check.def(no_name_send, false));
        var retvar = '', obj, name, value;
        // data -> form or array
        if (typeof(data) === 'object') {
            data = clk.to.form_array(data);
            obj = new Array();
            var k = Object.keys(data);
            for (var i = 0; i < k.length; i++) {
                name = k[i];
                value = clk.check.key(data, name, '');
                if (value === null) continue;
                if (typeof(value['files']) !== 'undefined') {
                    for (var i = 0; i < value.files.length; i++) {
                        var vv = value.files[i].name;
                        var nv = name + '_' + i;
                        if (no_value_equal || vv !== '') vv = '=' + vv;
                        obj.push(nv + vv);
                    }
                    value = value.files.length;
                } else {
                    if (no_value_equal || value !== '') value = '=' + value;
                    if (name !== '') obj.push(name + value);
                }
            }
            retvar = obj.join('&');
        } else {
            retvar = (data !== null) ? data.toString() : '';
        }
        if (urlencoded) {
            retvar = encodeURI(retvar.replace(/\%(\d+)/g, '?$1?')).replace(/\?(\d+)\?/g, '%$1');
        }
        return retvar;
    }
    clk.to.base64toExt = function(base64) {
        var m = base64.match(/[\/]([^\;]*)/);
        var ext = '';
        if (m) ext = m[1];
        return ext;
    }
    clk.to.base64toBlob = function(base64, name) {
        name = clk.check.nullvar(name, '').toString();
        clk.v.loop_i = clk.check.key(clk.v, 'loop_i', 0);
        // カンマで分割して以下のようにデータを分ける
        // tmp[0] : データ形式（data:image/png;base64）
        // tmp[1] : base64データ（iVBORw0k～）
        var tmp = base64.split(',');
        // base64データの文字列をデコード
        var data = atob(tmp[1]);
        // tmp[0]の文字列（data:image/png;base64）からコンテンツタイプ（image/png）部分を取得
        var mime = tmp[0].split(':')[1].split(';')[0];
        if (!name.match('.')) {
            var ext = clk.to.base64toExt(mime);
            if (ext !== '') { ext = '.' + ext; }
            if (name === '') { name = clk.get.date_32(); }
            name = name + '_' + (++clk.v.loop_i) + ext;
        }
        //  1文字ごとにUTF-16コードを表す 0から65535 の整数を取得
        var buf = new Uint8Array(data.length);
        for (var i = 0; i < data.length; i++) {
            buf[i] = data.charCodeAt(i);
        }
            // blobデータを作成
            var blob = new Blob([buf.buffer], { type: mime });
        blob.name = name;
        return blob;
    };
    clk.to.setQuery = function(array_list, path) {
        array_list = clk.check.def(array_list, new Object());
        path = clk.check.def(path, clk.v.href);
        var _path = path.replace(/[\?\#].*$/, "");
        var q = clk.to.querystr(clk.to.merge(clk.get.request(path), array_list), true);
        return _path + ((q === '') ? '' : '?') + q;
    }
    clk.to.form_append = function(request, formdata_obj, merge_mode){
        request = clk.check.nullvar(request, new Object());
        formdata_obj = clk.check.nullvar(formdata_obj, new FormData());
        merge_mode = typeof(formdata_obj.has) === 'undefined'
            ? false : clk.check.nullvar(merge_mode, false);
        keys = Object.keys(request);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var judge = key;
            var val = request[keys[i]];
            if (typeof(val)!=="object") {judge = key + val;}
            if (!(merge_mode && formdata_obj.has(key)) && (judge !== "")) {
                if (typeof(val) !== 'object') {
                    formdata_obj.append(key, val);
                } else {
                    var name = clk.check.key(val, 'name', '');
                    var ext = '';
                    var src = clk.check.key(val, ['src', 'data'], '');
                    var data = null;
                    if (typeof(src) === 'string') {
                        data = clk.to.base64toBlob(src);
                        if (name === '') {
                            name = data.name;
                        }
                    }  else {
                        data = src;
                    }
                    formdata_obj.append(key, data, name);
                }
            }
        }
        return formdata_obj;
    }
    
    clk.to.formData = function(data){
        data = clk.check.def(data, null);
        var data_callname = Object.prototype.toString.call(data);
        if(data_callname !== '[object FormData]') {
            if (typeof(FormData) !== 'undefined') {
                if (data_callname === '[object HTMLFormElement]') {
                    var _formdata = new FormData(data);
                } else {
                    var _formdata = new FormData();
                }
            } else {
                var _formdata = new Object();
            }
            return _formdata;
        } else {
            return data;
        }
    }
    clk.to.herfWidth = function(strVal, other_replace){
        other_replace = Boolean(clk.check.def(other_replace, true));
        // 半角変換
        var halfVal = strVal.replace(/[！-～]/g,
        function( tmpStr ) {
            // 文字コードをシフト
            return String.fromCharCode( tmpStr.charCodeAt(0) - 0xFEE0 );
        }
        );
        if (other_replace) {
            // 文字コードシフトで対応できない文字の変換
            return halfVal.replace(/”/g, "\"")
            .replace(/’/g, "'")
            .replace(/‘/g, "`")
            .replace(/￥/g, "\\")
            .replace(/　/g, " ")
            .replace(/〜/g, "~");
        } else {
            return halfVal;
        }
    }
    clk.to.fullWidth = function(strVal, other_replace){
        other_replace = Boolean(clk.check.def(other_replace, true));
        // 半角変換
        var fullVal = strVal.replace(/[!-~]/g,
        function( tmpStr ) {
            // 文字コードをシフト
            return String.fromCharCode( tmpStr.charCodeAt(0) + 0xFEE0 );
        }
        );
        if (other_replace) {
            // 文字コードシフトで対応できない文字の変換
            return fullVal.replace(/”/g, "\"")
            .replace(/'/g, "’")
            .replace(/`/g, "‘")
            .replace(/\\/g, "￥")
            .replace(/ /g, "　")
            .replace(/~/g, "〜");
        } else {
            return fullVal;
        }
    }
    clk.to.asctochar = function(str, decode, plus_to_space){
        str = clk.check.nullvar(str, '').toString();
        decode = clk.check.nullvar(decode, false);
        plus_to_space = clk.check.nullvar(plus_to_space, true);
        if (plus_to_space) str = str.split('+').join(' ');
        for (var i = 0; i < clk.v.urlrg.length; i++) {
            var chkstr = new RegExp("\\%"+clk.v.urlrg[i].charCodeAt().toString(16), "gi");
            str = str.split(chkstr).join(clk.v.urlrg[i]);
        }
        if (decode) str = decodeURI(str);
        return str;
    }
    clk.to.chartoasc = function(str, encode, space_to_plus){
        str = clk.check.nullvar(str, '').toString();
        encode = clk.check.nullvar(encode, false);
        space_to_plus = clk.check.nullvar(space_to_plus, false);
        if (space_to_plus) str = str.split(' ').join('+');
        if (encode) str = encodeURI(str);
        for (var i = 0; i < clk.v.urlrg.length; i++) {
            var chkstr = new RegExp("\\" + clk.v.urlrg[i], "g");
            var rplstr = "%"+clk.v.urlrg[i].charCodeAt().toString(16);
            str = str.split(chkstr).join(rplstr);
        }
        return str;
    }
    // PHPのstrtotimeの再現
    clk.to.strtotime = function(time){
        time = clk.check.nullvar(time, '').toString();
        var second = 0, minute = 0, hour = 0;
        var day = 0, week= 0, month = 0, year = 0;
        var re, m;
        re = /([\+\-]?[\d]+)\s*seconds?/; m = time.match(re);
        if (m) {
            time = time.replace(re, '');
            second = Number(m[1]);
        }
        re = /([\+\-]?[\d]+)\s*minutes?/; m = time.match(re);
        if (m) {
            time = time.replace(re, '');
            minute = Number(m[1]);
        }
        re = /([\+\-]?[\d]+)\s*hours?/; m = time.match(re);
        if (m) {
            time = time.replace(re, '');
            hour = Number(m[1]);
        }
        re = /([\+\-]?[\d]+)\s*days?/; m = time.match(re);
        if (m) {
            time = time.replace(re, '');
            day = Number(m[1]);
        }
        re = /([\+\-]?[\d]+)\s*weeks?/; m = time.match(re);
        if (m) {
            time = time.replace(re, '');
            week = Number(m[1]);
        }
        re = /([\+\-]?[\d]+)\s*months?/; m = time.match(re);
        if (m) {
            time = time.replace(re, '');
            month = Number(m[1]);
        }
        re = /([\+\-]?[\d]+)\s*years?/; m = time.match(re);
        if (m) {
            time = time.replace(re, '');
            year = Number(m[1]);
        }
        time = new Date(time);
        if (time.toString() === "Invalid Date") {
            time = new Date();
        }
        time.setFullYear(time.getFullYear() + year, time.getMonth() + month, time.getDate() + day + 7 * week);
        time.setHours(time.getHours() + hour, time.getMinutes() + minute, time.getSeconds() + second);
        return time;
    }
    clk.ajax = new Object();
    clk.ajax.enable = true;
    clk.ajax.onload = function(x, e){ console.log(e); };
    clk.ajax.onerror = function(x, e){ console.log('error'); console.log(e); };
    clk.ajax.onbusy = function(x, e){ console.log(e); };
    clk.ajax.oncatch = function(x, e){ console.log('javascript error'); console.log(x); };
    clk.ajax.id_stock = new Object();
    clk.ajax.result = new Object();
    clk.ajax.v = new Object();
    // argsの引数は主に"action", "request", "onload", "onerror", "onbusy", "id", "timeout"
    // 他に"ansynch", "method", "form", "catch", "type", "filelist", "option":0
    clk.ajax.run = function(args) {
        if (!clk.ajax.enable) return false;
        try {
            var form = null, formdata = null, query = new Object(), href = '';
            args = clk.check.nullvar(args, new Object());
            var formdata_check = typeof(FormData) !== 'undefined';
            var opt = Number(clk.check.key(args, 'option', 0));
            var id = Number(clk.check.key(args, 'id', 0));
            if (id >= 0) {
                if (typeof(clk.ajax.id_stock[id]) === 'undefined') {
                    clk.ajax.id_stock[id] = true;
                } else {
                    var f_onbusy = clk.check.key(args, 'onbusy', clk.ajax.onbusy);
                    if (typeof(f_onbusy) === "function") { f_onbusy(args); }
                    return false;
                }
            }
            var tmp = clk.check.key(args, 'form', null);
            var tmp_type = Object.prototype.toString.call(tmp);
            if (tmp_type === '[object HTMLFormElement]' || tmp_type === '[object FormData]') form = tmp;
            if (form !== null) {
                if (formdata_check) {
                    formdata = clk.to.formData(form);
                } else {
                    query = clk.to.form_array(form);
                }
                href = clk.check.key(form, 'action', clk.v.href);
            }
            href = clk.check.key(args, ['action','href'], href);
            if (href === '') href = clk.v.href;
            query = clk.to.merge(
                clk.to.merge(clk.get.request(href), query)
                , clk.to.merge(clk.check.key(args, "request", new Object()), clk.check.key(args, "query", new Object())));
            href = href.replace(/\?.*$/, "");
            var method = clk.check.key(form, 'method', "POST");
            method = clk.check.key(args, 'method', method).toUpperCase();
    
            var onload = clk.check.key(args, ['onload', 'load'], clk.ajax.onload);
            var onerror = clk.check.key(args, ['onerror', 'error'], clk.ajax.onerror);
            var onbusy = clk.check.key(args, ['onbusy', 'busy'], clk.ajax.onbusy);
            if (Object.prototype.toString.call(onload) !== "[object Function]") onload = clk.ajax.onload;
            if (opt & 1) {
                query["refpath"] = clk.check.key(args, "refpath", location.pathname).toString();
            }
            if (method === "GET") {
                query = clk.to.merge(clk.to.form_array(form), query);
                href = clk.to.setQuery(query, href);
            }
            var ansynch = clk.check.key(args, "ansynch", true);
            if (ansynch === null) {
                ansynch = clk.v.defaultAnsynch;
            }
            var xr = new XMLHttpRequest();
            if (typeof(args["timeout"]) !== 'undefined') xr.timeout = args["timeout"];
            var restype = clk.check.key(args, "type");
            switch (restype.toLowerCase()) {
                case "blob": restype = "blob"; break;
                case "arraybuffer": case "buf": case "bin": restype = "arraybuffer"; break;
                case "document": case "html": restype = "document"; break;
                case "json": restype = "json"; break;
                case "text": restype = "text"; break;
                default: restype = "";
            }
            xr.open(method, href, ansynch);
            xr.responseType = restype;
            
            if (method === "POST") {
                if (formdata_check) {
                    formdata = clk.to.form_append(query, formdata);
                    xr.send(formdata);
                } else {
                    xr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded")
                    xr.send(clk.to.querystr(query));
                }
            } else {
                xr.send();
            }
            var localrun = function(lxr) {
                delete clk.ajax.id_stock[id];
                clk.ajax.result.status = lxr.status;
                clk.ajax.result.text = lxr.responseText;
                clk.ajax.result.conmode = true;
                if (lxr.status == 200 || lxr.status == 304) {
                    if (typeof(onload) === "function") { onload(lxr.response, lxr); }
                } else {
                    if (typeof(onerror) === "function") { onerror(lxr.response, lxr); }
                }
            }
            if (ansynch) {
                xr.onload = function() {
                    localrun(this);
                }
                clk.v.conmode = false;
            } else {
                localrun(xr);
            }
            return xr;
        } catch(e) {
            delete clk.ajax.id_stock[id];
            if (typeof(clk.ajax.oncatch) === "function") { clk.ajax.oncatch(e); }
            return null;
        }
    }
    clk.storage = new Object();
    clk.storage.session = new Object();
    clk.storage.def_json = false;
    clk.storage.def_json_null = null;
    clk.storage.def_null = '';
    clk.storage.out = function(key, value, json_convert, session) {
        key = clk.check.def(key, 'k');
        value = clk.check.def(value, null);
        json_convert = clk.check.nullvar(json_convert, clk.storage.def_json);
        session = clk.check.nullvar(session, false);
        var u_storage = session ? sessionStorage : localStorage;
        u_storage.removeItem(key);
        if (value !== null) {
            if (json_convert) {
                value = JSON.stringify(value);
            }
            u_storage.setItem(key, value);
        }
    }
    clk.storage.remove = function(key, session) {
        clk.storage.out(key, null, false, session);
    }
    clk.storage.get = function(key, remove_flag, json_convert, nullvar, session) {
        session = clk.check.nullvar(session, false);
        var u_storage = session ? sessionStorage : localStorage;
        if (typeof(key) === 'undefined') return u_storage;
        var key = clk.check.nullvar(key, 'k');
        remove_flag = clk.check.nullvar(remove_flag, false);
        json_convert = clk.check.nullvar(json_convert, clk.storage.def_json);
        var gotvar = u_storage[key];
        var is_null_gotvar = typeof(gotvar) === 'undefined';
        if (json_convert) {
            if (is_null_gotvar || gotvar == '') {
                gotvar = clk.check.def(nullvar, clk.storage.def_json_null);;
            } else {
                try{ gotvar = JSON.parse(gotvar); }
                catch(e){ gotvar = {value: gotvar}; }
            }
        } else {
            if (is_null_gotvar) gotvar = clk.check.def(nullvar, clk.storage.def_null);;
        }
        if (remove_flag && !is_null_gotvar) clk.storage.remove(key, session);
        return gotvar;
    }

    clk.storage.session.out = function(key, value, json_convert) {
        return clk.storage.out(key, value, json_convert, true);
    }
    clk.storage.session.remove = function(key) {
        clk.storage.out(key, null, false, true);
    }
    clk.storage.session.get = function(key, remove_flag, json_convert, nullvar) {
        return clk.storage.get(key, remove_flag, json_convert, nullvar, true);
    }
    
    // Cookieの書き出しは制限、読み込みは制限しない
    if (typeof(clk.cookie) === 'undefined') clk.cookie = new Object();
    clk.cookie.enable = Boolean(clk.check.key(clk.v, 'use_cookie', false));
    clk.cookie.out = function(key, value, time, path) {
        value = clk.check.def(value, 0);
        time = clk.check.nullvar(time, null);
        path = clk.check.nullvar(path, '');
        if (clk.cookie.enable) {
            var setDate = '';
            if (value === null) {
                value = 0;
                setDate = ';max-age=0';
            } else if (time === '') {
            } else if (time === null) {
                setDate = ';max-age=999999999';
            } else if (time.toString().match(/^[\+\-]?[\d]+$/)) {
                setDate = ';max-age=' + time;
            } else {
                setDate = ';expires=' + clk.to.strtotime(time).toGMTString();
            }
            if (path === null || path === '') {
                setPath = '';
            } else {
                setPath = ';path=' + path;
            }
            document.cookie = key + '=' + value + setDate + setPath;
            return document.cookie;
        }
    }
    clk.cookie.remove = function(key) {
        return clk.cookie.out(key, null);
    }
    clk.cookie.get = function(key, pop) {
        key = clk.check.def(key, null);
        pop = clk.check.def(pop, false);
        if (key === null) { return document.cookie; }
        var cookie = ' ' + document.cookie + ';';
        var use_key = key.replace(/([<>.+*?(){}\^$|\[\]\\])/g, '\\$1');
        var re_key = new RegExp(' ' + use_key + '=([^;]+)');
        var m = cookie.match(re_key);
        if (m) {
            if (pop) clk.cookie.remove(key);
            return m[1];
        } else {
            return null;
        }
    }
    function obj2array(obj){
        return Object.keys(obj).map(function (key) {return obj[key]});
    }
    clk.dom = new Object();
    clk.dom.setupFocus = function(element){
        if (Object.prototype.toString.call(element).match('HTML')) {
            element.insertAdjacentHTML('beforebegin','<a id="__on_focus_before_dammy_a" href></a>');
            var dammy = document.getElementById('__on_focus_before_dammy_a');
            dammy.focus();
            document.activeElement.blur();
            dammy.parentElement.removeChild(dammy);
        }
    }
    clk.dom.removeChildren = function(elm){ while( elm.firstChild ){ elm.removeChild( elm.firstChild ); } }
    // string -> Check From Request, number(seconds) -> Directly
    clk.dom.autoreload = function(reload_target){
        var target_type = typeof(reload_target);
        if (target_type !== 'string') {
            var target_tmp = reload_target;
            reload_target = "reload-interval-cws";
            if (target_type === 'number') {
                clk.v.request[reload_target] = target_tmp;
            }
        }
        if (clk.check.exists(clk.v.request, reload_target)) {
            var interval = parseInt(parseFloat(clk.check.key(clk.v.request, reload_target, 0)) * 1000);
            if (interval < 1000) interval = 1000;
            setTimeout(function(){
                window.location.reload();
            }, interval)
        }
    }
    clk.dom.dataSet = function(obj, element_str, data){
        if (typeof(element_str) !== 'string') element_str = element_str.toString();
        if (typeof(obj.dataset) === 'undefined') {
            if (Object.prototype.toString.call(obj).match('HTML')) {
                obj.setAttribute('data-' + element_str, data);
            }
        } else {
            obj[element_str] = data;
        }
    }
    clk.dom.smooth_flag = false;
    clk.dom.hashScroll = function(hash, smooth_flag, timeout){
        hash = clk.check.nullvar(hash, location.hash.slice(1));
        if (hash === '') return;
        smooth_flag = clk.check.nullvar(smooth_flag, clk.dom.smooth_flag);
        timeout = clk.check.nullvar(timeout, 0);
        var elm = document.querySelector('[name="' + hash + '"]');
        var options = {top: elm.offsetTop}
        if (smooth_flag) options.behavior = 'smooth';
        if (elm !== null) {
            setTimeout(function(){ window.scrollTo(options); }, timeout);
        }
    }
    
    clk.v.global_init = function() {
        if (typeof(cws_cookie_use) === 'boolean') clk.cookie_use = cws_cookie_use;
    }
    clk.jump = new Object();
    clk.jump.location = function(href, auto_back) {
        href = clk.check.nullvar(href, location.href);
        auto_back = clk.check.nullvar(auto_back, false);
        if (auto_back && window.location.href !== href
            && window.document.referrer === href) {
            window.history.back();
        } else {
            window.location.href = href;
        }
    };
    clk.check.ie8 = /MSIE [1-8]/.test(navigator.userAgent);
    clk.event = function(event, func, target){
        if (typeof(target)!=='object') target = window;
        var type = typeof(func);
        if (!(type==='function'||type==='object')) return false;
        if (typeof(event)!='string') return false;
        if (typeof(target.addEventListener) === 'function') {
            target.addEventListener(event, func);
        } else if (typeof(target.attachEvent)!== 'undefined') {
            target.attachEvent('on' + event, func);
        }
        return true;
    };
    // documentを指定すると自動でDOMContentLoaded、それ以外はloadになります
    clk.ready = function(func, target){
        var target_def = (typeof(target)!=='object');
        var event_type = null;
        if (clk.check.ie8) {
            target = target_def ? window : target;
            event_type = 'load';
        } else {
            target = target_def ? document : target;
            event_type = (target === document) ? 'DOMContentLoaded' : 'load';
        }
        return clk.event(event_type, func, target);
    };
    clk.ready(function(){
        var clk = window.clk;
    });
}
