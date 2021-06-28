import OpenAnswerForm from './OpenAnswerForm.js'
import CloseAnswerForm from './CloseAnswerForm.js'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { useState } from 'react'
import { Asterisk } from 'react-bootstrap-icons'
import Alert from 'react-bootstrap/Alert'
import { useEffect } from 'react'

function UserFillInSurvey(props) {

    const [answers, setAnswers] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState([...props.questions.filter((q) => q.optional !== 0).map(q => q.qnum), 0]);
    const [tried, setTried] = useState(false)
    const [firstRender, setFirstRender] = useState(true);

    //UseEffect added in the end to reload the questions if the survey link is changed not using some app commands but by the link/broswer back forward button
    useEffect(() => {
        const newSurvey = async function () {
            props.reload(props.surveyid);
        }

        if (firstRender) {
            setFirstRender(false);
        } else {

            newSurvey();
        }
    }, [props.surveyid]);


    const addResponse = async (a, id) => {
        let q;
        //VALIDATION!!

        //Retrieve question relative to reponse we are adding
        if (id === 0)
            q = { qnum: 0, qtext: "Please insert your name below", open: 1, optional: 1, single: '' };
        else
            q = props.questions.filter((t) => t.qnum === id)[0];


        if (q.open === 1) {//OPEN ANSWER QUESTION
            if (!(q.optional === 0)) {
                //NOT OPTIONAL
                if (a.length === 0 || a.isEmpty() || a.length > 200) {
                    await setError((exs) => { return exs.filter((ex) => (ex !== id)); });
                    setError(old => [...old, id]);
                } else {
                    setError((exs) => { return exs.filter((ex) => (ex !== id)); });

                }
            } else { //OPTIONAL
                if (a.length < 200)
                    setError((exs) => { return exs.filter((ex) => (ex !== id)); });
                else {
                    await setError((exs) => { return exs.filter((ex) => (ex !== id)); });
                    setError(old => [...old, id]);
                }
            }
        }
        else {//CLOSED ASNWER QUESTION
            let selected = a.split("|").reduce((a, b) => parseInt(a) + parseInt(b));//sum of all checkbox (1 if checked 0 if not) has to be betwen specifie min and max

            if (selected < q.optional || selected > q.single) {
                await setError((exs) => { return exs.filter((ex) => (ex !== id)); });
                setError(old => [...old, id]);
            } else {
                setError((exs) => { return exs.filter((ex) => (ex !== id)); });
            }
        }

        //ADDING THE RESPONSE
        let qu = { qnum: id, response: a };

        await setAnswers((exs) => { return exs.filter((ex) => (ex.qnum !== qu.qnum)); });
        setAnswers(oldAnswers => [...oldAnswers, qu]);

    }

    const handleSubmit = async (event) => {
        //event.preventDefault();
        let answersToBeSent = [];

        setTried(true); //needed for validation (not to show error messages before submit)

        if (error.length === 0) {
            answers.map((a) =>
                answersToBeSent.push({ surveyid: props.surveyid, qnum: a.qnum, response: a.response }));
            await props.fillIn(answersToBeSent);
            setSubmitted(true);
        }
    }

    return (<>
        {submitted ? <Redirect to="/allsurveys" /> : <>
            <Row align="center" className="mt-4 md-3">

                <h1>
                    {props.surveytitle}
                </h1>

            </Row>

            <Col ><br></br><br></br>

                <OpenAnswerForm key={0} id={0} question={"Please insert your name below"} response={undefined} add={addResponse} error={error} optional={1} tried={tried} />

                {props.questions.filter(q => q.qtext.toLowerCase().includes(props.filter ? props.filter.toLowerCase() : '')).sort((a, b) => (a.qnum < b.qnum) ? a : b).map((q) => q.open ?
                    <>
                        <OpenAnswerForm align="right" key={q.qnum} id={q.qnum} question={q.qtext} response={undefined} add={addResponse} error={error} optional={q.optional} tried={tried} />
                    </>
                    :
                    <>
                        <CloseAnswerForm align="right" key={q.qnum} id={q.qnum} question={q.qtext} optional={q.optional} single={q.single} response={undefined} add={addResponse} error={error} tried={tried} />
                    </>

                )}

            </Col>{error ? (tried && error.reduce((a, b) => parseInt(a) + parseInt(b), 0) > 0) ? <Alert variant='danger'>Sorry! there is something wrong with at least one of your answers please check them!</Alert> : <br></br> : <br></br>}
            <Col align="right" className="bottom m-5">
                <Link to="/allsurveys"> <Button className="w-25" variant='secondary'> Cancel </Button></Link>
                <Button variant="dark" style={{ marginLeft: "30px" }} className=" w-25" onClick={handleSubmit}> Submit</Button>
            </Col>



            <br></br>
            <br></br>
            <br></br>
        </>
        }

    </>);
}

String.prototype.isEmpty = function () {
    return (this.length === 0 || !this.trim());
};

export default UserFillInSurvey;

