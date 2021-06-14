import './App.css';
import Container from 'react-bootstrap/Container'
import { PlusCircleFill } from 'react-bootstrap-icons'
import 'bootstrap/dist/css/bootstrap.min.css';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import LoginForm from './Components/login.js'
import { BrowserRouter as Router, Route, Switch, useParams, Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import NavBar from './Components/navbar.js'
import AdminSurveysList from './Components/AdminSurveysList.js'
import AdminSurvey from './Components/AdminSurvey.js'
import UserFillInSurvey from './Components/UserFillInSurvey.js'
import {UserSurveyList} from './Components/UserSurveysList.js'
import CreateSurvey from './Components/CreateSurvey.js'
import API from './API.js'
import Button from 'react-bootstrap/Button'



function App() {

  //states and useEffcets related to list of information that need to be stored and relative API calls/update triggers


  //SURVEYS TO COMPLETE: all surveys accessible by everyone (that can be filled in)
  const [surveysToComplete, setSurveysToComplete] = useState([]);
  const [updateSurveysToComplete, setUpdateSurveysToComplete] = useState(undefined);

  //SUBMITTED SURVEYS: surveys submission info for the survey created by a specific admin
  const [submittedSurveys, setSubmittedSurveys] = useState([]);
  const [updateSubmittedSurveys, setUpdateSubmittedSurveys] = useState(undefined);

  //QUESTIONS: loaded both when user wants to fill in a survey and when admin wants to see responses
  const [Questions, setQuestions] = useState([]);
  const [questionssurveyid, setQuestionssurveyid]= useState(undefined);// when changed triggers retrieval of questions for a specific survey

  //RESPONSES: responses for a specific survey (loaded when an admin wants to check reposnses for one of his survey)
  const [Responses, setResponses] = useState([]);
  const [answerssurveyid, setAnswerssurveyid]= useState(undefined);

  //states for storing admin info
  const [admin, setAdmin] = useState(undefined);
  const [id, setId] = useState();
  
  //state used for filtering surveys using navbar filter
  const [navfilter, setNavfilter] = useState() 

  //message temporarely displayed after login
  const [loginmessage, setLoginMessage] = useState(); 

  //needed to display title of a certain surveyid inside different components
  const [title, setTitle] = useState(); 

  //state needed to ensure that after a submit the data are uploaded in the db before loading another page
  const [ready, setReady] = useState(true);


  
  //checking authorization
  useEffect(() => {
    const checkAuth = async () => {
      try{
        let res=await API.getAdminInfo();
        await setAdmin(res.username);
        await setId(res.id);
    } catch {
        await setAdmin(undefined);
    }};

    checkAuth();
  }, []);


  //SURVEYSTO COMPLETE: all surveys accessible by everyone (that can be filled in)
  useEffect(()=> {
    const getSurveys = async () => {
      setSurveysToComplete(await API.loadSurveysToComplete());
    };

    getSurveys().catch(err => {
      setLoginMessage({msg: "Impossible to load ! Please, try again later...", type: 'danger'});
      console.error(err);
    });
  }, [updateSurveysToComplete])


  //SUBMITTED SURVEYS: surveys submission info for the survey created by a specific admin
  useEffect(()=> {
    const getSurveys = async () => {
      if(admin) setSubmittedSurveys(await API.loadSubmittedSurveys()); 
    };

    getSurveys().catch(err => {
      setLoginMessage({msg: "Impossible to load ! Please, try again later...", type: 'danger'});
      console.error(err);
    });
  }, [updateSubmittedSurveys, admin])


  //RESPONSES: responses for a specific survey (loaded when an admin wants to check reposnses for one of his survey)
  useEffect(()=>{
    if(answerssurveyid){
      const getSurveyRes = async ()=>{
        await setTitle(await getSurveyTitle(answerssurveyid));
        await setResponses(await API.getSurveyResults(answerssurveyid)); 
      }
    
      getSurveyRes();
    }
  }, [answerssurveyid]);


  //QUESTIONS: loaded both when user wants to fill in a survey and when admin wants to see responses
  useEffect(()=>{
    if(questionssurveyid){
    const findSurveyStruct = async ()=>{
      await setTitle(await getSurveyTitle(questionssurveyid));
      await setQuestions(await API.getSurveyQuestions(questionssurveyid));
    }

    findSurveyStruct();
  }
  }, [questionssurveyid]);




   //message temporarely displayed after login
  useEffect(() => {
    setTimeout(() => {  
      // After 2 seconds make it disappear
      setLoginMessage(null)
    }, 2000)
  }, [loginmessage]);


  //Login and Logout methods
  const doLogin = async (credentials) => {
    try {

      let user=await API.login(credentials);
        await setAdmin(user.split('|')[0]);
        await setId(user.split('|')[1]);
        await setLoginMessage({ msg: `Welcome, ${admin}!`, type: 'success' });
    } catch (err) {
        setLoginMessage({ msg: err, type: 'danger' });
    }
  }

  const doLogout = async () =>{
    let logout = await API.logout();
    if (logout){
      setAdmin(undefined);
      setId(undefined);
    }
  }

  //Method used to trigger POST of new survey added by admiin
  const addSurvey = async (newSurvey) => {
    if(newSurvey){
      //await setReady(false)
      try{
      await API.addSurvey(newSurvey)
      .then(()=>{updatesurveystocomplete()})
      .catch(err =>console.log(err))
      } catch (err){
        console.log(err);
      }
      //await setReady(true)
    }
  }

  //Methods used to trigger POST of new survey response inserted by user
  const fillInSurvey = async (surveyresponse) => {
    if(surveyresponse){
      //await setReady(false)
      await API.sendSurvey(surveyresponse)
      .then(()=>{updatesubmittedsurveys()})
      .catch(err => console.log(err))
      //await setReady(true);
    }
  }

  //Method used for triggering load of questions for a specific survey when a user wants to fill it in
  const FillSurvey = async (survey) =>{
    await setQuestions([]);
    await setQuestionssurveyid('');
     await setQuestionssurveyid(survey);
  }

  //Method used for triggering load of questions and answers for a specific survey when an admin wants to check responses
  const CheckSurvey = async (survey) =>{
    await setQuestions([]);
    await setResponses([]);
    await setQuestionssurveyid('');
    await setAnswerssurveyid('');
    await setAnswerssurveyid(survey);
    await setQuestionssurveyid(survey);
  }

  //set title for a certain survey
  const getSurveyTitle= async (currentsurveyid) => {
    return surveysToComplete.map((s)=> { console.log(s.survey_id); if(s.survey_id === currentsurveyid) return s.survey_title;});
  }

  //change state to triogger useEffects
  const updatesurveystocomplete = ()=> {setUpdateSurveysToComplete(t=>!t)};
  const updatesubmittedsurveys = ()=> {setUpdateSubmittedSurveys(t=>!t)};
  const filterCards = (text)=> {setNavfilter(text)};


  //RENDERING
  return (
    <Router>
      <Container fluid >

        <Row className="ml-5 p-0">
          <Col className="m-0 p-0">
            <NavBar filter={filterCards} logout={doLogout} logged={admin} login={doLogin} />
          </Col>
        </Row>

        <Row>
          {loginmessage &&
            <Row>
              <Col sm={{ span: 4, offset: 4 }} >
                <Alert variant={loginmessage.type} onClose={() => setLoginMessage(null)} dismissible>{loginmessage.msg}</Alert>
              </Col>
            </Row>}
        </Row>

        <Row>
          <Switch>

            <Route exact path="/admin/login"
              render={() =>
                <>
                  {admin ? <Redirect to="/admin" /> :
                    <Col sm={{ span: 4, offset: 4 }}>
                      <br />
                      <br />
                      <LoginForm doLogin={doLogin} />
                    </Col>
                  }
                </>
              }
            />

            <Route exact path="/admin"
              render={() =>
                //!loggedIn ? <Redirect to="/admin/login" /> :
                !admin ? <Redirect to="/admin/login" /> :
                  ready ?
                  <>
                    <AdminSurveysList filter={navfilter} surveys={submittedSurveys} setad={CheckSurvey} />
                    <br></br>
                    <br></br>
                    <br></br>
                    <Link to='/admin/createsurvey'><Button> Create new Survey</Button> </Link>
                  </>
                  : null
              }
            />

            <Route exact path="/admin/surveyresults/:survey"
              render={() =>
                !admin ? <Redirect to="/admin/login" /> :
                  <>
                    <Col>
                      {(Questions.length !=0 && Responses.length!=0) ?<AdminSurvey responses={Responses} surveytitle={title} questions={Questions} /> :null}
                    </Col>
                  </>
              }
            />

            <Route exact path="/admin/createsurvey"
              render={() =>
                //!loggedIn ? <Redirect to="/admin/login" /> :
                !admin ? <Redirect to="/admin/login" /> :
                  <>
                    <Col>
                      <CreateSurvey addSurvey={addSurvey} admin={id} />
                    </Col>
                  </>
              }
            />

            <Route exact path="/AllSurveys"
              render={() =>
                ready ?
                <>
                  <UserSurveyList filter={navfilter} surveys={surveysToComplete} setus={FillSurvey} />
                </>
                : null
              }
            />

            <Route exact path="/AllSurveys/fillinsurvey/:survey"
              render={() =>
                <>
                  <Col>
                    <UserFillInSurvey surveyid={questionssurveyid} surveytitle={title} questions={Questions} fillIn={fillInSurvey} />
                  </Col>
                </>
              }
            />

            <Redirect to="/AllSurveys" />

          </Switch>
        </Row>

      </Container>
    </Router>
  );
}

export default App;
