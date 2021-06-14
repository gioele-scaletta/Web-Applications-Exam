import SurveyCard from "./SurveyCard.js"
import Row from 'react-bootstrap/Row'



function UserSurveyList (props){

    return (<>{props.surveys.map((s) => ((s.survey_title.indexOf(props.filter)!==-1) || (!props.filter) ) ? 
        <>
            <SurveyCard key={s.survey_id} id={s.survey_id} title={s.survey_title} nusers={undefined} setus={props.setus}
            />
            </> : null
)}  
        </> );
}



export {UserSurveyList}