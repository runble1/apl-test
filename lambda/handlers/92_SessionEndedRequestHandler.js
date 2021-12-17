'use strict';

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    async handle(handlerInput) {

        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        if (handlerInput.requestEnvelope.request.reason !== "EXCEEDED_MAX_REPROMPTS") {
            if (handlerInput.requestEnvelope.request.reason === "ERROR") {
                console.log(`error details: ${JSON.stringify(handlerInput.requestEnvelope.request.error)}`);
            }
            return handlerInput.responseBuilder.getResponse();
        }
    }
};

module.exports = {SessionEndedRequestHandler};