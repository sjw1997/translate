function init() {
    const progressDiv = $('.progress');
    progressDiv.hide();

    const downloadBtn = $('#downloadBtn');
    downloadBtn.hide();

    let res = "";
    $('#myButton').on('click', function(e) {
        downloadBtn.hide();

        const lines = $('#myText').val();

        const words = [];
        for (let i of lines.split("\n")) {
            if (i.length > 0) {
                words.push(i);
            }
        }

        progressDiv.show();

        let progressBar = $('.progress-bar');
        progressBar.width("0");

        let translationTextArea = $('#myTranslation');
        translationTextArea.val("");

        const total = words.length;
        let cnt = 0;
        res = "";
        let map = new Map();
        for (const word of words) {
            $.ajax({
                type: "POST",
                url: "https://app5415.acapp.acwing.com.cn/api/translate/",
                dataType: "json",
                data: {
                    lines: word
                },
                success: function (response) {
                    map.set(word, response["result"]);
                    cnt ++ ;
                    progressBar.width((cnt / total * 100) + "%");

                    if (cnt === total) {
                        for (const w of words) {
                            res = res + map.get(w);
                        }
                        translationTextArea.val(res);
                        downloadBtn.show();
                    }
                }
            });
        }
    });

    downloadBtn.on('click', () => {
        const blob = new Blob([res], {
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