//Hook to check if user is has session
// TODO: chane that works always
$(document).on("pagecontainershow", function () {
  const pageId = $('body').pagecontainer('getActivePage').prop('id');
  if(!$.session.get('Authorization')){
    $.mobile.pageContainer.pagecontainer("change", "#welcome");
  }
})

$(function(){
  //Submit SignupForm
  $("#signup-form").submit(function(e){
    e.preventDefault();

    const $alert = $(this).find(".alert");

    const active = $("#active-signup").val();
    const firstName = $("#firstname-signup").val();
    const lastName = $("#lastname-signup").val();
    const eMail = $("#email-signup").val();
    const password = $("#password-signup").val();

    const data = {
      Active: active,
      FirstName: firstName,
      LastName: lastName,
      Email: eMail,
      Password: password
    }

    ajaxHandler('post', '/api/v1/register', data, 'no' , function(msg){
      if(msg.type == "Warning" || msg.type == "Error"){
        $alert.addClass("alert-danger");
        $alert.text(msg.message);
      }else{
        $alert.addClass("alert-success");
        $alert.html("User created, go back to the <a href='#sign-in'>login Form</a>");
      }
    })
  })

  //Login Form
  $("#signin-form").submit(function(e){
    e.preventDefault();

    const $alert = $(this).find(".alert");

    const email = $("#email-signin").val();
    const password = $("#password-signin").val();

    const data = {
      email: email,
      password: password
    }

    ajaxHandler('get', '/api/v1/users', data, 'yes', function(msg){
      console.log(msg)
      if(msg.type == "Warning" || msg.type == "Error"){
        $alert.addClass("alert-danger");
        $alert.text(msg.message);
      }else{
        //Read UserID over Email and set Session for Logged in User and Auth
        const userId = msg.find(x => x.Email === email).UserId
        $.session.set('loggedInUserId', userId);
        $.session.set('Authorization', basicAuth(email, password));
        $.mobile.pageContainer.pagecontainer("change", "#user");
      }
    })
  })

  //Handle Logout
  $("#logout").click(function(e){
    $.session.remove('Authorization');
    $.mobile.pageContainer.pagecontainer("change", "#welcome");
  })
})
