$(document).on("pagecontainershow", () => {
  const pageId = $('body').pagecontainer('getActivePage').prop('id');

  //Load Team List
  if(pageId === "team"){
    const $alert = $(".table-team-list").find(".alert");

    ajaxHandler('get', '/api/v1/teams', {}, 'session')
    .then(msg => {
      const message = JSON.parse(msg);

      if(message.type){
        alertHandler($alert, "danger", message.message);
      }else{
        const $trList = [];

        message.forEach(user => {
          const { TeamId, OwnerId, Name, Website } = user;

          $trList.push(`
            <tr>
              <td>${TeamId}</td>
              <td>${Name}</td>
              <td>${Website || ''}</td>
              <td><a href="#team-detail" data-id="${TeamId}" class="team-link-detail ui-btn ui-icon-plus ui-btn-icon-notext ui-corner-all">Detail</a></td>
            </tr>
          `);
        })
        $(".tbody-team").html($trList);
      }
    })
    .then(() => {
      //Add Eventhandler for Userdetail
      $(".team-link-detail").click(function(e){
        //Bug Arrowfunction not working here
        const currentId = $(this).attr("data-id");
        window.currentId = currentId;
      })
    })
    .fail(msg => {
      alertHandler($alert, "danger", "Server Error");
    })
  }

  //Load  Teamdetail List
  if(pageId === "team-detail") {
    const currentTeamId = window.currentId;

    if(currentTeamId){
      const $alert = $(".wrapper-listview-team-detail").find(".alert");

      ajaxHandler('get', `/api/v1/teams/${currentTeamId}`, {}, 'session')
      .then(msg => {
        const message = JSON.parse(msg);

        if(message.type){
          alertHandler($alert, "danger", message.message);
        }else{
          const $liList = [];

          message.forEach(user => {
            const { TeamId, OwnerId, Name, Website } = user;

            $liList.push(`
              <li><label>TeamId</label> ${TeamId}</li>
              <li><label>Name</label> ${Name}</li>
              <li><label>Website</label> ${Website || ''}</li>
            `);
          })

          $(".listview-team-detail").html($liList).listview('refresh').trigger("create");
        }
      })
      .fail(msg => {
        alertHandler($alert, "danger", "Server Error");
      })
    }
  }

  //Read Entry for Teamedit
  if(pageId === "team-edit") {
    const currentTeamId = window.currentId;

    ajaxHandler('get', `/api/v1/teams/${currentTeamId}`, {}, 'session')
    .then(msg => {
      const message = JSON.parse(msg);
      const { Name, Website } = message[0];

      $("#name-team-edit").val(Name);
      $("#website-team-edit").val(Website);
    })
    .fail(msg => {
      alertHandler($alert, "danger", "Server Error");
    })
  }
})

$(function(){
  //Submit Team
  $("#team-add-form").submit(e => {
    e.preventDefault();

    const $alert = $(this).find(".alert");

    const ownerId = $.session.get('loggedInUserId');
    const $name = $("#name-team-add");
    const $website = $("#website-team-add");

    const data = {
      OwnerId: ownerId,
      Name: $name.val(),
      Website: $website.val()
    }

    ajaxHandler('post', '/api/v1/teams', data, 'session')
    .then(msg => {
      const message = JSON.parse(msg);

      if(message.type == "Warning" || message.type == "Error"){
        alertHandler($alert, "danger", message.message);
      }else{
        alertHandler($alert, "success", "Team created");
        $name.val("");
        $website.val("");
      }
    })
    .fail(msg => {
      alertHandler($alert, "danger", "Server Error");
    })
  })
  //Edit Team
  $("#team-edit-form").submit(e => {
    e.preventDefault();
    const currentTeamId = window.currentId;

    const $alert = $(this).find(".alert");

    const $name = $("#name-team-edit");
    const $website = $("#website-team-edit");

    const data = {
      Name: $name.val(),
      Website: $website.val()
    }

    ajaxHandler('put', `/api/v1/teams/${currentTeamId}`, data, 'session')
    .then(msg => {
      const message = JSON.parse(msg);

      if(message.type == "Warning" || message.type == "Error"){
        alertHandler($alert, "danger", message.message);
      }else{
        alertHandler($alert, "success", "Team edited");
      }
    })
    .fail(msg => {
      alertHandler($alert, "danger", "Server Error");
    })
  })

  //Add Eventhandler for Teamdelete
  $("#team-link-delete").click(e => {
    e.preventDefault();
    const currentTeamId = window.currentId;

    ajaxHandler('delete', `/api/v1/teams/${currentTeamId}`, {}, 'session')
    .then(msg => {
      $.mobile.pageContainer.pagecontainer("change", "#team");
    })
    .fail(msg => {
      alertHandler($alert, "danger", "Server Error");
    })
  })
})
