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
import CreateSurvey from './Components/UserFillInSurvey.js'
import API from './API.js'
import Survey from './model/Survey.js'


function App() {
  //const [loggedIn, setLoggedIn] = useState(false);
  const [surveysToComplete, setSurveysToComplete] = useState([]);
  const [submittedSurveys, setSubmittedSurveys] = useState([]);
  const [Responses, setResponses] = useState([]);
  const [Questions, setQuestions] = useState([]);
  const [admin, setAdmin] = useState(undefined);
  const [loginmessage, setLoginMessage] = useState();
  const [readsurveyid, setReadsurveyid]= useState(undefined);
  const [fillinsurveyid, setFillinsurveyid]= useState(undefined);
  const [title, setTitle] = useState();
  const [updateSurveys, setUpdateSurveys] = useState(undefined);

 
  useEffect(() => {
    const checkAuth = async () => {
      try{
        let res = await API.getAdminInfo();
        //setLoggedIn(true);

        await setAdmin(res.admin);
    }catch {
        await setAdmin(undefined);
    }};
    checkAuth();
  }, []);

  useEffect(()=> {
    const getSurveys = async () => {
       //if(loggedIn) setSubmittedSurveys(await API.loadSubmittedSurveys(submittedSurveys, admin));
    //const tmp = await API.loadSubmittedSurveys(admin);
    if(admin) setSubmittedSurveys(await API.loadSubmittedSurveys());

    setSurveysToComplete(await API.loadSurveysToComplete());
    };
    getSurveys()
    .catch(err => {
      setLoginMessage({msg: "Impossible to load ! Please, try again later...", type: 'danger'});
      console.error(err);
    });
  }, [updateSurveys, admin])

  useEffect(() => {
    setTimeout(() => {  
      // After 2 seconds make login messsage disappear
      setLoginMessage(null)
    }, 2000)
  }, [loginmessage]);

  const doLogin = async (credentials) => {
  try {
      await setAdmin( await API.login(credentials));
      await setLoginMessage({ msg: `Welcome, ${admin}!`, type: 'success' });
  } catch (err) {
      setLoginMessage({ msg: err, type: 'danger' });
  }
  }

  const doLogout = async () =>{
  let logout = await API.logout();
  if (logout){
  //setLoggedIn(false);
  setAdmin(undefined);
  }
  }

  useEffect(()=>{
    if(readsurveyid){
    const getSurveyRes = async ()=>{
    await setTitle(getSurveyTitle(readsurveyid));
    await setResponses(await API.getSurveyResults(readsurveyid));
    //await setQuestions(await API.getSurveyQuestions(readsurveyid));
    
  }
  getSurveyRes();
}
  }, [readsurveyid]);
  
  useEffect(()=>{
    if(fillinsurveyid){
    const findSurveyStruct = async ()=>{
    
    await setTitle(getSurveyTitle(fillinsurveyid));
    await setQuestions(await API.getSurveyQuestions(fillinsurveyid));
    }
   findSurveyStruct();
  }
  }, [fillinsurveyid]);

  const addSurvey = (newSurvey) => {
    if(newSurvey){
      API.addSurvey(newSurvey)
      .then(()=>{surveysUpdated()})
      .catch(err =>console.log(err));
    }
  }

  const fillInSurvey = (surveyresponse) => {
    if(surveyresponse){
      API.sendSurvey(surveyresponse)
      .then(()=>{surveysUpdated()})
      .catch(err => console.log(err));
    }
  }

  const FillSurvey = async (survey) =>{
    await setQuestions([]);
     await setFillinsurveyid(survey);
    
    //await setUpdatef(s=>!s);
  }

  const CheckSurvey = async (survey) =>{
    await setQuestions([]);
    //await setResponses([]);
    await setReadsurveyid(survey);
    await setFillinsurveyid(survey);
    //await setUpdater(s=>!s);
  }

  const getSurveyTitle= (currentsurveyid) => {
    return surveysToComplete.filter((s)=> s.surveyid === currentsurveyid ).stitle;
  }

  const surveysUpdated = ()=> {setUpdateSurveys(t=>!t)};

    // loggedIn={loggedIn} LINE 98
  return (
    <Router>
      <Container fluid className="m-0 p-0">
      <Row className="m-0 p-0">
                    <Col className="m-0 p-0">
                        <NavBar logout={doLogout} logged = {admin} login={doLogin}/>
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
              render={()=>
                //{loggedIn ? <Redirect to="/admin"/> : null}
                <>
                {admin ? <Redirect to="/admin"/> : 
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
              render={()=>
                //!loggedIn ? <Redirect to="/admin/login" /> :
                !admin ? <Redirect to="/admin/login" /> :
                <>
                  <Col>
                  <AdminSurveysList surveys={submittedSurveys} setad={CheckSurvey} />
                  </Col>
                  <Link to ='/admin/createsurvey'><PlusCircleFill color="blue" size={40} /> </Link>
                </>
              }
            />

            <Route exact path="/admin/:survey"
              render={()=>
                //!loggedIn ? <Redirect to="/admin/login" /> :
                !admin ? <Redirect to="/admin/login" /> :
                <>
                  <Col>
                  { !(Questions.length===0) ? <AdminSurvey responses={Responses} surveytitle={title} questions={Questions} />: null}
                  </Col>
                </>
              }
            />    

            <Route exact path="/admin/createsurvey"
              render={()=>
                //!loggedIn ? <Redirect to="/admin/login" /> :
                !admin ? <Redirect to="/admin/login" /> :
                <>
                  <Col>
                    <CreateSurvey addSurvey={addSurvey} admin={admin} />
                  </Col>
                </>
              }
            />   


            <Route exact path="/AllSurveys"
              render={()=>
                <>
                  <Col>
                    <UserSurveyList surveys={surveysToComplete} setus={FillSurvey}/>
                  </Col>
                </>
              }
            />

            <Route exact path="/AllSurveys/:survey"
              render={()=>
                <>
                  <Col>
                    <UserFillInSurvey surveyid={fillinsurveyid} surveytitle={title} questions={Questions} fillIn={fillInSurvey}/>
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
