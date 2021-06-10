import SurveyCard from "./SurveyCard.js"

const AdminSurveyList= function (props){

    return (<>
        {props.surveys.forEach((s) =>{
            return <SurveyCard key={s.surveyid} title={s.stitle} nusers={s.nusers} set={props.set}
            />
        }
        )}
    </>);
}



export default AdminSurveyList