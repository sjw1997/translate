function init() {
    const progressDiv = $('.progress');
    progressDiv.hide();

    const downloadBtn1 = $('#downloadBtn1');
    const downloadBtn2 = $('#downloadBtn2');
    downloadBtn1.hide();
    downloadBtn2.hide();

    let res1 = "", res2 = "";
    $('#myButton').on('click', function(e) {
        downloadBtn1.hide();
        downloadBtn2.hide();

        const lines = $('#myText').val();

        const words = [];
        for (let i of lines.split("\n")) {
            if (i.length > 0) {
                words.push(i);
            }
        }

        const MAX_SIZE = 200;
        if (words.length > MAX_SIZE) {
            alert(`最多只能输入${MAX_SIZE}个单词`);
            return;
        }

        progressDiv.show();

        let progressBar = $('.progress-bar');
        progressBar.width("0");

        let translationTextArea = $('#myTranslation');
        translationTextArea.val("");

        const total = words.length;
        let cnt = 0;
        res1 = "";
        res2 = "";
        let map1 = new Map();  // 带换行的翻译结果
        let map2 = new Map();  // 不带换行的翻译结果
        for (const word of words) {
            $.ajax({
                type: "POST",
                url: "https://app5415.acapp.acwing.com.cn/api/translate/",
                dataType: "json",
                data: {
                    lines: word
                },
                success: function (response) {
                    const arrs = response["result"].split("\n");

                    let r = arrs.length - 1;
                    for (const i in arrs) {
                        if (arrs[i] === "") {
                            r = i - 1;
                            break;
                        }
                    }

                    let tmp = "";
                    for (let i = 0; i <= r; i ++ ) {
                        tmp = tmp + arrs[i];
                        if (i !== r) {
                            tmp = tmp + " | ";
                        }
                    }

                    map1.set(word, response["result"]);
                    map2.set(word, tmp);
                    cnt ++ ;
                    progressBar.width((cnt / total * 100) + "%");

                    if (cnt === total) {
                        for (const w of words) {
                            res1 = res1 + map1.get(w);
                            res2 = res2 + map2.get(w) + "\n";
                        }
                        translationTextArea.val(res1);
                        downloadBtn1.show();
                        downloadBtn2.show();
                    }
                }
            });
        }
    });

    downloadBtn1.on('click', () => {
        const blob = new Blob([res1], {
          type: 'charset=uft-8',
        });
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);

        a.href = url;
        a.download = `translation.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
    });

    downloadBtn2.on('click', () => {
        const blob = new Blob([res2], {
          type: 'charset=uft-8',
        });
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);

        a.href = url;
        a.download = `translation.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
    });
}

export {
    init
}