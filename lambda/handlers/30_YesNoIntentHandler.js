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

const { QuestionHandler } = require('./11_QuestionHandler');

/**
 * Yes/Noインテントハンドラ
 * sessionAttributes.statusがCONFIRM_RETRYの場合のみ入り込む
 */
const YesNoIntentHandler  = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        return ask.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (
                ask.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent'
                || ask.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent'
            )
            && sessionAttributes.status === STATUS.CONFIRM_RETRY;
    },
    async handle(handlerInput) {
        let st = '';
        let rt = '';
        let commands = '';
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
 
        console.log('処理開始:YesNoIntentHandler');
        
        // ------------------------------
        // メッセージ
        // ------------------------------
        // メッセージ準備
        const Msg = new MessageControl(MessageMap,SoundMap);
        
        // ------------------------------
        // ゲームマネージャ準備
        // ------------------------------
        // ゲームマネージャのインスタンスを生成
        const gameManager = new GameManager(sessionAttributes);
        
        // インテント種類によって分岐
        if(ask.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent'){
            // Yesならゲームやり直し
            console.log('YES');
            
            // ステータスをPLAYINGにする
            sessionAttributes.status = STATUS.PLAYING;
            // ゲームをリセット
            gameManager.initSessionAttributes(sessionAttributes);
            
            requestAttributes.st = Msg.getMessage("RESTART_GAME");
            
            // ゲーム開始
            // 以降の処理(出題部分)はQuestionHandlerの方でやる
            console.log('処理終了:YesNoIntentHandler(QuestionHandlerへ)');
            return await QuestionHandler.handle(handlerInput);
            
        } else {
            // Noならスキル終了
            console.log('NO');
            
            st += Msg.getMessage("EXIT_SKILL");
            st += Msg.getSound("SKILL_ENDING");
            
            return handlerInput.responseBuilder
                .speak(st)
                .withShouldEndSession(true)
                .getResponse();
        }
        
    }
};

module.exports = { YesNoIntentHandler };