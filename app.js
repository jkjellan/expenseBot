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
    });  

//query database
    var Request = tedious.Request;  
    var TYPES = tedious.TYPES;  
  
    var deptVar = "channel insights";
    var acctVar = "travel";
    var result = "";
    
    function executeStatement() {  
        var sqlQuery = "SELECT Sum(Plan$) FROM [dbo].['PIXP Data$'] WHERE D3 = '" + deptVar + "'AND A3 = '" + acctVar + "'";
        request = new Request(sqlQuery, function(err) {  
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
        session.beginDialog('/intro');
    }
]);

bot.dialog('/intro', [
    
    function (session) {
        builder.Prompts.text(session,"Well hello there. How are you doing?");
    },
    function(session,results){
        session.userData.doingWell = results.response;
        session.send("That's nice...");       
        builder.Prompts.text(session, "Do you like magic?");
    },
    function(session,results){
        session.userData.magic = results.response;
        if(session.userData.magic == 'yes'){
            session.beginDialog('/magic');
        }
        else if(session.userData.magic == 'no'){
            session.send("I guess this is goodbye, then");
        }
        else{
            session.send("It's a simple yes or no question");
        }   
    }
]);

bot.dialog('/magic',[
    function(session){
        builder.Prompts.text(session, "Give me the name of a Safeco department, such as Agency Insights");
    },
    function(session,results){
        deptVar = results.response;
        builder.Prompts.text(session,"Now give me the name of an expense category, such as Travel");
    },
    function(session,results){
        acctVar = results.response;
        result = "";
        executeStatement();
        session.send("The %s budget for %s in 2017 is %s",acctVar,deptVar,result);
    }
]);


server.get('/', restify.serveStatic({
 directory: __dirname,
 default: '/index.html'
}));
