$(function(){
  //Submit SignupForm
  $("#signup-form").submit(e => {
    e.preventDefault();

    const $alert = $(this).find(".alert");

    const $active = $("#active-signup");
    const $firstName = $("#firstname-signup");
    const $lastName = $("#lastname-signup");
    const $eMail = $("#email-signup");
    const $password = $("#password-signup");

    const data = {
      Active: $active.val(),
      FirstName: $firstName.val(),
      LastName: $lastName.val(),
      Email: $eMail.val(),
      Password: $password.val()
    }

    ajaxHandler('post', '/api/v1/register', data, 'no')
    .then(msg => {
      const message = JSON.parse(msg);

      if(message.type == "Warning" || message.type == "Error"){
        alertHandler($alert, "danger", message.message);
      }else{
        alertHandler($alert, "success", "User created");
        $active.val("");
        $firstName.val("");
        $lastName.val("");
        $eMail.val("");
        $password.val("");
      }
    })
    .fail(msg => {
      alertHandler($alert, "danger", "Server Error");
    })
  })

  //Login Form
  $("#signin-form").submit(e => {
    e.preventDefault();

    const $alert = $(this).find(".alert");

    const $email = $("#email-signin");
    const $password = $("#password-signin");

    const data = {
      email: $email.val(),
      password: $password.val()
    }

    ajaxHandler('get', '/api/v1/users', data, 'yes')
    .then(msg => {
      const message = JSON.parse(msg);

      if(message.type == "Warning" || message.type == "Error"){
        alertHandler($alert, "danger", message.message);
      }else{
        //Read UserID over Email and set Session for Logged in User and Auth
        const userId = message.find(x => x.Email === $email.val()).UserId
        $.session.set('loggedInUserId', userId);
        $.session.set('Authorization', basicAuth($email.val(), $password.val()));
        $.mobile.pageContainer.pagecontainer("change", "#user");
        $email.val("");
        $password.val("");
      }
    })
    .fail(msg => {
      alertHandler($alert, "danger", "Server Error");
    })
  })
})
