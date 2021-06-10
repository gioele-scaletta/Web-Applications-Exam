import OpenAnswerForm from './OpenAnswerForm.js'
import CloseAnswerForm from './CloseAnswerForm.js'
import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'

import { Link } from 'react';

//manca seleziona e filtra by users
const AdminSurvey= function (props){

    //GET list of users who provided responses to survey
    const [users, setUsers] = useState(uniq(props.responses.map((r)=>{return r.rnum;})));
    const [currentUser, setCurrentuser] = useState(0)

    return (<>
        <Row>
            <h1>
            {props.surveyTitle}
            </h1>
        </Row>
        {Array.of(props.questions).sort((a,b)=>{if(a.qnum<b.qnum)return a;}).forEach((q, index) =>{
            if(q.open)
            return <OpenAnswerForm key={q.qnum} question={q.q} response={Array.of(props.responses).filter((r)=>{return (r.rnum===users[currentUser] && r.qnum===q.qnum);}).sort((a,b)=>{if(a.num<b.num)return a;}).response}
            />;
            else
            return <CloseAnswerForm key={q.qnum} question={q.text} optional={q.optional} single={q.single} response={Array.of(props.responses).filter((r)=>{return (r.rnum===users[currentUser] && r.qnum===q.qnum);}).sort((a,b)=>{if(a.num<b.num)return a;}).response}
            />;
        }
        )}
        <Row>
            <Link to="/admin"><Button>Back </Button> </Link> 
        </Row>
        </>);
}

function uniq(a) {
    return a.filter(function(item, pos) {
        return a.indexOf(item) == pos;
    });
}

export default AdminSurvey;