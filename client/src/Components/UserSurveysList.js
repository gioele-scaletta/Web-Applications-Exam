import SurveyCard from "./SurveyCard.js"
import Row from 'react-bootstrap/Row'



function UserSurveyList (props){

    return (<>
        {props.surveys.map((s) => 
            <SurveyCard key={s.survey_id} id={s.survey_id} title={s.survey_title} nusers={undefined} setus={props.setus}
            />

        )}</>
    );
}


export {UserSurveyList}