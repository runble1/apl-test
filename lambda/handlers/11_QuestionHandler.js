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
 * 問題出題ハンドラ
 * 各種インテントハンドラから飛んでくる
 */
const QuestionHandler  = {
    canHandle(handlerInput) {
        // ユーザーの発話を拾って入り込むことはない
        return false;
    },
    async handle(handlerInput) {
        let st = '';
        let rt = '';
        let commands = '';
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
 
        console.log('処理開始:QuestionHandler');
        
        // ------------------------------
        // メッセージ・ステータスセット
        // ------------------------------
        // メッセージ準備
        const Msg = new MessageControl(MessageMap,SoundMap);
        // ステータスセット
        sessionAttributes.status = STATUS.PLAYING;

        // ------------------------------
        // ゲームマネージャ準備
        // ------------------------------
        // ゲームマネージャのインスタンスを生成(初期化もやってくれる)
        const gameManager = new GameManager(sessionAttributes);
        
        // requestAttributesに発話文言が格納されている場合、最初に追加
        if(requestAttributes.st){
            st += requestAttributes.st;
        }
        
        // 問題番号と問題文を読み上げ
        st += Msg.getMessage("QUESTION_01",gameManager.getNowQuestionNum(sessionAttributes));
        st += Msg.getSound("QUESTION_BRIDGE");
        rt += gameManager.getNowQuestionSt(sessionAttributes);
        
        st += rt;

        console.log("画面対応確認開始");
        if(AlexaUtil.supportsApl(handlerInput)){
            console.log("★画面対応しているため画面を描写★");

            const gameTemplate = require('../apl/GameTemplate.json');
            var datasource = require('../apl/Datasource.json');
            
            // 現在の情報をセット
            datasource.aplData.nowQuestionInfo = gameManager.getNowQuestionInfo(sessionAttributes);
            datasource.aplData.nowQuestionNum = gameManager.getNowQuestionNum(sessionAttributes);
    		datasource.aplData.allQuestionNum = gameManager.getAllQuestionNum(sessionAttributes);
		    datasource.aplData.correctNum = gameManager.getCorrectNum(sessionAttributes);

            // 画面作成
            handlerInput.responseBuilder.addDirective(AlexaUtil.createAplObj(gameTemplate,datasource));
        }
        console.log("画面対応確認完了");

        console.log('処理終了:QuestionHandler');

        return handlerInput.responseBuilder
            .speak(st)
            .reprompt(rt)
            .getResponse();
    }
};

module.exports = { QuestionHandler };