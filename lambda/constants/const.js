// 定数定義関係はここに書く

module.exports = {
    "SKILL_SPEECH_TEXT":"クイズボックス",
    "STATUS":{
        "MENU":1,
        "PLAYING":2,
        "CONFIRM_RETRY":3
    },
    "APL_ARGUMENT":{    // APL側でSendEvent時に送ってくるargumentsと一致させる
        "GAMESTART":"GAMESTART",
        "HELP":"HELP",
        "A":"A",
        "B":"B"
    },
    "ANSWERTYPE":{        // ※JSONに記載した解答と一致させる
        "A":"A",
        "B":"B"
    },
    "S3":{
        "KEY_NAME":"S3の資材のkey",
    }
};