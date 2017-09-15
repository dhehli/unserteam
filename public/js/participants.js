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

    //CHeck if User is Already a Participant of this training
    function isAlreadyParticipant(cb){
      const trainingId = window.currentId;
      ajaxHandler('get', `/api/v1/trainings/${trainingId}`, {}, 'session' , function(msg){
        if(Array.isArray(msg)){
          const { Participants } = msg[0];

          let alreadyApplied = Participants.find(function(e) {
            return e.UserId === $.session.get('loggedInUserId');
          })
          cb(alreadyApplied ? alreadyApplied.ParticipantId : false);
        }
      })
    }

    //Laod inital Button
    isAlreadyParticipant(function(isApplied){
      if(isApplied){
        $(".add-participant-link").hide();
        $(".remove-participant-link").show();
      }else{
        $(".add-participant-link").show();
        $(".remove-participant-link").hide();
      }
    });

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
        $(".add-participant-link").hide();
        $(".remove-participant-link").show();
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
      isAlreadyParticipant(function(participantId){
        if(participantId){
          ajaxHandler('delete', `/api/v1/participants/${participantId}`, data, 'session' , function(msg){
            loadAddedParticipants();
            $(".add-participant-link").show();
            $(".remove-participant-link").hide();
          })
        }
      })
    })
  }
})
