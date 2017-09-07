$(document).on("pagecontainershow", function () {

  const pageId = $('body').pagecontainer('getActivePage').prop('id');
  if(pageId === "member"){
    ajaxHandler('get', '/api/v1/users', {}, 'session' , function(msg){
      // TODO: Handler Errors and Warning
      if(Array.isArray(msg)){
        const $trList = [];

        msg.forEach(function(user){
          const { UserId, Active, LastName, FirstName, Email } = user;

          $trList.push(`
            <tr>
              <td>${FirstName}</td>
              <td>${LastName}</td>
              <td>${Email}</td>
              <td>${Active}</td>
            </tr>
          `);
        })

        $(".tbody-member").append($trList);
      }
    })
  }
})
