// Add your requirements
var restify = require('restify');
var builder = require('botbuilder');
var tedious = require('tedious');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.PORT || 3979, function()
// server.listen(process.env.PORT || 5858, function()
{
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
// var connector = new builder.ChatConnector
var connector = new builder.ConsoleConnector({
    userWelcomeMessage: 'User Welcome Message Works!'
    
});
var bot = new builder.UniversalBot(connector.listen());

var model = 'https://luis-actions.cloudapp.net/api/v1/botframework?app-id=0788ebe8-b8f3-4748-b59f-3d3298aae151&subscription-key=b7831c85b83244b5a42356a1c6374da4';
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);


    intents.matches('budget','/intro');
    intents.matches('None','/intro');

    bot.dialog('/intro',[
        function (session) {
        builder.Prompts.text(session,"Hello");
        }
    ]);