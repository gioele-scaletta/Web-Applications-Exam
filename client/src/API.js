import dayjs from 'dayjs';
const BASEURL = '/api';

async function loadSurveysToComplete(surveysToComplete){

    const response = await fetch(BASEURL + '/surveysToComplete', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveysToComplete)
    });
    const Json = await response.json();
    if (response.ok) {
      return Json.map((s) => Object.assign({}, s));
    } else {
      throw Json;  // an object with the error coming from the server
    }
}

async function loadSubmittedSurveys(submittedSurveys, admin){

    const response = await fetch(BASEURL + '/submittedSurveys', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(submittedSurveys)
    });
    const Json = await response.json();
    if (response.ok) {
      return Json.map((s) => Object.assign({}, s));
    } else {
      throw Json;  // an object with the error coming from the server
    }
}

async function getSurveyResults(survey){

    const response = await fetch(BASEURL + '/surveyResults', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(survey)
    });
    const Json = await response.json();
    if (response.ok) {
      return Json.map((s) => Object.assign({}, s));
    } else {
      throw Json;  // an object with the error coming from the server
    }

}


async function addSurvey(newSurvey){
    fetch('/api/addSurvey', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSurvey)
    })
}

async function sendSurvey(surveyresponse){
    fetch('/api/sendSurvey', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyresponse)
    })

}


async function login(credentials) {
    let response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user.name;
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
  }
  
  async function logout(){
      let response = await fetch('/api/sessions/current',{
          method: 'delete',
      });
      if(response.ok)
          return (true);
      else
          return false;
  }
  
  async function getAdminInfo() {
    const response = await fetch(BASEURL + '/sessions/current_session');
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;  // an object with the error coming from the server
    }
  }
  
  
  const API = {login, getAdminInfo,logout}
  export default API 