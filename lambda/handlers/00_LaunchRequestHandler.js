'use strict';

const ask = require('ask-sdk');

const MessageMap = require('../messages/Messages');
const SoundMap = require('../messages/Sounds');
const MessageControl = require('../util/MessageControl');
const AlexaUtil = require('../util/AlexaUtil');
const S3Util = require('../util/S3Util');
const CONSTANT = require('../constants/const');
const STATUS = CONSTANT.STATUS;

/**
 * スキル起動リクエストハンドラ
 * sessionAttributes.statusが空の場合に入り込むので、ワンショット起動しようとしてもスキル起動時は必ずここを通る
 */
const LaunchRequestHandler  = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        return ask.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
            || !sessionAttributes.status;
    },
    async handle(handlerInput) {
        let st = '';
        let rt = '';
        let commands = '';
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
 
        console.log('処理開始:LaunchRequestHandler');
        
        // ------------------------------
        // メッセージ・ステータスセット
        // ------------------------------
        // メッセージ準備
        const Msg = new MessageControl(MessageMap,SoundMap);
        // ステータスセット
        sessionAttributes.status = STATUS.MENU;
        
        // 画面対応していない場合、スキルを修了させる
        if(!AlexaUtil.supportsApl(handlerInput)){
            st += Msg.getMessage("NO_DISPLAY_EXIT");
            return handlerInput.responseBuilder
                .speak(st)
                .withShouldEndSession(true)
                .getResponse();
        }

        st += Msg.getSound("SKILL_OPENING");
        st += Msg.getMessage("LAUNCH_01",CONSTANT.SKILL_SPEECH_TEXT);
        rt += Msg.getMessage("LAUNCH_RT_01");
        st += rt;

        console.log("画面対応確認開始");
        if(AlexaUtil.supportsApl(handlerInput)){
            console.log("★画面対応しているため画面を描写★");

            const titleTemplate = require('../apl/TitleTemplate.json');
            var datasource = require('../apl/Datasource.json');

            // 画面作成
            handlerInput.responseBuilder.addDirective(AlexaUtil.createAplObj(titleTemplate,datasource));
        }
        console.log("画面対応確認完了");

        console.log('処理終了:LaunchRequestHandler');

        return handlerInput.responseBuilder
            .speak(st)
            .reprompt(rt)
            .getResponse();
    }
};

module.exports = {LaunchRequestHandler};