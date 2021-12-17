'use strict';

const Alexa = require('ask-sdk');
const moment = require('moment-timezone');

const GREETING_ARRAY = [
    '<say-as interpret-as="interjection" >こんにちは！</say-as><break time="0.5s" />',
    '<say-as interpret-as="interjection" >お久しぶりです！</say-as><break time="0.5s" />',
    '<say-as interpret-as="interjection" >はい！</say-as><break time="0.5s" />',
    '<say-as interpret-as="interjection" >おかえりなさい！</say-as><break time="0.5s" />',
    '<say-as interpret-as="interjection" >お疲れ様です！</say-as><break time="0.5s" />'
];

/**
 * ランダムな挨拶の言葉を取得する
 * @returns {string} 挨拶文言
 */
exports.getRandomGreeting = function(){
    return getRandomElement(GREETING_ARRAY);
};

/**
 * 指定したスロットに対し、定義した値がセットされたかチェックする
 * @param {string} slotName
 * @param {any} slots
 */
exports.isMatchSlotValue = function(slotName, slots) {
    return slots[slotName]
        && slots[slotName].resolutions
        && slots[slotName].resolutions.resolutionsPerAuthority[0]
        && slots[slotName].resolutions.resolutionsPerAuthority[0].status.code === "ER_SUCCESS_MATCH";
}

/**
 * ユーザ発話における、スロット内の代表値(value)の配列を取得する
 * @param {any} slotName 対象スロット名
 * @param {any} slots handlerInput.requestEnvelope.request.intent.slots
 */
exports.getSlotResolvedValues = function(slotName, slots) {
    // スロット一覧を取得
    const slotValues = getSlotValues(slots);
    let rtnArray = [];
    // スロット情報があったら、valueの配列を生成、取得
    if (slotValues[slotName] && slotValues[slotName].resolvedValues) {
        for (let element in slotValues[slotName].resolvedValues) {
            rtnArray.push(slotValues[slotName].resolvedValues[element].value);
        }
    }
    return rtnArray;
}

/**
 * ユーザ発話における、スロット内のidの配列を取得する
 * @param {any} slotName 対象スロット名
 * @param {any} slots handlerInput.requestEnvelope.request.intent.slots
 */
exports.getSlotResolvedIds = function(slotName, slots) {
    // スロット一覧を取得
    const slotValues = getSlotValues(slots);
    let rtnArray = [];
    // スロット情報があったら、valueの配列を生成、取得
    if (slotValues[slotName] && slotValues[slotName].resolvedValues) {
        for (let element in slotValues[slotName].resolvedValues) {
            rtnArray.push(slotValues[slotName].resolvedValues[element].id);
        }
    }
    return rtnArray;
}

/**
 * AMAZON.NUMBERタイプのスロットの値を取得する
 * 解決できているかどうかはisResolvedNumberTypeで判定できる
 * @param {any} slotName 対象スロット名
 * @param {any} slots handlerInput.requestEnvelope.request.intent.slots
 */
exports.getNumberSlotValue = function(slotName,slots) {
    return Number(slots[slotName].value);
}

/**
 * AMAZON.NUMBERタイプのスロットの中身が解決できたか判定する
 * @param {any} slotName 対象スロット名
 * @param {any} slots handlerInput.requestEnvelope.request.intent.slots
 */
exports.isResolvedNumberType = function(slotName,slots) {
    return !isNaN(Number(slots[slotName].value));
}

/**
 * APLのオブジェクトを生成する
 * ※APLコマンドを実行したい場合、トークンをコマンドの方のトークンと一致する形で定義する必要がある。
 * @param {any} documentJson ドキュメントテンプレートファイル
 * @param {any} datasourcesJson データファイル
 * @param {string} token トークン文字列。引数をセットしなかった場合は"TOKEN"が自動で入る
 */
exports.createAplObj = function(documentJson, datasourcesJson,token) {
    return {
        type: 'Alexa.Presentation.APL.RenderDocument',
        version: '1.0',
        token: token ? token : 'TOKEN',
        document: documentJson,
        datasources: datasourcesJson
    };
}

/**
 * APLコマンドのオブジェクトを生成する
 * ※APLコマンドを実行したい場合、トークンをドキュメントの方のトークンと一致する形で定義する必要がある。
 * @param {array} commandArray コマンドの配列
 * @param {any} token トークン文字列。引数をセットしなかった場合は"TOKEN"が自動で入る
 */
exports.createAplCommandObj = function(commandArray,token){
    return {
        type : "Alexa.Presentation.APL.ExecuteCommands",
        token: token ? token : 'TOKEN',
        commands: commandArray
    }
}

/**
 * UPSELL用のオブジェクトを生成する
 * @param {string} productId upsellするスキル内商品のId
 * @param {string} datasourcesJson upsellのメッセージ。'有料コンテンツとして、○○があります。詳しい説明を聞きますか？'など。
 */
exports.createUpsellObj = function(productId, upsellMessage,token){
    let tk = token;
    if(!tk || tk === ''){
        tk = "UpsellIntent";
    }
    
    return {
        type: "Connections.SendRequest",
        name: "Upsell",
        payload: {
            InSkillProduct: {
                productId: productId,
            },
            upsellMessage: upsellMessage,
        },
        token: tk
    }
}

/**
 * 文字列をSSMLエスケープする
 * @param {string} targetText 対象の文字列
 */
exports.escapeSpeechText= function(targetText){
    return Alexa.escapeXmlCharacters(targetText);
}

/**
 * APLサポート判定
 * @param {any} handlerInput
 */
exports.supportsApl = function(handlerInput) {
    return handlerInput.requestEnvelope.context &&
        handlerInput.requestEnvelope.context.System &&
        handlerInput.requestEnvelope.context.System.device &&
        handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
        handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL'];
}

/**
 * 早口のSSMLタグで囲む
 * @param {sring} speechText
 */
exports.quickTalk = function(speechText) {
    return `<emphasis level="reduced">${speechText}</emphasis>`;
}

/**
 * 本日日付をYYYYMMDD文字列で取得する
 * ※ moment-timezoneをnpm installしておく必要あり
 * ※ タイムゾーン取得エラーでも、Asia/Tokyoとして処理を続行する
 */
exports.getTodayYYYYMMDD = async function (handlerInput){

    let userTimeZone;
    try {
        userTimeZone = await getUserTZ(handlerInput);
        console.log(`userTimeZone:${userTimeZone}`);
    } catch (error) {
        console.log('TimeZone取得エラー:', error.message);
        // timezone取得エラーだが、どうせ日本の人くらいしかユーザーいないので"Asia/Tokyo"にしておく
        userTimeZone = "Asia/Tokyo";
    }

    moment.tz.setDefault(userTimeZone);
    return new moment().format('YYYYMMDD');
}


/**
 * スキル実行デバイスのタイムゾーン文字列を取得する("Asia/Tokyo"など)
 * @param {*} handlerInput 
 */
exports.getUserTimeZone = async function (handlerInput){
    return await getUserTZ(handlerInput);
}

/**
 * スキルを実行したデバイスのデバイスIDを取得する
 * @param {*} handlerInput 
 */
exports.getDeviceId = function(handlerInput){
    return handlerInput.requestEnvelope.context.System.device.deviceId;
}

/**
 * slotsを取得する
 * getSlotResolvedIdsとかの引数slotsをセットするのに便利
 * @param {*} handlerInput
 */
exports.getSlots = function(handlerInput){
    return handlerInput.requestEnvelope.request.intent.slots;
}

/**
 * プログレッシブ応答を投げる
 * @param {*} handlerInput
 * @param {string} ssml
 */
exports.callDirectiveService = function(handlerInput, ssml) {
    const directiveServiceClient = handlerInput.serviceClientFactory.getDirectiveServiceClient();

    const requestId = handlerInput.requestEnvelope.request.requestId
    const directive = {
      header: {
        requestId: requestId
      },
      directive: {
        type: 'VoicePlayer.Speak',
        speech: ssml
      }
    };

    return directiveServiceClient.enqueue(directive);
}

/**
 * 商品名リストの説明文を作る関数
 * 出力例: 「(商品名) と (商品名)  と ・・・(商品名) 」
 * @param {*} productList リクエストインターセプターで取得した商品リスト、これのnameを並べる
 */
exports.getProductNamesText = function (productList) {
    const productNameList = productList.map(item => item.name);
    let productListSpeech = productNameList.join('と、');
    return productListSpeech;
}

/**
 * 画面付デバイスの形状の情報を取得する
 * ※RequestInterceptorにて実施する想定
 * スキル実行しているデバイスが画面付デバイスである場合、"RECTANGLE" or "ROUND"がsessionAttributes.shapeにセットされる
 */
exports.putDeviceShapeToSession = {
    async process(handlerInput){
        if(handlerInput && handlerInput.requestEnvelope && handlerInput.requestEnvelope.session){
            if (handlerInput.requestEnvelope.session.new) {
                if(handlerInput.requestEnvelope.context && handlerInput.requestEnvelope.context.Viewport){
                    console.log('画面付デバイスでした');
                    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
                    sessionAttributes.shape = handlerInput.requestEnvelope.context.Viewport.shape;
                    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                }
            }
        }
    }
}

/**
 * ユーザーのタイムゾーンをセッションにセットする
 * ※RequestInterceptorにて実施する想定
 * sessionAttributes.userTimeZoneにセットされる
 */
exports.setUserTimeZoneToSession = {
    async process(handlerInput){
        if(handlerInput && handlerInput.requestEnvelope && handlerInput.requestEnvelope.session){
            // 新規セッションだった場合のみ、セッションにタイムゾーン情報をセットする
            if (handlerInput.requestEnvelope.session.new) {

                const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
                
                const userTimeZone = await getUserTZ(handlerInput);
                sessionAttributes.userTimeZone = userTimeZone;

                console.log(`タイムゾーンをセッションにセット sessionAttributes.userTimeZone:${userTimeZone}`);
            }
        }
    }
}

/**
 * 購入済みスキル内商品および購入可能商品のリストをセッションに格納する
 * ※RequestInterceptorにて実施する想定
 * sessionAttributes.entitledProducts:購入済み商品のリスト
 * sessionAttributes.purchasableProducts:購入可能商品のリスト
 */
exports.updateProductsListInSession = {
    async process(handlerInput){
        if(handlerInput && handlerInput.requestEnvelope && handlerInput.requestEnvelope.session){
            if (handlerInput.requestEnvelope.session.new) {
                try {
                    const locale = handlerInput.requestEnvelope.request.locale;
                    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
                    const result = await ms.getInSkillProducts(locale);
                    
                    // 購入済商品
                    const entitledProducts = getAllEntitledProducts(result.inSkillProducts);
                    
                    // 未購入商品
                    const notEntitledProducts = getAllNotEntitledProducts(result.inSkillProducts);

                    // 購入可能商品
                    const purchasableProducts = getAllPurchasableProducts(result.inSkillProducts);
                    
                    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
                    sessionAttributes.entitledProducts = entitledProducts;
                    sessionAttributes.purchasableProducts = purchasableProducts;
                    sessionAttributes.notEntitledProducts = notEntitledProducts;
                    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                } catch (error) {
                    console.log(`Error calling InSkillProducts API: ${error} `);
                }
            }
        }
    }   
};

/**
 * referenceNameが一致するスキル内商品のオブジェクトを取得する
 * @param {string} referenceName 検索対象のスキル内商品名称
 * @param {object[]} productArray スキル内商品群。updateProductsListInSessionにて取得したentitledProducts,notEntitledProducts,purchasableProductsのいずれかの想定
 * @returns {*} 最初に一致したスキル内商品オブジェクト
 */
exports.pickUpProductByReferenceName = function (referenceName,productArray){
    for(let idx in productArray){
        if(referenceName === productArray[idx].referenceName){
            return productArray[idx];
        }
    }
}

/**
 * productIdが一致するスキル内商品のオブジェクトを取得する
 * @param {string} productId 検索対象のスキル内商品のID
 * @param {object[]} productArray スキル内商品群。updateProductsListInSessionにて取得したentitledProducts,notEntitledProducts,purchasableProductsのいずれかの想定
 * @returns {*} 最初に一致したスキル内商品オブジェクト
 */
exports.pickUpProductByProductId = function (productId,productArray){
    for(let idx in productArray){
        if(productId === productArray[idx].productId){
            return productArray[idx];
        }
    }
}

/**
 * @param {number} ms ミリ秒
 */
exports.sleep = async function(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

// ここからprivate関数-----------------------------------------------------------------------------------
/**
 * 配列の要素をランダムで取得
 * @returns {string} ランダムな要素
 */
function getRandomElement(array){
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * 独自のオブジェクト構造でスロット情報を取得する(getSlotResolvedValuesで使う)
 * @param {any} slots
 */
function getSlotValues(slots) {

    const slotValues = {};

    for (let key in slots) {

        if (slots.hasOwnProperty(key)) {

            slotValues[key] = {
                synonym: slots[key].value || null,
                resolvedValues: (slots[key].value ? [slots[key].value] : []),
                statusCode: null,
            };

            let statusCode = (((((slots[key] || {})
                .resolutions || {})
                .resolutionsPerAuthority || [])[0] || {})
                .status || {})
                .code;

            let authority = ((((slots[key] || {})
                .resolutions || {})
                .resolutionsPerAuthority || [])[0] || {})
                .authority;

            slotValues[key].authority = authority;

            // any value other than undefined then entity resolution was successful
            if (statusCode) {
                slotValues[key].statusCode = statusCode;

                // we have resolved value(s)!
                if (slots[key].resolutions.resolutionsPerAuthority[0].values) {
                    let resolvedValues = slots[key].resolutions.resolutionsPerAuthority[0].values;
                    slotValues[key].resolvedValues = [];
                    for (let i = 0; i < resolvedValues.length; i++) {
                        slotValues[key].resolvedValues.push({
                            value: resolvedValues[i].value.name,
                            id: resolvedValues[i].value.id
                        });
                    }
                }
            }
        }
    }
    return slotValues;
}

// スキルに登録されている商品リスト（inSkillProductList）から、購入された商品を抽出する関数
function getAllEntitledProducts(inSkillProductList) {
    const entitledProductList = inSkillProductList.filter(record => record.entitled === 'ENTITLED');
    console.log(`Currently entitled products: ${JSON.stringify(entitledProductList)}`);
    return entitledProductList;
}

// スキルに登録されている商品リスト（inSkillProductList）から、未購入の商品を抽出する関数
function getAllNotEntitledProducts(inSkillProductList) {
    const notEntitledProductList = inSkillProductList.filter(record => record.entitled === 'NOT_ENTITLED');
    console.log(`Currently not entitled products: ${JSON.stringify(notEntitledProductList)}`);
    return notEntitledProductList;
}

// スキルに登録されている商品リスト（inSkillProductList）から、購入可能な商品を抽出する関数
function getAllPurchasableProducts(inSkillProductList) {
    const purchasableProductList = inSkillProductList.filter(record => record.purchasable === 'PURCHASABLE');
    console.log(`Currently purchasable products: ${JSON.stringify(purchasableProductList)}`);
    return purchasableProductList;
}

// タイムゾーン取得
async function getUserTZ(handlerInput){
    // ServiceClientFactory作成
    const serviceClientFactory = handlerInput.serviceClientFactory;
    const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;

    try {
        const upsServiceClient = serviceClientFactory.getUpsServiceClient();
        return await upsServiceClient.getSystemTimeZone(deviceId);
    } catch (error) {
        console.log('TimeZone取得エラー:', error.message);
        throw error;
    }
}
