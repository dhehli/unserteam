//Hook to check if user is has session
$(document).on("pagecontainershow", function () {
  const pageId = $('body').pagecontainer('getActivePage').prop('id');
  if(pageId === "member" && !$.session.get('Authorization')){
    $.mobile.pageContainer.pagecontainer("change", "#welcome");
  }
})

$(function(){
  const baseURI = "https://zbw.lump.ch";

  //FirstAuthentication with session
  function basicAuth(user, password) {
    const tok = user + ':' + password;
    const hash = btoa(tok);
    return "Basic " + hash;
  }

  //Basic AjaxHandler
  function ajaxHandler(method, url, data, auth, cb){
    $.ajax({
      method: method,
      url: baseURI + url,
      data: JSON.stringify(data),
      beforeSend: function(xhr) {
         $.mobile.loading('show');
         if(auth == "yes"){
           const { email, password } = data;
           xhr.setRequestHeader('Authorization', basicAuth(email, password));
         }
      },
      complete: function() {
        $.mobile.loading('hide');
      }
    })
    .done(function( msg ) {
      const message = JSON.parse(msg);
      cb(message);
    })
  }

  //Submit SignupForm
  $("#signup-form").submit(function(e){
    e.preventDefault();

    const $alert = $(this).find(".alert");

    const active = $("#active").val();
    const firstName = $("#firstname").val();
    const lastName = $("#lastname").val();
    const eMail = $("#email").val();
    const password = $("#password").val();

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
        $alert.html("User created, go back to the <a href='sign-in.html'>login Form</a>");
      }
    })
  })

  //Login Form
  $("#signin-form").submit(function(e){
    e.preventDefault();

    const $alert = $(this).find(".alert");

    const email = $("#email").val();
    const password = $("#password").val();

    const data = {
      email: email,
      password: password
    }

    ajaxHandler('get', '/api/v1/users', data, 'yes', function(msg){
      if(msg.type == "Warning" || msg.type == "Error"){
        $alert.addClass("alert-danger");
        $alert.text(msg.message);
      }else{
        $alert.text("");
        $.session.set('Authorization', basicAuth(email, password));
        $.mobile.pageContainer.pagecontainer("change", "#member");
      }
    });
  })

  //Handle Logout
  $("#logout").click(function(e){
    console.log("logout");
    $.session.remove('Authorization');
    $.mobile.pageContainer.pagecontainer("change", "#welcome");
  })

  //

})
