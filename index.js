// Include the Alexa SDK v2
const Alexa = require("ask-sdk-core");
var https = require('https');

function httpGet() {
  return new Promise(((resolve, reject) => {
    var options = {
      host: 'masterquote.herokuapp.com',
      port: 443, // usar https
      path: '/random',
      method: 'GET',
    };
    const request = https.request(options, (response) => {
      response.setEncoding('utf8'); // encoder...
      let returnData = ''; // sabe data

      response.on('data', (chunk) => {
        returnData += chunk;
      }); // data/

      response.on('end', () => {
        resolve(JSON.parse(returnData));
      }); // cuando termine resolvemos en json

      response.on('error', (error) => {
        reject(error);
      }); // en caso de error
    });
    request.end(); // terminamos el request
  }));
}

// The "LaunchRequest" intent handler - called when the skill is launched
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  async handle(handlerInput) {
    const speechText = "Hola, soy Master Bot";
    const response = await httpGet();
    const mensage = `frase celebre de  ${response.results[0].name}, ${response.results[0].quote}`;
    // Speak out the speechText via Alexa
    return handlerInput.responseBuilder.speak(mensage).getResponse();
  }
};

// Register the handlers and make them ready for use in Lambda
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(LaunchRequestHandler)
  .lambda();
