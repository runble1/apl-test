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
const { EndGameHandler } = require('./21_EndGameHandler');

/**
 * 解答インテントハンドラ
 * sessionAttributes.statusがPLAYINGの場合のみ入り込む
 * TouchEventHandlerから入り込む場合もある
 */
const AnswerHandler  = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        return ask.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (
                ask.getIntentName(handlerInput.requestEnvelope) === 'AnswerAIntent'
                || ask.getIntentName(handlerInput.requestEnvelope) === 'AnswerBIntent'
            )
            && sessionAttributes.status === STATUS.PLAYING;
    },
    async handle(handlerInput) {
        let st = '';
        let rt = '';
        let commands = '';
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
 
        console.log('処理開始:AnswerHandler');
        
        // ------------------------------
        // メッセージ・ステータスセット
        // ------------------------------
        // メッセージ準備
        const Msg = new MessageControl(MessageMap,SoundMap);
        // ステータスは引き続きPLAYINGのまま

        // ------------------------------
        // ゲームマネージャ準備
        // ------------------------------
        // ゲームマネージャのインスタンスを生成
        const gameManager = new GameManager(sessionAttributes);
        
        // 解答種別判断 ※TouchEventHandlerから来た場合、既に入っている
        if(!requestAttributes.playerAnswer){
            requestAttributes.playerAnswer = ask.getIntentName(handlerInput.requestEnvelope) === 'AnswerAIntent' ? CONSTANT.ANSWERTYPE.A : CONSTANT.ANSWERTYPE.B;
        }
        
        // 正誤判断
        if(gameManager.judgeAnswer(requestAttributes.playerAnswer,sessionAttributes)){
            requestAttributes.st = Msg.getSound("OK");
            requestAttributes.st += Msg.getMessage("ANSWEROK");
        } else {
            requestAttributes.st = Msg.getSound("NG");
            requestAttributes.st += Msg.getMessage("ANSWERNG");
        }
        
        // ゲーム終了判断
        if(gameManager.isEndGame(sessionAttributes)){
            return EndGameHandler.handle(handlerInput);
        }
        
        // "次の問題です"の発話
        requestAttributes.st += Msg.getMessage("NEXTQUESTION");
        
        // 以降の処理(出題部分)はQuestionHandlerの方でやる
        console.log('処理終了:AnswerHandler(QuestionHandlerへ)');
        return await QuestionHandler.handle(handlerInput);
    }
};

module.exports = { AnswerHandler };