// Add your requirements
var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.PORT || 3979, function()
{
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
// var connector = new builder.ChatConnector
var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);

// Create bot dialogs
bot.dialog('/', function (session) {
   session.send('Hi My Name is Jim.  I am the number 3.');
});
