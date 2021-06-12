import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import {Filter, PersonCircle} from 'react-bootstrap-icons'
import {CardChecklist, BarChartFill} from 'react-bootstrap-icons'
import {NavDropdown} from "react-bootstrap";
import { Redirect } from 'react-router';
import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'

const NavBar = function (props) {

    const [tologin, setToLogin]= useState();


    return (
            <>
        {tologin ? <Redirect to="/admin/login"/> :

        <Navbar  bg="dark" variant="dark" expand="lg">

            <BarChartFill color="white" size={50} className="m-2"/>
            <Navbar.Brand >Survey Manager</Navbar.Brand>
            <Link to ='/AllSurveys'> <Nav.Item className="m-3" >Home</Nav.Item></Link>
         
            <Link to ='/admin'> <Nav.Item >Admin</Nav.Item></Link>
           
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
                <Form inline className="mr-3">
                    <FormControl type="text" placeholder="Search" onChange={(ev)=>props.filter(ev.target.value)} className="mr-sm-2"/>
                  
                </Form>
            </Navbar.Collapse>

            <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
        

                <Navbar.Brand>{props.clientName}</Navbar.Brand>

                    < PersonCircle action color ="white" size={50} />
                {props.logged ?
                <>
                <NavDropdown title="Logout" id="basic-nav-dropdown"  color="white">
                    <NavDropdown.Item  onClick={props.logout} eventKey="1">logout</NavDropdown.Item>
                    </NavDropdown>
                </> :  <>
               
                <NavDropdown title="Login" id="basic-nav-dropdown"  color="white">
                 <NavDropdown.Item onClick={()=>setToLogin(true)} eventKey="2">login</NavDropdown.Item> 
                    </NavDropdown>
                </>
                }
            </Navbar.Collapse>

        </Navbar>
            }</>
    );
}



export default NavBar