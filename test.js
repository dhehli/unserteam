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
