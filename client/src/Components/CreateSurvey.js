import AdminSurvey from "./AdminSurvey";

const CreateSurvey = function(props){

    let [questions, setQuestions] = useState(undefined);
    let [showForm, setShowForm] = useState(false);
    let [open, setOpen] = useState(false);
    let [title, setTitle] = useState('');
    const [num, setNum] =useState(0);

    const addQuestion = (text, ope, opt, sing) =>{
        let o;

        if(ope){
            o=1;
        } else{
            o=0;
        }
        
        let q={qnum: id, qtext:text, open: o, optional: opt, single:sing};
        setQuestions((exs) => exs.filter(ex => ex.num !== q.qnum))
        setQuestions(oldAnswers => [...oldAnswers, q]);
        setNum(num+1);

    }

    const handleSubmit = (event) => {
        //event.preventDefault();
        let questionsToBeSent = [];
        let n={Title: title, ad:props.admin.id}
        questionsToBeSent.push(n);
        answers.forEach(a=>{
            questionsToBeSent.push(a);
        }).then(props.addSurvey(questionsToBeSent));
        //MANCA VALIDATION
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setBgColor("");
    }
    const handleShowForm = (open) =>{ setOpen(open).then(setShowForm(true));}

    return (<>
        <Row>
        <Form>
            <Form.Group controlId="formGroupTitle">
                <Form.Label>Email Survey Title</Form.Label>
                <Form.Control  value={title} />
            </Form.Group>
        </Form>
        </Row>
        {questions.sort((a,b)=>{if(a.num<b.num)return a;}).forEach((q) =>{
            if(q.open)
            return <OpenAnswerForm key={q.id} question={q.text} response={undefined} add={addResponse}
            />;
            else
            return <CloseAnswerForm key={q.id} question={q.text} optional={q.optional} single={q.single} response={undefined} add={addResponse}
            />;
        }
        )}
        <Modal show={showForm} onHide={handleCloseForm}>
            <Modal.Header closeButton>
                <Modal.Title>Add new Question</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {open ? <AddOpenEnded addQuestion={addQuestion} handleCloseForm={handleCloseForm} /> :  <AddCloseEnded addQuestion={addQuestion}  handleCloseForm={handleCloseForm} /> }
            </Modal.Body>
        </Modal>
        <Row>
            <Button onClick={handleShowForm(true)}>Add Open-ended question</Button> <Button onClick={handleShowForm(false)}>Add Closed-answer question</Button>
        </Row>
        <Row>
            <Link to="/admin"><Button onClick={handleSubmit}>Submit the survey</Button></Link> <Link to="/admin"><Button variant='secondary'> Cancel </Button></Link>
        </Row>
    </>);
}


function AddOpenEnded(props) {

    const [text, setText] = useState(undefined);

    const ifSubmit = (values) => {
     
        props.addQuestion(text, id, true, '', '');
        props.handleCloseForm();
    };


    return (
        <Form>
            <Form.Group >
                <Form.Label>Insert question</Form.Label>
                <Form.Control type='text' value={text} />
            </Form.Group>
            <Row>
                <Col xs={{ offset: 2 }}>
                    <Button type="submit" onClick={ifSubmit}>Save</Button>
                </Col>
                <Col xs={{ offset: 1 }}>
                    <Button variant='secondary' onClick={props.handleCloseForm}>Cancel</Button>
                </Col>
            </Row>
        </Form>

    )

}

function AddCloseEnded(props) {

    const [text, setText] = useState(undefined);
    const [texttmp, setTexttmp] = useState('');
    const [opt, setOpt]= useState (undefined); 
    const [sing, setSing]= useState(undefined);  
    const [showplus, setShowplus] =useState(true);

    const ifSubmit = (values) => {
     
        props.addQuestion(text, id, false, opt, sing);
        props.handleCloseForm();
    };

    const toggle = ()=>{
        setShowplus(!showplus);
    }

    const append = ()=>{
        setShowplus(!showplus);
        text.concat(texttmp);
    }

    return (
        <Form >
            <Form.Group  >
                <Form.Label>Insert question</Form.Label>
                <Form.Control type='text' value={title} />
            </Form.Group>
            {showplus ? <Button onClick={toggle}>Add checkbox</Button> : null}
            {!showplus ?
            <Form.Group  >
                <Form.Label>Insert checkbox answer</Form.Label>
                <Form.Control type='text' value={title} />
            </Form.Group> : null}
            {!showplus ? <Button onClick={append}> Confirm checkbox text </Button> : null}
            <Form.Group>
              <Form.Label>Min</Form.Label>
              <Form.Control type='number' value={opt}/>
          </Form.Group>
          <Form.Group>
              <Form.Label>Max</Form.Label>
              <Form.Control type='number' value={sing}/>
          </Form.Group>
            <Row>
                <Col xs={{ offset: 2 }}>
                    <Button type="submit" onClick={ifSubmit}>Save</Button>
                </Col>
                <Col xs={{ offset: 1 }}>
                    <Button variant='secondary' onClick={props.handleCloseForm}>Cancel</Button>
                </Col>
            </Row>
        </Form>

    )

}


export default CreateSurvey