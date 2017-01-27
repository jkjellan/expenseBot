// Add your requirements
var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.PORT || 3978, function()
{
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MY_APP_ID, 
    appPassword: process.env.MY_APP_PASSWORD
});


var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Create bot dialogs
bot.dialog('/',[
    function(session, args,next){
        if(session.userData.qtype != 'expense' || session.userData.qtype != 'headcount'){
            session.beginDialog('/qtype');
        } else{
            next();
        }
    },
    function(session,results){
    if(session.userData.qtype == 'expense' || session.userData.qtype == 'headcount' ){
        session.send("I can definitely answer your questions about %s",session.userData.qtype);
    }
    else {
        session.send("I don't know anything about %s",session.userData.qtype);
        session.beginDialog('/');
    }
}
]);

bot.dialog('/qtype', [
    
    function (session) {
        builder.Prompts.text(session,"Hi, Do you want to know about expense or headcount?");
    },
    function(session,results){
        
            session.userData.qtype = results.response;
            session.endDialog();
        
    }
]);


server.get('/', restify.serveStatic({
 directory: __dirname,
 default: '/index.html'
}));
