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

var LUISmodelURL = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/0788ebe8-b8f3-4748-b59f-3d3298aae151?subscription-key=b7831c85b83244b5a42356a1c6374da4';
var recognizer = new builder.LuisRecognizer(LUISmodelURL);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);


//connect to database
var Connection = tedious.Connection;  
    var config = {  
        userName: 'sqladmin',  
        password: 'AIbotadmin1',
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
    
    function executeStatement(callback) {  
        var sqlQuery = "SELECT FORMAT(Sum(Plan$),'C','en-us') AS 'Currency Format' FROM [dbo].['PIXP Data$'] WHERE D3 = '" + deptVar + "'AND A3 = '" + acctVar + "'";
              
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
            
            //console.log(result);  
            //result ="";
            callback(); 
        });  
  
        request.on('done', function(rowCount, more) {  
        console.log(rowCount + ' rows returned');  
        });  
        connection.execSql(request);  
    }  

intents.matches('budget',[
    function (session, args, next) {
        session.send('Welcome to the expense Bot!');
    }]);

intents.onDefault(builder.DialogAction.send("whatchyoutalkinbout"));

// Create bot dialogs
// bot.dialog('/',[
//     function(session, args,next){
//         session.beginDialog('/intro');
//     }
// ]);

// bot.dialog('/intro', [
    
//     function (session) {
//         builder.Prompts.text(session,"Well hello there. How are you doing?");
//     },
//     function(session,results){
//         session.userData.doingWell = results.response;
//         session.send("That's nice...");       
//         builder.Prompts.text(session, "Would you like to see a magic trick?");
//     },
//     function(session,results){
//         session.userData.magic = results.response;
//         if(session.userData.magic == 'yes' || session.userData.magic == 'Yes'){
//             session.beginDialog('/magic');
//         }
//         else if(session.userData.magic == 'no' || session.userData.magic == 'No' ){
//             session.send("I guess this is goodbye, then");
//         }
//         else{
//             session.send("It's a simple yes or no question");
//         }   
//     }
// ]);

// bot.dialog('/magic',[
//     function(session){
//         builder.Prompts.text(session, "Ok, give me the name of an Agency Insights department, such as Channel Insights");
//     },
//     function(session,results){
//         deptVar = results.response;
//         builder.Prompts.text(session,"Now give me the name of an expense category, such as Travel");
//     },
//     function(session,results){
//         acctVar = results.response;
//         result = "";
//         executeStatement(function(){
//             session.beginDialog('/answer');
//         });       
//         }
//     ]);

// bot.dialog('/answer',[
//     function(session){
//         session.send("The %s budget for %s in 2017 is %s",acctVar,deptVar,result);
//         builder.Prompts.text(session,"Would you like to see another trick?");
//     },
//     function(session,results){
//         if(results.response == 'yes' || results.response == 'Yes'){
//             session.beginDialog('/magic');
//         }
//         else if(results.response == 'no' || results.response == 'No'){
//             session.endDialog("Goodbye");
//         }
//         else {
//             session.send("It was a simple yes or no question");
//             session.endDialog("See ya");
//         }

//     }
// ]);