// Add your requirements
var restify = require('restify');
var builder = require('botbuilder');
var tedious = require('tedious');

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

//connect to database
var Connection = tedious.Connection;  
    var config = {  
        userName: 'sqladmin',  
        password: 'Pickspockets3',  
        server: 'expensesbotserver.database.windows.net',  
        // If you are on Microsoft Azure, you need this:  
        options: {encrypt: true, database: 'expensesbotdb'}  
    };  
    var connection = new Connection(config);  
    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        console.log("Database Connected");  
        executeStatement();  
    });  

//query database
    var Request = tedious.Request;  
    var TYPES = tedious.TYPES;  
  
    var sql = "Test String";
    var result = "";
    
    function executeStatement() {  
        request = new Request("SELECT Sum(Plan$) FROM [dbo].['PIXP Data$'] WHERE D3 = 'channel insights' AND A3 = 'travel'", function(err) {  
        if (err) {  
            console.log('I is error');}  
        });  
      
        request.on('row', function(columns) {  
            columns.forEach(function(column) {  
              if (column.value === null) {  
                console.log('NULL');  
              } else {  
                result+= column.value + " ";  
              }  
            });  
            console.log(result);  
            //result ="";  
        });  
  
        request.on('done', function(rowCount, more) {  
        console.log(rowCount + ' rows returned');  
        });  
        connection.execSql(request);  
    } 

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
        session.send("I don't know anything about %s and %s",session.userData.qtype,"Test String");
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
