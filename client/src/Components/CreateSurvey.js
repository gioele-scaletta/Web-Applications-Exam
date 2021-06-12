import OpenAnswerForm from './OpenAnswerForm.js'
import CloseAnswerForm from './CloseAnswerForm.js'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Row'

import { Link, useParams, Redirect} from 'react-router-dom';
import {useState} from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

const CreateSurvey = function(props){

    const [questions, setQuestions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [num, setNum] =useState(1);
    const [submitted, setSubmitted]= useState(false);

    const addQuestion = (text, ope, opt, sing) =>{
        let o;
            let q;
        if(ope){
            q={qnum: num, qtext: text, open: 1, optional: '', single:''};
        } else{
            q={qnum: num, qtext: text, open: 0, optional: opt, single: sing};
        }
        
        //let q={qnum: num, qtext:text, open: o, optional: opt, single:sing};
        //if(questions) setQuestions((exs) => exs.filter(ex => ex.num !== q.qnum));
        setQuestions(oldAnswers => [...oldAnswers, q]);
        setNum(num+1);

    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let questionsToBeSent = [];
        let n={Title: title, admin: props.admin}
        await  questionsToBeSent.push(n);
        await questions.forEach(a=>{
            questionsToBeSent.push(a);
        });
        await props.addSurvey(questionsToBeSent);
        await setSubmitted(true);
        //MANCA VALIDATION
    };

    const handleCloseForm = () => {
        setShowForm(false);
        
    }
    const handleShowForm = (open) =>{ setOpen(open);setShowForm(true);}

    return (<>  {submitted ? <Redirect to="/admin" /> :null}
        <Row>
        <Form>
        <Form.Group >
                <Form.Label>Insert Survey title here</Form.Label>
                <Form.Control type='text' onChange={(ev)=>setTitle(ev.target.value)} />
            </Form.Group>
        </Form>
        </Row> 
        {questions ? questions.sort((a,b) => (a.qnum<b.qnum) ? a : b).map( (q) => q.open ?
        <> <br></br>
        <br></br>
            <OpenAnswerForm key={q.qnum} id={q.qnum} question={q.qtext} response={"         "}
            />
            </>
            :
            <> <br></br>
            <br></br>
            <CloseAnswerForm key={q.qnum} id={q.qnum} question={q.qtext} optional={q.optional} single={q.single} response={"0|0|0|0"}
            />

            </>
        ) : null}
        
        <Modal show={showForm} onHide={handleCloseForm} >
            <Modal.Header >
                <Modal.Title>Add new Question</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {open ? <AddOpenEnded addQuestion={addQuestion} handleCloseForm={handleCloseForm} /> :  <AddCloseEnded addQuestion={addQuestion}  handleCloseForm={handleCloseForm} /> }
            </Modal.Body>
        </Modal>
        <br></br>
            <Button variant="primary" size="sm" onClick={()=>handleShowForm(true)}>Add Open-ended question</Button> {'  '}<Button variant="primary" size="sm" onClick={()=>handleShowForm(false)}>Add Closed-answer question</Button>
            <br></br>
            <br></br>
            <br></br>
          <Link to="/admin"><Button onClick={handleSubmit}>Submit survey</Button></Link>  {'  '} <Link to="/admin"><Button variant='secondary'> Cancel </Button></Link>
        
    </>);
}


function AddOpenEnded(props) {

    const [text, setText] = useState(undefined);

    const ifSubmit = () => {
     
        props.addQuestion(text,  true, '', '');
        props.handleCloseForm();
    };


    return (<>
        <Form>
            <Form.Group >
                <Form.Label>Insert question</Form.Label>
                <Form.Control type='text' onChange={(ev)=>setText(ev.target.value)} />
            </Form.Group>
            <Row>
              
            </Row>
        </Form>
        <Row>
        <Col xs={{ offset: 2 }}>
                    <Button type="submit" onClick={()=>ifSubmit()}>Save</Button>
                </Col>
               
         <Col xs={{ offset: 1 }}>
         <Button variant='secondary' onClick={()=>props.handleCloseForm()}>Cancel</Button>
     </Col>
     </Row>
     </>

    )

}

function AddCloseEnded(props) {

    const [text, setText] = useState('');
    const [checkboxtext, setCheckboxtext] = useState('');
    const [texttmp, setTexttmp] = useState('');
    const [opt, setOpt]= useState (undefined); 
    const [sing, setSing]= useState(undefined);  
    const [showplus, setShowplus] =useState(true);

    const ifSubmit = async () => {
     
        await props.addQuestion(text+checkboxtext, false, opt, sing);
        await props.handleCloseForm();
    };

    const toggle = ()=>{
        setShowplus(!showplus);
    }

    const append = ()=>{
        setShowplus(!showplus);
        setCheckboxtext(checkboxtext +'|'+texttmp);
    }

    return (<>
        <Form >
            <Form.Group  >
                <Form.Label>Insert question</Form.Label>
                <Form.Control type='text' onChange={(ev)=>setText(ev.target.value)} />
            </Form.Group>
               
            
      
            <Form.Group>
              <Form.Label>Min</Form.Label>
              <Form.Control type='text' onChange={(ev)=>setOpt(ev.target.value)} />
          </Form.Group>
          <Form.Group>
              <Form.Label>Max</Form.Label>
              <Form.Control type='text' onChange={(ev)=>setSing(ev.target.value)} />
          </Form.Group>
          
        </Form>
        <br></br>
        <br></br>
        <Form>
        {showplus ? <Button onClick={toggle}>Add checkbox</Button> : null}
            {!showplus ?
            <Form.Group  >
                <Form.Label>Insert checkbox answer</Form.Label>
                <Form.Control type='text' onChange={(ev)=>setTexttmp(ev.target.value)} />
            </Form.Group> : null}
            {!showplus ? <Button onClick={()=>append()}> Confirm checkbox text </Button> : null}
            <br></br>
        <br></br>
            <Form.Group controlId="exampleForm.ControlTextarea1">
                {checkboxtext ? checkboxtext.split('|').splice(1,).map((q, index) =>
               <Form.Check  type="checkbox" label={q}/>
                 ) : null}
            </Form.Group>
        </Form>
        
           <Row>
           <Col xs={{ offset: 2 }}>
               <Button type="submit" onClick={()=>ifSubmit()}>Save</Button>
           </Col>
           <Col xs={{ offset: 1 }}>
               <Button variant='secondary' onClick={()=>props.handleCloseForm()}>Cancel</Button>
           </Col>
       </Row>
        </>
    )

}


export default CreateSurvey