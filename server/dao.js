'use strict';
/* Data Access Object (DAO) module for accessing data */

const db = require('./db');


exports.loadAllSurveys = () => {
    return new Promise((resolve, reject) =>{
        const sql = 'SELECT survey_id, survey_title FROM SURVEYS';
        db.all(sql, (err, rows)=>{
            if(err){
                reject(err);
                return;
            }
            const surveysToComplete = rows.map((r) => ({survey_id: r.survey_id, survey_title: r.survey_title}));
        resolve(surveysToComplete);
        });
    });
};

//anche n users!
exports.loadAdminSurveys = (id) => {
    return new Promise((resolve, reject) =>{
        const sql = 'SELECT survey_id, survey_title, COUNT (DISTINCT response_num) AS nusers FROM SURVEYS AS S, RESPONSES AS R WHERE S.survey_id=R.survey_id AND admin_id=? GROUP BY survey_id, survey_title';
        db.all(sql, [id], (err, rows)=>{
            if(err){
                reject(err);
                return;
            }
            const submittedSurveys = rows.map((r) => ({survey_id: r.survey_id, survey_title: r.survey_title, nusers: r.nusers}));
        resolve(submittedSurveys);
        });
    });
};  

exports.loadSurveyResponses = (rsid) => {
    return new Promise((resolve, reject) =>{
        const sql = 'SELECT * FROM RESPONSES WHERE survey_id=?';
        db.all(sql, [rsid], (err, rows)=>{
            if(err){
                reject(err);
                return;
            }
            const surveyResults = rows.map((r) => ({survey_id: r.survey_id, qnum: r.question_num, rtext: r.response_text,  rnum: r.response_num}));
        resolve(surveyResults);
        });
    }); 
};


exports.loadSurveyQuestions = (sid) =>{
    return new Promise((resolve, reject) =>{
        const sql = 'SELECT * FROM QUESTIONS WHERE survey_id=?';
        db.all(sql, [sid], (err, rows)=>{
            if(err){
                reject(err);
                return;
            }
            const surveyResults = rows.map((r) => ({survey_id: r.survey_id, qnum: r.question_num,  qtext: r.question_text, open: r.open, optional: r.optional, single: r.choices}));
        resolve(surveyResults);
        });
    }); 
};


exports.newSurvey = (ad, title)=>{
    return new Promise((resolve, reject) =>{
        const sql = 'INSERT INTO SURVEYS(survey_title, admin_id) VALUES(?,?)';
        db.all(sql, [title, ad], (err, rows)=>{
            if(err){
                reject(err);
                return;
            }
        resolve(this.lastID);
        });
    }); 
};


exports.addQuestion = (s_id, qnum, qtext, open, optional, single)=>{
    return new Promise((resolve, reject) =>{
        const sql = 'INSERT INTO QUESTIONS(survey_id, question_number, question_text, open, optional, choices) VALUES(?,?,?,?,?)';
        db.all(sql, [s_id, qnum, qtext, open, optional, single], (err, rows)=>{
            if(err){
                reject(err);
                return;
            }
        resolve(this.lastID);
        });
    }); 
};


//need to take care of res number creation
exports.addResponse = (n, surveyid, qnum, response) =>{
    return new Promise((resolve, reject) =>{
        const sql = 'INSERT INTO RESPONSES(survey_id, question_num, response_text, response_num) VALUES(?,?,?,?)';
        db.all(sql, [surveyid, qnum, response, n], (err, rows)=>{
            if(err){
                reject(err);
                return;
            }
        resolve(this.lastID);
        });
    }); 
};