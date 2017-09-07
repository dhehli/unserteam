$(function(){
  const baseURI = "https://zbw.lump.ch";

  //Basic AjaxHandler
  function ajaxHandler(method, url, data, cb){
    $.ajax({
      method: method,
      url: baseURI + url,
      data: JSON.stringify(data)
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
})
