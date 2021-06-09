import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import { PersonCircle } from 'react-bootstrap-icons'
import { CardChecklist } from 'react-bootstrap-icons'
import { NavDropdown } from "react-bootstrap";

const NavBar = function (props) {

    return (
        <Navbar bg="dark" variant="dark" expand="lg">

            <CardChecklist color="white" size={50} className="mr-5" />
            <Navbar.Brand href="/">ToDo Manager</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
                <Form inline className="mr-3">
                    <FormControl type="text" placeholder="Search" className="mr-sm-2"/>
                    <Button variant = "primary" >Search</Button>
                </Form>
            </Navbar.Collapse>

            <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
                <Navbar.Brand>{props.clientName}</Navbar.Brand>
                <PersonCircle action color="white" size={50}/>
                {!props.logged ? null :
                    <>
                        <NavDropdown title="Logout" id="basic-nav-dropdown" color="white">
                            <NavDropdown.Item onClick={props.logout} eventKey="1">logout</NavDropdown.Item>
                        </NavDropdown>
                    </> 
                }
            </Navbar.Collapse>
        </Navbar>
    );
}



export default NavBar