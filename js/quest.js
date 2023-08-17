$(document).ready(function() {
    let wordLists = []
    let EnableSkippedCooldown = true;
    let forceSkipped = false;
    // 数据准备 - 最后汇总用
    let correctNum = 0;
    let wrongNum = 0;
    let skippedNum = 0;
    let correctRate = 0;
    let theMostRemembered = "No Word";
    let theLeastRemembered = "No Word";
    let theMostRememberedCorrectRate = 0; // 相似度
    let theLeastRememberedCorrectRate = 0;
    let wrongQuestions = [];
    let wrongQuestionsIndex = [];
    $.getJSON("./wordLists.json",
        function (data) {
            // 获取单词列表的列表
            wordLists = data;
            console.log(wordLists);
            // 清空select选择框
            $("select[name='WordList']").empty();
            // 添加选项
            for (let i = 0; i < wordLists.length; i++) {
                $("select[name='WordList']").append("<option value="+i+">"+wordLists[i].title+"</option>");
            }

        }
    );

    function checkSimilarity(input_str, answer_str, mode=1) {
        function isEnglishText(text) {
          return /^[A-Za-z\s]+$/.test(text);
        }
      
        // 判断输入字符串和答案字符串的语言类型
        let input_units;
        let answer_units;
      
        if (isEnglishText(input_str)) {
          // 英文情况下按照单词划分
          input_units = input_str.split(' ');
          answer_units = answer_str.split(' ');
        } else {
          // 中文情况下按照汉字划分
          input_units = Array.from(input_str);
          answer_units = Array.from(answer_str);
        }
      
        // 计算相同单元的数量
        const same_count = [...new Set(input_units)].filter(unit => answer_units.includes(unit)).length;
      
        // 计算相同单元的比例
        const similarity = same_count / Math.max(input_units.length, answer_units.length);
        
        if(mode == 1) return similarity;
        // 判断相似度是否大于60%
        if (similarity > 0.6) {
          return true;
        } else {
          return false;
        }
      }
      
    
    function doFireworks1() {
        var defaults = {
            spread: 360,
            ticks: 50,
            gravity: 0,
            decay: 0.94,
            startVelocity: 30,
            shapes: ['star'],
            colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
          };
          
          function shoot() {
            confetti({
              ...defaults,
              particleCount: 40,
              scalar: 1.2,
              shapes: ['star']
            });
          
            confetti({
              ...defaults,
              particleCount: 10,
              scalar: 0.75,
              shapes: ['circle']
            });
          }
          
          setTimeout(shoot, 0);
          setTimeout(shoot, 100);
          setTimeout(shoot, 200);
    }

    function doFireworks2() {
        var end = Date.now() + (7 * 1000);

        // go Buckeyes!
        var colors = ['#bb0000', '#ffffff'];

        (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
        }());
    }

    function doFireworks3() {
        var duration = 15 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function() {
            var timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            var particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    function doQuest(TestMethod, TotalWordNum, wordList) {
        console.log("开始测试");
        $("input[name='answer']").attr("placeholder", "");
        // $("input[name='answer']").attr("disabled", "none");
        // $("button#submitBtn").attr("disabled", "none");
        // 取消disabled
        $("input[name='answer']").removeAttr("disabled");
        $("button#submitBtn").removeAttr("disabled");
        $("button#submitBtn").text("提交");
        setInterval(() => {
            // 减少跳过冷却
            if(Skipped) console.log("单词", wordListArr[wordIndex], "减少冷却，还有"+SkippedCooldown+"s")
            coolDownJudge();
        }, 1000);
        // Key为英文，Value为中文
        // getTestInfo()返回一个array，包含三个值，为单词列表，每组单词数，测试方法
        // 例如["1", 10, "eng2chi"]
        let wordIndex = 0; // 当前题目索引
        console.log("TestMethod: " + TestMethod);
        console.log("TotalWordNum: " + TotalWordNum);
        console.log("wordList: " + wordList);
        console.log("wordListArr: " + Object.keys(wordList));

        // 生成题目 - 打乱wordList的顺序
        let wordListArr = Object.keys(wordList);
        wordListArr.sort(function() {
            return 0.5 - Math.random();
        });
        // 选择前TotalWordNum个单词
        wordListArr = wordListArr.slice(0, TotalWordNum);
        // 更新题库
        console.log("更新题库");
        updateQuestions();
        let Skipped = false;
        let SkippedCooldown = 0;
        $(document).keypress(function(e) {
            // 侦测是否按下Enter键
            if (e.which == 13 && SkippedCooldown <= 0) {
                updateResult();
            }
            if (e.which == 48) {
                // 按下右键
                forceSkipped = true;
                updateResult();
            }
        });
        function updateQuestions() {
            // 根据wordIndex更新题目
            const word = wordListArr[wordIndex];
            $("h1#questionShow").text(word);
            replaceText("i_global_keyhint", "跳过=Enter | Q"+(wordIndex+1)+". Total / "+TotalWordNum);

            // 清空输入框
            const answer = $("input[name='answer']").val("");
            // 根据模式设置提示
            if (TestMethod == 1) {
                $("input[name='answer']").attr("placeholder", "请输入中文翻译");
            } else if (TestMethod == 2) {
                $("input[name='answer']").attr("placeholder", "请输入英文翻译");
            } else {
                if (Math.random() < 0.5) {
                    $("input[name='answer']").attr("placeholder", "请输入中文翻译");
                } else {
                    $("input[name='answer']").attr("placeholder", "请输入英文翻译");
                }
            }
        }

        function checkAnswer() {
            // 获取输入框的值
            // 只要输入的key正确或者value正确，就算正确
            const answer = $("input[name='answer']").val();
            const word = wordListArr[wordIndex];
            const value = wordList[word];
            if (answer == "") return "Skip";
            // 获取相似度，并与最高的相似度比较，判断哪个单词记得最牢固
            const similarity = checkSimilarity(answer, value);
            if (similarity > theMostRememberedCorrectRate) {
                theMostRemembered = word;
                theMostRememberedCorrectRate = similarity;
            }
            if (similarity < theLeastRememberedCorrectRate) {
                theLeastRemembered = word;
                theLeastRememberedCorrectRate = similarity;
            }

            if (TestMethod == 1) {
                if (answer == value) {
                    return true;
                }
            }
            if (TestMethod == 2) {
                if (answer == word) {
                    return true;
                }
            }
            if (TestMethod == 3) {
                if (answer == value || answer == word) {
                    return true;
                }
            }
        }

        function updateResult() {
            Skipped=false;
            // 更新结果，result是id=result的元素
            const result = $("p#result");
            const right = checkAnswer();
            if (right == "Skip") {
                if(SkippedCooldown > 0 && EnableSkippedCooldown) {
                    result.text("跳过冷却中，还有"+SkippedCooldown+"s");
                    result.css("color", "gray");
                    return;
                }
                Skipped = true;
                skippedNum++;
                result.text("跳过上题");
                result.css("color", "gray");
            } else if (right) {
                correctNum++;
                result.text("回答正确！");
                result.css("color", "green");
            } else {
                wrongNum++;
                wrongQuestions.push(wordListArr[wordIndex]);
                wrongQuestionsIndex.push(wordIndex);
                result.text("答案错误，正确答案为"+wordList[wordListArr[wordIndex]]+"。");
                result.css("color", "red");
            }
            wordIndex++;
            if (wordIndex >= TotalWordNum) {
                // 测试结束
                correctRate = correctNum / TotalWordNum;
                // 四舍五入
                correctRate = Math.round(correctRate * 100) / 100;
                $("input[name='answer']").attr("placeholder", "您无法再输入答案了");
                $("input[name='answer']").attr("disabled", "disabled");
                $("button#submitBtn").attr("disabled", "disabled");
                $("button#submitBtn").text("测试结束");
                // .css("color", "red");
                $("p#result").css("color", "#ffc559");
                $("p#result").html(
                    "测试结束"+
                    "&nbsp;<span id='resultPageGo' style='text-decoration: underline'>点击查看结果</span>"
                )
                $("h1#questionShow").text("恭喜！");
                // doFireworks();
                doFireworks1();
                doFireworks2();
                doFireworks3();
                $("span#resultPageGo").click(function () {
                    $('#page2').fadeOut(1000, function() {
                        $('div.action').fadeOut(1);
                        $('#page1').fadeIn(1000);
                        $('div.display_result').fadeIn(1000);
                        // function pageResultReplace(totalNumber, rightNumber, wrongNumber, notRemember, rememberTheMost, rank) {
                        pageResultReplace(TotalWordNum, correctNum, wrongNum+skippedNum, theMostRemembered, theLeastRemembered, "50.01");
                        console.log("page2 fade out");
                        // console.log(getTestInfo());
                    });
                });
            } else {
                if(forceSkipped) updateQuestions();
                else if (!Skipped){
                    updateQuestions();
                }
                else {
                    // 设置跳过冷却
                    SkippedCooldown = 3;
                    console.log("单词", wordListArr[wordIndex], "跳过冷却中，还有"+SkippedCooldown+"s")
                    updateQuestions();
                }
            }
        }

        function coolDownJudge() {
            if(!EnableSkippedCooldown) return;
            if(SkippedCooldown > 0) {
                SkippedCooldown--;
            }
            if(SkippedCooldown == 0) {
               Skipped = false;
            }
        }

        // submitBtn点击后，检查答案
        $("button#submitBtn").click(function() {
            updateResult();
        });

    }

    // 当按钮被点击时，开始测试
    $('.startBTN').click(function() {
        console.log("page")
        if (page == 3) {
            // 重载页面
            location.reload();
        }
        // let wordList;
        const TestInfo = getTestInfo();
        const TotalWordNum = TestInfo[1]; // 每轮测试的单词数
        const TestMethod = 1 ? TestInfo[2] == "eng2chi" : (2 ? TestInfo[2] == "chi2eng" : 3); 
        let wordList;
        $.getJSON("./wordlists/Wordlist_1.json",
            function (data) {
                console.log("getData", data)
                // wordList = JSON.parse(data)
                wordList = data
                console.log("WDL", wordList)
                setTimeout(() => {
                    doQuest(TestMethod, TotalWordNum, wordList);
                }, 1000);
            }
        );
        
    });
});
