'use strict';

const AWS = require('aws-sdk');

// 環境変数にS3のバケット名が設定されている前提
// → S3_PERSISTENCE_BUCKET にバケット名をセットする

const s3SigV4Client = new AWS.S3({
    signatureVersion: 'v4'
});

const CONSTANT = require("../constants/const");

// 環境変数にセットされているバケット名が設定
const BUCKET_NAME = process.env.S3_PERSISTENCE_BUCKET;

/**
 * PreSignedUrlを取得する
 */
module.exports.getS3PreSignedUrl = function getS3PreSignedUrl(s3ObjectKey) {

    const s3PreSignedUrl = s3SigV4Client.getSignedUrl('getObject', {
        Bucket: BUCKET_NAME,
        Key: s3ObjectKey,
        Expires: 60*1 // the Expires is capped for 1 minute
    });
    console.log(`Util.s3PreSignedUrl: ${s3ObjectKey} URL ${s3PreSignedUrl}`);
    return s3PreSignedUrl;

}

/**
 * JSONファイルをオブジェクト形式で取得する
 */
module.exports.getJsonFile = async function(s3ObjectKey) {
    const params = {
        Bucket: BUCKET_NAME,
        Key: s3ObjectKey
    };

    return new Promise((resolve,reject)=>{
        s3SigV4Client.getObject(params,(err,data)=>{
            if(err){
                return reject(err);
            }
            console.log(data.Body.toString());
            return resolve(JSON.parse(data.Body.toString()));
        });
    });
}