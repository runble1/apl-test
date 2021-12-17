'use strict';

const S3Util = require('./S3Util');
const ask = require('ask-sdk');

module.exports = class MessageControl {
    /**
     * コンストラクタ
     * @param {*} messageMapObj セットするメッセージデータマップObj
     * @param {*} SoundMapObj セットするサウンドマップObj
     */
    constructor(messageMapObj,soundMapObj){
        this._messageMapObj = messageMapObj;
        this._soundMapObj = soundMapObj;
    }

    /**
     * メッセージコードに紐づくメッセージを取得する。
     * 第2引数以降は、メッセージコードの"{}"部分を置換する
     * @param {*} msgCd 対象のメッセージコード
     */
    getMessage(msgCd){
        let rtnStr = '';
        if(!this._messageMapObj || !this._messageMapObj.messages){
            return '';
        }
        for(let elm of this._messageMapObj.messages){
            if( elm.CODE === msgCd){
                rtnStr = elm.VALUE;
                // 最初の引数はメッセージコードなので、第2引数以降で置換を実行
                for(let i = 1; i < arguments.length; i++){
                    rtnStr = rtnStr.replace("{}",arguments[i]);
                }
                return rtnStr;
            }
        }
        return '';
    }

    /**
     * 沈黙を挟む
     * @param {number} breakms 
     */
    getBreakMs(breakms){
        if (isNaN(breakms)){
            breakms = 1000;
        }
        return `<break time="${breakms}ms" />`;
    }

    /**
     * サウンドコードに紐づくサウンドを取得する。
     * @param {*} soundCd 対象のサウンドコード
     */
    getSound(soundCd){
        if(!this._soundMapObj || !this._soundMapObj.Sounds){
            return '';
        }
        for(let elm of this._soundMapObj.Sounds){
            if( elm.CODE === soundCd){
                if(elm.TYPE === "SOUND_LIBRARY" || elm.TYPE === "S3_PUBLIC"){
                    return elm.VALUE;
                } else if(elm.TYPE === "S3_PRIVATE"){
                    return `<audio src="${ask.escapeXmlCharacters(S3Util.getS3PreSignedUrl(elm.KEY))}" />`;
                }
            }
        }
        return '';
    }

}