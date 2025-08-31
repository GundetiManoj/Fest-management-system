const passport = require('passport');
require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../connect.js');

//const User = require('../../database/schemas/user.js');


const {genpassword,validPassowrd} = require('../lib/passwordUtils.js');
const customFields={
    usernameField:'emailId',
    passwordField:'password',
    passReqToCallback:true

}

// here get user from db and check if user is verified or not
// user can be student or organizer or admin or volunteer
// write psql query to get user from db
//give me the psql query to get user from db
'(select * from students where email=$1) union (select * from organizers where email=$1) union (select * from volunteers where email=$1) union (select * from admins where email=$1'



const verifyCallback=(req,username,password,done)=>{
    console.log('verification started')
    var  query;
    if(req.body.userType==='student'){
        query=`select * from Students where EmailID=$1`;
        console.log('trying to log as student');
    }
    else if(req.body.userType==='organizer'){
        query=`select * from Organizers where EmailID=$1`
    }
    else if(req.body.userType==='admin'){
        query=`select * from  administrators where EmailID=$1` // administratos does not exit.
    }
    else {
        // participants 
        query=`select * from ExternalParticipants where EmailID=$1`

    }

    //convert this json

    db.query(query, [username]).then((user)=>{
        if(!user.rowCount){
            console.log('no user');
            return done(null,false,{message:'No user with that email'});
        }
        const isValid =validPassowrd(password,user.rows[0].hash,user.rows[0].salt);
        if(!isValid){
            console.log('not valid')
           
            return done(null,false,{message:'Incorrect password'});
        }
        if((req.body.userType!=='admin' && req.body.userType!=='organizer') && !user.rows[0].isverified){
            console.log('not verified');
            return done(null,false,{message:'Please verify your email'});
        }
        else{
            console.log('auth sucess');
            return done(null,user);
        }
    }).catch((error)=>
    {
        done(error);
    })
}
const strategy =new LocalStrategy(customFields,verifyCallback);


passport.use(strategy);
passport.serializeUser((user, done) => {
    done(null, user.rows[0].id);
});


// change this accordingly

//should you use parse int here ??
passport.deserializeUser((userId, done) => {
    db.query((`(select * from students where id=$1) union (select * from organizers where id=$1) union (select * from participants where id=$1) union (select * from admins where id=$1)`),[parseInt(userId,10)])
        .then((user) => {
            done(null, user.rows[0]);
        })
        .catch(err => done(err))
});