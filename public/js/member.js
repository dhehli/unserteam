$(document).on("pagecontainershow", function () {
  const pageId = $('body').pagecontainer('getActivePage').prop('id');

  //Load Team and Members
  if(pageId === "member"){
    ajaxHandler('get', '/api/v1/teams', {}, 'session' , function(msg){
      // TODO: Handler Errors and Warning
      if(Array.isArray(msg)){
        const fieldsetList = [];

        msg.forEach(function(user, index){
          const { TeamId, Name } = user;

          fieldsetList.push(`
            <fieldset data-role="collapsible" data-id=${TeamId}>
              <legend>${Name}</legend>
            </fieldset>
          `);

          $("#member-add-form").html(fieldsetList).trigger('create');

          ajaxHandler('get', '/api/v1/users', {}, 'session' , function(msg){
            // TODO: Handler Errors and Warning
            if(Array.isArray(msg)){
              const $divGroup = $('<div data-role="controlgroup">');
              const $formElementList = [];

              msg.forEach(function(user){
                const { UserId, LastName, FirstName } = user;

                $formElementList.push(`
                  <input
                    class="cb-member-add" type="checkbox"
                    name="checkbox-${TeamId}-${UserId}"
                    id="checkbox-${TeamId}-${UserId}"
                    data-team-id=${TeamId}
                    data-user-id=${UserId}
                  >
                  <label for="checkbox-${TeamId}-${UserId}">${FirstName} ${LastName}</label>
                `);
              })
              $divGroup.html($formElementList);

              $("#member-add-form fieldset[data-id='" + TeamId  + "'] .ui-collapsible-content").html($divGroup).trigger('create');

              //Add Change Eventhandler
              $(".cb-member-add").change(function(){
                const { teamId, userId } = $(this).prop("dataset")
                if($(this).is(":checked")){
                    const data = {
                      TeamId: teamId,
                      UserId: userId
                    }
                    ajaxHandler('post', '/api/v1/members', {}, 'session' , function(msg){

                    }
                }else{
                    console.log("unchecked")
                }

                console.log(teamId, userId)
              })
            }
          })
        })
      }
    })
  }
})
