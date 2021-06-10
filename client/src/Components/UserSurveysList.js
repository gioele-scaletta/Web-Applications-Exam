import SurveyCard from "./SurveyCard.js"

const UserSurveyList= function (props){

    return (<>
        {props.surveys.forEach((s) =>{
            return <SurveyCard key={s.survey_id} title={s.survey_title} nusers={undefined} set={props.set}
            />;
        }
        )}
    </>);
}


export default UserSurveyList