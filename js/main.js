const DEBUGMODE = false;
let page = 1;
if (DEBUGMODE) {
    $(document).ready(function() {
        $('#page2').fadeOut(1000, function() {
            $('div.action').fadeOut(1);
            $('#page1').fadeIn(1000);
            $('div.display_result').fadeIn(1000);
            // page2Replace();
            console.log("page2 fade out");
            // console.log(getTestInfo());
        });
    });
}

$(document).ready(function() {
    $('.startBTN').click(function() {
        $('#page1').fadeOut(1000, function() {
            $('#page2').fadeIn(1000);
            page2Replace();
            console.log("page1 fade out");
            console.log(getTestInfo());
        });
    });
});

function getTestInfo() {
    // 元素ID对应的含义
    // conf_wordList -> 选择的单词列表
    // conf_roundInp -> 一轮听写的单词总数
    // Name为method的radio -> 选择的测试方法

    // 返回一个array，包含以上三个值
    var wordList = document.getElementById("conf_wordList").value;
    var roundInp = document.getElementById("conf_roundInp").value;
    // 依次遍历eng2chi，chi2eng，mixed三个id的radio，如果选中则返回对应的value
    var methodValue = "";
    var eng2chi = document.getElementById("eng2chi");
    var chi2eng = document.getElementById("chi2eng");
    var mixed = document.getElementById("mixed");
    if (eng2chi.checked) {
        methodValue = "eng2chi";
    } else if (chi2eng.checked) {
        methodValue = "chi2eng";
    } else if (mixed.checked) {
        methodValue = "mixed";
    }
    var result = [wordList, roundInp, methodValue];
    return result;
}

function replaceText(id, text) {
    document.getElementById(id).innerHTML = text;
}

// =================================
// 需要替换的文本
// =================================
function page2Replace() {
    page = 2;
    var t = getTestInfo();
    // replaceText("rep_needList", t[0]);
    // replaceText("rep_roundNum", t[1]);
    // replaceText("rep_mod", t[2]);
    // replaceText("i_global_keyhint", "Skip = PageDown | Q1. Total / "+t[1]);
}

function pageResultReplace(totalNumber, rightNumber, wrongNumber, notRemember, rememberTheMost, rank) {
    page = 3;
    replaceText("rep_totalNumber", totalNumber);
    replaceText("rep_rightNumber", rightNumber);
    replaceText("rep_wrongNumber", wrongNumber);
    replaceText("rep_notRemember", notRemember);
    replaceText("rep_rememberTheMost", rememberTheMost);
    replaceText("rep_rank", rank);
}
