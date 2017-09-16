const baseURI = "https://zbw.lump.ch";

// TODO: Add Doc to Methods http://yui.github.io/yuidoc/
/**
* This is the description for my class.
*
* @class MyClass
* @constructor
*/

function basicAuth(user, password) {
  const tok = user + ':' + password;
  const hash = btoa(tok);
  return "Basic " + hash;
}

//Basic AjaxHandler
function ajaxHandler(method, url, data, auth){
  return $.ajax({
    method: method,
    url: baseURI + url,
    data: JSON.stringify(data),
    beforeSend(xhr){
       $.mobile.loading('show');
       if(auth === "yes"){
         const { email, password } = data;
         xhr.setRequestHeader('Authorization', basicAuth(email, password));
       }else if (auth === "session") {
         xhr.setRequestHeader('Authorization', $.session.get('Authorization'));
       }
    },
    complete(){
      $.mobile.loading('hide');
    }
  })
}

//Basic Alert Handler for Formerrors
function alertHandler($element, type, message){
  $element.show();
  if(type === "success"){
    return $element.addClass("alert-success").html(message);
  }else if(type === "danger"){
    return $element.addClass("alert-danger").html(message);
  }
}

//Hook to check if user is has session
$(document).on("pagecontainershow", () => {
  $(".alert").hide();
  const pageId = $('body').pagecontainer('getActivePage').prop('id');
  if(pageId === "user" && !$.session.get('Authorization')){
    $.mobile.pageContainer.pagecontainer("change", "#welcome");
  }

  //Handle Logout
  $("#logout").click(e => {
    $.session.remove('Authorization');
    $.mobile.pageContainer.pagecontainer("change", "#welcome");
  })
})
