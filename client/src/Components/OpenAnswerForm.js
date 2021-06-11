import Form from'react-bootstrap/Form'
import { useState, useEffect } from 'react'


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
        {console.log(props.rtext)}
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
            <Form.Control as="textarea" value={text} onChange={ev=>setText(ev.target.value)} rows={4} />
        </Form.Group>
        </Form>
    );
    }


}

export default OpenAnswerForm;