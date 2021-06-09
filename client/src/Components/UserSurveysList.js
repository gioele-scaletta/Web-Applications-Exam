import SurveyCard from "./SurveyCard.js"

const UserSurveyList= function (props){

    return (<>
        {props.surveys.forEach((s) =>{
            return <SurveyCard key={s.surveyid} title={s.sTitle} nusers={undefined}
            />;
        }
        )}
    </>);
}


export default UserSurveyList