import {EyeFill} from 'react-bootstrap-icons'
import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'



const LoginForm = function(props) {
    const [errorMessage, setErrorMessage] = useState('') ;
    const [passwordType ,setPasswordType] = useState("password");
    const togglePasswordType = ()=>{setPasswordType((old)=> old==="password"? "text" : "password")}

    const myHandleSubmit = (values) => {

        const credentials = { 
            username: values.username,
            password: values.password
        };
        props.doLogin(credentials);
        
    }

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Required field'),
            password: Yup.string().required('Required field'),
        }),
        onSubmit: myHandleSubmit,
    });


    return (
        <Form onSubmit={formik.handleSubmit} >
            {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}

            <Form.Group controlID='validationFormik01' >
                <Form.Label>Username</Form.Label>
                <Form.Control id="username" type='text' value={formik.values.username} onChange={formik.handleChange} isInvalid={formik.touched.username && formik.errors.username} />
                <Form.Control.Feedback type="invalid">{formik.errors.username}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlID='validationFormik02' >
                <Form.Label>Password</Form.Label>
                <Form.Control id="password" type={passwordType} value={formik.values.password} onChange={formik.handleChange} isInvalid={formik.touched.password && formik.errors.password}>
                </Form.Control>
                <EyeFill style={{cursor:"pointer"}} onClick={togglePasswordType}/><i>show password</i>
                <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
            </Form.Group>

            <Row>
                <Col >
                    <Button type="submit">Login</Button>
                </Col>
            </Row>
        </Form>

    )

}

export default LoginForm;
