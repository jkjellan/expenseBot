// Add your requirements
var restify = require('restify');
var builder = require('botbuilder');
var tedious = require('tedious');

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



// Create bot dialogs
bot.dialog('/', function (session) {
   session.send('Hi My Name is Jim.  I am the number %s.',result);
});
