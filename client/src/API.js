const BASEURL = '/api';

async function loadSurveysToComplete(){

    const response = await fetch(BASEURL + '/surveysToComplete');

    const Json = await response.json();
    if (response.ok) {

      return Json.map((s) => Object.assign({}, s))//Survey.from(s));
    } else {
      throw Json;  // an object with the error coming from the server
    }
}

//HERE I ALSO NEED N OF USERS WHO SUBMITTED A SURVEY
async function loadSubmittedSurveys(admin){

    const response = await fetch(BASEURL + '/submittedSurveys' );
    const Json = await response.json();
    if (response.ok) {
      return Json.map((s) => Object.assign({}, s));
    } else {
      throw Json;  // an object with the error coming from the server
    }
}

async function getSurveyResults(survey/*, admin*/){

  const response = await fetch(BASEURL + '/surveyResults/'+survey);

    const Json = await response.json();
    if (response.ok) {
      return Json.map((s) => Object.assign({}, s));
    } else {
      throw Json;  // an object with the error coming from the server
    }

}

async function getSurveyQuestions(survey){

  const response = await fetch(BASEURL + '/surveyQuestions/'+ survey);
  
  const Json = await response.json();
  if (response.ok) {
    return Json.map((s) => Object.assign({}, s));
  } else {
    throw Json;  // an object with the error coming from the server
  }
}



async function addSurvey(newSurvey){
  return new Promise((resolve, reject) => {
    fetch('/api/addSurvey', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSurvey)
    }).then ((response)=>{
      if(response.ok) {
        resolve(null);
      }
      else {
        // analyze and return the error
        // TODO: complete the error handling
        response.json()
          .then((obj)=> { reject(obj); })
          //...
      }
    }).catch(err => { reject({'error': 'Cannot communicate with the server'})});
  });
}

function sendSurvey(surveyresponse){
  return new Promise((resolve, reject) => {
    fetch('/api/sendSurvey', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyresponse)
    }).then ((response)=>{
      if(response.ok) {
        resolve(null);
      }
      else {
        // analyze and return the error
        // TODO: complete the error handling
        response.json()
          .then((obj)=> { reject(obj); })
          //...
      }
    }).catch(err => { reject({'error': 'Cannot communicate with the server'})});
  });
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
      return user.username+'|'+user.id;
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
  
  
  const API = {login, getAdminInfo,logout, sendSurvey, addSurvey, getSurveyResults, loadSubmittedSurveys,getSurveyQuestions, loadSurveysToComplete}
  export default API 