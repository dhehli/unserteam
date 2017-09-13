$(document).on("pagecontainershow", function () {
  const pageId = $('body').pagecontainer('getActivePage').prop('id');

  //Load Team List
  if(pageId === "team"){
    ajaxHandler('get', '/api/v1/teams', {}, 'session' , function(msg){
      // TODO: Handler Errors and Warning
      if(Array.isArray(msg)){
        const $trList = [];

        msg.forEach(function(user){
          const { TeamId, OwnerId, Name, Website } = user;

          $trList.push(`
            <tr>
              <td>${TeamId}</td>
              <td>${Name}</td>
              <td>${Website || ''}</td>
              <td><a href="#team-detail" data-id="${TeamId}" class="team-link-detail ui-icon-home">Detail</a></td>
            </tr>
          `);
        })

        $(".tbody-team").html($trList);
      }

      //Add Eventhandler for Userdetail
      $(".team-link-detail").click(function(e){
        const currentId = $(this).attr("data-id");
        window.currentId = currentId;
      })
    })
  }

  //Load  Teamdetail List
  if(pageId === "team-detail") {
    const currentTeamId = window.currentId;

    if(currentTeamId){
      ajaxHandler('get', `/api/v1/teams/${currentTeamId}`, {}, 'session' , function(msg){
        if(Array.isArray(msg)){
          const $trList = [];

          msg.forEach(function(user){
            const { TeamId, OwnerId, Name, Website } = user;

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
  //Submit Team
  $("#team-add-form").submit(function(e){
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
  //Edit Team
  $("#team-edit-form").submit(function(e){
    e.preventDefault();
    const currentTeamId = window.currentId;

    const $alert = $(this).find(".alert");

    const name = $("#name-team-edit").val();
    const website = $("#website-team-edit").val();

    const data = {
      Name: name,
      Website: website
    }

    ajaxHandler('put', `/api/v1/teams/${currentTeamId}`, data, 'session' , function(msg){
      if(msg.type == "Warning" || msg.type == "Error"){
        $alert.addClass("alert-danger");
        $alert.text(msg.message);
      }else{
        $alert.addClass("alert-success");
        $alert.html("Team edited, go back to the <a href='#team-detail'>Detail</a>");
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
