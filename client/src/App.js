import './App.css';
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import LoginForm from './Components/login.js'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import NavBar from './Components/navbar.js'
import AdminSurveysList from './Components/AdminSurveysList.js'
import AdminSurvey from './Components/AdminSurvey.js'
import UserFillInSurvey from './Components/UserFillInSurvey.js'
import { UserSurveyList } from './Components/UserSurveysList.js'
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
  const [questionssurveyid, setQuestionssurveyid] = useState((!window.location.pathname.includes('/allsurveys/fillinsurvey/') && !window.location.pathname.includes('/admin/surveyresults/')) ? undefined : parseInt(window.location.pathname.split('/')[3]));
  // when page reloaded triggers retrieval of questions for a specific survey
  // In this way a survey could be shared by users even only using the URL

  //RESPONSES: responses for a specific survey (loaded when an admin wants to check reposnses for one of his survey)
  const [Responses, setResponses] = useState([]);
  const [answerssurveyid, setAnswerssurveyid] = useState(!window.location.pathname.includes('/admin/surveyresults/') ? undefined : parseInt(window.location.pathname.split('/')[3]));
  // when page reloaded triggers retrieval of answers for a specific survey
  // In this way an admin can recharge the page while still keeping survey info

  //states for storing admin info
  const [admin, setAdmin] = useState();
  const [id, setId] = useState();

  //state used for filtering surveys using navbar filter
  const [navfilter, setNavfilter] = useState()

  //message temporarely displayed after login
  const [loginmessage, setLoginMessage] = useState();

  const [color, setColor] = useState("#B98077");
  const [loaded, setLoaded] = useState(false);


  //checking authorization
  useEffect(() => {
    const checkAuth = async () => {
      try {
        let res = await API.getAdminInfo();
        setAdmin(res.username);
        setId(res.id);
        setLoaded(true);
      } catch {
        setAdmin(undefined);
        setLoaded(true);
      }
    };

    checkAuth();
  }, []);


  //SURVEYSTO COMPLETE: all surveys accessible by everyone (that can be filled in)
  useEffect(() => {
    const getSurveys = async () => {
      setSurveysToComplete(await API.loadSurveysToComplete());
    };

    getSurveys().catch(err => {
      setLoginMessage({ msg: "Impossible to load data ! Please, try again later...", type: 'danger' });
      console.error(err);
    });
  }, [updateSurveysToComplete])


  //SUBMITTED SURVEYS: surveys submission info for the survey created by a specific admin
  useEffect(() => {
    const getSurveys = async () => {
      if (admin)
        setSubmittedSurveys(await API.loadSubmittedSurveys());
    };

    getSurveys().catch(err => {
      setLoginMessage({ msg: "Impossible to load data ! Please, try again later...", type: 'danger' });
      console.error(err);
    });
  }, [updateSubmittedSurveys, admin])


  //RESPONSES: responses for a specific survey (loaded when an admin wants to check reposnses for one of his survey)
  useEffect(() => {
    if (answerssurveyid) {
      const getSurveyRes = async () => {
        setResponses(await API.getSurveyResults(answerssurveyid));
      }

      getSurveyRes().catch(err => {
        setLoginMessage({ msg: "Impossible to load data ! Please, try again later...", type: 'danger' });
        console.error(err);
      });
    }
  }, [answerssurveyid]);


  //QUESTIONS: loaded both when user wants to fill in a survey and when admin wants to see responses
  useEffect(() => {
    if (questionssurveyid) {
      const findSurveyStruct = async () => {
        setQuestions(await API.getSurveyQuestions(questionssurveyid));
      }

      findSurveyStruct().catch(err => {
        setLoginMessage({ msg: "Impossible to load data ! Please, try again later...", type: 'danger' });
        console.error(err);
      });
    }
  }, [questionssurveyid]);


  //message temporarely displayed after login
  useEffect(() => {
    setTimeout(() => {
      // After 2 seconds make it disappear
      setLoginMessage(undefined);
    }, 2000)
  }, [loginmessage]);

  //need this useEffect to reset navbar state when we change page (otherwise we filter components in next page)
  //for example could be a proble when goign from UserSurveyList to UserFillInSurvey
  useEffect(()=>{
    setNavfilter('');
  }, [questionssurveyid, updateSubmittedSurveys, updateSurveysToComplete])


  //Login and Logout methods
  const doLogin = async (credentials) => {

    try {
      let user = await API.login(credentials);
      setAdmin(user.split('|')[0]);
      setId(user.split('|')[1]);
      setLoginMessage({ msg: `Welcome, ${user.split('|')[0]}!`, type: 'success' });
    } catch (err) {
      setLoginMessage({ msg: err, type: 'danger' });
    }

  }

  const doLogout = async () => {
    let logout = await API.logout();
    if (logout) {
      setAdmin(undefined);
      setId(undefined);
      setResponses([]);
      setSubmittedSurveys([]);
    }
  }

  //Method used to trigger POST of new survey added by admiin
  const addSurvey = async (newSurvey) => {
    if (newSurvey) {
      try {
        await API.addSurvey(newSurvey)
          .then(() => {
            updatesurveystocomplete();
            updatesubmittedsurveys();
          })
          .catch(err => console.log(err))
        setLoginMessage({ msg: `The new Survey has been successfully uploaded, thank you!`, type: 'success' });
      } catch (err) {
        console.log(err);
        setLoginMessage({ msg: `Something went wrong with your submission, the Survey has not been recorded, sorry for the inconvenient`, type: 'danger' });
      }
    }
  }

  //Methods used to trigger POST of new survey response inserted by user
  const fillInSurvey = async (surveyresponse) => {
    if (surveyresponse) {
      await API.sendSurvey(surveyresponse)
        .then(() => {
          updatesubmittedsurveys();
          setLoginMessage({ msg: `The response has been successfully submitted, thank you!`, type: 'success' });
        })
        .catch((err) => {
          console.log(err);
          setLoginMessage({ msg: `Something went wrong with your submission, the response has not been uploaded, sorry for the inconvenient`, type: 'danger' });
        })

    }
  }

  //Method used for triggering load of questions for a specific survey when a user wants to fill it in
  const FillSurvey = async (survey) => {
    await setQuestions([]);
    await setQuestionssurveyid('');
    await setQuestionssurveyid(survey);
  }

  //Method used for triggering load of questions and answers for a specific survey when an admin wants to check responses
  const CheckSurvey = async (survey) => {
    await setQuestions([]);
    await setResponses([]);
    await setQuestionssurveyid('');
    await setAnswerssurveyid('');
    await setQuestionssurveyid(survey);
    await setAnswerssurveyid(survey);
  }

  //change state to triogger useEffects
  const updatesurveystocomplete = () => { setUpdateSurveysToComplete(t => !t) };
  const updatesubmittedsurveys = () => { setUpdateSubmittedSurveys(t => !t) };
  const filterCards = (text) => { setNavfilter(text) };
  const backgroundColor = (col) => { setColor(col) };

  //RENDERING
  return (
    <Router>
      <Container fluid >

        <Row className="ml-5 p-0">
          <Col className="m-0 p-0">
            <NavBar filter={filterCards} logout={doLogout} filterV={navfilter} logged={admin} login={doLogin} />
          </Col>
        </Row>

        <Row>
          {loginmessage ?
            <Row>
              <Col sm={{ span: 4, offset: 4 }} >
                <Alert variant={loginmessage.type} >{loginmessage.msg}</Alert>
              </Col>
            </Row> : null}
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
                !admin ? <Redirect to="/admin/login" /> :
                  <>
                    <Row align='center' className="p-5 w-100">
                      <Row className="w-100"  >
                        <Link to='/admin/createsurvey'><Button className="w-75" variant="dark"> Create new Survey</Button> </Link>
                      </Row>
                    </Row>
                    <br></br>
                    <br></br>

                    <AdminSurveysList backgroundColor={backgroundColor} filter={navfilter} surveys={submittedSurveys} setad={CheckSurvey} />

                  </>
              }
            />

            <Route exact path="/admin/surveyresults/:survey/:title"
              render={({ match }) =>
                (!admin && loaded) ? <Redirect to="/admin/login" /> :

                  <Container fluid style={{ backgroundColor: color, height: '100%', minHeight: '100ch', opacity: '0.95' }}>
                    <Col sm={{ span: 8, offset: 2 }}>
                      {Questions.length !== 0 && Responses.length !== 0 ? <AdminSurvey responses={Responses} surveytitle={match.params.title} surveyid={match.params.survey} questions={Questions} reload={CheckSurvey} filter={navfilter} /> : null}
                    </Col>
                  </Container>

              }
            />

            <Route exact path="/admin/createsurvey"
              render={() =>
                (!admin && loaded) ? <Redirect to="/admin/login" /> :

                  <Container fluid style={{ backgroundColor: '#B98077', height: '100%', minHeight: '100ch', opacity: '0.95' }}>
                    <Col sm={{ span: 8, offset: 2 }} >
                      <CreateSurvey addSurvey={addSurvey} admin={id} />
                    </Col>
                  </Container>

              }
            />

            <Route exact path="/allsurveys"
              render={() =>
                <>
                  <UserSurveyList backgroundColor={backgroundColor} filter={navfilter} surveys={surveysToComplete} setus={FillSurvey} />
                </>
              }
            />

            <Route exact path="/allsurveys/fillinsurvey/:surveyid/:surveytitle"
              render={({ match }) =>
                <>
                  <Container fluid style={{ backgroundColor: color, height: '100%', minHeight: '100ch', opacity: '0.95' }} >
                    <Col sm={{ span: 8, offset: 2 }}  >
                      <UserFillInSurvey color={color} surveyid={match.params.surveyid} surveytitle={match.params.surveytitle} questions={Questions} fillIn={fillInSurvey} reload={FillSurvey} filter={navfilter} />
                    </Col>
                  </Container>
                </>
              }
            />

            <Route exact path="/"
              render={() =>
                <>
                  <Redirect to="/allsurveys" />
                </>}
            />

          </Switch>
        </Row>

      </Container>
    </Router>

  );
}

export default App;
