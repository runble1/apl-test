'use strict';

const QUESTIONS = require('../constants/questions.json');

/**
 * ゲーム管理クラス
 * (作りが微妙なのは許して…)
 */
module.exports = class GameManager {
    
    // sessionAttributes の中に、ゲーム関連の変数として以下のフィールドをもつ
    // allQuestionNum { number } 全問題数
    // nowQuestionNum { number } 現在の問題数
    // nowQuestionInfo {*} 現在解いている問題の詳細 
    // correctNum { number } 現在の正解数
    // endGame { boolean } 最後の問題まで完了したか
    
    /**
     * コンストラクタ
     * @param {*} sessionAttributes
     */
    constructor(sessionAttributes) {
        // ゲーム関連の変数がなかった場合、生成して初期化
        if(!sessionAttributes.allQuestionNum){
            this.initSessionAttributes(sessionAttributes);
        }
        // 現在の問題の情報を取得する
        sessionAttributes.nowQuestionInfo = getQuestionInfo(sessionAttributes.nowQuestionNum - 1);
    }
    
    
    /**
     * sessionAttributesに、ゲーム関連の変数を登録する
     * @param {*} sessionAttributes
     */
    initSessionAttributes(sessionAttributes) {
        console.log(`GameManagerの初期化実施`);
        sessionAttributes.endGame = false;
        sessionAttributes.allQuestionNum = QUESTIONS.questions.length;
        sessionAttributes.nowQuestionNum = 1;
        sessionAttributes.correctNum = 0;
    }
    
    /**
     * 問題の正誤を判定し、ゲーム情報を更新する
     * @param {number} playerAnswer
     * @param {*} sessionAttributes
     * @returns {boolean} 正誤
     */
    judgeAnswer(playerAnswer,sessionAttributes){
        console.log(`judgeAnswer  playerAnswer : ${playerAnswer}, correctAnswer: ${sessionAttributes.nowQuestionInfo.correct}`);
        // 正誤判定
        const result = playerAnswer === sessionAttributes.nowQuestionInfo.correct;
        
        // 正解であれば正解数を加算
        if(result){
            sessionAttributes.correctNum++;
        }
        
        if(sessionAttributes.nowQuestionNum === sessionAttributes.allQuestionNum){
            // 最終問題が終了した場合、全問終了フラグを立てる
            sessionAttributes.endGame = true;
            
        } else {
            // 最終問題でない場合は、次の問題の準備
            
            // 正誤関係なく、次の問題に進める(現在の問題数の更新と、内部的に保持している現在の問題のオブジェクトの更新)
            sessionAttributes.nowQuestionNum ++;
            sessionAttributes.nowQuestionInfo = getQuestionInfo(sessionAttributes.nowQuestionNum - 1);
        }
        
        return result;
    }
    
    /**
     * ゲームが終了したか判定する
     * @returns {boolean} 追加されたステージ数
     */
    isEndGame(sessionAttributes){
        return sessionAttributes.endGame;
    }
    
    
    /**
     * 現在の問題番号を取得する
     */
    getNowQuestionNum(sessionAttributes){
        return sessionAttributes.nowQuestionNum;    
    }
    
    /**
     * 全問題数を取得する
     */
    getAllQuestionNum(sessionAttributes){
        return sessionAttributes.allQuestionNum;    
    }
    
    /**
     * 正解数を取得する
     */
    getCorrectNum(sessionAttributes){
        return sessionAttributes.correctNum;    
    }
    
    /**
     * 現在の問題のオブジェクトをまるっと取得する
     */
     getNowQuestionInfo(sessionAttributes){
         return sessionAttributes.nowQuestionInfo;
     }
     
    /**
     * 現在の問題の問題文(発話)を取得する
     */
     getNowQuestionSt(sessionAttributes){
        console.log(`sessionAttributes:${JSON.stringify(sessionAttributes)}`);
         return sessionAttributes.nowQuestionInfo.questionSt;
     }
     
    /**
     * 現在の問題の問題文(表示)を取得する
     */
     getNowQuestionDt(sessionAttributes){
         return sessionAttributes.nowQuestionInfo.questionDt;
     }
     
     /**
      * 全問正解だったかを判定する(※全問終了時にのみ機能する)
      */
      isPerfect(sessionAttributes){
          return sessionAttributes.allQuestionNum === sessionAttributes.correctNum;
      }
}

/**
 * questions.jsonに格納されている、対象のインデックス番号の問題の情報を取得する
 * @param {number} questionIndex
 */
function getQuestionInfo(questionIndex) {
    return QUESTIONS.questions[questionIndex];
}