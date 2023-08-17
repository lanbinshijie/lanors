// 多语言翻译字典
var translations = {
    zh: {
        global: {
            title: "TwTords 天天背单词",
            keyhint: "开始背单词吧！",
        },
        settings: {
            setting: "设置",
            chooseWordList: "请选择单词表",
            oneRoundWords: "一轮听写的单词总数",
            askingMode: "听写模式",
            eng2chi: "英译中",
            chi2eng: "中译英",
            mixed: "混合模式",
            start: "开始听写",
            warning: "选择完毕后点击下方的“开始”按钮",
            language: "语言",
            letsstart: '如果你已经准备好了，<br>那就让我们开始吧！',
            startR: "开始按钮",
            startB: "开始背单词",
            clickLeftToStart: "点击左侧按钮开始答题！"
        },
    },
    en: {
        global: {
            title: "TwTords Everyday",
            keyhint: "Start to learn words!",
        },
        settings: {
            setting: "Settings",
            chooseWordList: "Choose Word List",
            oneRoundWords: "Words in One Round",
            askingMode: "Asking Mode",
            eng2chi: "Eng to Chi",
            chi2eng: "Chi to Eng",
            mixed: "Mixed",
            start: "Start",
            warning: "Click the button below to start",
            language: "Language",
            letsstart: "If you are ready, let's start!",
            startR: "Start Button",
            startB: "Start to Learn",
            clickLeftToStart: "Click the button on the left to start!",
        },
    },
};
  
// 当前语言变量
var currentLanguage = "zh"; // 假设默认为英文

function getCurrentLanguage() {
    // 从 localStorage 中获取当前语言
    var language = localStorage.getItem("language");
    if (language === null) {
        // 默认设置为zh
        language = "zh";
    }
    if (language == "en") {
        // 将id为langswitch的复选框设置为选中状态
        document.getElementById("langswitch").checked = true;
    }
    currentLanguage = language;
}

function storeCurrentLanguage() {
    // 将当前语言存储到 localStorage 中
    localStorage.setItem("language", currentLanguage);
}

// 翻译函数
function translate(key) {
    var translation = translations[currentLanguage];
    // 根据传入的键获取对应的翻译文本
    var keys = key.split('.');
    for (var i = 0; i < keys.length; i++) {
        translation = translation[keys[i]];

        // 如果找不到对应翻译，则返回传入的键
        if (translation === undefined) {
            return key;
        }
    }

    return translation;
}


function replaceTranslations() {
    var elements = document.querySelectorAll('[id^="i_"]'); // 获取所有以 "i_" 开头的元素
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var id = element.id;
        var keys = id.split('_').slice(1); // 分割 ID，获取分类名和字段名
        var translation = translate(keys.join('.')); // 调用 translate 函数获取翻译后的文本
        element.innerHTML = translation; // 替换元素的内容
    }
}
// 调用函数，以便在页面加载时自动执行替换
window.addEventListener('DOMContentLoaded', replaceTranslations);

getCurrentLanguage();
refreshLanguage();

function refreshLanguage() {
    // 刷新当前页面的语言（因为语言出现变化）
    replaceTranslations();
    storeCurrentLanguage();
}

$(document).ready(function() {
    // 监听复选框点击事件
    $('input[type="checkbox"]#langswitch').change(function() {
        if ($(this).is(':checked')) {
            // 切换为英语
            currentLanguage = "en";
            refreshLanguage();
        } else {
            // 切换为中文
            currentLanguage = "zh";
            refreshLanguage();
        }
    });
});