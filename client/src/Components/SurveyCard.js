import Card from'react-bootstrap/Card'
import { Redirect } from 'react-router';
import Button from 'react-bootstrap/Button'
import {useState} from 'react'

function SurveyCard (props){

    const [path, setPath]= useState(undefined);

    const set = async function (id, flag){
        if(flag){
        await props.setus(id);
        await setPath("/AllSurveys/"+props.id)
        }
        else{
        await props.setad(id);
        await setPath("/admin/"+props.id)
        }
    }

    if(props.nusers){
        return (<> {path ? <Redirect to={path} /> :
            <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                <Card.Text>{"Completed by "+ props.nusers + "users"}</Card.Text>
                <Button variant="primary" onClick={()=>set(props.id, false)}> See responses </Button>
            </Card.Body>
            </Card>
             }
             </>
        );
    } else {
        return (<> {path ? <Redirect to={path} /> :
            <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                    <Button variant="primary" onClick={()=>set(props.id, true)}> Fill in survey </Button>
            </Card.Body>
            </Card>
            
            }
            </>
        );
    }

}

export default SurveyCard