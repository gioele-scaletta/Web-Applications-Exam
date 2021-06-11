/**
 * Information about an exam being passed
 */
 class Survey {
  
    constructor(survey_id, survey_title) {
      this.survey_id = survey_id;
      this.survey_title = survey_title;
  
    }
  
    
    static from(json) {
      return new Survey(json.survey_id, json.survey_title);
    }
  }
  
  export default Survey;
 