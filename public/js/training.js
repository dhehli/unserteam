$(document).on("pagecontainershow", function () {
  const pageId = $('body').pagecontainer('getActivePage').prop('id');

  //Load Training List
  if(pageId === "training"){
    ajaxHandler('get', '/api/v1/trainings', {}, 'session' , function(msg){
      // TODO: Handler Errors and Warning
      if(Array.isArray(msg)){
        const $trList = [];

        msg.forEach(function(training){
          const { TrainingId, TeamId, Title, Date, Time } = training;

          ajaxHandler('get', `/api/v1/teams/${TeamId}`, {}, 'session' , function(msg){
            // TODO: Handler Errors and Warning
            const { Name } = msg[0];

            $trList.push(`
              <tr>
                <td>${TrainingId}</td>
                <td>${Title}</td>
                <td>${Date}</td>
                <td>${Time}</td>
                <td>${Name}</td>
                <td><a href="#training-detail" data-id="${TrainingId}" class="training-link-detail ui-icon-home">Detail</a></td>
              </tr>
            `);

            $(".tbody-training").html($trList);

            //Add Eventhandler for Userdetail
            $(".training-link-detail").click(function(e){
              const currentId = $(this).attr("data-id");
              window.currentId = currentId;
            })
          })
        })
      }
    })
  }

  //Load  Teamdetail List
  if(pageId === "training-detail") {
    const currentTrainingId = window.currentId;

    if(currentTrainingId){
      ajaxHandler('get', `/api/v1/trainings/${currentTrainingId}`, {}, 'session' , function(msg){
        if(Array.isArray(msg)){
          const $liList = [];

          msg.forEach(function(training){
            const {
              TrainingId, TeamId, Title, Date, Time, Duration, MinParticipants, Description
            } = training;

            ajaxHandler('get', `/api/v1/teams/${TeamId}`, {}, 'session' , function(msg){
              // TODO: Handler Errors and Warning
              const { Name } = msg[0];

              $liList.push(`
                <li><label>TrainingId</label> ${TrainingId}</li>
                <li><label>Title</label> ${Title}</li>
                <li><label>Team</label> ${Name}</li>
                <li><label>Date</label> ${Date}</li>
                <li><label>Time</label> ${Time}</li>
                <li><label>Duration</label> ${Duration || ''}</li>
                <li><label>MinParticipants</label> ${MinParticipants || ''}</li>
                <li><label>Description</label> ${Description || ''}</li>
              `);

              $(".listview-training-detail").html($liList).listview('refresh').trigger("create");
            })
          })
        }
      })
    }
  }

  //Load Training Select Field
  if(pageId === "training-add" || pageId === "training-edit"){
    ajaxHandler('get', '/api/v1/teams', {}, 'session' , function(msg){
      // TODO: Handler Errors and Warning
      if(Array.isArray(msg)){
        const $optionList = [];

        msg.forEach(function(team){
          const { TeamId, Name } = team;

          $optionList.push(`
            <option value="${TeamId}">${Name}</option>
          `);
        })

        $("#team-training-add").html($optionList);
        $("#team-training-edit").html($optionList);

      }
    })
  }

  //Read Entry for Teamedit
  if(pageId === "training-edit") {
    const currentTrainingId = window.currentId;
    ajaxHandler('get', `/api/v1/trainings/${currentTrainingId}`, {}, 'session' , function(msg){
      const { TeamId, Title, Date, Time, Duration, MinParticipants, Description } = msg[0];

      const teamId = $("#team-training-edit").val(TeamId).change();
      const title = $("#title-training-edit").val(Title);
      const date = $("#date-training-edit").val(Date);
      const time = $("#time-training-edit").val(Time);
      const duration = $("#duration-training-edit").val(Duration);
      const participants = $("#participants-training-edit").val(MinParticipants);
      const description = $("#description-training-edit").val(Description);
    })
  }
})

$(function(){
  //Add Training Form
  $("#training-add-form").submit(function(e){
    e.preventDefault();
    const currentTeamId = window.currentId;

    const $alert = $(this).find(".alert");

    const teamId = $("#team-training-add").val();
    const title = $("#title-training-add").val();
    const date = $("#date-training-add").val();
    const time = $("#time-training-add").val();
    const duration = $("#duration-training-add").val();
    const participants = $("#participants-training-add").val();
    const description = $("#description-training-add").val();

    const data = {
      TeamId: teamId,
      Title: title,
      Date: date,
      Time: time,
      Duration: duration,
      MinParticipants: participants,
      Description: description
    }

    ajaxHandler('post', '/api/v1/training', data, 'session' , function(msg){
      console.log(msg)
      if(msg.type == "Warning" || msg.type == "Error"){
        $alert.addClass("alert-danger");
        $alert.text(msg.message);
      }else{
        $alert.addClass("alert-success");
        $alert.html("Training added, go back to the <a href='#training'>List</a>");
      }
    })
  })

  //Edit Training
  $("#training-edit-form").submit(function(e){
    e.preventDefault();
    const currentTrainingId = window.currentId;

    const $alert = $(this).find(".alert");

    const teamId = $("#team-training-edit").val();
    const title = $("#title-training-edit").val();
    const date = $("#date-training-edit").val();
    const time = $("#time-training-edit").val();
    const duration = $("#duration-training-edit").val();
    const participants = $("#participants-training-edit").val();
    const description = $("#description-training-edit").val();

    const data = {
      TeamId: teamId,
      Title: title,
      Date: date,
      Time: time,
      Duration: duration,
      MinParticipants: participants,
      Description: description
    }

    ajaxHandler('put', `/api/v1/trainings/${currentTrainingId}`, data, 'session' , function(msg){
      console.log(msg)
      if(msg.type == "Warning" || msg.type == "Error"){
        $alert.addClass("alert-danger");
        $alert.text(msg.message);
      }else{
        $alert.addClass("alert-success");
        $alert.html("Training edited, go back to the <a href='#training'>List</a>");
      }
    })
  })

  //Add Eventhandler for Teamdelete
  $("#training-link-delete").click(function(e){
    e.preventDefault();
    const currentTrainingId = window.currentId;
    console.log(currentTrainingId);

    ajaxHandler('delete', `/api/v1/trainings/${currentTrainingId}`, {}, 'session' , function(msg){
      $.mobile.pageContainer.pagecontainer("change", "#training");
    })
  })
})
