import Form from'react-bootstrap/Form'
import { useState, useEffect } from 'react'


const CloseAnswerForm = function(props){

    const Question = props.question.split("|");
 
    let Response=[];
    let text='';

    if(props.response)
    Response = props.response.split("|")


    const Check = function (checked, index) {

        Response= text.split('|')
        Response[index]=checked ? 1 : 0;

        text='';

        Response.forEach((r)=>{
            text.concat(r);
            text.concat("|");
        })
        
        props.add(text, props.key);
         
    };


    if(props.response){
        return(
            <Form>
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>{Question[0]}</Form.Label>
                {Question.forEach((q, index)=>{if (index!=0) return (
                <Form.Check defaultChecked={Response[index]===1} type="checkbox" label={q}/>
                );})}
            </Form.Group>
            </Form>
        );
        } else {
        return(
            <Form>
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>{Question[0]}</Form.Label>
                {Question.forEach((q, index)=>{Response[index]=0; if (index!=0) return (
                <CustomCheck q={q} index={index} Check={Check}/>
                );})}
            </Form.Group>
            </Form>
        );


}
}

const CustomCheck = function (props) {

    const [checked, setChecked]= useState(false);

    useEffect(() => {
        props.Check(checked, props.index);
    },[checked])

    return (
        <Form.Check defaultChecked={checked} onClick={(t)=>setChecked(!t)} type="checkbox" label={props.q}/>
    );
}


export default CloseAnswerForm;