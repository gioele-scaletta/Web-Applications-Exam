import OpenAnswerForm from './OpenAnswerForm.js'
import CloseAnswerForm from './CloseAnswerForm.js'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Row'
import { Redirect } from 'react-router';

import { Link, useParams} from 'react-router-dom';
import {useState} from 'react'

function  UserFillInSurvey(props){
    

    let [answers, setAnswers] = useState([]);
    let [submitted, setSubmitted] = useState(false);

    const addResponse = (a, id) =>{

        let q={qnum: id, response: a};
        setAnswers((exs) =>{return exs.filter((ex) => (ex.qnum !== q.qnum));});
        setAnswers(oldAnswers => [...oldAnswers, q]);

    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let answersToBeSent = [];
        await answers.map((a)=>
        answersToBeSent.push({ surveyid: props.surveyid, qnum: a.qnum, response: a.response }));
        console.log(answersToBeSent);
        await props.fillIn(answersToBeSent);
        setSubmitted(true);
        //MANCA VALIDATION
    };


    return (<>
        {submitted ? <Redirect to="/AllSurveys" /> : <>
        <Row>
            <h1>
            {props.surveytitle}
            </h1>
        </Row>
        {props.questions.sort((a,b) => (a.qnum<b.qnum) ? a : b).map( (q) => q.open ?
            <OpenAnswerForm key={q.qnum} id={q.qnum} question={q.qtext} response={undefined} add={addResponse}
            />
            :
            <CloseAnswerForm key={q.qnum} id={q.qnum} question={q.qtext} optional={q.optional} single={q.single} response={undefined} add={addResponse}
            />
        )}
        
    
        <Button onClick={handleSubmit} >Submit</Button> 
        <Link to="/AllSurveys"><Button variant='secondary'>Cancel</Button> </Link>

        </>
        }
           
    </>);
}

export default UserFillInSurvey;

