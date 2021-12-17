'use strict';

const ask = require('ask-sdk');

const MessageMap = require('../messages/Messages');
const MessageControl = require('../util/MessageControl');
const AlexaUtil = require('../util/AlexaUtil');
const S3Util = require('../util/S3Util');
const CONSTANT = require('../constants/const');
const STATUS = CONSTANT.STATUS;

const { GameStartIntentHandler } = require('./10_GameStartIntentHandler');
const { HelpIntentHandler } = require('./90_BuiltInIntentHandler');
const { AnswerHandler } = require('./20_AnswerIntentHandler');

/**
 * 画面要素タップ時
 * シミュレーターではonPressが反応し、実機ではPressが反応するため2つ書いておく
 */
const TouchEventHandler  = {
    canHandle(handlerInput) {
        return ((handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent' &&
            (handlerInput.requestEnvelope.request.source.handler === 'Press' ||
                handlerInput.requestEnvelope.request.source.handler === 'onPress')));
    },
    async handle(handlerInput) {
        let st = '';
        let rt = '';
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        console.log('処理開始:TouchEventHandler');

        // メッセージ準備
        const Msg = new MessageControl(MessageMap);

        // TcouhWrapperのargumentsで指定したパラメータを取得する
        // ここのidがスロットのid値と同じになるように作られているので、そのまま引く
        const id = handlerInput.requestEnvelope.request.arguments[0];

        console.log('タップ対象のid:' + id);
        
        // argumentsに応じて処理を分岐
        switch(id){
            case CONSTANT.APL_ARGUMENT.GAMESTART:
                // ゲーム開始ボタンを押下したパターン
                console.log('処理終了:TouchEventHandler(GameStartIntentHandlerへ)');
                return await GameStartIntentHandler.handle(handlerInput);
            case CONSTANT.APL_ARGUMENT.HELP:
                // 遊び方ボタンを押下したパターン
                console.log('処理終了:TouchEventHandler(HelpIntentHandlerへ)');
                return await HelpIntentHandler.handle(handlerInput);
            case CONSTANT.APL_ARGUMENT.A:
                // 解答Aを押下したパターン
                console.log('処理終了:TouchEventHandler(AnswerIntentHandlerへ)');
                requestAttributes.playerAnswer = CONSTANT.ANSWERTYPE.A;
                return await AnswerHandler.handle(handlerInput);
            case CONSTANT.APL_ARGUMENT.B:
                // 解答Bを押下したパターン
                console.log('処理終了:TouchEventHandler(AnswerIntentHandlerへ)');
                requestAttributes.playerAnswer = CONSTANT.ANSWERTYPE.B;
                return await AnswerHandler.handle(handlerInput);
            default:
                console.log('！！予期せぬイベント！！');
                st += "予期せぬ画面タッチイベントが検出されました。時間をおいてやり直してください。"
                return handlerInput.responseBuilder
                    .speak(st)
                    .withShouldEndSession(true)
                    .getResponse();
        }
        
        // 上記switch文にてどこかしらにreturnされる

    }
}

module.exports = { TouchEventHandler };
