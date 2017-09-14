$(document).on("pagebeforeshow", function () {
  const pageId = $('body').pagecontainer('getActivePage').prop('id');

  //Load Team and Members
  if(pageId === "team-detail"){
    const teamId = window.currentId;

    function loadAddedMembers(){
      //Load Memberlist of currentTeam
      ajaxHandler('get', `/api/v1/teams/${teamId}`, {}, 'session' , function(msg){
        // TODO: Handler Errors and Warning
        if(Array.isArray(msg)){
          const { Members } = msg[0];

          if(Array.isArray(Members)){
            const userIdArr = [];

            Members.forEach(function(member){
              const { UserId, MemberId } = member;
              userIdArr.push({UserId, MemberId})
            })

            const $liList = [];

            userIdArr.forEach(function(user){
              const { UserId, MemberId } = user;
              ajaxHandler('get', `/api/v1/users/${UserId}`, {}, 'session' , function(msg){
                  const { UserId, Active, LastName, FirstName, Email } = msg[0];

                  $liList.push(`
                    <li data-icon="delete"><a href="#" class="remove-member-link" data-id="${MemberId}">${FirstName} ${LastName}</a></li>
                  `);

                  $(".member-list-added").html($liList).listview('refresh').trigger("create");

                  $(".remove-member-link").click(function(e){
                    e.preventDefault();
                    const memberId = $(this).attr("data-id");
                    ajaxHandler('delete', `/api/v1/members/${memberId}`, {}, 'session' , function(msg){
                      console.log(msg)
                      $(".member-list-added").listview('refresh').trigger("create");
                      loadAddedMembers();
                    })
                  })
              })
            })
          }
        }
      })
    }
    loadAddedMembers();

    function loadAllMembers(){
      //Load User List
      ajaxHandler('get', '/api/v1/users', {}, 'session' , function(msg){
        // TODO: Handler Errors and Warning
        if(Array.isArray(msg)){
          const $liList = [];

          msg.forEach(function(user){
            const { UserId, Active, LastName, FirstName, Email } = user;

            $liList.push(`
              <li data-icon="plus"><a href="#" class="add-member-link" data-id="${UserId}">${FirstName} ${LastName}</a></li>
            `);
          })

          $(".member-list-toadd").html($liList).listview('refresh').trigger("create");
        }

        $(".add-member-link").click(function(e){
          e.preventDefault();
          const teamId = window.currentId;
          const userId = $(this).attr("data-id");

          const data = {
            UserId: userId,
            TeamId: teamId
          }

          ajaxHandler('post', '/api/v1/members', data, 'session' , function(msg){
            $(".member-list-added").listview('refresh').trigger("create");
            loadAddedMembers();
          })
        })
      })
    }
    loadAllMembers();

  }
})
