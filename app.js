// Add your requirements
var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.PORT || 3000, function()
{
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector
({ appId: '9590c808-42d9-44a0-adb8-037f3f628a82', appPassword: 'M4k1uzvPqT5mOpommgiQOne' });
var bot = new builder.UniversalBot(connector);
server.post('/API/Messages', connector.listen());

// Create bot dialogs
bot.dialog('/', function (session) {
    session.send("Hello World");
});
