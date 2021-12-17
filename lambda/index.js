'use strict';

const Alexa = require('ask-sdk');

// S3をpersisitenceAttributesとして使用する場合
// ※別途npm installが必要。alexa-hostedの場合、package.jsonに追記が必要( → すでに追記済)
const Adapter = require('ask-sdk-s3-persistence-adapter');

// リクエストインターセプター登録用
const AlexaUtil = require('./util/AlexaUtil');

// 必須のインテントハンドラ
const { LaunchRequestHandler } = require('./handlers/00_LaunchRequestHandler');
const { HelpIntentHandler, CancelIntentHandler, StopIntentHandler} = require('./handlers/90_BuiltInIntentHandler');
const { SessionEndedRequestHandler } = require('./handlers/92_SessionEndedRequestHandler');
const { ErrorHandler } = require('./handlers/99_ErrorHandler');

// スキル固有のインテントハンドラ
const { GameStartIntentHandler } = require('./handlers/10_GameStartIntentHandler');
const { AnswerHandler } = require('./handlers/20_AnswerIntentHandler');
const { YesNoIntentHandler } = require('./handlers/30_YesNoIntentHandler');

// 画面タッチ操作ある場合のハンドラ
const { TouchEventHandler } = require('./handlers/70_TouchEventHandler');

// 想定外の発話への対応 → このハンドラに流れて、「うまく聞き取れませんでした」を返してあげる
const { OtherHandler } = require('./handlers/91_OtherHandler');

// 固定値
const CONSTANT = require('./constants/const');

// skillBuilderを定義
const skillBuilder = Alexa.SkillBuilders.custom();    // ※persistentAttributesやwithApiClientを利用する場合は、standard()ではなく、custom()にする

// persistentAttributes格納場所として、S3を使用する
//const PersistenceAdapter = new Adapter.S3PersistenceAdapter({bucketName:process.env.S3_PERSISTENCE_BUCKET});

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        TouchEventHandler,
        GameStartIntentHandler,
        AnswerHandler,
        YesNoIntentHandler,
        HelpIntentHandler,
        CancelIntentHandler,
        StopIntentHandler,
        SessionEndedRequestHandler,
        OtherHandler
    )
    .addRequestInterceptors(
        AlexaUtil.updateProductsListInSession		// スキル内課金実装している場合は記載する
    )
    .addErrorHandlers(ErrorHandler)
    .withApiClient(new Alexa.DefaultApiClient())    // タイムゾーン情報を取得するのに必要
//    .withPersistenceAdapter(PersistenceAdapter)		// PersistenceAdapterを設定する
    .lambda();