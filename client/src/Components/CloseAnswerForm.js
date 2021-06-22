import Form from'react-bootstrap/Form'
import { useState, useEffect } from 'react'
import Alert from 'react-bootstrap/Alert'


const CloseAnswerForm = function(props){

    let Question =[];
    let Response=[];
    //current checkbox responses
    const [curresponse, setCurresponse]=useState();
  
   
    Question = String(props.question).split("|"); //transform questions list into array
 
    if(props.response) //READONLY VERSION FOR ADMIN CHECKING RESPONSES OR CREATING SURVEY I have to set responses to be displayed
    Response = String(props.response).split("|");

    //update current response and propagate update of current response to UserFillInSurvey
    const  Check= async function (checked, index) {
        if(curresponse)
        Response=curresponse.split("|");

        if(checked)
        Response[index-1]=1;
        else
        Response[index-1]=0;

        let text='';

        for (let i=0; i<Response.length;i++)
        text=text.concat(Response[i].toString(), "|");

        //update current response   
        setCurresponse(text.substring(0,text.length-1));
        
        //propagate update of current response to UserFillInSurvey
        props.add(text.substring(0,text.length-1), props.id);
         
    };


    if(props.response){
        return( //READONLY VERSION FOR ADMIN CHECKING RESPONSES OR CREATING SURVEY
            <Form>
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>{Question[0]}</Form.Label>
                {props.maxq ? <Form.Text type="valid">{" (Most selected option is underlined in green)"}</Form.Text> : null}
                {Question.map((q, index)=>(index!==0) ? 
                <>
                {props.maxq ? props.maxq.split('|')[index-1]==='1' ? 
                <>
                <Form.Check checked={Response[index-1]==='1'} type="checkbox" label={q} isValid/>
               
                </>
                :
                <Form.Check checked={Response[index-1]==='1'} type="checkbox" label={q} />
                :
                <Form.Check checked={Response[index-1]==='1'} type="checkbox" label={q} />
                }
                </>
                :null 
                )}

                {props.maxseq ? props.maxseq.includes(props.response[0]) ?  //added functionality that displays which is most popular answer (if two answers same amount nothing displayed)
                 <Form.Text> {"This sequence of answers was the most popular"}  </Form.Text>
                : <br></br> : <br></br>}
                
               
            </Form.Group>
            </Form>
        );
    } else 
    { // READWRITE VERSION FOR USER FILLING IN SURVEY
        return(
            <Form>
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>{Question[0]}</Form.Label>
                
                <Form.Text> {" (For this question you can select between " + props.optional + " and " + props.single + " checkboxes)"}  </Form.Text>
                
                <br></br>
                {Question.map((q, index)=>{Response[index-1]=0; if (index!==0) return (
                    <CustomCheck q={q} key={index} index={index} Check={Check}   />
                );})}
                {(props.error!==[] && props.tried && props.error.filter((a)=>a===(props.id)).length>0) ? <Alert variant ={'danger'}> 
                Your answer does not respect the constraints of selectable checkboxes, please correct your answer</Alert > : null}
                <br></br>
            </Form.Group>
            </Form>
        );
    }
}

const CustomCheck = function (props) {

    const [checked, setChecked]= useState(false);

    //When checkbox toggled I have to change the response also in CloseAnswerForm component. It will be then later propagated to UserFillinSurvey using addResponse(add)
    useEffect(() => {
        props.Check(checked, props.index);}
    ,[checked])

    return ( 
        <Form.Check value={checked} onChange={(ev) => setChecked(ev.target.checked)}  type="checkbox" label={props.q}/>
    );
}


export default CloseAnswerForm;