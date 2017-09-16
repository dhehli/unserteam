$(document).on("pagecontainershow", () => {
  const pageId = $('body').pagecontainer('getActivePage').prop('id');

  if(pageId === "training-detail"){
    const currentTrainingId = window.currentId;

    function loadAddedParticipants(){
      //Load Memberlist of currentTeam
      const participantIdArr = [];

      ajaxHandler('get', `/api/v1/trainings/${currentTrainingId}`, {}, 'session')
      .then(msg => {
        const message = JSON.parse(msg);

        if(message.type){
          alertHandler($alert, "danger", message.message);
        }else{
          const { Participants } = message[0];

          Participants.forEach(participant => {
            const { UserId, ParticipantId } = participant;
            participantIdArr.push({UserId, ParticipantId})
          })
        }
      })
      .then(() => {
        const $liList = [];

        participantIdArr.forEach(user => {
          const { UserId, TrainingId } = user;
          ajaxHandler('get', `/api/v1/users/${UserId}`, {}, 'session')
          .then(msg => {
            const message = JSON.parse(msg);

            if(message.type){
              alertHandler($alert, "danger", message.message);
            }else{
              const message = JSON.parse(msg);
              const { UserId, Active, LastName, FirstName, Email } = message[0];

              $liList.push(`
                <li data-icon="false"><a href="#" class="remove-participant-link">${FirstName} ${LastName}</a></li>
              `);

              $(".participant-list").html($liList).listview('refresh').trigger("create");
            }
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
    loadAddedParticipants();

    //CHeck if User is Already a Participant of this training
    function isAlreadyParticipant(cb){
      const trainingId = window.currentId;
      ajaxHandler('get', `/api/v1/trainings/${trainingId}`, {}, 'session')
      .then(msg => {
        const message = JSON.parse(msg);

        if(message.type){
          alertHandler($alert, "danger", message.message);
        }else{
          const { Participants } = message[0];

          let alreadyApplied = Participants.find(function(e) {
            return e.UserId === $.session.get('loggedInUserId');
          })
          cb(alreadyApplied ? alreadyApplied.ParticipantId : false);
        }
      })
      .fail(msg => {
        alertHandler($alert, "danger", "Server Error");
      })
    }

    //Laod inital Button
    isAlreadyParticipant(isApplied => {
      if(isApplied){
        $(".add-participant-link").hide();
        $(".remove-participant-link").show();
      }else{
        $(".add-participant-link").show();
        $(".remove-participant-link").hide();
      }
    });

    $(".add-participant-link").click(e => {
      e.preventDefault();
      const trainingId = window.currentId;
      const userId = $.session.get('loggedInUserId');

      const data = {
        UserId: userId,
        TrainingId: trainingId
      }

      ajaxHandler('post', '/api/v1/participants', data, 'session')
      .then(msg => {
        loadAddedParticipants();
        $(".add-participant-link").hide();
        $(".remove-participant-link").show();
      })
      .fail(msg => {
        alertHandler($alert, "danger", "Server Error");
      })
    })

    $(".remove-participant-link").click(e => {
      e.preventDefault();
      const trainingId = window.currentId;
      const userId = $.session.get('loggedInUserId');

      const data = {
        UserId: userId,
        TrainingId: trainingId
      }

      isAlreadyParticipant(function(participantId){
        if(participantId){
          ajaxHandler('delete', `/api/v1/participants/${participantId}`, data, 'session')
          .then(msg => {
            loadAddedParticipants();
            $(".add-participant-link").show();
            $(".remove-participant-link").hide();
          })
          .fail(msg => {
            alertHandler($alert, "danger", "Server Error");
          })
        }
      })
    })
  }
})
