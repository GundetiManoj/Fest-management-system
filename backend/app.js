require("dotenv").config();
const path = require("path"); 
const fs = require("fs");
//import random string
const randomString = require("randomstring");
const session = require("express-session");
//const genfunc =require("connect-pg-simple").genFunc;
const pgSession = require("connect-pg-simple")(session);

//const stripe = require("stripe")(
  //"sk_test_51MnnkzSARgmBpkGyMJdzua5kXod303wNYtLJqvKr6TMAgdFJCFakSa8aQFEXUxNfMk7ZqFu6EwmL9AEiQz2TCIRm00RpPNyrGj"
//);

//isAuth = require("./backend/middleware/isAuth.js");
//const multer = require("multer");
//const uploader = multer({ dest: "uploads/" });
//const fileupload = require("express-fileupload");
const db=require('./connect.js');
isAuth = require("./middleware/isAuth.js");
const cors = require("cors");  

//const pool = require("./backend/connect.js");

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
//const home = require("./backend/routes/home.js");
//const search = require("./backend/routes/search.js");
//app.use(fileupload());
const crypto = require("crypto");
//const findflights=require('./backend/middleware/findflights.js');

//const login=require('./backend/controllers/login.js');

//const user = require("./database/schemas/user.js");

//const flight = require("./database/schemas/flights.js");

//const MongoStore = require("connect-mongo")(session);
//const findflights = require("./backend/middleware/findflights.js");
const passport = require("passport");
const {
  genpassword,
  validPassowrd,
} = require("./lib/passwordUtils.js");
//const { loginpage } = require("./backend/controllers/login.js");

const ensure = require("connect-ensure-login");
//const { verify } = require("./backend/lib/verifycowincert.js");
const { upload } = require("./lib/upload.js");
const { rename1 } = require("./lib/rename.js");
//const schedule = require("./database/schemas/schedule.js");

// let image = fs
//   .readFileSync("./backend/mailbody/Cloud9logo.png")
//   .toString("base64");
// const templateHtml = require("./backend/mailbody/ticketConfirmation.js");

 const {
   sendVerificationMail,
 } = require("./lib/sendVerificationMail.js");
// const airport = require("./database/schemas/airports.js");
const { log } = require("console");

//const { sendSuccessEmail } = require("./backend/lib/success.js");
//const { html_to_pdf } = require("./backend/lib/test1.js");
//const qrcode = require("qrcode");

//const { forgotpassword } = require("./backend/lib/forgotpassword.js");
//const {refundmail}=require('./backend/lib/refundmail.js');
require("./config/passport.js");
const start = async () => {
  try {
    //db = await connect()    ;
    app.listen(5002, console.log("Listening on port 5002..."));
  } catch (error) {
    console.log(error);
  }
};

start();

// const sessionStore = new MongoStore({
//   mongooseConnection: mongoose.connection,
//   collection: "sessions",
// });

const sessionConfig = {
  store: new pgSession({
      pool: db,
      tableName: 'sessions'
  }),
  name: 'SID',
  secret: randomString.generate({
      length: 14,
      charset: 'alphanumeric'
  }),
  resave: false,
  saveUninitialized: true,
  cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: true,
      secure: false // ENABLE ONLY ON HTTPS
  }}

 app.use(
   session(sessionConfig)
   );

app.use(passport.initialize());
app.use(passport.session());



app.get("/", (req, res, next) => {
  //give link to login page
  const form = "hello world!!"
  res.send(form);

});
app.get("/login", (req,res,next)=>{
  const form = '<h1>Login Page</h1><form method="POST" action="/login">\
  Enter email:<br><input type="text" name="email">\
  <br>Enter Password:<br><input type="password" name="password">\
  <br><br><input type="submit" value="Submit"></form>';
 

  res.send(form);
  next();



});
app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login-error" }),
  (req, res, next) => {
    console.log(req.user);
    console.log(req.session);
    console.log(req.sessionID);
    const d = { user: req.user.rows[0], session: req.session, sessionID: req.sessionID};
    res.send(d);
    next();
  
  }
  
);
app.get("/register", (req, res, next) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="name">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br>Enter Email:<br><input type="email" name="email">\
                    <br>Enter Phone:<br><input type="text" name="phone">\
                    <br>Enter Date of Birth:<br><input type="date" name="dob">\
                    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});
app.post("/register", async (req, res, next) => {
  const saltHash = genpassword(req.body.password);
  const salt = saltHash.salt;
  const hash = saltHash.hash;
  const userType = req.body.userType;
  const newuser =  {
    email: req.body.email,
    hash: hash,
    salt: salt,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    emailToken: crypto.randomBytes(64).toString("hex"),
    isVerified: false,
    college: req.body.college,
    isVolunteer:0
   
  };
  //console.log(newuser,userType);
  var query;
  const guestHouseNames=["Tgh","Mgh","Sgh","Dgh","Agh"];
  var guestHouseName;
  var roomNumber;
  try{
    var user;
  if(userType=="organizer")
  {
    query = `INSERT INTO Organizers(FirstName, LastName, Hash, Salt, isVerified, EmailID, EmailToken, OrganiserType) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
    user = await db.query(query,[newuser.firstName,newuser.lastName,newuser.hash,newuser.salt,newuser.isVerified,newuser.email,newuser.emailToken,req.body.organizerType]);
  }
  else if (userType=="student"){
    query = `INSERT INTO Students (FirstName, LastName, Hash, Salt, isVerified, EmailToken, EmailID, isVolunteer)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8);`;
    user = await db.query(query,[newuser.firstName,newuser.lastName,newuser.hash,newuser.salt,newuser.isVerified,newuser.emailToken,newuser.email,newuser.isVolunteer]);
  }
  else if(userType=="participant")
  {
   
    guestHouseName=guestHouseNames[Math.floor(Math.random()*5)];
    roomNumber=Math.floor(Math.random()*100);
    query = `INSERT INTO ExternalParticipants (FirstName, LastName, Hash, Salt, isVerified, EmailToken, EmailID, College, GuestHouseName, RoomNumber)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;
    user = await db.query(query,[newuser.firstName,newuser.lastName,newuser.hash,newuser.salt,newuser.isVerified,newuser.emailToken,newuser.email,newuser.college,guestHouseName,roomNumber]);
  }
  else{
    query = `insert into administrators (FirstName, LastName, Hash, Salt, EmailID) values ($1, $2, $3, $4, $5);`;
    user = await db.query(query,[newuser.firstName,newuser.lastName,newuser.hash,newuser.salt,newuser.email]);
  }
    //const user = await db.query(query,[newuser.email,newuser.hash,newuser.salt,newuser.firstName,newuser.lastName, newuser.college, newuser.emailToken,newuser.isVerified, newuser.isVolunteer, 0, guestHouseName, roomNumber]);
    await sendVerificationMail(newuser.email, newuser.emailToken);
    res.send(user);
    
  }
  catch(error){
    if(error.code=='23505')
    {
      res.status(400);
      res.send("Email already registered");
      console.log(error);
    }
    else {
      res.status(400);
      res.send("error");
      console.log(error);
    
    }
  }
});
app.get("/login-error", async(req, res, next) => {
  res.status(400);
  res.send("Invalid username or password or wrong user type");
}
);
app.get("/logout", async(req, res, next) => {
  req.logout();
  res.send("Logged out");
});
app.get("/getallevents", async (req, res, next) => {
  try {
    query=`Select * from Events`;
    const events = await db.query(query);
    res.send(events.rows);
  } catch (error) {
    res.status(400);
    res.send("error");
  }
  next();
}
);
app.post("/registerforevent",async (req, res, next) => {
  //check if user is already registered
  var eventId=req.body.eventId;
  eventId=parseInt(eventId);
  var userId=req.body.userId;
  //convert it into integer
  userId=parseInt(userId);
  var query;
  try{
    const authHeader = req.headers['authorization'];
    const sessId = authHeader.split(' ')[1]; 
  
      
        query=`select * from sessions where sid=$1`;
        const result =await db.query(query, [sessId]);
        if(!result.rows[0].sess.passport.user)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
        //organizer are between 3000(excluded) and 4000
        if(result.rows[0].sess.passport.user != userId)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
  
      }
      catch(error){
        res.status(400);
        res.send("error");
        return;
      }
  console.log(userId,typeof userId);
  try{
    if((userId > 2000) && (userId <= 3000)){
      query=`INSERT INTO EventExternalParticipants (EventID, ParticipantID) VALUES ($1, $2);` ;
      const event = await db.query(query,[eventId, userId]);
      console.log(query);
    }
    else if((userId > 1000) && (userId <= 2000)){
      query=`INSERT INTO EventStudents (EventID, StudentID) VALUES ($1, $2);`;
      const event = await db.query(query,[eventId, userId]);
      console.log(query);
    }else{
      //not eligible to register for events
      console.log("not eligible to register for events");
      res.status(400);
      res.send("Can't Register");
    }
    res.status(200);
    res.send("Success");

  }
  catch (error)
  {
    console.log(error);
    res.status(400);
    res.send("Already registered");
  }
 
  next();
  //managers cant register for events



}
);
app.get("/geteventdetails/:id", async (req, res, next) => {
  var eventId;
  var query;
  //console.log(req.sessionID);
  try{
    const authHeader = req.headers['authorization'];
    const sessId = authHeader.split(' ')[1]; 
    console.log(sessId);
  
      
        query=`select * from sessions where sid=$1`;
        const result =await db.query(query, [sessId]);
        console.log(result.rows[0]);
        if(!result.rows[0].sess.passport.user)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
        //organizer are between 3000(excluded) and 4000
        // if(!result.rows[0].sess.passport.user )
        // {
        //   console.log('no user');
        //   res.status(400);
        //   res.send("error");
        //   return;
      //  }
       
  
      }
      catch(error){
        console.log('querry error');
        console.log(error);
        res.status(400);
        res.send("error");
        return;
      }

  try {
    eventId=req.params.id;
    query=`Select * from Events where ID=$1`;
    const events = await db.query(query, [eventId]);
    res.send(events.rows);
  } catch (error) {
    res.status(400);
    res.send("error");
    console.log(error);
  }
  next();
}
);

app.get("/getalleventregistrations/:id", async (req, res, next) => {
  try {
    userId=req.params.id;
    query = `Select ID,Name from Events where Events.ID in (Select EventID from EventParticipants where ParticipantID=$1);`;
    const events = await db.query(query, [userId]);
    res.send(events.rows);
  } catch (error) {
    res.status(400);
    res.send("error");
  }
  next();
}
);  

app.post("/setasvolunteer",async (req, res, next) => {
  const userId=req.body.userId;
  var query;
  const q1 = `INSERT INTO Volunteers (StudentID) VALUES ($1);`;
  try{
    const authHeader = req.headers['authorization'];
    const sessId = authHeader.split(' ')[1]; 
  
      
        query=`select * from sessions where sid=$1`;
        const result =await db.query(query, [sessId]);
        if(!result.rows[0].sess.passport.user)
        {
          res.status(400);
          res.send("error");
          return;
        }
        //stduent betweeen 1000 and 2000
       
        //organizer are between 3000(excluded) and 4000
        if(result.rows[0].sess.passport.user != userId)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
  
      }
      catch(error){
        res.status(400);
        res.send("error");
        return;
      }
  try{
    query=`INSERT INTO Students (isVolunteer) VALUES (1) WHERE ID=$1;`;
    const event1 = await db.query(q1, [userId]);
    const event = await db.query(query, [userId]);
    res.status(200);
    res.send(event);
  }catch(error){
    res.status(400);
    res.send("Already registered");
  }
  next();
})

app.post("/registerasvolunteer", async (req, res, next) => {
  
  const eventId=req.body.eventId;
  console.log(userId);
  var query;
  try{
    var userId=req.body.userId;
    const authHeader = req.headers['authorization'];
    const sessId = authHeader.split(' ')[1]; 
  
      
        query=`select * from sessions where sid=$1`;
        const result =await db.query(query, [sessId]);
        if(!result.rows[0].sess.passport.user)
        {
          console.log('register as volunteer');
          res.status(400);
          res.send("error");
          return;
        }
       
        //organizer are between 3000(excluded) and 4000
        if(result.rows[0].sess.passport.user != userId)
        {
          console.log('register as volunteer');
          res.status(400);
          res.send("error");
          return;
        }
       
  
      }
      catch(error){
        console.log('register as volunteer');

        res.status(400);
        res.send("error");
        return;
      }

  try{
  if((userId > 1000) && (userId <= 2000)){
    query=`INSERT INTO EventVolunteers (EventID, VolunteerID) VALUES ($1, $2);` ;
    const event = await db.query(query,[eventId, userId]);
    res.status(200);
    res.send(event);
  }else{
    //not eligible to register as volunteer
    res.status(400);
    res.send("Can't Register");
  }
  }catch(error){
    res.status(400);
    res.send("error");
  }
  next();
  //managers cant register as volunteers

}
);
app.get("/viewalleventsforvolunteer/:id",async (req, res, next) => {

  var query;
  try{

    var userId=req.params.id;
    // console.log(userId,typeof userId);
    //userId=parseInt(userId);
    const authHeader = req.headers['authorization'];
    const sessId = authHeader.split(' ')[1]; 
  
      
        query=`select * from sessions where sid=$1`;
        const result =await db.query(query, [sessId]);
        if(!result.rows[0].sess.passport.user)
        {
          console.log('view all eventes for volunteer');
          res.status(400);
          res.send("error");
          return;
        }
        userId=parseInt(userId);
       
        //organizer are between 3000(excluded) and 4000
        if(result.rows[0].sess.passport.user != userId)
        {
          console.log('view all eventes for volunteer');
          res.status(400);
          res.send("error");
          return;
        }
       
  
      }
      catch(error){
        console.log('hello');
        console.log(error);
        console.log('view all eventes for volunteer');
        res.status(400);
        res.send("error");
        return;
      }
  
  try {
    

    query=`select * from Events where Events.ID in (select EventID from EventVolunteers where VolunteerID=$1);`;
    const events = await db.query(query, [userId]);
    //console.log(userId)
    res.send(events.rows);
  } catch (error) {
    res.status(400);
    res.send("error");
  }
  next();
}
);

app.post("/deletestudent", async (req, res, next) => {
  
  var query=`DELETE FROM Students WHERE ID=$1`;
  //only admin can do it 
  try{
    var userId=req.body.userId;
    const authHeader = req.headers['authorization'];
    const sessId = authHeader.split(' ')[1]; 
  
      
        query=`select * from sessions where sid=$1`;
        const result =await db.query(query, [sessId]);
        if(!result.rows[0].sess.passport.user)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
        //admin are between 4000(excluded) and 5000
        if(result.rows[0].sess.passport.user <= 4000 && result.rows[0].sess.passport.user >5000)
        {
          res.status(400);
          res.send("error");
          return;
        }
  
      }
      catch(error){
        res.status(400);
        res.send("error");
        return;
      }

  try{
    query=`DELETE FROM Students WHERE ID=$1`;
    const event = await db.query(query, [userId]);
    res.send(event);
  }catch(error){
    res.status(400);
    res.send("error");
  }
  next();
})

app.post("/removevolunteer", async (req, res, next) => {
  
  var query;
  try{
    var userId=req.body.userId;
    const authHeader = req.headers['authorization'];
    const sessId = authHeader.split(' ')[1]; 
  
      
        query=`select * from sessions where sid=$1`;
        const result =await db.query(query, [sessId]);
        if(!result.rows[0].sess.passport.user)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
        //organizer are between 3000(excluded) and 4000
        if(result.rows[0].sess.passport.user <= 3000 && result.rows[0].sess.passport.user >4000)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
  
      }
      catch(error){
        res.status(400);
        res.send("error");
        return;
      }
  try{
    query=`DELETE FROM Volunteers WHERE StudentID=$1`;
    const event = await db.query(query, [userId]);
    res.send(event);
  }catch(error){
    res.status(400);
    res.send("error");
  }
})

app.post("/deleteparticipant", async (req, res, next) => {
  const userId=req.body.userId;
  const query=`DELETE FROM ExternalParticipants WHERE ID=$1`;
  try{
    const event = await db.query(query, [userId]);
    res.send(event);
  }catch(error){
    res.status(400);
    res.send("error");
  }
  next();
})

app.get("/getallvolunteers/:id", async (req, res, next) => {
  
  var query;
  try{
    var eventId=req.params.id;
    const authHeader = req.headers['authorization'];
    const sessId = authHeader.split(' ')[1]; 
  
      
        query=`select * from sessions where sid=$1`;
        const result =await db.query(query, [sessId]);
        if(!result.rows[0].sess.passport.user)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
        //organizer are between 3000(excluded) and 4000
        if(result.rows[0].sess.passport.user <= 3000 && result.rows[0].sess.passport.user >4000)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
  
      }
      catch(error){
        res.status(400);
        res.send("error");
        return;
      }

  
  try {
   

     query=`select FirstName, LastName, EmailID from Students where ID in (select VolunteerID from EventVolunteers where EventID=$1);`;
    const events = await db.query(query, [eventId]);
    res.send(events.rows);
  } catch (error) {
    res.status(400);
    res.send("error");
    console.log(error);
  }
}
);

app.get("/getallparticipants", async (req, res, next) => {
  //only admins can do this 
  var query;
  try{
    const authHeader = req.headers['authorization'];
    const sessId = authHeader.split(' ')[1]; 
  
      
        query=`select * from sessions where sid=$1`;
        const result =await db.query(query, [sessId]);
        if(!result.rows[0].sess.passport.user)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
        //organizer are between 3000(excluded) and 4000
        if(result.rows[0].sess.passport.user <= 4000 && result.rows[0].sess.passport.user >4500)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
  
      }
      catch(error){
        res.status(400);
        res.send("error");
        return;
      }


  try {
     query=`SELECT * from ExternalParticipants`;
    const events = await db.query(query);
    res.send(events.rows);
  } catch (error) {
    res.status(400);
    res.send("error");
  }
})

app.get("/getallparticipants/:id", async (req, res, next) => {

  var eventId;
  var query;
  try{
     eventId=req.params.id;
    const authHeader = req.headers['authorization'];
    const sessId = authHeader.split(' ')[1]; 
  
      
        query=`select * from sessions where sid=$1`;
        const result =await db.query(query, [sessId]);
        if(!result.rows[0].sess.passport.user)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
        //organizer are between 3000(excluded) and 4000
        if(result.rows[0].sess.passport.user <= 3000 && result.rows[0].sess.passport.user >5000)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
  
      }
      catch(error){
        res.status(400);
        res.send("error");
        return;
      }
  try {
    
    //first need to check if he is a manager? implement in backend or database?

     query=`select FirstName, LastName, EmailID,ID from Students where ID in (select StudentID from EventStudents where EventID=$1) union select FirstName, LastName, EmailID,ID from ExternalParticipants where ID in (select ParticipantID from EventExternalParticipants where EventID=$1);`;
    const events = await db.query(query, [eventId]);
    res.send(events.rows);
  } catch (error) {
    res.status(400);
    res.send("error");
    console.log(error);
  }
}
);

app.get("/getallstudents", async (req, res, next) => {
  //only admins can do this
  var query;
  try{
    const authHeader = req.headers['authorization'];
    const sessId = authHeader.split(' ')[1]; 
  
      
        query=`select * from sessions where sid=$1`;
        const result =await db.query(query, [sessId]);
        if(!result.rows[0].sess.passport.user)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
        //organizer are between 3000(excluded) and 4000
        if(result.rows[0].sess.passport.user <= 4000 && result.rows[0].sess.passport.user >=5000)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
  
      }
      catch(error){
        res.status(400);
        res.send("error");
        return;
      }

  try {
     query=`SELECT * from Students`;
    const events = await db.query(query);
    res.send(events.rows);
  } catch (error) {
    res.status(400);
    res.send("error");
  }
})

app.get("/getwinners/:id", async (req, res, next) => {
  try {

    //any body can do this 
    const eventId=req.params.id;
  
    // no need to be manager
    const query=`select FirstName,LastName,emailid,id from students where ID in (select firstprizewinnerid from eventwinners where eventid = $1 union select secondprizewinnerid from eventwinners where eventid = $1 union select thirdprizewinnerid from eventwinners where eventid = $1) union select FirstName,LastName,emailid,id from externalparticipants where ID in (select firstprizewinnerid from eventwinners where eventid = $1 union select secondprizewinnerid from eventwinners where eventid = $1 union select thirdprizewinnerid from eventwinners where eventid = $1);`;
    const events = await db.query(query, [eventId]);
    res.send(events.rows);
  } catch (error) {
    res.status(400);
    res.send("error");
    console.log(error);
  }
});

app.get("/getwinnersid/:id", async (req, res, next) => {
  try {
    const eventId=req.params.id;
    
    // no need to be manager
    const query=`select firstprizewinnerid,secondprizewinnerid,thirdprizewinnerid from eventwinners where eventid = $1`;
    const events = await db.query(query, [eventId]);
    res.send(events.rows);
  } catch (error) {
    res.status(400);
    res.send("error");
    console.log(error);
  }
})

//admin specific tasks
app.post("/createevent", async (req, res, next) => {
  const eventName=req.body.eventName;
  const eventDescription=req.body.eventDescription;
  const startDate=req.body.startDate;
  const hours = req.body.hours;
  const minutes = req.body.minutes;
  const type = req.body.type;
  var prize = parseInt(req.body.prize);
  const venueId = req.body.venueId;
  var query;
  const time = hours+":"+minutes;
  

  if(isNaN(prize))
  {  prize=null;
  }
  //admin range?
  //sessId=req.sessId;
  // search if sessId is logged in
    // if not logged in then return error
    // if logged in then check if he is a manager
    // if he is a manager then return all participants
    try{
  const authHeader = req.headers['authorization'];
  const sessId = authHeader.split(' ')[1]; 

    
      query=`select * from sessions where sid=$1`;
      const result =await db.query(query, [sessId]);
      if(!result.rows[0].sess.passport.user)
      {
        res.status(400);
        res.send("error");
        return;
      }
     
      //organizer are between 3000(excluded) and 4000
      if(result.rows[0].sess.passport.user <= 4000 && result.rows[0].sess.passport.user >5000)
      {
        res.status(400);
        res.send("error");
        return;
      }
     

    }
    catch(error){
      res.status(400);
      res.send("error");
      return;
    }
  try{
    query=`INSERT INTO Events (Name, Description, Date, Time, Type, Prize, VenueID) VALUES ($1, $2, $3, $4, $5, $6, $7);`;
    const event = await db.query(query, [eventName, eventDescription, startDate, time, type, prize, venueId]);
    res.send(event);
  }catch(error){
    console.log(error);
    res.status(400);
    res.send("error");
  }
}
);
app.post("/deleteevent", async (req, res, next) => {
  const eventId=req.body.eventId;
  var query;
  try{
    const authHeader = req.headers['authorization'];
    const sessId = authHeader.split(' ')[1]; 
  
      
        query=`select * from sessions where sid=$1`;
        const result =await db.query(query, [sessId]);
        if(!result.rows[0].sess.passport.user)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
        //organizer are between 4000(excluded) and 5000
        if(result.rows[0].sess.passport.user <= 4000 && result.rows[0].sess.passport.user >5000)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
  
      }
      catch(error){
        res.status(400);
        res.send("error");
        return;
      }
  
  try{
    query=`DELETE FROM Events WHERE ID=$1`;
    const event = await db.query(query, [eventId]);
    res.send(event);
  }catch(error){
    res.status(400);
    res.send("error");
    console.log(error);
  }
}
);

app.post("/deleteorganizer", async (req, res, next) => {
  const userId=req.body.userId;
  var query;
  try{
    const authHeader = req.headers['authorization'];
    const sessId = authHeader.split(' ')[1]; 
  
      
        query=`select * from sessions where sid=$1`;
        const result =await db.query(query, [sessId]);
        if(!result.rows[0].sess.passport.user)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
        //organizer are between 3000(excluded) and 4000
        if(result.rows[0].sess.passport.user <= 4000 && result.rows[0].sess.passport.user >5000)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
  
      }
      catch(error){
        res.status(400);
        res.send("error");
        return;
      }
  try{
    query=`DELETE FROM Organizers WHERE ID=$1`;
    const event = await db.query(query, [userId]);
    res.send(event);
  }catch(error){
    res.status(400);
    res.send("error");
    console.log(error);
  }
})

app.get("/getassorg/:id", async (req, res, next) => {
  var eventId;
  var query;
  try{
    const authHeader = req.headers['authorization'];
    const sessId = authHeader.split(' ')[1]; 
  
      
        query=`select * from sessions where sid=$1`;
        const result =await db.query(query, [sessId]);
        if(!result.rows[0].sess.passport.user)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
        //organizer are between 3000(excluded) and 4000
        if(result.rows[0].sess.passport.user <= 3000 && result.rows[0].sess.passport.user >5000)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
  
      }
      catch(error){
        res.status(400);
        res.send("error");
        return;
      }
  try {
    eventId=req.params.id;
    query=`select * from events where id in (SELECT EventID from eventorganizers where OrganizerID=$1);`;
    const events = await db.query(query, [eventId]);
    res.send(events.rows);
  } catch (error) {
    res.status(400);
    res.send("error");
  }
})

app.post("/setassevent", async (req, res, next) => {
  const userId=req.body.userId;
  const eventId=req.body.eventId;
  var query;
  try{
    const authHeader = req.headers['authorization'];
    const sessId = authHeader.split(' ')[1]; 
  
      
        query=`select * from sessions where sid=$1`;
        const result =await db.query(query, [sessId]);
        if(!result.rows[0].sess.passport.user)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
        //organizer are between 3000(excluded) and 4000
        if(result.rows[0].sess.passport.user <= 4000 && result.rows[0].sess.passport.user >5000)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
  
      }
      catch(error){
        res.status(400);
        res.send("error");
        return;
      }
  try{
    query=`INSERT INTO EventOrganizers (EventID, OrganizerID) VALUES ($1, $2);`;
    const event = await db.query(query, [eventId, userId]);
    res.send(event);
  }catch(error){
    res.status(400);
    res.send("error");
  }
}
);

app.post("/addOrganizerEmail", async (req, res, next) => {
  const emailId=req.body.emailId;
  var query;
  try{
    const authHeader = req.headers['authorization'];
    const sessId = authHeader.split(' ')[1]; 
  
      
        query=`select * from sessions where sid=$1`;
        const result =await db.query(query, [sessId]);
        if(!result.rows[0].sess.passport.user)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
        //organizer are between 3000(excluded) and 4000
        if(result.rows[0].sess.passport.user <= 4000 && result.rows[0].sess.passport.user >5000)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
  
      }
      catch(error){
        res.status(400);
        res.send("error");
        return;
      }
  try{
    query=`INSERT INTO OrganizerEmails (EmailID) VALUES ($1)`;
    const event = await db.query(query, [emailId]);
    res.send(event);
  }catch(error){
    res.status(400);
    res.send("Organizer already added");
  }
}
);

app.get("/getallorganizers", async (req, res, next) => {
  //only admins can do this
  var query;
  try{
    const authHeader = req.headers['authorization'];
    const sessId = authHeader.split(' ')[1]; 
  
      
        query=`select * from sessions where sid=$1`;
        const result =await db.query(query, [sessId]);
        if(!result.rows[0].sess.passport.user)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
        //organizer are between 3000(excluded) and 4000
        if(result.rows[0].sess.passport.user <= 4000 && result.rows[0].session.passport.user >5000)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
  
      }
      catch(error){
        res.status(400);
        res.send("error");
        return;
      }

  try {
     query=`SELECT * from Organizers`;
    const events = await db.query(query);
    res.send(events.rows);
  } catch (error) {
    res.status(400);
    res.send("error");
  }
})

app.get("/getwinners", async (req, res, next) => {
  try {
    eventId=req.body.eventId;
    //first need to check if he is a manager? implement in backend or database?
    // no need to be manager
    query=``;
    const events = await db.query(``);
    res.send(events.rows);
  } catch (error) {
    res.status(400);
    res.send("error");
  }
}
);

app.post("/settpeorg", async (req, res, next) => {
  const userId=req.body.userId;
  var query;
  try{
    const authHeader = req.headers['authorization'];
    const sessId = authHeader.split(' ')[1]; 
  
      
        query=`select * from sessions where sid=$1`;
        const result =await db.query(query, [sessId]);
        if(!result.rows[0].sess.passport.user)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
        //organizer are between 3000(excluded) and 4000
        if(result.rows[0].sess.passport.user <= 4000 && result.rows[0].sess.passport.user >5000)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
  
      }
      catch(error){
        res.status(400);
        res.send("error");
        return;
      }
  
  try{
     query=`UPDATE Organizers SET OrganiserType=$1 WHERE ID=$2;`;
    const event = await db.query(query, [req.body.type, userId]);
    res.send(event);
  }catch(error){
    res.status(400);
    res.send("error");
  }
})

app.get("/getuserinfo/:id", async (req, res, next) => {
  var userId;
  var query;
  var userId=req.params.id;
  userId=parseInt(userId);
  console.log(userId);
  //only user can do this 
  try{
    const authHeader = req.headers['authorization'];
    const sessId = authHeader.split(' ')[1]; 
  
      
        query=`select * from sessions where sid=$1`;
        const result =await db.query(query, [sessId]);
        if(!result.rows[0].sess.passport.user)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
        //organizer are between 3000(excluded) and 4000
        if(result.rows[0].sess.passport.user != userId)
        {
          res.status(400);
          res.send("error");
          return;
        }
       
  
      }
      catch(error){
        res.status(400);
        res.send("error");
        return;
      }

  try {
  if((userId > 1000) && (userId <= 2000)){
  query=`Select Firstname,LastName,isVolunteer,EmailID from Students where ID=$1`;
  }
  else if((userId > 2000) && (userId <= 3000)){
  query=`Select Firstname,LastName,EmailID,College,GuestHouseName,RoomNumber from ExternalParticipants where ID=$1`;
  }
  else if( userId > 3000 && userId <= 4000){
  query=`Select Firstname,LastName,EmailID,OrganiserType from Organizers where ID=$1`;
  }
  else{
    query=`Select Firstname,LastName,EmailID from Administrators where ID=$1`;
  }
  const user = await db.query(query, [userId]);
  res.send(user.rows);
  } catch (error) {
    console.log(error);
  res.status(400);
  res.send("error");
  }
  }
  );

app.post("/setwinners", async (req, res, next) => {
  const eventId=req.body.eventId;
  const winner1=req.body.winner1;
  const winner2=req.body.winner2;
  const winner3=req.body.winner3;
  var query;
  try{
    const authHeader = req.headers['authorization'];
    const sessId = authHeader.split(' ')[1]; 
  
      
        query=`select * from sessions where sid=$1`;
        const result =await db.query(query, [sessId]);
        if(!result.rows[0].sess.passport.user)
        {
          res.status(400);
          res.send("errorkgui");
          return;
        }
       
        //organizer are between 3000(excluded) and 4000
        if(result.rows[0].sess.passport.user <= 3000 && result.rows[0].sess.passport.user >5000)
        {
          res.status(400);
          res.send("errorlil");
          return;
        }
       
  
      }
      catch(error){
        res.status(400);
        res.send("error87");
        console.log(error);
        return;
      }
  //first need to check if he is a manager? implement in backend or database?
  try{
    query=`INSERT INTO EventWinners (EventID,FirstPrizeWinnerID , SecondPrizeWinnerID, ThirdPrizeWinnerID) VALUES ($1, $2, $3, $4);`;
    const event = await db.query(query, [eventId, winner1, winner2, winner3]);
    res.send(event);
  }catch(error){
    res.status(400);
    res.send("errorjvhj");
    console.log(error);
  }
}
);
app.get("/getallsponsers", async (req, res, next) => {
  try {
    eventId=req.body.eventId;
    

    query=`SELECT Name, EmailID from Sponsers where SponserID in (SELECT SponserID from EventSponsers where EventID=$1)`;
    const events = await db.query(query, [eventId]);
    res.send(events.rows);
  } catch (error) {
    res.status(400);
    res.send("error");
  }
}
);

app.get("/verify-email/:id", async (req, res, next) => {
  const emailToken = req.params.id;
  //console.log(req.sessionID);
  var resp;
  try
  {
    //console.log(emailToken);
    resp= await db.query('(SELECT ID,isVerified FROM Students WHERE EmailToken=$1) union (select ID,isVerified from Organizers WHERE EmailToken=$1) union (select ID,isVerified from externalparticipants where EmailToken=$1)', [emailToken]);
    //console.log(resp.rows[0].id);
  }
  catch(error)
  {
    res.status(400);
    res.send("error");
    console.log(error);
  }
  if(resp.rowCount==0)
  {
    console.log('Invalid Token');
    res.status(400);
    res.send("Invalid Token");
  }
 else {
  if(resp.rows[0].isverified==='1')
  {

    res.status(400);
    res.send("Email already verified");
  }
  else {
    console.log('found token');
    try {
      //find out user type
      //id 2000 (exluded)-3000 external participants
      //id 1000-2000 students
      //else managers
      var events;
      if((resp.rows[0].id > 1000) && (resp.rows[0].id <= 2000)){
        //also set emailToken to null
        query=` UPDATE Students SET isVerified=true WHERE EmailToken=$1 RETURNING *`;
        //console.log(query,resp.rows[0].id);
      events =  await db.query(query, [emailToken]);
      console.log(events.rows);
      //set email token to null


     
      console.log('student')
      }
      else if((resp.rows[0].id > 2000) && (resp.rows[0].id <= 3000)){
        query=`UPDATE ExternalParticipants SET isVerified=true WHERE EmailToken=$1`;
        //console.log(query,resp.rows[0].id);
        events =  await db.query(query, [emailToken]);
        console.log('external')
      }
      else{
        query=`UPDATE Organizers SET isVerified=true WHERE EmailToken=$1`;
        //console.log(query,resp.rows[0].id);
         events = await db.query(query, [emailToken]);
          console.log('organizer')
      }
      res.status(200);
      res.send("Success");
      next();
      


    }
     catch (error) {
       res.status(400);
       console.log(error);
       res.send("error");
     }
   }

  }
  });



















