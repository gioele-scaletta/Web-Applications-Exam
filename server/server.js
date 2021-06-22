'use strict';

const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // username+psw
const userDao = require('./user_dao'); //auth db access
const session = require('express-session');
const dao = require('./dao'); // module for accessing the DB

let cnt = 0;
/*** Set up Passport ***/
passport.use(new LocalStrategy(
  function (username, password, done) {
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
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(400).json({ error: 'Not authorized' });
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
app.get('/api/surveysToComplete', (req, res) => {
  dao.loadAllSurveys()
    .then(((s) => { res.json(s); }))
    .catch((err) => { res.status(500).json(err) });
});

//Get all surveys created by a certain admin together with the number of user who completed it
app.get('/api/submittedSurveys', isLoggedIn, async (req, res) => {
  dao.loadAdminSurveys(req.user.id)
    .then(((s) => { res.json(s); }))
    .catch((err) => { console.log(err); res.status(500).json(err); });
});

//Get all the responses for a certain survey (need to check loig in and also that the right admin is requesting the survey) 
//(both authenticatin and authorization)
app.get('/api/surveyResults/:survey', isLoggedIn, (req, res) => {
  dao.loadSurveyResponses(req.params.survey, req.admin)
    .then(((s) => { res.json(s); }))
    .catch((err) => { res.status(500).json(err); });
});

//Get the question for a specific survey when a user wants to complete it. 
//Since this function can be needed even when no admin is logged LOggedIn is not checked
app.get('/api/surveyQuestions/:survey', (req, res) => {
  dao.loadSurveyQuestions(req.params.survey)
    .then(((s) => { res.json(s); }))
    .catch((err) => { res.status(500).json(err); });
});

//Add a new survey type (need to be logged in) 
//We receive from the client a list of questions(+ as first field the admin and survey info), 
//After creating a new survey in the DB by calling dao.newSurvey(),
//we scan the list and add each question one by one to the db by calling dao.addQuestion()
app.post('/api/addSurvey', isLoggedIn, async (req, res) => {
  if(req.body.length<=1){ 
     res.status(500).json("wrong or inconsostent Survey format");//backend validation for survey info
  }
  
  //doing validation int his way it will be a little bit slower because we have to scan data twice but in this way we don't risk to insert invalid data and then later rollback
  //I evaluated the additional dealy as still ok in this case
  req.body.forEach((q,index)=> {    
    if(index!=0){
    if ( ((q.qtext.length < 0) || (q.qnum < 0) || !(q.open === 1 || q.open === 0) || q.optional < 0) ||  //backend validation for questions
     ( (q.open === 0) && ((q.single < q.optional) || (q.single > (q.qtext.split("|").length - 1))) ) //backend validation specific to closed answer
    ){
      res.status(500).json("wrong or inconsostent Question format");
    }}
  });

  let s_id;

  try {
    s_id = await dao.newSurvey(req.body[0].admin, req.body[0].Title);
  }
  catch (error) {
    res.status(500).json(error);
  }
 
    req.body.forEach(async (q, index) => {
      if (index !== 0) {
        try {
          await dao.addQuestion(s_id, q.qnum, q.qtext, q.open, q.optional, q.single);
        }
        catch (error) {
          res.status(500).json(error);
        }
      }
    });

  res.end();
});


// this function receives a survey response (list of responses to all questions)
//it scans all the responses in the list and add them one by one to the DB by calling dao.addResponse()
// since the uqser can fill in the survey without logging in the LoggedIn check is not needed
app.post('/api/sendSurvey', async (req, res) => {
  //backend validation
  if(req.body.length<0) 
    res.status(500).json("wrong or inconsostent Question format");

  req.body.forEach((q, index)=>{
    if(q.qnum<0 || !q.response || q.surveyid<0)
      res.status(500).json("wrong or inconsostent Question format");
  });

  let n;
  try {
    n = await dao.getMaxResponse();
  }
  catch (error) {
    res.status(500).json(error);
  }
  n++;
 
  req.body.forEach(async (q) => {
    //backend validation (even in case of no respose the response should be valid: an empty string)
    try {
      await dao.addResponse(n, q.surveyid, q.qnum, q.response);
    }
    catch (error) {
      res.status(500).json(error);
    }
  });

  res.end();
});


/*** User APIs ***/
app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current_session', (req, res) => {
  if (req.isAuthenticated())
    res.json(req.user);
  else
    res.status(401).json({ error: 'Not authenticated' });
});

// DELETE /sessions/current
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

app.listen(PORT, () => { console.log(`Server started at http://localhost:${PORT}/`) });