import OpenAnswerForm from './OpenAnswerForm.js'
import CloseAnswerForm from './CloseAnswerForm.js'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'



const AdminSurvey = function (props) {

    //GET list of users who provided responses to survey
    const [users, setUsers] = useState(uniq(props.responses.map((r) => r.rnum)));
    const [currentUser, setCurrentuser] = useState(0);
    const [warning, setWarning] = useState(false);
    const [firstRender, setFirstRender] = useState(true);

    //UseEffect added in the end to reload the questions if the survey link is changed not using some app commands but with the broswer back forward button (not working when passing from user to admin surveys but it is not required to have back forward button working)
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

    useEffect(() => {
        if (warning)
            setTimeout(() => {
                // After 2 seconds make it disappear
                setWarning(false);
            }, 2000);
    }, [warning]);

    //go to next or previous survey submission-> set currentUser to next one 
    const next = function () {
        if (currentUser < users.length - 1)
            setCurrentuser(currentUser + 1);
        else
            setWarning(2); //tell user answes are finished
    }

    const previous = function () {
        if (currentUser > 0)
            setCurrentuser(currentUser - 1);
        else
            setWarning(1);
    }

    return (
        <>
            <Row align="center" className="mt-4 md-3">

                <h1>
                    {props.surveytitle}
                </h1>

            </Row><br></br><br></br>

            <OpenAnswerForm key={0} id={0} question={"Name"} response={props.responses.filter((r) => (r.rnum === users[currentUser] && r.qnum === 0)).map((r) => r.rtext)} add={undefined} />
            <br></br><hr /><br></br>

            {props.questions.filter(q => q.qtext.toLowerCase().includes(props.filter ? props.filter.toLowerCase() : '')).sort((a, b) => (a.qnum < b.qnum) ? a : b)
                .map((q) => q.open ?
                    <>
                        <OpenAnswerForm key={q.qnum} id={q.qnum} add={undefined} question={q.qtext} response={props.responses.filter((r) => (r.rnum === users[currentUser] && r.qnum === q.qnum)).map((r) => r.rtext)} />
                        <br></br><hr /><br></br>

                    </>
                    :
                    <>
                        <CloseAnswerForm key={q.qnum} id={q.qnum} maxseq={mode(props.responses.filter(r => r.qnum === q.qnum).map((r) => r.rtext))} maxq={maxquestion(props.responses.filter(r => r.qnum === q.qnum).map((r) => r.rtext))} question={q.qtext} optional={q.optional} single={q.single} response={props.responses.filter((r) => (r.rnum === users[currentUser] && r.qnum === q.qnum)).map((r) => r.rtext)} />
                        <br></br><hr /><br></br>
                    </>
                )
            }

            <Button className="m-2" onClick={previous}>Previous Survey  </Button>

            <Button className="m-2" onClick={next}>Next Survey</Button>

            {/*if next or previous buttons pressed but there are no following/previous users*/}
            {warning === 2 ? <Alert variant="danger">The Answers are finished</Alert> :
                warning === 1 ? <Alert variant="danger">This is the first answer</Alert> :
                    <><br></br><br></br><br></br></>}

            <div align="right" >
                <Link to="/admin"> <Button className="w-25 m-5" variant='secondary'> Back</Button> </Link>
            </div>

        </>

    );
}

//function to get disinct users who completed survey
function uniq(a) {
    return a.filter(function (item, pos) {
        return a.indexOf(item) === pos;
    });
}

//function used to get maximum answered sequence
function mode(arr) {
    let max = 0;

    return Object.entries(arr.filter((a) => a.includes('|')).reduce((acc, x) => {
        if (!acc[x]) {
            acc[x] = 1;
            return acc;
        } else {
            acc[x] += 1;
            if (acc[x] > max)
                max = acc[x];

            return acc;
        }

    }, {})).filter(([k, x]) => x === max).map(([k, x]) => k);
}

//function to get maximum answered question
function maxquestion(arr) {
    return Object.values(arr.filter((a) => a.includes('|'))
        .reduce((occ, a) => {
            a.split('|').forEach((x, index) => x === '1' ? occ[index] ? ++occ[index] : occ[index] = 1 : occ[index] ? null : occ[index] = 0);
            return occ;
        }, {}))
        .map((e, i, arr) => e === Math.max(...arr) ? 1 : 0).join('|');

}

export default AdminSurvey;


