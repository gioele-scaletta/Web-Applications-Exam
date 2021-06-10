import './App.css';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import LoginForm from './Components/login.js'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router';
import { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import NavBar from './Components/navbar.js'
import AdminSurveysList from './Components/AdminSurveysList.js'
import AdminSurvey from './Components/AdminSurvey.js'
import UserFillInSurvey from './Components/UserFillInSurvey.js'
import UserSurveysList from './Components/UserSurveysList.js'
import CreateSurvey from './Components/UserFillInSurvey.js'
import API from './API.js'


function App() {
  //const [loggedIn, setLoggedIn] = useState(false);
  const [surveysToComplete, setSurveysToComplete] = useState(undefined);
  const [submittedSurveys, setSubmittedSurveys] = useState(undefined);
  const [updateSurveys, setUpdateSurveys] = useState(undefined);
  const [admin, setAdmin] = useState(undefined);
  const [loginmessage, setLoginMessage] = useState();
  const [currentsurvey, setCurrentsurvey] = useState();
 
  useEffect(() => {
    const checkAuth = async () => {
        let res = await API.getAdminInfo();
        //setLoggedIn(true);
        await setAdmin(res.admin);
    };
    checkAuth();
  }, []);

  useEffect(()=> {
    const getSurveys = async () => {
       //if(loggedIn) setSubmittedSurveys(await API.loadSubmittedSurveys(submittedSurveys, admin));
    //const tmp = await API.loadSubmittedSurveys(admin);
    if(admin) setSubmittedSurveys(await API.loadSubmittedSurveys(admin));
    //const s=await API.loadSurveysToComplete();
    setSurveysToComplete(await API.loadSurveysToComplete());
    };
    getSurveys()
    .catch(err => {
      setLoginMessage({msg: "Impossible to load ! Please, try again later...", type: 'danger'});
      console.error(err);
    });
  }, [updateSurveys])

  useEffect(() => {
    setTimeout(() => {  
      // After 2 seconds make login messsage disappear
      setLoginMessage(null)
    }, 2000)
  }, [loginmessage]);

  useEffect(()=>{
    surveysUpdated();
  }, [])


  const doLogin = async (credentials) => {
  try {
      const admin = await API.login(credentials);
      //await setLoggedIn(true);
      await setAdmin(admin);
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

  const getSurveyResults = async (surveyid) => {
    const getSurveyRes = async ()=>{
      let surveyResults= await API.getSurveyResults(surveyid);
      return Array.of(surveyResults);
    }
  }

  const findSurveyStructure = (surveyid) => {
    const findSurveyStruct = async ()=>{
      let surveyQuestions= await API.getSurveyQuestions(surveyid);
      return Array.of(surveyQuestions);
    }

  } 

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

  const newCurrentSurvey = (survey) =>{
    setCurrentsurvey(survey);
  }

  const getSurveyTitle= (currentsurveyid) => {
    return surveysToComplete.filter((s)=>{return (s.surveyid === currentsurveyid);}).stitle;
  }

  const surveysUpdated = ()=> {setUpdateSurveys(t=>!t)};

    // loggedIn={loggedIn} LINE 98
  return (
    <Router>
      <Container fluid>
        <NavBar logout={doLogout} logged={admin} /> 

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
                {admin ? <Redirect to="/admin"/> : null}
                  <Col sm={{ span: 4, offset: 4 }}>
                    <br />
                    <br />
                    <LoginForm doLogin={doLogin} />
                  </Col>
                </>
              }
            />

            <Route exact path="/admin"
              render={()=>
                //!loggedIn ? <Redirect to="/admin/login" /> :
                !admin ? <Redirect to="/admin/login" /> :
                <>
                  <Col>
                  <AdminSurveysList surveys={submittedSurveys} set={newCurrentSurvey} />
                  </Col>
                </>
              }
            />

            <Route exact path="/admin/:currentsurveyid"
              render={()=>
                //!loggedIn ? <Redirect to="/admin/login" /> :
                !admin ? <Redirect to="/admin/login" /> :
                <>
                  <Col>
                    <AdminSurvey responses={getSurveyResults(currentsurvey)} surveytitle={getSurveyTitle(currentsurvey)} questions={findSurveyStructure(currentsurvey.survey_id)} />
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
                    <UserSurveysList surveys={surveysToComplete} set={newCurrentSurvey}/>
                  </Col>
                </>
              }
            />

            <Route exact path="/AllSurveys/:currentsurveyid"
              render={()=>
                <>
                  <Col>
                    <UserFillInSurvey surveyTitle={getSurveyTitle(currentsurvey)} questions={findSurveyStructure(currentsurvey)} fillIn={fillInSurvey}/>
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
