import Form from'react-bootstrap/Form'
import { useState, useEffect } from 'react'
import { Asterisk} from 'react-bootstrap-icons'
import Alert from 'react-bootstrap/Alert'
import Row from 'react-bootstrap/Row'


const OpenAnswerForm = function(props){
    
    const [text, setText] = useState();
    const [r, setR] =useState(props.id===0 ? 1 : 4);

    useEffect(() => {
        if(!props.response)
             props.add(text ? text : '', props.id);
    }, [text])


    if(props.response){//READONLY VERSION FOR ADMIN CHECKING RESPONSES OR CREATING SURVEY
    return(<> 
        
        <Form  >
        <Form.Group >
            <Form.Label>{props.question}</Form.Label>
            <Form.Control  rows={r} as="textarea" placeholder={props.response} readOnly />
        </Form.Group>
        </Form>
      </>
    );
    } else { // READWRITE VERSION FOR USER FILLING IN SURVEY
    return(
        <Form >
        <Form.Group>
            <Form.Label>{props.question}</Form.Label>
           {!(props.optional===0) ? <Asterisk color="blue" /> : null }
            <Form.Control as="textarea" value={text} onChange={ev=>setText(ev.target.value)} rows={r} />
      
            {(props.error!==[] && props.tried) ? ((props.error.filter((a)=>a===(props.id)).length>0) ? (!(props.optional===0) ? <Alert variant ={'danger'}> Please remember that text shold be less than 200 characters and that this answer is mandatory </Alert > : <Alert variant ={'danger'}> Please remember that text should be less than 200 characters</Alert> ) : null) : null}
        </Form.Group>
        </Form>
    );
    }


}

export default OpenAnswerForm;