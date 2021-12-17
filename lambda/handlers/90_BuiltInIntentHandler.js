'use strict';

const MessageMap = require('../messages/Messages_help');
const SoundMap = require('../messages/Sounds');
const MessageControl = require('../util/MessageControl');
const CONSTANT = require('../constants/const');

/**
 * ヘルプインテントハンドラ
 */
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    async handle(handlerInput) {        
        let st = '';
        let rt = '';
        
        console.log('処理開始：HelpIntentHandler');
        // メッセージ準備
        const Msg = new MessageControl(MessageMap,SoundMap);

        st += Msg.getMessage('HELP_01');
        st += Msg.getMessage('HELP_02');
        st += Msg.getMessage('HELP_03');
        st += Msg.getMessage('HELP_04');
        st += Msg.getMessage('HELP_05');
        st += Msg.getMessage('HELP_06');

        rt += Msg.getMessage('HELP_RT_01');

        console.log('処理終了：HelpIntentHandler');

        return handlerInput.responseBuilder
            .speak(st)
            .reprompt(rt)
            .getResponse();
    }
};

/**
 * キャンセルインテントハンドラ
 */
const CancelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent';
    },
    async handle(handlerInput) {
        console.log("処理開始：CancelIntentHandler");
        let speechText = "スキルを終了します。";
        console.log("処理終了：CancelIntentHandler");

        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(true)
            .getResponse();
    }
};

/**
 * ストップインテントハンドラ
 */
const StopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent';
    },
    async handle(handlerInput) {
        console.log("処理開始：StopIntentHandler");
        const speechText = 'スキルを終了します。';
        console.log("処理終了：StopIntentHandler");

        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(true)
            .getResponse();
    }
};

module.exports = {
    HelpIntentHandler,
    CancelIntentHandler,
    StopIntentHandler,
};