'use strict';

const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // username+psw
const userDao = require('./user_dao'); //auth db access
const session = require('express-session');
const dao = require('./dao'); // module for accessing the DB

let cnt=0;
/*** Set up Passport ***/
passport.use(new LocalStrategy(
  function(username, password, done) {
    userDao.getUser(username, password).then((user) => { 
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });
  
      return done(null, user);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => { 
  userDao.getUserById(id).then((user) => {
    done(null, user); // req.user
  })
  .catch((err) => {
    done(err, null);
  });
});

// init express
const app = new express();
const PORT = 3001;

app.use(morgan('dev'));
app.use(express.json()); // parse the body in JSON format => populate req.body attributes

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }

  return res.status(400).json({error: 'Not authorized'});
}

// enable sessions in Express
app.use(session({
  // set up here express-session
  secret: 'una frase segreta da non condividere con nessuno e da nessuna parte, usata per firmare il cookie Session ID',
  resave: false,
  saveUninitialized: false,
}));

// init Passport to use sessions
app.use(passport.initialize()); 
app.use(passport.session());

//Get all surveys (just title and id) to make normal user choose (no need for authentication)
app.get('/api/surveysToComplete', (req,res) =>{
  dao.loadAllSurveys()
  .then(((s) => { res.json(s); }))
  .catch((err)=>{res.status(500).json(err);});
});

//Get all surveys created by a certain admin together with the number of user who completed it
app.get('/api/submittedSurveys', isLoggedIn, (req,res)=>{
  dao.loadAdminSurveys(req.admin.id)
  .then(((s) => { res.json(s); }))
  .catch((err)=>{res.status(500).json(err);});
});

//Get all the responses for a certain survey (need to check loig in and also that the right admin is requesting the survey) 
//(both authenticatin and authorization)
app.get('/api/surveyResults', isLoggedIn, (req,res)=>{
  dao.loadSurveyResponses(req.survey, req.admin)
  .then(((s) => { res.json(s); }))
  .catch((err)=>{res.status(500).json(err);});
});

//Get the question for a specific survey when a user wants to complete it. 
//Since this function can be needed even when no admin is logged LOggedIn is not checked
app.get('/api/surveyQuestions', (req,res)=>{
  dao.loadSurveyQuestions(req.survey)
  .then(((s) => { res.json(s); }))
  .catch((err)=>{res.status(500).json(err);});
});

//Add a new survey type (need to be logged in) 
app.post('/api/addSurvey', isLoggedIn, (req,res)=>{
  let title;
  let s_id;

  req.body.forEach(async (q, index)=>{
    try{
    if(index===0){
      s_id= await dao.newSurvey(q.admin,q.Title);
    }
    else{
      await dao.addQuestion(s_id, q.qnum, q.qtext, q.open, q.optional, q.single );
    }}
    catch(error){
      res.status(500).json(error);
    }
  });
});

app.post('/api/sendSurvey', (req,res)=>{
  req.body.forEach(async (q, index)=>{
    try{
    //forse si può provare a usare variabile cnt=await
    //n= await dao.getMaxResponse();
    cnt = await dao.addResponse(cnt+1, q.surveyid, q.qnum, q.response);
    }
    catch(error){
      res.status(500).json(error);
    }
  });
});


/*** User APIs ***/
app.post('/api/sessions',  passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current_session', (req, res) => {
  if(req.isAuthenticated())
    res.json(req.user);
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /sessions/current
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

app.listen(PORT, () => { console.log(`Server started at http://localhost:${PORT}/`) });