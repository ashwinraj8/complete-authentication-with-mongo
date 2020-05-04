let express = require('express');
let mongoose = require('mongoose');
let routes = express.Router();
let bodyparser = require('body-parser')
let bcrypt = require('bcryptjs');
let user = require('./models/models')
let work = require('./models/workout');
let passpport = require('passport');
let auth = require('./controllers/auth')
let cookieParser = require('cookie-parser');
let authMidWare = require('./middleware/auth');
/*mongodb+srv://azz:<password>@cluster0-7fhkf.mongodb.net/test?retryWrites=true&w=majority
azz -usrname
yLefky2yRs81SFio - password  **IMPORTANT
*/
routes.use(cookieParser());
routes.use(bodyparser.urlencoded({extended: true}));


mongoose.connect('mongodb+srv://azz:yLefky2yRs81SFio@cluster0-7fhkf.mongodb.net/userDB?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(()=> console.log("database connected")
).catch((e)=>{
    console.log(e);
})


routes.get('/yoyo',authMidWare,(req,res)=>{  //The whole function after authMidWare is the next()!;
    res.send('I am yoyo route!!!!');
})

routes.post('/workout', (req,res)=>{
    let yo =  new work({
        equip: req.body.equip,
        level: req.body.level
        //desc: req.body.desc
    })
    yo.save()
    .then(result=>{
        res.redirect('/success');
        console.log(result);
    })
    .catch(err=>{
        console.log(err);
    })
})




routes.get('/',(req,res)=>{
    res.render('index');
});  



routes.get('/success',(req,res)=>{
    let token = req.cookies['auth_token'];
    if(token && auth.checkToken(token)){
        res.render('success');
    }else{
        res.redirect('/login');
    }

})



//LOGIN//////////////////////////////
routes.post('/login', async (req,res)=>{
    let email = req.body.email;
    let password  = req.body.password;
    let User = await user.find().where({email:email});
    console.log(User);
    if(User.length>0)
    {
        let compareRes = await bcrypt.compare(password, User[0].password);
        if(compareRes){
            let token = auth.generateToken(User[0]);
            res.cookie('auth_token',token);
            res.redirect('/success');
           // res.redirect('success')


        }else{
            res.send('Rejected!')
        }
    }
    else
    {
        res.send('Rejected');
    }
})

//////////////register///////////////////////////////
routes.post('/register',(req,res)=>{
        let {email,username, password, confirmpassword} = req.body;
        let err;
      if(!email || !username || !password || !confirmpassword){
          err = "Please fill the details..";
          res.render('index',{'err':err});  
      }
      if(password!=confirmpassword){
        err = "Password do not match..";
        res.render('index',{'err':err,'email': email,'username': username}); 
      }
      if(typeof err == 'undefined'){
          user.findOne({email:email},function(err,data){
            if(err) throw err;
            if(data){
                console.log("user exist");
                err = "User already exixts with this email";
                res.render('index',{'err':err,'email': email,'username': username});
            }else{
                bcrypt.genSalt(10,(err,salt)=>{
                    if(err) throw err;
                    bcrypt.hash(password,salt,(err,hash)=>{
                        if(err) throw err;
                        password = hash;
                        user({
                            email,
                            username,
                            password
                        }).save((err,data)=>{
                            if(err) throw err;
                            res.redirect('/login')
                        });
                    })
                })
            }
          });
      }
      
});




routes.get('/login',(req,res)=>{
    res.render('login');
})



module.exports = routes;
