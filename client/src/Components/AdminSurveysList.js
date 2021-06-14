import SurveyCard from "./SurveyCard.js"

const AdminSurveyList= function (props){


    return (  <>
    {props.surveys.map((s) => ((s.survey_title.indexOf(props.filter)!==-1) || (!props.filter) ) ? 
        <>
        <br></br>
            <SurveyCard key={s.survey_id} id={s.survey_id} title={s.survey_title} nusers={s.nusers} setad={props.setad}
            />
            </> : null
)}  
        </> );
}



export default AdminSurveyList