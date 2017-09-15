$(document).on("pagecontainershow", function () {
  const pageId = $('body').pagecontainer('getActivePage').prop('id');

  //Load User Liset
  if(pageId === "user"){
    ajaxHandler('get', '/api/v1/users', {}, 'session' , function(msg){
      // TODO: Handler Errors and Warning
      if(Array.isArray(msg)){
        const $trList = [];

        msg.forEach(function(user){
          const { UserId, Active, LastName, FirstName, Email } = user;

          $trList.push(`
            <tr>
              <td>${FirstName}</td>
              <td>${LastName}</td>
              <td>${Email}</td>
              <td>${Active}</td>
              <td><a href="#user-detail" data-id="${UserId}" class="user-link-detail ui-btn ui-icon-plus ui-btn-icon-notext ui-corner-all">Detail</a></td>
            </tr>
          `);
        })

        $(".tbody-user").html($trList);
      }

      //Add Eventhandler for Userdetail
      $(".user-link-detail").click(function(e){
        const currentId = $(this).attr("data-id");
        window.currentId = currentId;
      })
    })
  }

  //Load  Userdetail List
  if(pageId === "user-detail") {
    const currentUserId = window.currentId;

    if(currentUserId){
      ajaxHandler('get', `/api/v1/users/${currentUserId}`, {}, 'session' , function(msg){
        if(Array.isArray(msg)){
          const $trList = [];

          msg.forEach(function(user){
            const { UserId, Active, LastName, FirstName, Email } = user;

            $trList.push(`
              <tr>
                <td>${FirstName}</td>
                <td>${LastName}</td>
                <td>${Email}</td>
                <td>${Active}</td>
              </tr>
            `);
          })

          $(".tbody-user-detail").html($trList);
        }
      })
    }
  }

  //Read Entry for Useredit
  if(pageId === "user-edit") {
    ajaxHandler('get', `/api/v1/users/${$.session.get('loggedInUserId')}`, {}, 'session' , function(msg){
      const { UserId, Active, LastName, FirstName, Email } = msg[0];
      $("#active-user-edit").val(Active).change();
      $("#firstname-user-edit").val(FirstName);
      $("#lastname-user-edit").val(LastName);
      $("#email-user-edit").val(Email);
      $("#password-user-edit").val("123"); //Fake Entry
    })
  }
})

//Edit User
$(function(){
  $("#user-edit-form").submit(function(e){
    e.preventDefault();

    const $alert = $(this).find(".alert");

    const active = $("#active-user-edit").val();
    const firstName = $("#firstname-user-edit").val();
    const lastName = $("#lastname-user-edit").val();
    const eMail = $("#email-user-edit").val();
    //const password = $("#password-user-edit").val();

    const data = {
      Active: active,
      FirstName: firstName,
      LastName: lastName,
      Email: eMail/*,
      Password: password*/
    }

    ajaxHandler('put', `/api/v1/users/${
      $.session.get('loggedInUserId')}`, data, 'session' , function(msg){
      if(msg.type == "Warning" || msg.type == "Error"){
        $alert.addClass("alert-danger");
        $alert.text(msg.message);
      }else{
        $alert.addClass("alert-success");
        $alert.html("User updated");
      }
    })
  })
})
