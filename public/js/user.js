$(document).on("pagecontainershow", () => {
  const pageId = $('body').pagecontainer('getActivePage').prop('id');

  //Load User Liset
  if(pageId === "user"){
    const $alert = $(".table-user-list").find(".alert");

    ajaxHandler('get', '/api/v1/users', {}, 'session')
    .then(msg => {
      const message = JSON.parse(msg);

      if(message.type){
        alertHandler($alert, "danger", message.message);
      }else{
        const $trList = [];

        message.forEach(user => {
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
    })
    .then(() => {
      $(".user-link-detail").click(function(e){
        //Bug Arrowfunction not working here
        const currentId = $(this).attr("data-id");
        window.currentId = currentId;
      })
    })
    .fail(msg => {
      alertHandler($alert, "danger", "Server Error");
    })
  }

  //Load  Userdetail List
  if(pageId === "user-detail") {
    const currentUserId = window.currentId;

    if(currentUserId){
      const $alert = $(".table-user-detail").find(".alert");

      ajaxHandler('get', `/api/v1/users/${currentUserId}`, {}, 'session')
      .then(msg => {
        const message = JSON.parse(msg);

        if(message.type){
          alertHandler($alert, "danger", message.message);
        }else{
          const $trList = [];

          message.forEach(user => {
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
      .fail(msg => {
        alertHandler($alert, "danger", "Server Error");
      })
    }
  }

  //Read Entry for Useredit
  if(pageId === "user-edit") {
    ajaxHandler('get', `/api/v1/users/${$.session.get('loggedInUserId')}`, {}, 'session')
    .then(msg => {
      const message = JSON.parse(msg);
      const { UserId, Active, LastName, FirstName, Email } = message[0];

      $("#active-user-edit").val(Active).change();
      $("#firstname-user-edit").val(FirstName);
      $("#lastname-user-edit").val(LastName);
      $("#email-user-edit").val(Email);
        //$("#password-user-edit").val("123"); //Fake Entrys
    })
    .fail(msg => {
      alertHandler($alert, "danger", "Server Error");
    })
  }
})

//Edit User
$(function(){
  $("#user-edit-form").submit(e => {
    e.preventDefault();

    const $alert = $(this).find(".alert");

    const $active = $("#active-user-edit");
    const $firstName = $("#firstname-user-edit");
    const $lastName = $("#lastname-user-edit");
    const $eMail = $("#email-user-edit");
    //const $password = $("#password-user-edit");

    const data = {
      Active: $active.val(),
      FirstName: $firstName.val(),
      LastName: $lastName.val(),
      Email: $eMail.val()/*,
      Password: $password.val()*/
    }

    ajaxHandler('put', `/api/v1/users/${
      $.session.get('loggedInUserId')}`, data, 'session'
    )
    .then(msg => {
      const message = JSON.parse(msg);

      if(message.type == "Warning" || message.type == "Error"){
        alertHandler($alert, "danger", message.message);
      }else{
        alertHandler($alert, "success", "User updated");
      }
    })
    .fail(msg => {
      alertHandler($alert, "danger", "Server Error");
    })
  })
})
