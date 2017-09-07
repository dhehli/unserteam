$(function(){
  if(!$.session.get('Authorization')){
    $.mobile.changePage("index.html");
  }
})
