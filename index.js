let express = require('express');
let path = require('path');
let app = express();
let routes  = require('./routes');
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))



app.get('/',routes);
app.post('/register',routes);
app.get('/login',routes);
app.post('/login',routes);
app.get('/success',routes);
app.get('/yoyo',routes);
app.post('/workout',routes);
let PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log("server at ",PORT));