const title_left = "黒メモ";
const title_sp = " | ";
const title_elm = document.querySelector("title");
var fileHandle = null;
var idi = "fs",
    bf = null,
    cd = 0,
    cdl = ["UTF-8", "Shift-JIS"];
var elm = null,
    textareaMode = false;
var pdlrMode = 0;
var rewrite_flag = false;
var ssv = location.protocol === "data:",
    dsv = false,
    nsv = "保存はページ表示ごとに1度だけです";
var getSetElmValue = (v) => {
    if (typeof v !== "undefined") {
        if (textareaMode) {
            elm.value = v;
        } else {
            elm.innerText = v;
        }
        setTitleRewrite();
    }
    if (textareaMode) {
        return elm.value;
    } else {
        return elm.innerText;
    }
};
const textFileOptions = {
    types: [
        {
            description: "Text Files",
            accept: {
                "text/plain": [".txt", ".text", ".md"],
            },
        },
    ],
};
function BeforeCloseEvent() {
    if (
        !rewrite_flag ||
        confirm(
            "行った変更が保存されない可能性があります。\nそれでも閉じますか？"
        )
    ) {
        return true;
    }
    return false;
}
window.onbeforeunload = (e) => {
    if (rewrite_flag) return true;
};
function setBF(file) {
    if (typeof file !== "undefined") bf = file;
    rewrite_flag = false;
    if (bf === null) {
        fileHandle = null;
        delete document.body.dataset.filename;
        title_elm.innerText = title_left;
        getSetElmValue("");
    } else {
        title_elm.innerText = title_left + title_sp + bf.name;
        document.body.dataset.filename = bf.name;
    }
    return bf;
}
function LoadFile(t, _cd) {
    var file;
    if (t === null) {
        return;
    } else {
        if (typeof t.files === "undefined") {
            file = t;
        } else {
            file = t.files[0];
        }
    }
    if (typeof _cd !== "number") _cd = cd;
    var rd = new FileReader(),
        ec = cdl[_cd];
    rd.readAsText(file, ec);
    rd.onload = (e) => {
        getSetElmValue(rd.result);
    };
}
function getLogDateName() {
    const d = new Date();
    return (
        "log" +
        d.getFullYear() +
        ("0" + (d.getMonth() + 1)).slice(-2) +
        ("0" + d.getDate()).slice(-2) +
        "_" +
        ("0" + d.getHours()).slice(-2) +
        ("0" + d.getMinutes()).slice(-2) +
        ".txt"
    );
}
async function fsv() {
    var sn = "",
        sndfn = document.body.dataset.filename;
    if (typeof sndfn !== "undefined") sn = sndfn;
    if (sn === "") sn = getLogDateName();
    if (typeof window.showOpenFilePicker === "undefined") {
        if (dsv) {
            alert(nsv);
        } else if (
            confirm(
                "テキストの内容を保存しますか？\n保存名>> " +
                    sn +
                    (ssv ? "\n(" + nsv + ")" : "")
            )
        ) {
            var text = getSetElmValue();
            var b = new Blob([text], { type: "text/plane" });
            var a = document.createElement("a");
            a.href = URL.createObjectURL(b);
            a.download = sn;
            a.click();
            if (ssv) dsv = true;
            setBF();
        }
    } else {
        if (fileHandle === null) {
            try {
                var saveOptions = textFileOptions;
                saveOptions.suggestedName = sn;
                fileHandle = await window.showSaveFilePicker(saveOptions);
                setBF(await fileHandle.getFile());
            } catch (e) {
                if (e.name !== "AbortError") console.error(e);
                return;
            }
        }
        const writable = await fileHandle.createWritable();
        await writable.write(getSetElmValue());
        await writable.close();
        setBF();
    }
}
async function fld() {
    if (typeof window.showOpenFilePicker === "undefined") {
        var f = document.getElementById(idi);
        if (f !== null) {
            f.remove();
        }
        f = document.createElement("input");
        f.id = idi;
        f.type = "file";
        f.accept = ".txt";
        f.addEventListener("change", (e) => {
            LoadFile((bf = e.target));
        });
        document.head.appendChild(f);
        f.click();
    } else {
        try {
            var openOptions = textFileOptions;
            openOptions.directory = "note/";
            [fileHandle] = await window.showOpenFilePicker(openOptions);
        } catch (e) {
            if (e.name !== "AbortError") console.error(e);
            return;
        }
        LoadFile(setBF(await fileHandle.getFile()));
    }
}
async function fcc() {
    var ncd = cd ^ 1;
    if (bf !== null && confirm(cdl[ncd] + "として開き直しますか？"))
        LoadFile(bf, (cd = ncd));
}
var replacePeriodBreak = (n) => {
    return n
        .replace(/([。]+|[.!?！？]\s+)(\n|)/g, function (m, p1, p2) {
            return p1 + (p2 === "" ? "\n" : p2);
        })
        .replace(/^\s+/, " ");
};
var replaceDeleteBreak = (n) => {
    return n.replace(/(\n|)[\-\d]+\n/g, "").replace(/\n([^\n])/g, "$1");
};
var getFontSize = (e) => {
    return Number(getComputedStyle(e).fontSize.match(/\d+/)[0]);
};
function titleUpdate(ast = true) {
    title_elm.innerText =
        title_left + (ast ? "*" : "") + (bf === null ? "" : title_sp + bf.name);
}
function setTitleRewrite() {
    if (rewrite_flag) {
        if (bf === null && elm.value === "") {
            titleUpdate((rewrite_flag = false));
        }
    } else {
        titleUpdate((rewrite_flag = bf !== null || elm.value !== ""));
    }
}
function insertTextarea(
    str = "",
    shiftMode = false,
    multype = 0,
    textarea = null
) {
    if (textarea === null) textarea = elm;
    if (str !== "") {
        const ss = textarea.selectionStart,
            se = textarea.selectionEnd;
        const sr = se - ss,
            v = textarea.value,
            sl = str.length;
        var ts = v.slice(0, ss),
            tr = v.slice(ss, se),
            te = v.slice(se);
        var as = ss,
            ae = se,
            ad = "";
        if (isNaN(multype)) {
            ad = String(multype);
        }
        if (ad !== "") {
            var al = ad.length;
            if (shiftMode) {
                if (ts.slice(-sl) === str && te.slice(0, al) === ad) {
                    textarea.value = ts.slice(0, ss - sl) + tr + te.slice(al);
                    as = ss - sl;
                    ae = se - sl;
                }
            } else {
                textarea.value = ts + str + tr + ad + te;
                as = ss + sl;
                ae = se + sl;
            }
        } else {
            if (sr === 0 || multype) {
                if (shiftMode) {
                    if (ts.slice(-sl) === str) {
                        textarea.value = ts.slice(0, ss - sl) + tr + te;
                        as = ss - sl;
                        ae = se - sl;
                    }
                } else {
                    textarea.value = ts + str + tr + te;
                    as = ss + sl;
                    ae = se + sl;
                }
            } else {
                var tsn = ts.match(/[^\n]*$/)[0],
                    ten = te.match(/^[^\n]*/)[0];
                var loopNum = 0;
                ts = ts.slice(0, ss - tsn.length);
                te = te.slice(ten.length);
                tr = tsn + tr + ten;
                tr = tr.replace(/(^|\n)([^\n]*)/g, function (m0, m1, m2) {
                    if (shiftMode) {
                        if (m2.slice(0, sl) === str) {
                            loopNum--;
                            m2 = m2.slice(sl);
                        }
                        return m1 + m2;
                    } else {
                        loopNum++;
                        return m1 + str + m2;
                    }
                });
                textarea.value = ts + tr + te;
                as = ss + sl * Math.sign(loopNum);
                ae = se + sl * loopNum;
            }
        }
        textarea.selectionStart = as;
        textarea.selectionEnd = ae;
        setTitleRewrite();
        return true;
    }
    return false;
}
elm = document.querySelector("textarea");
textareaMode = elm.tagName === "TEXTAREA";
elm.focus();
elm.addEventListener("input", (e) => {
    setTitleRewrite();
});
elm.addEventListener("paste", (e) => {
    var rt = true,
        img = document.querySelector("img");
    var is = e.clipboardData.items;
    for (var i = 0; i < is.length; i++) {
        it = is[i];
        if (/^image/.test(it.type)) {
            var gf = it.getAsFile();
            var fr = new FileReader();
            fr.onload = (e) => {
                img.src = e.target.result;
            };
            fr.readAsDataURL(gf);
            img.title = "t" + new Date().getTime();
            rt = false;
            document.body.classList.add("includeImage");
        }
    }
    return rt;
});
function imgDelete(){
    var img = document.querySelector("img");
    delete img.src;
    document.body.classList.remove("includeImage");
    elm.focus();
}
document.body.onkeydown = (e) => {
    if (e.code === "Tab" && !(e.ctrlKey || e.altKey)) {
        return !insertTextarea("\t", e.shiftKey);
    }
    if (!e.shiftKey) {
        if (e.ctrlKey) {
            switch (e.code) {
                case "KeyS":
                case "Enter":
                    fsv();
                    return false;
                case "KeyO":
                    fld();
                    return false;
            }
            if (e.altKey) {
                var keyNum = null;
                switch (e.code) {
                    case "KeyE":
                        if (confirm("句読点を自動的に改行しますか？")) {
                            getSetElmValue(
                                replacePeriodBreak(getSetElmValue())
                            );
                        }
                        return false;
                    case "KeyD":
                        if (confirm("改行を削除しますか？")) {
                            getSetElmValue(
                                replaceDeleteBreak(getSetElmValue())
                            );
                        }
                        return false;
                    case "KeyL":
                    case "Comma":
                        elm.style.textAlign = "left";
                        return false;
                    case "KeyR":
                    case "Period":
                        elm.style.textAlign = "right";
                        return false;
                    case "KeyC":
                    case "Slash":
                        elm.style.textAlign = "center";
                        return false;
                    case "KeyW":
                    case "KeyN":
                        if (BeforeCloseEvent()) setBF(null);
                        return false;
                    case "KeyH":
                    case "KeyJ":
                    case "KeyK":
                    case "KeyM":
                        switch (e.code) {
                            case "KeyH":
                                keyNum = 1;
                                break;
                            case "KeyJ":
                                keyNum = 2;
                                break;
                            case "KeyK":
                                keyNum = 3;
                                break;
                            case "KeyM":
                                keyNum = 0;
                                break;
                        }
                        if (pdlrMode === keyNum || keyNum === 0) {
                            pdlrMode = 0;
                            elm.style.paddingLeft = "";
                            elm.style.paddingRight = "";
                        } else {
                            pdlrMode = keyNum;
                            var mpc = pdlrMode + "0%";
                            elm.style.paddingLeft = mpc;
                            elm.style.paddingRight = mpc;
                        }
                        return false;
                    case "Quote":
                    case "Digit0":
                        elm.style.fontSize = "";
                        return false;
                    case "Digit1":
                    case "Digit2":
                    case "Digit3":
                    case "Digit4":
                    case "Digit5":
                    case "Digit6":
                    case "Digit7":
                    case "Digit8":
                        keyNum = Number(e.key);
                        elm.style.fontSize = keyNum * 4 + 8;
                        return false;
                    case "Digit9":
                        elm.style.fontSize = 48;
                        return false;
                    case "KeyP":
                        elm.style.fontSize = 80;
                        return false;
                    case "Semicolon":
                        elm.style.fontSize = getFontSize(elm) + 1;
                        return false;
                    case "Minus":
                        elm.style.fontSize = getFontSize(elm) - 1;
                        return false;
                    case "BracketRight":
                        elm.style.fontSize = getFontSize(elm) + 4;
                        return false;
                    case "Backslash":
                        elm.style.fontSize = getFontSize(elm) - 4;
                        return false;
                    case "KeyI":
                        fcc();
                        return false;
                }
            }
            elm.focus();
        }
    }
    // console.log(e);
};
if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("bnsw.js");
}
