import OpenAnswerForm from './OpenAnswerForm.js'
import CloseAnswerForm from './CloseAnswerForm.js'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Alert from 'react-bootstrap/Alert'
import { Redirect } from 'react-router';


import { Link, useParams} from 'react-router-dom';
import {useState} from 'react'

function  UserFillInSurvey(props){
    

    let [answers, setAnswers] = useState([]);
    let [submitted, setSubmitted] = useState(false);
    let [error, setError] = useState(props.questions.filter((q)=> q.optional!==0).map(q=>q.qnum));
    let [tried, setTried] = useState(false)

    const addResponse = (a, id) =>{
        

        //VALIDATION
        let q = props.questions.filter((t) => t.qnum === id)[0];


        if (q.open === 1) {
            if (!q.optional) {
            if(a){
                if (a.length === 0 || a.length >200) {
                    setError((exs) =>{return exs.filter((ex) => (ex !== id));});
                    setError(old => [...old, id]);
                } else{
                    setError((exs) =>{return exs.filter((ex) => (ex !== id));});
                }
            }
            } else{
                if(a.length<200)
                setError((exs) =>{return exs.filter((ex) => (ex !== id));});
                else {
                setError((exs) =>{return exs.filter((ex) => (ex !== id));});
                setError(old => [...old, id]);
                }
                
            }
        }
        else {
            let selected = a.split("|").reduce((a, b) => parseInt(a) + parseInt(b));

            if (selected < q.optional || selected > q.single) {
                setError((exs) =>{return exs.filter((ex) => (ex !== id));});
                setError(old => [...old, id]);
            } else{
                setError((exs) =>{return exs.filter((ex) => (ex !== id));});
            }
        }

        let qu={qnum: id, response: a};

        setAnswers((exs) =>{return exs.filter((ex) => (ex.qnum !== qu.qnum));});
        setAnswers(oldAnswers => [...oldAnswers, qu]);

}

    const handleSubmit = async (event) => {
        //event.preventDefault();
        let answersToBeSent = [];
      
        setTried(true);

        if(error.length===0){
            await answers.map((a)=>
            answersToBeSent.push({ surveyid: props.surveyid, qnum: a.qnum, response: a.response }));
            await props.fillIn(answersToBeSent);
            setSubmitted(true);
        } 
    }



    return (<>
        {submitted ? <Redirect to="/AllSurveys" /> : <>
        <Row>
            <h1>
            {props.surveytitle}
            </h1>
        </Row>
      
        {props.questions.sort((a,b) => (a.qnum<b.qnum) ? a : b).map( (q) => q.open ?
            <OpenAnswerForm key={q.qnum} id={q.qnum} question={q.qtext} response={undefined} add={addResponse} error={error}  optional={q.optional} tried={tried}
            />
            :
            <CloseAnswerForm key={q.qnum} id={q.qnum} question={q.qtext} optional={q.optional} single={q.single} response={undefined} add={addResponse} error={error} tried={tried}
            />
        )}
        
    
        <Button onClick={handleSubmit} >Submit</Button> 
        <Link to="/AllSurveys"><Button variant='secondary'>Cancel</Button> </Link>

        

        </>
        }
           
    </>);
}

export default UserFillInSurvey;

