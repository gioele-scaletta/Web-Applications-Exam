import SurveyCard from "./SurveyCard.js"

const AdminSurveyList= function (props){

    return (<>
        {props.surveys.map((s) =>
            <SurveyCard key={s.survey_id} id={s.survey_id} title={s.survey_title} nusers={s.nusers} setad={props.setad}
            />
        
        )}
    </>);
}



export default AdminSurveyList