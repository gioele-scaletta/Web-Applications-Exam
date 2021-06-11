import OpenAnswerForm from './OpenAnswerForm.js'
import CloseAnswerForm from './CloseAnswerForm.js'
import { useState } from 'react'
import Button from 'react-bootstrap/Button'

import Row from 'react-bootstrap/Row'
import { Link, useParams} from 'react-router-dom';

//manca seleziona e filtra by users
const AdminSurvey= function (props){

    //GET list of users who provided responses to survey
    const [users, setUsers] = useState(uniq(props.responses.map((r) => r.rnum)));
    const [currentUser, setCurrentuser] = useState(0)

    const next= function(){
        setCurrentuser(currentUser+1);
    }

    return (<>
        <Row>
            <h1>
            {props.surveytitle}
            {console.log(props.responses)}
            </h1>
        </Row>
        {props.questions.sort((a,b) => (a.qnum<b.qnum) ? a : b).map( (q) => q.open ?
            <OpenAnswerForm key={q.qnum} id={q.qnum} add={undefined} question={q.qtext} response={props.responses.filter( (r) => (r.rnum===users[currentUser] && r.qnum===q.qnum)).map((r)=>r.rtext)} 
            />
            :
            <CloseAnswerForm  key={q.qnum} id={q.qnum} question={q.qtext} optional={q.optional} single={q.single} response={props.responses.filter( (r) => (r.rnum===users[currentUser] && r.qnum===q.qnum)).map((r)=>r.rtext)}
        
            />
        )}
        
    
        <Button onClick={next}>Next</Button> 
        <Link to="/admin"> <Button variant='secondary'> Back</Button> </Link>

        </>
     
        );
}

function uniq(a) {
    return a.filter(function(item, pos) {
        return a.indexOf(item) == pos;
    });
}

export default AdminSurvey;


