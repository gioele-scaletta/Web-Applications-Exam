import OpenAnswerForm from './OpenAnswerForm.js'
import CloseAnswerForm from './CloseAnswerForm.js'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Link from 'react'
import {useState} from 'react'

const UserFillInSurvey= function (props){

    let [answers, setAnswers] = useState(undefined);

    const addResponse = (a, id) =>{

        let q={qnum: id, response: a};
        setAnswers((exs) => exs.filter(ex => ex.num !== q.qnum))
        setAnswers(oldAnswers => [...oldAnswers, q]);

    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let answersToBeSent = [];
        answers.forEach(a=>{
            answersToBeSent.push({ surveyid: props.surveyid, qnum: a.id, response: a.response });
        }).then(props.fillIn(answersToBeSent));
        //MANCA VALIDATION
    };


    return (<>
        <Row>
            <h1>
            {props.surveyTitle}
            </h1>
        </Row>
        {Array.of(props.questions).sort((a,b)=>{if(a.num<b.num)return a;}).forEach((q) =>{
            if(q.open)
            return <OpenAnswerForm key={q.id} question={q.text} response={undefined} add={addResponse}
            />;
            else
            return <CloseAnswerForm key={q.id} question={q.text} optional={q.optional} single={q.single} response={undefined} add={addResponse}
            />;
        }
        )}
        <Row>
        <Link to="/AllSurveys"><Button onClick={handleSubmit}>Submit</Button></Link> <Link to="/AllSurveys"><Button variant='secondary'>Cancel</Button></Link>
        </Row>
    </>);
}

export default UserFillInSurvey;

