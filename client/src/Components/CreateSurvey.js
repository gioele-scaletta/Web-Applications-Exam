import OpenAnswerForm from './OpenAnswerForm.js'
import CloseAnswerForm from './CloseAnswerForm.js'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Row'
import { Trash, PencilSquare, ArrowUp, ArrowDown } from 'react-bootstrap-icons'

import { Link, useParams, Redirect} from 'react-router-dom';
import {useState} from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

const CreateSurvey = function(props) {

    const [questions, setQuestions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [num, setNum] =useState(1);
    const [submitted, setSubmitted]= useState(false);
    const [modal, setModal] = useState('');
    const [modaln, setModaln] = useState(-1);

    const addQuestion = async (text, ope, opt, sing) =>{
        let o;
        let q, q0;

        if(num==1 && modaln==-1){
            q0= {qnum: 0, qtext: "Please insert your name below", open: 1, optional: '', single:''};
            await setQuestions(oldAnswers => [...oldAnswers, q0]);
        }
            
        if(ope){
        
            q={qnum: (modaln==-1) ? num : modaln, qtext: text, open: 1, optional: opt ? 1 : 0, single:''};
        } else{
            q={qnum: (modaln==-1) ? num : modaln, qtext: text, open: 0, optional: opt, single: sing};
        }
        
        await setQuestions(oldAnswers => oldAnswers.filter((r)=>r.qnum!==modaln));
        await setQuestions(oldAnswers => [...oldAnswers, q]);
        if(modaln==-1){
        await setNum(num+1);
        }

        await handleCloseForm();
        
    }
    

    const Up= function (n) {

         if(n!=0)
        setQuestions(
            questions.map((r)=>{
                
               if (r.qnum===n-1) r.qnum++;
               else
               if (r.qnum===n) r.qnum--;
             return r;}) );
    }

    const Down= (n) =>{

        console.log(questions.map((r)=>r.qnum))
        let max=questions.reduce((r,a)=>a.qnum>r.qnum ? a:r);
        console.log(max);
 
       if((n!==max.qnum))
        setQuestions(
         questions.map((r)=>{
            if (r.qnum===n+1) r.qnum--;
            else if (r.qnum===n) r.qnum++;
          return r;}) );
    }
    
    const handleDelete= function(n) {
      
        setQuestions(oldAnswers => oldAnswers.filter((r)=>r.qnum!==n));
    
    }

    const handleUpdate= function(bool, init, n, opt, single) {
        if(!bool)
        setModal(init+"|"+opt+"|"+single);
        else
        setModal(init+"|"+opt)
        
        setModaln(n);
        handleShowForm(bool);
    
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        if(questions.length>0 && title.length>0){ //VALIDATION
        let questionsToBeSent = [];
        let n={Title: title, admin: props.admin}
        await  questionsToBeSent.push(n);
        await questions.forEach(a=>{
            questionsToBeSent.push(a);
        });
        await props.addSurvey(questionsToBeSent);
        await setSubmitted(true);
    } else{
        let mes =alert("Please insert at least question and the title of the survey to submit the survey");
       // setTimeout(function(){ clearTimeout(mes) }, 2000);
    }
        
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setModal('');
        setModaln(-1);
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
        {questions ? questions.sort((a,b) =>(a.qnum-b.qnum) ).map( (q) => q.open ?
        <> <br></br>
        <br></br>
            <OpenAnswerForm key={q.qnum} id={q.qnum} question={q.qtext} optional={q.optional} response={"         "}
            />
             < Trash color="blue" href="#" onClick={()=>handleDelete(q.qnum)} />
                            < PencilSquare color="blue" onClick={()=>handleUpdate(true, q.qtext, q.qnum, q.optional, '')} />
                            < ArrowUp color="blue" onClick={()=>Up(q.qnum)} /> 
                            < ArrowDown color="blue" onClick={()=>Down(q.qnum)} /> 
            </>
            :
            <> <br></br>
            <br></br><Col sm={5}>
            <CloseAnswerForm key={q.qnum} id={q.qnum} question={q.qtext} optional={q.optional} single={q.single} response={"0|0|0|0"}
            /></Col>
             < Trash color="blue" href="#" onClick={()=>handleDelete(q.qnum)} />
                            < PencilSquare color="blue" onClick={()=>handleUpdate(false, q.qtext, q.qnum, q.optional, q.single)} /> 
                            < ArrowUp color="blue" onClick={()=>Up(q.qnum)} /> 
                            < ArrowDown color="blue" onClick={()=>Down(q.qnum)} /> 

            </>
        ) : null}

        <Modal show={showForm}  >
            <Modal.Header >
                <Modal.Title>Add new Question</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {open ? <AddOpenEnded init={modal}  addQuestion={addQuestion} handleCloseForm={handleCloseForm} /> :  <AddCloseEnded init={modal} addQuestion={addQuestion}   handleCloseForm={handleCloseForm} /> }
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

    const [text, setText] = useState(props.init.split("|")[0]);
    const [opt, setOpt] = useState(props.init.split("|")[1]);
    

    const ifSubmit = () => {
     
        if(text.length>0){
        props.addQuestion(text,  true, opt, '');
        } else{
           alert("Please insert a question in the inpute text box");
        }
 
    };


    return (<>
        <Form>
            <Form.Group >
                <Form.Label>Insert question</Form.Label>
                <Form.Control type='text' value={text} onChange={(ev)=>setText(ev.target.value)} />
                <Form.Check  type="checkbox" value={opt} onChange={(ev) => setOpt(ev.target.checked)} label={"Thick the box to make the question mandatory"}/>
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

    const [text, setText] = useState(props.init.split("|")[0]);
    const [checkboxtext, setCheckboxtext] = useState(props.init.split("|").splice(0,props.init.split("|").length-2).join("|"));
    const [texttmp, setTexttmp] = useState('');
    const [opt, setOpt]= useState (props.init.split("|")[props.init.split("|").length-2] ); 
    const [sing, setSing]= useState(props.init.split("|")[props.init.split("|").length-1] );  
    const [showplus, setShowplus] =useState(true);
    const [validation, setValidation] =useState ()

    const ifSubmit = async () => {
     
       
     
        if(text.length>0 && checkboxtext.length>0){
            if(/^\d+$/.test(opt)) {
            await props.addQuestion(text+checkboxtext.replace(text,''), false, opt ? opt : 0, sing ? sing : 10);
            }else{
                alert("Min and max attributes should be numbers!")
            }

            } else{


                alert("Please inserT a Question and at least one checkbox")

                /* CAN THINK ABOUT USING FLAGS AND THIS FORM BOOT VAL
                if(text.length<=0)
            setValidation(1);
            if(checkboxtext.length<=0)
            setValidation(2);
            <InputGroup hasValidation>
  <InputGroup.Prepend>
    <InputGroup.Text>@</InputGroup.Text>
  </InputGroup.Prepend>
  <Form.Control type="text" required isInvalid />
  <Form.Control.Feedback type="invalid">
    Please choose a username.
  </Form.Control.Feedback>
</InputGroup>
            */

            }
     
            //for the min and max value we have choosen to put 0 and 10 as defautl values if the user doesn' select anything in 
            //order not to constrain too much the user
     
    };

    const toggle = ()=>{
        setShowplus(!showplus);
    }

    const append = ()=>{
        if(texttmp.length>0){
        setShowplus(!showplus);
        setCheckboxtext(checkboxtext +'|'+texttmp);
        } else{
            alert("Please insert some checkbox text")
        }
    }

    const handleDelete= (q)=>{
        
        setCheckboxtext( checkboxtext.split("|").filter((r)=>r!=q).join("|"));
    }


    return (<>
        <Form >
            <Form.Group>
                <Form.Label>Insert question</Form.Label>
                
          
                 <Form.Control type='text' value={text}  onChange={(ev)=>setText(ev.target.value)} />
                 
                
         </Form.Group>
      
            <Form.Group >
              <Form.Label>Min number of answers that can be selected</Form.Label>
              <Form.Control type='text'  value={opt}  onChange={(ev)=>setOpt(ev.target.value)} />
        
          </Form.Group>
          <Form.Group>
              <Form.Label>Max number of answers that can be selected</Form.Label>
              <Form.Control type='text' value={sing} onChange={(ev)=>setSing(ev.target.value)} />
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
                {checkboxtext ? checkboxtext.split('|').splice(1,).map((q) =>
                <>
               <Form.Check  type="checkbox" label={q}/>
               < Trash color="blue"  onClick={()=>handleDelete(q)} />
               </>
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