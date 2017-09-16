$(document).on("pagecontainershow", () => {
  const pageId = $('body').pagecontainer('getActivePage').prop('id');

  //Load Training List
  if(pageId === "training"){
    $alert = $(".table-training-list").find(".alert")

    ajaxHandler('get', '/api/v1/trainings', {}, 'session')
    .then(msg => {
      const message = JSON.parse(msg);
      if(message.type){
        alertHandler($alert, "danger", message.message);
      }else{
        const message = JSON.parse(msg);

        const $trList = [];

        message.forEach(training => {
          const { TrainingId, TeamId, Title, Date, Time } = training;

          ajaxHandler('get', `/api/v1/teams/${TeamId}`, {}, 'session')
          .then(msg => {
            const message = JSON.parse(msg);
            if(message.type){
              alertHandler($alert, "danger", message.message);
            }else{
              const { Name } = message[0];

              $trList.push(`
                <tr>
                  <td>${TrainingId}</td>
                  <td>${Title}</td>
                  <td>${Date}</td>
                  <td>${Time}</td>
                  <td>${Name}</td>
                  <td><a href="#training-detail" data-id="${TrainingId}" class="training-link-detail ui-btn ui-icon-plus ui-btn-icon-notext ui-corner-all">Detail</a></td>
                </tr>
              `);

              $(".tbody-training").html($trList);
            }
          }).then(() => {
            $(".training-link-detail").click(function(e){
              const currentId = $(this).attr("data-id");
              window.currentId = currentId;
            })
          })
          .fail(msg => {
            alertHandler($alert, "danger", "Server Error");
          })
        })
      }
    })
    .fail(msg => {
      alertHandler($alert, "danger", "Server Error");
    })
  }

  //Load  Teamdetail List
  if(pageId === "training-detail") {
    $alert = $(".alert-training");
    const currentTrainingId = window.currentId;

    if(currentTrainingId){
      ajaxHandler('get', `/api/v1/trainings/${currentTrainingId}`, {}, 'session')
      .then(msg => {
        const message = JSON.parse(msg);
        if(message.type){
          alertHandler($alert, "danger", message.message);
        }else{
          const $liList = [];

          message.forEach(training => {
            const {
              TrainingId, TeamId, Title, Date, Time, Duration, MinParticipants, Description
            } = training;

            ajaxHandler('get', `/api/v1/teams/${TeamId}`, {}, 'session')
            .then(msg => {
              const message = JSON.parse(msg);
              if(message.type){
                alertHandler($alert, "danger", message.message);
              }else{
                const { Name } = message[0];

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
              }
            })
            .fail(msg => {
              alertHandler($alert, "danger", "Server Error");
            })
          })
        }
      })
      .fail(msg => {
        alertHandler($alert, "danger", "Server Error");
      })
    }
  }

  //Load Training Select Field
  if(pageId === "training-add" || pageId === "training-edit"){
    ajaxHandler('get', '/api/v1/teams', {}, 'session')
    .then(msg => {
      const message = JSON.parse(msg);
      const $optionList = [];

      message.forEach(team => {
        const { TeamId, Name } = team;

        $optionList.push(`
          <option value="${TeamId}">${Name}</option>
        `);
      })
      $("#team-training-add").html($optionList);
      $("#team-training-edit").html($optionList);
    }).fail(msg => {
      alertHandler($alert, "danger", "Server Error");
    })
  }

  //Read Entry for Teamedit
  if(pageId === "training-edit") {
    const currentTrainingId = window.currentId;
    ajaxHandler('get', `/api/v1/trainings/${currentTrainingId}`, {}, 'session')
    .then(msg => {
      const message = JSON.parse(msg);
      const { TeamId, Title, Date, Time, Duration, MinParticipants, Description } = message[0];

      const teamId = $("#team-training-edit").val(TeamId).change();
      const title = $("#title-training-edit").val(Title);
      const date = $("#date-training-edit").val(Date);
      const time = $("#time-training-edit").val(Time);
      const duration = $("#duration-training-edit").val(Duration);
      const participants = $("#participants-training-edit").val(MinParticipants);
      const description = $("#description-training-edit").val(Description);
    })
    .fail(msg => {
      alertHandler($alert, "danger", "Server Error");
    })
  }
})

$(function(){
  //Add Training Form
  $("#training-add-form").submit(e => {
    e.preventDefault();
    const currentTeamId = window.currentId;

    const $alert = $(this).find(".alert");

    const $teamId = $("#team-training-add");
    const $title = $("#title-training-add");
    const $date = $("#date-training-add");
    const $time = $("#time-training-add");
    const $duration = $("#duration-training-add");
    const $participants = $("#participants-training-add");
    const $description = $("#description-training-add");

    const data = {
      TeamId: $teamId.val(),
      Title: $title.val(),
      Date: $date.val(),
      Time: $time.val(),
      Duration: $duration.val(),
      MinParticipants: $participants.val(),
      Description: $description.val()
    }

    ajaxHandler('post', '/api/v1/training', data, 'session')
    .then(msg => {
      const message = JSON.parse(msg);

      if(message.type == "Warning" || message.type == "Error"){
        alertHandler($alert, "danger", message.message);
      }else{
        alertHandler($alert, "success", "Training created");
        $teamId.val(""),
        $title.val(""),
        $date.val(""),
        $time.val(""),
        $duration.val(""),
        $participants.val(""),
        $description.val("")
      }
    })
    .fail(msg => {
      alertHandler($alert, "danger", "Server Error");
    })
  })

  //Edit Training
  $("#training-edit-form").submit(e => {
    e.preventDefault();
    const currentTrainingId = window.currentId;

    const $alert = $(this).find(".alert");

    const $teamId = $("#team-training-edit");
    const $title = $("#title-training-edit");
    const $date = $("#date-training-edit");
    const $time = $("#time-training-edit");
    const $duration = $("#duration-training-edit");
    const $participants = $("#participants-training-edit");
    const $description = $("#description-training-edit");

    const data = {
      TeamId: $teamId.val(),
      Title: $title.val(),
      Date: $date.val(),
      Time: $time.val(),
      Duration: $duration.val(),
      MinParticipants: $participants.val(),
      Description: $description.val()
    }

    ajaxHandler('put', `/api/v1/trainings/${currentTrainingId}`, data, 'session')
    .then(msg => {
      const message = JSON.parse(msg);

      if(message.type == "Warning" || message.type == "Error"){
        alertHandler($alert, "danger", message.message);
      }else{
        alertHandler($alert, "success", "Training edited");
      }
    })
    .fail(msg => {
      alertHandler($alert, "danger", "Server Error");
    })
  })

  //Add Eventhandler for Teamdelete
  $("#training-link-delete").click(e => {
    e.preventDefault();
    const currentTrainingId = window.currentId;

    ajaxHandler('delete', `/api/v1/trainings/${currentTrainingId}`, {}, 'session')
    .then(msg => {
      $.mobile.pageContainer.pagecontainer("change", "#training");
    })
    .fail(msg => {
      alertHandler($alert, "danger", "Server Error");
    })
  })
})
