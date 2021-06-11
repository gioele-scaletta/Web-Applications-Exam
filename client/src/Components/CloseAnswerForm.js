import Form from'react-bootstrap/Form'
import { useState, useEffect } from 'react'


const CloseAnswerForm = function(props){

    let Question =[];
    Question = String(props.question).split("|");
 
    let Response=[];
    const [tmp, setTmp]=useState();
    

    if(props.response)
    Response = String(props.response).split("|");


    const  Check= async function (checked, index) {
        if(tmp)
        Response=tmp.split("|");

        if(checked)
        Response[index-1]=1;
        else
        Response[index-1]=0;

        let text='';

        for (let i=0; i<Response.length;i++)
        text=text.concat(Response[i].toString(), "|");
           
        setTmp(text.substring(0,text.length-1));
        
        props.add(text.substring(0,text.length-1), props.id);
         
    };


    if(props.response){
        return(
            <Form>
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>{Question[0]}</Form.Label>
                {Question.map((q, index)=>(index!=0) ? 
                <Form.Check checked={Response[index-1]==1} type="checkbox" label={q}/> :
                null
                )}
            </Form.Group>
            </Form>
        );
        } else {
        return(
            <Form>
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>{Question[0]}</Form.Label>
                {Question.map((q, index)=>{Response[index-1]=0; if (index!=0) return (
                <CustomCheck q={q} key={index} index={index} Check={Check} write={true}  />
                );})}
            </Form.Group>
            </Form>
        );


}
}

const CustomCheck = function (props) {

    const [checked, setChecked]= useState(false);

    useEffect(() => {
        props.Check(checked, props.index);}
    ,[checked])

    return ( 
        
        <Form.Check value={checked} onChange={(ev) => setChecked(ev.target.checked)}  type="checkbox" label={props.q}/>
       
        
 );
}


export default CloseAnswerForm;