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

          $trList.push(`
            <tr>
              <td>${TrainingId}</td>
              <td>${Title}</td>
              <td>${Date}</td>
              <td>${Time}</td>
              <td><a href="#training-detail" data-id="${TrainingId}" class="training-link-detail ui-icon-home">Detail</a></td>
            </tr>
          `);
        })

        $(".tbody-training").html($trList);
      }

      //Add Eventhandler for Userdetail
      $(".training-link-detail").click(function(e){
        const currentId = $(this).attr("data-id");
        window.currentId = currentId;
      })
    })
  }

  //Load  Teamdetail List
  if(pageId === "training-detail") {
    const currentTrainingId = window.currentId;

    if(currentTrainingId){
      ajaxHandler('get', `/api/v1/trainings/${currentTrainingId}`, {}, 'session' , function(msg){
        if(Array.isArray(msg)){
          const $trList = [];

          msg.forEach(function(training){
            const { TrainingId, TeamId, Title, Date, Time, Description } = training;

            $trList.push(`
              <tr>
                <td>${TeamId}</td>
                <td>${Name}</td>
                <td>${Website || ''}</td>
              </tr>
            `);
          })

          $(".tbody-team-detail").html($trList);
        }
      })
    }
  }

  //Load Training Select Field
  if(pageId === "training-add"){
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
      }
    })
  }

  //Read Entry for Teamedit
  if(pageId === "team-edit") {
    const currentTeamId = window.currentId;
    ajaxHandler('get', `/api/v1/teams/${currentTeamId}`, {}, 'session' , function(msg){
      const { Name, Website } = msg[0];
      $("#name-team-edit").val(Name);
      $("#website-team-edit").val(Website);
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

  //Submit Team
  $("#training-add-form").submit(function(e){
    e.preventDefault();

    const $alert = $(this).find(".alert");

    const ownerId = $.session.get('loggedInUserId');
    const name = $("#name-team-add").val();
    const website = $("#website-team-add").val();

    const data = {
      OwnerId: ownerId,
      Name: name,
      Website: website
    }

    ajaxHandler('post', '/api/v1/teams', data, 'session' , function(msg){
      if(msg.type == "Warning" || msg.type == "Error"){
        $alert.addClass("alert-danger");
        $alert.text(msg.message);
      }else{
        $alert.addClass("alert-success");
        $alert.html("Team created, go back to the <a href='#team'>List</a>");
      }
    })
  })

  //Add Eventhandler for Teamdelete
  $("#team-link-delete").click(function(e){
    const currentTeamId = window.currentId;
    e.preventDefault();

    ajaxHandler('delete', `/api/v1/teams/${currentTeamId}`, {}, 'session' , function(msg){
      $.mobile.pageContainer.pagecontainer("change", "#team");
    })
  })
})
