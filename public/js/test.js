$(function(){
  const baseURI = "https://zbw.lump.ch";

  //Basic AjaxHandler
  function ajaxHandler(method, url, data, cb){
    $.ajax({
      method: method,
      url: baseURI + url,
      data: JSON.stringify(data),
      beforeSend: function() {
         $.mobile.loading('show');
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

  //FirstAuthentication with session
  function ajaxFirstAuth(){
    function basicAuth(user, password) {
      var tok = user + ':' + password;
      var hash = btoa(tok);
      return "Basic " + hash;
    }

    $.ajax
      ({
        type: "GET",
        url: baseURI + "/api/v1/users",
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', basicAuth(eMail, password));
            $.session.set('authString', basicAuth(eMail, password));
            console.log($.session.get('authString'))
        },
        success: function (msg){
            console.log(msg);
        }
    });
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

    ajaxHandler('post', '/api/v1/register', data, function(msg){
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

      const eMail = $("#email").val();
      const password = $("#password").val();

      const data = {
        Email: eMail,
        Password: password
      }


  })
})
