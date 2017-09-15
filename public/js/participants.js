$(document).on("pagecontainershow", function () {
  const pageId = $('body').pagecontainer('getActivePage').prop('id');

  if(pageId === "training-detail"){
    const currentTrainingId = window.currentId;

    function loadAddedParticipants(){
      //Load Memberlist of currentTeam
      ajaxHandler('get', `/api/v1/trainings/${currentTrainingId}`, {}, 'session' , function(msg){
        // TODO: Handler Errors and Warning
        if(Array.isArray(msg)){
          const { Participants } = msg[0];

          if(Array.isArray(Participants)){
            const participantIdArr = [];

            Participants.forEach(function(participant){
              const { UserId, ParticipantId } = participant;
              participantIdArr.push({UserId, ParticipantId})
            })

            const $liList = [];

            participantIdArr.forEach(function(user){
              const { UserId, TrainingId } = user;
              ajaxHandler('get', `/api/v1/users/${UserId}`, {}, 'session' , function(msg){
                const { UserId, Active, LastName, FirstName, Email } = msg[0];

                $liList.push(`
                  <li data-icon="false"><a href="#" class="remove-participant-link">${FirstName} ${LastName}</a></li>
                `);

                $(".participant-list").html($liList).listview('refresh').trigger("create");
              })
            })
          }
        }
      })
    }
    loadAddedParticipants();

    $(".add-participant-link").click(function(e){
      e.preventDefault();
      const trainingId = window.currentId;
      const userId = $.session.get('loggedInUserId');

      const data = {
        UserId: userId,
        TrainingId: trainingId
      }

      ajaxHandler('post', '/api/v1/participants', data, 'session' , function(msg){
        loadAddedParticipants();
      })
    })

    $(".remove-participant-link").click(function(e){
      e.preventDefault();
      const trainingId = window.currentId;
      const userId = $.session.get('loggedInUserId');

      const data = {
        UserId: userId,
        TrainingId: trainingId
      }

      ajaxHandler('post', '/api/v1/participants', data, 'session' , function(msg){
        loadAddedParticipants();
      })
    })
  }
})
