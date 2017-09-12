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
       if(auth === "yes"){
         const { email, password } = data;
         xhr.setRequestHeader('Authorization', basicAuth(email, password));
       }else if (auth === "session") {
         xhr.setRequestHeader('Authorization', $.session.get('Authorization'));
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
  .fail(function(msg){
    console.error(msg);
  })
}
