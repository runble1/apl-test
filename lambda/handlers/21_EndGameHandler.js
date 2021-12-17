'use strict';

const ask = require('ask-sdk');

const MessageMap = require('../messages/Messages');
const SoundMap = require('../messages/Sounds');
const MessageControl = require('../util/MessageControl');
const AlexaUtil = require('../util/AlexaUtil');
const S3Util = require('../util/S3Util');
const CONSTANT = require('../constants/const');
const STATUS = CONSTANT.STATUS;

const GameManager = require('../modules/GameManager');

/**
 * ゲーム終了ハンドラ
 * 全ゲームへの解答が終了後に入り込む
 */
const EndGameHandler  = {
    canHandle(handlerInput) {
        // 通常の発話からは入ってこない
        false;
    },
    async handle(handlerInput) {
        let st = '';
        let rt = '';
        let commands = '';
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
 
        console.log('処理開始:EndGameHandler');
        
        // ------------------------------
        // メッセージ・ステータスセット
        // ------------------------------
        // メッセージ準備
        const Msg = new MessageControl(MessageMap,SoundMap);
        // ステータスをCONFIRM_RETRYに変更
        sessionAttributes.status = STATUS.CONFIRM_RETRY;

        // ------------------------------
        // ゲームマネージャ準備
        // ------------------------------
        // ゲームマネージャのインスタンスを生成
        const gameManager = new GameManager(sessionAttributes);
        
        // requestAttributesに発話文言が格納されている場合、最初に追加
        if(requestAttributes.st){
            st += requestAttributes.st;
        }
        
        st += Msg.getMessage("RESULT_01");
        
        // 結果を教える
        if(gameManager.isPerfect(sessionAttributes)){
            st += Msg.getMessage("RESULT_PERFECT");
        } else {
            st += Msg.getMessage("RESULT_NORMAL",gameManager.getAllQuestionNum(sessionAttributes),gameManager.getCorrectNum(sessionAttributes));
        }
        
        // ゲームをやり直すか聞くような発話
        rt += Msg.getMessage("RESULT_RT_01");
        st += rt;
        
        // APLコマンドを生成して流し込む処理
        // ※適切なAPLを作れば、ここが機能する
        console.log("画面対応確認開始");
        if(AlexaUtil.supportsApl(handlerInput)){
            console.log("★画面対応しているためコマンドを生成★");

            const commandArray = [
                // ダイアログのメッセージ部分(ResultText)を今回の結果に差し替える
                {
                    type:"SetValue",
                    componentId:"ResultText",
                    property:"text",
                    value:`${gameManager.getAllQuestionNum(sessionAttributes)}問中、${gameManager.getCorrectNum(sessionAttributes)}問正解でした！`
                },
                // ダイアログを表示する
                {
                    type:"AnimateItem",
                    componentId:"ScoreLayer",
                    easing: "ease-in-out",
                    duration: 300,
                    value: [
                        {
                            "property": "opacity",
                            "to": 1
                        }
                    ]
                }
            ];

            // コマンドの流し込み
            handlerInput.responseBuilder.addDirective(AlexaUtil.createAplCommandObj(commandArray));
        }
        
        // 以降の処理(出題部分)はQuestionHandlerの方でやる
        return handlerInput.responseBuilder
            .speak(st)
            .reprompt(rt)
            .getResponse();
    }
};

module.exports = { EndGameHandler };