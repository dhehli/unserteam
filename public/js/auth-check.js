$(function(){
  if(!$.session.get('Authorization')){
    $.mobile.changePage("sign-in.html");
  }
})
