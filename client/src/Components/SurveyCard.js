import Card from'react-bootstrap/Card'
import { Redirect } from 'react-router';
import Button from 'react-bootstrap/Button'
import {useState, useEffect} from 'react'
import Col from 'react-bootstrap/Col'

function SurveyCard (props){

    const [path, setPath]= useState(undefined);

      const [color, setColor]= useState(); 

      useEffect(() => {
        const getColor=async function(){
            setColor(await props.getColor());
        }
        getColor();
        }, []);

    const set = async function (id, flag){
        if(flag){
            //if we are in the user mode we call setus which will call FillIn in App.js which will trigger the loading of the survey questions (for the user to be able to fill in the survey)
            await props.setus(id);
            await props.backgroundColor(color);
            await setPath("/allsurveys/fillinsurvey/"+props.title)//used to specify where to redirect (for the redirect we have to wait for the prev mentioned loading)
        }
        else
        {   //otherwise in admin mode we cann setad which will call CheckSurvey in App.js tha will trigger the loading of questions and asnwers for a specific survey
            await props.setad(id);
            await props.backgroundColor(color);
            await setPath("/admin/surveyresults/"+props.title)//used to specify where to redirect (for the redirect we have to wait for the prev mentioned loading)
        }
    }

    if (props.nusers) { //if nusers is defined we are in the admin section otherwise in the user one
        return (
                    <>  
                        {path ? <Redirect to={path} /> :
                        <Col sm={4} >
                            <Card  style={{backgroundColor: color, opacity: 0.9}}    className="p-3 m-3">
                                <Card.Body>
                                    <Card.Title>{props.title}</Card.Title>
                                    <Card.Text>{"Completed by " + props.nusers + " users"}</Card.Text>
                                    
                                </Card.Body>
                                <Button className="w-50"  variant="dark" style={{  margin: "7%", boxShadow: "5px 5px 3px rgba(46, 46, 46, 0.3)"}} onClick={() => set(props.id, false)}> See responses </Button>
                            </Card>
                        
                            </Col>
                        }
                    </>
                );
    } else {
        return (
                    <>  
                        {path ? <Redirect to={path} /> :
                         <Col sm={4} >
                            <Card  style={{backgroundColor: color, opacity: 0.9}}  className="p-3 m-3">
                                <Card.Body>
                                    <Card.Title>{props.title}</Card.Title>
                                  
                                </Card.Body>
                                <Button className="w-50" variant="dark" style={{  margin: "7%", boxShadow: "5px 5px 3px rgba(64, 64, 64, 0.3)"}} onClick={() => set(props.id, true)}> Fill in survey </Button>
                            </Card>
                             </Col>
                         }
                    </>
                );
    }
}

export default SurveyCard