$(document).on("pagebeforeshow", () => {
  const pageId = $('body').pagecontainer('getActivePage').prop('id');

  $alert = $(".alert-member");
  //Load Team and Members
  if(pageId === "team-detail"){
    const teamId = window.currentId;

    function loadAddedMembers(){
      //Load Memberlist of currentTeam
      const userIdArr = [];

      ajaxHandler('get', `/api/v1/teams/${teamId}`, {}, 'session')
      .then(msg => {
        const message = JSON.parse(msg);

        if(message.type){
          alertHandler($alert, "danger", message.message);
        }else{
          const { Members } = message[0];

          Members.forEach(member => {
            const { UserId, MemberId } = member;
            userIdArr.push({UserId, MemberId})
          })
        }
      })
      .then(() => {
        const $liList = [];

        userIdArr.forEach(user => {
          const { UserId, MemberId } = user;

          ajaxHandler('get', `/api/v1/users/${UserId}`, {}, 'session')
          .then(msg => {
            const message = JSON.parse(msg);

            if(message.type){
              alertHandler($alert, "danger", message.message);
            }else{
              const { UserId, Active, LastName, FirstName, Email } = message[0];

              $liList.push(`<li data-icon="delete">
                <a href="#" class="remove-member-link" data-id="${MemberId}">${FirstName} ${LastName}</a>
              </li>
              `);

              $(".member-list-added").html($liList).listview('refresh').trigger("create");
            }
          })
          .then(() => {
            $(".remove-member-link").click(function(e){
              //Bug Arrow function not working here
              e.preventDefault();
              const memberId = $(this).attr("data-id");

              ajaxHandler('delete', `/api/v1/members/${memberId}`, {}, 'session')
              .then(msg => {
                $(".member-list-added").listview('refresh').trigger("create");
                loadAddedMembers();
              })
              .fail(msg => {
                alertHandler($alert, "danger", "Server Error");
              })
            })
          })
          .fail(msg => {
            alertHandler($alert, "danger", "Server Error");
          })
        })
      })
      .fail(msg => {
        alertHandler($alert, "danger", "Server Error");
      })
    }
    loadAddedMembers();

    function loadAllMembers(){
      //Load User List
      ajaxHandler('get', '/api/v1/users', {}, 'session')
      .then(msg => {
        const message = JSON.parse(msg);

        if(message.type){
          alertHandler($alert, "danger", message.message);
        }else{
          const $liList = [];

          message.forEach(user => {
            const { UserId, Active, LastName, FirstName, Email } = user;

            $liList.push(`
              <li data-icon="plus"><a href="#" class="add-member-link" data-id="${UserId}">${FirstName} ${LastName}</a></li>
            `);
          })
          $(".member-list-toadd").html($liList).listview('refresh').trigger("create");
        }
      })
      .then(() =>{
        $(".add-member-link").click(function(e){
            //Bug Arrow function not working here
          e.preventDefault();
          const teamId = window.currentId;
          const userId = $(this).attr("data-id");

          const data = {
            UserId: userId,
            TeamId: teamId
          }

          ajaxHandler('post', '/api/v1/members', data, 'session')
          .then(() =>{
            $(".member-list-added").listview('refresh').trigger("create");
            loadAddedMembers();
          }).fail(msg => {
            alertHandler($alert, "danger", "Server Error");
          })
        })
      })
      .fail(msg => {
        alertHandler($alert, "danger", "Server Error");
      })
    }
    loadAllMembers();

  }
})
