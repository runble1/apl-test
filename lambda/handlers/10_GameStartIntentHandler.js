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
 * ゲーム開始インテントハンドラ
 * sessionAttributes.statusがMENUの場合のみ入り込む
 */
const GameStartIntentHandler  = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        return ask.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && ask.getIntentName(handlerInput.requestEnvelope) === 'GameStartIntent'
            && sessionAttributes.status === STATUS.MENU;
    },
    async handle(handlerInput) {
        let st = '';
        let rt = '';
        let commands = '';
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
 
        console.log('処理開始:GameStartIntentHandler');
        
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
        
        // 発話を生成
        requestAttributes.st = Msg.getMessage("GAMESTART_01");
        
        // 以降の処理(出題部分)はQuestionHandlerの方でやる
        console.log('処理終了:GameStartIntentHandler(QuestionHandlerへ)');
        return await QuestionHandler.handle(handlerInput);
    }
};

module.exports = { GameStartIntentHandler };