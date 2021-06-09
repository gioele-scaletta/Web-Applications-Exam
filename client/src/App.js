import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
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
import AdminModifySurvey from './Components/AdminModifySurvey.js'
import CreateSurvey from './Components/CreateSurvey.js'
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
 
  useEffect(() => {
    const checkAuth = async () => {
        let res = await API.getAdminInfo();
        //setLoggedIn(true);
        await setAdmin(res.name);
    };
    checkAuth();
  }, []);

  useEffect(()=> {
    //if(loggedIn) setSubmittedSurveys(await API.loadSubmittedSurveys(submittedSurveys, admin));
    if(admin) setSubmittedSurveys(await API.loadSubmittedSurveys(submittedSurveys, admin));
    
    setSurveysToComplete(await API.loadSurveysToComplete(surveysToComplete));
  }, [updateSurveys])

  useEffect(() => {
    setTimeout(() => {  
      // After 2 seconds make login messsage disappear
      setLoginMessage(null)
    }, 2000)
  }, [loginmessage]);



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

  const getSurveyResults = async (survey) => {
    let surveyResults= await API.getSurveyResults(survey);
    return surveyResults;
  }

  const findSurveyToComplete = (surveyid) => {
    return surveysToComplete.find(s => s.id === surveyid);
  } 

  const addSurvey = (newSurvey) => {
    if(newSurvey){
      API.addSurvey(newSurvey)
      .then(()=>{surveysUpdated;})
      .catch(err =>console.log(err));
    }
  }

  const fillInSurvey = (surveyresponse) => {
    if(surveyresponse){
      API.sendSurvey(surveyresponse)
      .then(()=>{surveysUpdated;})
      .catch(err => console.log(err));
    }
  }

  const surveysUpdated = ()=>setUpdateSurveys(t=>!t);

    // loggedIn={loggedIn} LINE 98
  return (
    <Router>
      <Container fluid>
        <NavBar logout={doLogout} logged={admin} /> 
        <Row>
        {message && <Row>
                      <Col sm={{ span: 4, offset: 4 }} >
                          <Alert variant={message.type} onClose={() => setLoginMessage(null)} dismissible>{message.msg}</Alert>
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
                  <AdminSurveysList surveys={submittedSurveys}/>
                  </Col>
                </>
              }
            />

            <Route exact path="/admin/:currentsurvey"
              render={()=>
                //!loggedIn ? <Redirect to="/admin/login" /> :
                !admin ? <Redirect to="/admin/login" /> :
                <>
                  <Col>
                    <AdminModifySurvey results={getSurveyResults(currentsurvey)} surveyStructure={findSurveyToComplete(currentsurvey)} />
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
                    <CreateSurvey addSurvey={addSurvey} />
                  </Col>
                </>
              }
            />   


            <Route exact path="/AllSurveys"
              render={()=>
                <>
                  <Col>
                    <UserSurveysList surveys={surveysToComplete}/>
                  </Col>
                </>
              }
            />

            <Route exact path="/AllSurveys/:currentsurvey"
              render={()=>
                <>
                  <Col>
                    <UserFillInSurvey survey={findSurveyToComplete(currentsurvey)} fillIn={fillInSurvey}/>
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
