import OpenAnswerForm from './OpenAnswerForm.js'
import CloseAnswerForm from './CloseAnswerForm.js'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Row'
import { Trash, PencilSquare, ArrowUp, ArrowDown } from 'react-bootstrap-icons'

import { Link, Redirect} from 'react-router-dom';
import {useState} from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { Container } from 'react-bootstrap'

const CreateSurvey = function(props) {

    //list of questions currently inserted by admin
    const [questions, setQuestions] = useState([]);
    //used for add/modify question modal opening and closing =1->open asnwer =2->closed
    const [showForm, setShowForm] = useState(0);
    //used to set survey title
    const [title, setTitle] = useState('');
    //used to set qnum of a new question when it is not a question in update
    const [num, setNum] =useState(1);
    //used to set and transmit the quetion number when the question is updated 
    const [modaln, setModaln] = useState(-1);
    //triggers redirect when survey is succesfully submitted
    const [submitted, setSubmitted]= useState(false);
    //used to transfer question inital values when question is updated
    const [modal, setModal] = useState('');
    //valdation
    const[missing, setMissing] = useState(false);
    

    //add question to current question list can be called both by closed and open questions
    const addQuestion = async (text, ope, opt, sing) =>{
        let q;

        console.log(text);

        if(ope)
            q={qnum: (modaln===-1) ? num : modaln, qtext: text, open: 1, optional: opt, single:''};
        else
            q={qnum: (modaln===-1) ? num : modaln, qtext: text, open: 0, optional: parseInt(opt), single: parseInt(sing)};
        
        await setQuestions(oldAnswers => oldAnswers.filter((r)=>r.qnum!==modaln));
        setQuestions(oldAnswers => [...oldAnswers, q]);

        if(modaln===-1) 
             setNum(num+1);

        handleCloseForm();
        
    }
    
    //update list of questions in order to move the selected question down of one position
    const Up= (n)=> {

        if(n!==1)
            setQuestions(
                questions.map((r)=>{
                    if (r.qnum===n-1) r.qnum++;
                    else
                    if (r.qnum===n) r.qnum--;
                    return r;
                })
            );
    }

    //update list of questions in order to move the selected question down of one position
    const Down= (n) =>{

        let max=questions.reduce((r,a)=>a.qnum>r.qnum ? a:r);

       if((n!==max.qnum))
            setQuestions(
                questions.map((r)=>{
                    if (r.qnum===n+1) r.qnum--;
                    else if (r.qnum===n) r.qnum++;
                    return r;
                }) 
            );
    }
    
    //delte question from list when delete icon clicked
    const handleDelete= function(n) {
      
        setQuestions(oldAnswers => oldAnswers.filter((r)=>r.qnum!==n));
    
    }

    //takes care of opening modal and setting previuos values in case of update icon clicked (the previous values are set using 2 states)
    const handleUpdate= function(type, init, n, opt, single) {

        console.log(init+"|"+opt+"|"+single);
        if(type===2)
        setModal(init+"|"+opt+"|"+single);
        else
        setModal(init+"|"+opt)
        
        setModaln(n);
        handleShowForm(type);
    
    }

    //When admin submits survey the already 
    const handleSubmit = async () => {
      
        if(questions.length>0 && title.length>0 && !title.isEmpty()){ //VALIDATION
        let questionsToBeSent = [];
        let n={Title: title, admin: props.admin}
        questionsToBeSent.push(n);
        questions.forEach(a=>{
            questionsToBeSent.push(a);
        });
        await props.addSurvey(questionsToBeSent);
        setSubmitted(true);
    } else{
        setMissing(true);
        //alert("Please insert at least question and the title of the survey to submit the survey");
    }
        
    };

    //close modal form and reset modal update values to default
    const handleCloseForm = () => {
        setShowForm(0);
        setModal('');
        setModaln(-1);
    }
    let colors=['#283747', '#000000', '#EEFBFB','#12232E', '#203647'];
    let iconcolor= colors[1];

    const handleShowForm = (open) =>{ setShowForm(open);}

    return (
                <>  
                    {submitted ? <Redirect to="/admin" /> :null}
                    <Row>
                        <Form>
                            <Form.Group >
                                <Form.Label  style={{fontSize: '115%', fontWeight: '600'}} className="mt-4 md-3">Insert Survey title here</Form.Label>
                                {missing ?
                                    <>
                                        <Form.Control type='text' value={title} onChange={(ev)=>setTitle(ev.target.value)} required isInvalid />
                                        <Form.Control.Feedback type="invalid">
                                            Please insert at least question and the title of the survey to submit the survey
                                        </Form.Control.Feedback>
                                   </>
                                :
                                    <Form.Control type='text' value={title} onChange={(ev)=>setTitle(ev.target.value)} />
                                }
                            </Form.Group>
                        </Form>
                     
                    </Row> 
                    <br></br><br></br><hr/>
                    {questions ? questions.sort((a,b) =>(a.qnum-b.qnum))
                        .map( (q) => q.open ?
                            <> <br></br> <br></br>
                                <OpenAnswerForm key={q.qnum} id={q.qnum} question={q.qtext} optional={q.optional} response={"         "}/>
                                
                                <Container align="right" >
                                {q.qnum!==1 ?  < ArrowUp color={iconcolor} className="m-3" size={20} onClick={()=>Up(q.qnum)} /> : null}
                               {q.qnum!==questions.reduce((r,a)=>a.qnum>r.qnum ? a:r).qnum ? < ArrowDown color={iconcolor} className="m-3"size={20} onClick={()=>Down(q.qnum)} /> : null}
                                < PencilSquare color={iconcolor} className="m-3" size={20} onClick={()=>handleUpdate(1, q.qtext, q.qnum, q.optional, '')} />
                                < Trash color={iconcolor} className="m-3" size={20} href="#" onClick={()=>handleDelete(q.qnum)} /> 
                                </Container>
                                <br></br>
                                <br></br><hr/><br></br>

                            </>
                            :
                            <> <br></br><br></br>
                                
                                    <CloseAnswerForm key={q.qnum} id={q.qnum} question={q.qtext} optional={q.optional} single={q.single} response={"0|0|0|0"}/>
                                
                                <Container align="right" >
                                {q.qnum!==1 ? < ArrowUp color={iconcolor} className="m-3" size={20} onClick={()=>Up(q.qnum)} /> : null }
                                {q.qnum!==questions.reduce((r,a)=>a.qnum>r.qnum ? a:r).qnum ? < ArrowDown color={iconcolor} className="m-3"size={20} onClick={()=>Down(q.qnum)} /> : null}
                                < PencilSquare color={iconcolor} className="m-3" size={20} onClick={()=>handleUpdate(2, q.qtext, q.qnum, q.optional, q.single)} />
                                < Trash color={iconcolor} className="m-3" size={20} href="#" onClick={()=>handleDelete(q.qnum)} /> 
                                </Container>
                                <br></br>
                                <br></br><hr/><br></br>
                            </>
                        ) 
                    : null}

                    <Modal show={showForm===1 || showForm===2}>
                        <Modal.Header >
                            <Modal.Title>Add new Question</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {(showForm===1) ? <AddOpenEnded init={modal}  addQuestion={addQuestion} handleCloseForm={handleCloseForm} /> : (showForm===2) ? <AddCloseEnded init={modal} addQuestion={addQuestion}   handleCloseForm={handleCloseForm} /> : null}
                        </Modal.Body>
                    </Modal>
            
                    <br></br>
                    <br></br>

                    <Col align="left">
                        <Button variant="primary" style={{marginLeft: "10px" , marginRight:"35px",  border:0, outline:0}} className="w-25" size="sm" onClick={()=>handleShowForm(1)}>Add Open-ended question</Button> 
                        <Button variant="primary" style={{  border:0}} size="sm"   className="w-25" onClick={()=>handleShowForm(2)}>Add Closed-answer question</Button>
                    </Col>

                    <br></br>
                    <br></br>
                    <br></br>
                   
                    <Col align="right" className="bottom m-2">
                        <div style={{display: 'inline'}}>
                            <Link to="/admin"><Button className="w-25" variant='secondary'> Cancel </Button></Link> 
                            <Button style={{marginLeft:"30px"}} className="w-25" variant="dark" onClick={()=>handleSubmit()}> Submit survey </Button>
                        </div>
                    </Col>
                    <br></br>
        <br></br>
           <br></br>
                </>
            );
    }


 function AddOpenEnded(props) {

    //question title
    const [text, setText] = useState(props.init.split("|")[0]);
    //question optional?
    const [opt, setOpt] = useState(props.init.split("|")[1]==='1' ? true : false);   
    //validatio
    const [missing, setMissing] = useState(false);

    //on successful open question submit add question to survey list of question
    const ifSubmit = () => {
     
        if(text.length>0 && !text.isEmpty()){
            setMissing(false);
            props.addQuestion(text.replaceAll("|", "\u20D2"),  true, opt===true ? 1 : 0 , '');
        } else{
            setMissing(true);
            //alert("Please insert a question in the inpute text box");
        }
 
    };


    return (<>
        <Form>
            <Form.Group >
                <Form.Label className ='w-100'>Insert question</Form.Label>
                {missing ?
                    <>
                        <Form.Control type='text' value={text} onChange={(ev)=>setText(ev.target.value)} required isInvalid/>
                        <Form.Control.Feedback type="invalid">
                                    Please insert a Question
                        </Form.Control.Feedback>
                    </>
                    :
                    <Form.Control type='text' value={text} onChange={(ev)=>setText(ev.target.value)} />
                }
                <Form.Check  type="checkbox" checked={opt} onChange={(ev) => setOpt(ev.target.checked)} label={"Thick the box to make the question mandatory"}/>
            </Form.Group>
            <Row>
              
            </Row>
        </Form>
        
       <div align="right">
            <Button className="m-3" variant='secondary' onClick={()=>props.handleCloseForm()}>Cancel</Button>        
            <Button className="m-3" type="submit" variant="dark" onClick={()=>ifSubmit()}> Save Question </Button>  
        </div>
     </>

    )

}

function AddCloseEnded(props) {

    //Question title (only at the end merged with checkbox questions)
    const [text, setText] = useState(props.init.split("|")[0]);
    //current checkbox questions text. Only at the end the content is moved into text (if it is done before it is impossible to modify again question)
    const [checkboxtext, setCheckboxtext] = useState(props.init.split("|").splice(1,props.init.split("|").length-3).join("|"));
    //tmp variable used to set single checkboxtext. After single check text submit then content is moved to checkboxtext where all questions text are stored
    const [texttmp, setTexttmp] = useState('');
    //states used to set inital values when modal is used for an update
    const [opt, setOpt]= useState (props.init.split("|")[props.init.split("|").length-2] ); 
    const [sing, setSing]= useState(props.init.split("|")[props.init.split("|").length-1] );  
    //state used to toggle between add and confirm checkbox text buttons
    const [showplus, setShowplus] =useState(true);
    //validation states
    const [valMinMax, setValMinMax] =useState(false)
    const [missing, setMissing] = useState(false);
    const [valText, setValText] = useState(false);

    const ifSubmit = async () => {
     
        if(text.length>0 && checkboxtext.length>0 && !text.isEmpty()){//VALIDATION
                setMissing(false);
            if(/^\d+$/.test(opt) && /^\d+$/.test(opt) && opt<=sing && sing<=checkboxtext.split('|').length) { //VALIDATION STEP 2
                setValMinMax(false);
                props.addQuestion(text.replaceAll("|", "\u20D2")+"|"+checkboxtext, false, opt , sing);  //merge all questions text in one string
            }else{
                //alert("Min and max attributes should be numbers!")
                setValMinMax(true);
            }
            } else{ //VALIDATION
                //alert("Please insert a Question and at least one checkbox")
                setMissing(true);

            }
     
    };

    //toggle form add checkbox button to confimr checkbox text button
    const toggle = ()=>{
        setShowplus(!showplus);
    }

    //merge of new checkbox question text with prevous ones
    const append =  ()=>{
        if(texttmp.length>0 && !texttmp.isEmpty()){
            setValText(false);
            setShowplus(!showplus);
            if(checkboxtext)
                setCheckboxtext(checkboxtext + '|'  + texttmp.replaceAll("|", "\u20D2"));
            else //se è la prima domanda
            setCheckboxtext(texttmp.replaceAll("|", "\u20D2"));
        } else{
            setValText(true);
            //alert("Please insert some checkbox text")
        }
    }

    const handleDelete= (q)=>{
        setCheckboxtext( checkboxtext.split("|").filter((r)=>r!==q).join("|"));
    }


    return (<>
        <Form >
            <Form.Group>
                {missing ? 
                    <>
                        <Form.Label>Insert question</Form.Label> 
                        <Form.Control type='text' value={text}  onChange={(ev)=>setText(ev.target.value)} required isInvalid />
                        <Form.Control.Feedback type="invalid">
                            Please insert a Question and at least one checkbox
                        </Form.Control.Feedback>
                    </>
                :    
                    <>
                        <Form.Label>Insert question</Form.Label>
                        <Form.Control type='text' value={text}  onChange={(ev)=>setText(ev.target.value)} /> 
                    </>
                }               
            </Form.Group>
                {valMinMax ?
                    <>
                        <Form.Group>
                            <Form.Label>Min number of answers that can be selected</Form.Label>
                            <Form.Control type='text'  value={opt}  onChange={(ev)=>setOpt(ev.target.value)}  required isInvalid/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Max number of answers that can be selected</Form.Label>
                            <Form.Control type='text' value={sing} onChange={(ev)=>setSing(ev.target.value)}  required isInvalid />
                       
                        <Form.Control.Feedback type="invalid">
                            Min and Max fields should be valid numbers.
                        </Form.Control.Feedback>
                        </Form.Group>
                    </>
                :
                    <>
                       <Form.Group>
                            <Form.Label>Min number of answers that can be selected</Form.Label>
                            <Form.Control type='text'  value={opt}  onChange={(ev)=>setOpt(ev.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Max number of answers that can be selected</Form.Label>
                            <Form.Control type='text' value={sing} onChange={(ev)=>setSing(ev.target.value)} />
                        </Form.Group>
                    </>
                }

        </Form>
        <br></br>
        <br></br>
        <Form>
            {showplus ? <Button onClick={toggle}>Add checkbox</Button> : null}
            {!showplus ?
                <Form.Group  >
                    <Form.Label>Insert checkbox answer</Form.Label>
                    {valText ?
                        <>
                            <Form.Control type='text' onChange={(ev) => setTexttmp(ev.target.value)} required isInvalid />
                            <Form.Control.Feedback type="invalid">
                                Please insert some text in the question
                            </Form.Control.Feedback>
                        </>
                        :
                        <Form.Control type='text' onChange={(ev) => setTexttmp(ev.target.value)} />
                    }

                </Form.Group> : null}
            {!showplus ? <Button onClick={() => append()}> Confirm checkbox text </Button> : null}
            <br></br>
            <br></br>
            <Form.Group controlId="exampleForm.ControlTextarea1">
                {checkboxtext ? checkboxtext.split('|').map((q) =>
             <Form.Group  >
                   <Trash color='#000000'  className="m-1" size={20}   onClick={() => handleDelete(q)} /> 
                 <Form.Check className="m-3" style={{marginRight: '10'}}  inline checked={false} label={q}/>{'  '}{'    '}
             
               
                  </Form.Group>
                       
                 
                ) : null}
            </Form.Group>
        </Form>

        <div align="right">
            <Button className="m-3" variant='secondary' onClick={()=>props.handleCloseForm()}>Cancel</Button>        
            <Button className="m-3" type="submit" variant="dark" onClick={()=>ifSubmit()}> Save Question  </Button>  
        </div>
    </>
    )

}

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

export default CreateSurvey