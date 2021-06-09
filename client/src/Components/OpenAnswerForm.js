
const OpenAnswerForm = function(props){

    const [text, setText] = useState(undefined);

    useEffect(() => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {  
            // After 2 seconds make login messsage disappear
            props.add(text, props.key);
          }, 500)
    }, [text])


    if(props.response){
    return(
        <Form>
        <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>{props.question}</Form.Label>
            <Form.Control type="text" placeholder={props.response} readOnly rows={4}/>
        </Form.Group>
        </Form>
    );
    } else {
    return(
        <Form>
        <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>{props.question}</Form.Label>
            <Form.Control as="textarea" value={text} rows={4} />
        </Form.Group>
        </Form>
    );
    }


}

export default OpenAnswerForm;