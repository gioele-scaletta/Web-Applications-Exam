const SurveyCard=function(props){

    if(props.nusers){
        return (
            <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
                <Card.Title>props.title</Card.Title>
                <Card.Text>{"Completed by "+ props.nusers + "users"}</Card.Text>
                <Link to = {"/admin/"+props.key} style={{ textDecoration: 'none' }}>
                    <Button variant="primary"> See responses </Button>
                </Link>

            </Card.Body>
            </Card>
        );
    } else {
        return (
            <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
                <Card.Title>props.title</Card.Title>
                <Card.Text>props.description</Card.Text>
                <Link to = {"/AllSurveys/"+props.key} style={{ textDecoration: 'none' }}>
                    <Button variant="primary"> Fill in survey </Button>
                </Link>
            </Card.Body>
            </Card>
        );
    }

}

export default SurveyCard