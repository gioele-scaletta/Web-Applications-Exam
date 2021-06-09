import OpenAnswerForm from './OpenAnswerForm.js'
import CloseAnswerForm from './CloseAnswerForm.js'

//manca seleziona e filtra by users
const AdminSurvey= function (props){

    //GET list of users who provided responses to survey
    const [users, setUsers] = useState(uniq(props.responses.map((r)=>{r.rnum})));
    const [currentUser, setCurrentuser] = useState(0)

    return (<>
        <Row>
            <h1>
            {props.surveyTitle}
            </h1>
        </Row>
        {ArrayOf(props.questions).sort((a,b)=>{if(a.qnum<b.qnum)return a;}).forEach((q, index) =>{
            if(s.open)
            return <OpenAnswerForm key={q.qnum} question={q.qtitle} response={ArrayOf(props.responses).filter((r)=>{r.rnum===users[currentUser] && r.qnum===q.qnum}).sort((a,b)=>{if(a.num<b.num)return a;}).response}
            />;
            else
            return <CloseAnswerForm key={q.id} question={q.text} optional={q.optional} single={q.single} response={ArrayOf(props.responses).filter((r)=>{r.rnum===users[currentUser] && r.qnum===q.qnum}).sort((a,b)=>{if(a.num<b.num)return a;}).response}
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