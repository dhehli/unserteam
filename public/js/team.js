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
      console.log(msg)
      if(msg.type == "Warning" || msg.type == "Error"){
        $alert.addClass("alert-danger");
        $alert.text(msg.message);
      }else{
        $alert.addClass("alert-success");
        $alert.html("Team created, go back to the <a href='#team'>List</a>");
      }
    })
  })
})

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
})
