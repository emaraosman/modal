$(document).ready(function() {

  getData() //retrieves data when page loads

  $("#open-modal-button").on("click", function(){
    $(".modal").css({"display":"block",})
  })

  $(".close-modal, #cancel-button").on("click", function(){
    $(".modal").css({"display":"none",})
  })

  $("#save-button").on("click", function(){
    saveChanges()
    $(".modal").css({"display":"none",})
  })

  ////////////////////////////////////////////////
  // VALIDATIONS BELOW:

  //Validation to only allow numeric entries in monetary sections:
  $("#ee-contribution, #ee-percentage, #er-contribution, #er-contribution").on('keypress', function (event) {
    var regex = new RegExp("[0-9]");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
       event.preventDefault();
       console.log("validation preventing non-numeric chars")
       return false;
    }
  });

  //Validation to only allow text and spaces for names section:

  $("#dependents-input").on('keypress', function (event) {
    var regex = new RegExp("^[a-zA-Z, ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
       event.preventDefault();
       console.log("validation preventing everything but letters and spaces")
       return false;
    }
  });

  /////////////////////////////////
  // DATA retrieval funcition and form population function below:

  function getData(){
    $.ajax({
      method: 'GET',
      url: "https://api.myjson.com/bins/13su96",
      data: $('form').serialize(),
      dataType: 'json',
      success: dataLoadSuccess //run this function to place data in modal fields
    });
    function dataLoadSuccess(data){
      console.log("RECIEVED DATA FROM API: ", data)
      //////////////////////////////////////////////
      // BELOW FILLS ALL MODAL FIELDS WITH CURRENT DATA
      //

      $("#health-subcategory").text(data.subcategory);

      // health-plan-picker data load:
      $("#health-plan-picker").append("<option selected='true' value=" + data.health_plan_selected + "  >" + data.health_plan_type[data.health_plan_selected]+ "</option>");
      Object.values(data.health_plan_type).map(function (key, item) {
        $("#health-plan-picker").append($('<option></option>').attr('value', item).text(key));
      });

      $("#date-picker").text(data.effective_date);

      // Coverage level data load:
      $("#coverage-level-picker").append("<option selected='true' value=" + data.coverage_level_selected + ">" + data.coverage_level_type[data.coverage_level_selected]+ "</option>");
      Object.values(data.coverage_level_type).map(function (key, item) {
        $("#coverage-level-picker").append($('<option></option>').attr('value', item).text(key));
      });

      // EE Contribution data load:
      $("#ee-contribution").val(data.ee_contribution);
      $("#ee-percentage").val(data.ee_percentage);
      $("#er-contribution").val(data.er_contribution);
      $("#er-percentage").val(data.er_percentage);

      //Dependents data load:
      if(data.dependents_enabled){ //Handles if dependents is true or false on checkbox
        $("#dependents-boolean").prop('checked', true);
      } else {
        $("#dependents-boolean").prop('checked', false);
      }

      $("#dependents-input").val(data.dependent_list);

      //Waive data load:
      if(data.waive_enabled){ //Handles if dependents is true or false on checkbox
        $("#waive-boolean").prop('checked', true);
      } else {
        $("#waive-boolean").prop('checked', false);
      }

      $("#waive-reason-picker").append("<option selected='true' value=" + data.reason_selected + ">" + data.reason_list[data.reason_selected]+ "</option>");
      Object.values(data.reason_list).map(function (key, item) {
        $("#waive-reason-picker").append($('<option></option>').attr('value', item).text(key));
      });


    }//end of data field entries function (dataLoadSuccess)
  }//end of getData()

  ////////////////////////////////////////////////
  // SAVE + SUBMIT BUTTON FUNCTION BEGINS BELOW:
  function saveChanges(){

    // This section will attach the updated values to a list of variables to be used in the updatedData object POST request
    let subcategory = $("#health-subcategory").text();
    let date = $("#date-picker").text();
    let healthPlanSelected = parseInt($("#health-plan-picker").val());
    let coverageLevelSelected = parseInt($("#coverage-level-picker").val());
    let eeContribution = parseInt($("#ee-contribution").val());
      if(!eeContribution){
        eeContribution = 0;
      }
    let eePercentage = parseInt($("#ee-percentage").val());
      if(!eePercentage){
        eePercentage = 0;
      }
    let erContribution = parseInt($("#er-contribution").val());
      if(!erContribution){
        erContribution = 0;
      }
    let erPercentage = parseInt($("#er-percentage").val());
      if(!erPercentage){
        erPercentage = 0;
      }
    let dependentsEnabled = $("#dependents-boolean").prop('checked');
    let dependentsList = $("#dependents-input").val();
      if(dependentsList == ""){
        dependentsList = null;
      }else{
        dependentsList = dependentsList.replace(/\s*,\s*/g, ",").split(",");
      }
    let waiveEnabled = $("#waive-boolean").prop('checked');
    let reasonSelected = parseInt($("#waive-reason-picker").val());

    // updatedData is the object that we can attach to our Ajax POST request
    let updatedData = {
      "subcategory": subcategory,
      "effective_date": date,
      "health_plan_selected": healthPlanSelected,
      "coverage_level_selected": coverageLevelSelected,
      "ee_contribution": eeContribution,
      "ee_percentage": eePercentage,
      "er_contribution": erContribution,
      "er_percentage": erPercentage,
      "dependents_enabled": dependentsEnabled,
      "dependent_list": dependentsList,
      "waive_enabled": waiveEnabled,
      "reason_selected": reasonSelected,
    }

    htmlUpdatedData = JSON.stringify(updatedData, null, "\t");
    $("#saved-data-response").text(htmlUpdatedData);

    console.log("SAVED DATA RESPONSE: ", updatedData)
  }


})//end of document.ready
