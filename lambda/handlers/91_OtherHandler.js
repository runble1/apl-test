'use strict';

const MessageMap = require('../messages/Messages');
const MessageControl = require('../util/MessageControl');
const AlexaUtil = require('../util/AlexaUtil');
const S3Util = require('../util/S3Util');
const CONSTANT = require('../constants/const');
const STATUS = CONSTANT.STATUS;

/**
 * その他ハンドラ
 * ステータスに合わないインテントの発話があった場合、全部ここに入って言い直すように促してくる。
 * ※このハンドラはハンドラ列挙の一番最後に記載すること
 */
const OtherHandler  = {
    canHandle(handlerInput) {
        return true;
    },
    async handle(handlerInput) {
        let speechText = '';
        let repromptText = '';
        // const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        console.log('処理開始:OtherHandler');

        // メッセージ準備
        const Msg = new MessageControl(MessageMap);

        // Alexaの発話を準備
        speechText += Msg.getMessage('COMMON_SORRY');
        speechText += Msg.getMessage('COMMON_CANNOT_LISTEN');

        // 本来はスキル内のステータスに応じて聞き方を分岐すべき……
        repromptText = Msg.getMessage('COMMON_ONEMORE');

        speechText += repromptText;

        console.log('処理終了:OtherHandler');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .getResponse();
    }
};

module.exports = {OtherHandler};
