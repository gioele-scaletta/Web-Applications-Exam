import SurveyCard from "./SurveyCard.js"

const AdminSurveyList= function (props){

    let myColors = {
        1: [   '#768A95',  '#B98077', '#932432', '#EEFBFB','#2d545e'],  
        2: [ '#932432', '#3c1874', '#DE354C', '#283747' ],
        3: ['#B73225', '#004E7C', '#591COB', '#5C5F58', '#DCE1E3'], 
        4: [ '#007CC7', '#4DA8DA',  '#EEFBFB','#12232E', '#203647'], //BLUE 
        5: ['#164A41', '#4D774E', '#9DC88D', '#F1B24A'],
        6: ['#F7E8E6', '#FA28089','#2d545e','#f9c5bd', '#0f2862', '#6B7A8F', '#dea6af','#8cbcd0' ],
        7: [ '#768A95',  '#B98077', '#932432',  '#4DA8DA',  '#EEFBFB','#164A41','#2d545e','#932432', '#3c1874', '#DE354C', '#283747','#B73225', '#004E7C', '#591COB', '#5C5F58', '#DCE1E3','#007CC7', '#4DA8DA',  '#EEFBFB','#12232E', '#203647','#164A41', '#4D774E', '#9DC88D', '#F1B24A','#164A41', '#4D774E', '#9DC88D', '#F1B24A','#F7E8E6', '#FA28089','#2d545e','#f9c5bd', '#0f2862', '#6B7A8F', '#dea6af','#8cbcd0 ' ],
        8:[ '#283747']//, '#007CC7',,'#20639B''#004E7C',
    };

    let color_scheme=1;//select color scheme

    //Those two function makes the random choice of colors for the cards more likely not to have the same color in cards next to each other
    const toggleColor=function (col){
        myColors[color_scheme].push(col);
    }

    const changeColor= async function(){
        let color=myColors[color_scheme].splice(Math.floor(Math.random() * (myColors[color_scheme].length-3)),1);
        toggleColor(color);
        return color;
    }

    return (  
        <>
            {props.surveys.map((s) => ((s.survey_title.toLowerCase().indexOf(props.filter ? props.filter.toLowerCase() : props.filter)!==-1) || (!props.filter) ) ? 
                <>
                    <SurveyCard key={s.survey_id} id={s.survey_id} title={s.survey_title} nusers={s.nusers} setad={props.setad} backgroundColor={props.backgroundColor} getColor={changeColor} />
                </> : null
            )}  
        </>     
    );
}


export default AdminSurveyList