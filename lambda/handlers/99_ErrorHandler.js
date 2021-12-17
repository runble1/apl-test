'use strict';

const ErrorHandler = {
    canHandle() {
        return true;
    },
    async handle(handlerInput, error) {
        console.error(`Error handled: ${error.message}`);
        console.log(error.stack);

        return handlerInput.responseBuilder
            .speak("エラーが発生しました。")
            .getResponse();
    }
};

module.exports = { ErrorHandler };