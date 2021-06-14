import Form from'react-bootstrap/Form'
import { useState, useEffect } from 'react'
import { Asterisk} from 'react-bootstrap-icons'
import Alert from 'react-bootstrap/Alert'


const OpenAnswerForm = function(props){
    
    const [text, setText] = useState();

    useEffect(() => {
        if(!props.response){
        let timeout;
        clearTimeout(timeout);
        timeout = setTimeout(() => {  
            // After 2 seconds make login messsage disappear
            props.add(text, props.id);
          }, 500)
        }
    }, [text])


    if(props.response){
    return(<>
        <Form>
        <Form.Group >
            <Form.Label>{props.question}</Form.Label>
            <Form.Control type="text" placeholder={props.response} readOnly />
        </Form.Group>
        </Form></>
    );
    } else {
    return(
        <Form>
        <Form.Group>
            <Form.Label>{props.question}</Form.Label>
           {!props.optional ? <Asterisk color="blue" /> : null }
            <Form.Control as="textarea" value={text} onChange={ev=>setText(ev.target.value)} rows={4} />
      
            {(props.error!==[] && props.tried) ? ((props.error.filter((a)=>a===(props.id)).length>0) ? (!props.optional ? <Alert variant ={'danger'}> "Please remember that text shold be less than 200 characters and that this answer is mandatpory" </Alert > : <Alert variant ={'danger'}> "Please remember that text shold be less than 200 characters and that this answer is mandatpory"</Alert> ) : null) : null}
        </Form.Group>
        </Form>
    );
    }


}

export default OpenAnswerForm;