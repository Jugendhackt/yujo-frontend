// App-Logik
const app = (() => {
var server = "https://yujo.jugendhacker.de"
  // Selektoren der html container
  const screenIds = [
    "startScreen", "showPinScreen", "enterPinScreen", "tutorialScreen", "questionScreen", "playerAttackScreen", "playerHitScreen", "wonScreen", "lostScreen"
  ];

  // Zustand der app
  let state = {
    currentScreenId: 0,
    uuid: null,
    gamepin: null,
    round: 0,
    creatorName: "",
    teammateName: "",
    healthPoints: null
  };

  // Funktion um einen Screen anzuzeigen (id = 0, 1, 2)
  const showScreen = (id) => {
    // alle screens ausblenden
    screenIds.forEach(screenId => {
      $(`#${screenId}`).hide();
    });

    // screen mit id einblenden
    $(`#${screenIds[id]}`).show();
  }

  // Funktion zum Starten der App
  const start = () => {
    console.log("App läuft");
    showScreen(state.currentScreenId);
  }

  // Debug-Funktion um zum nächsten Screen zu gehen (in der Reihenfolge 0, 1, 2, 3)
  const nextScreen = () => {
    state.currentScreenId = state.currentScreenId + 1;
    if (state.currentScreenId >= screenIds.length) {
      state.currentScreenId = 0;
    }
    showScreen(state.currentScreenId);
  }

  // Start new game for host
  const startNewGame = () => {
    var Host = $("#username").val()
    // API-Aufruf /create
    $.post(`${server}/create`,JSON.stringify({"name": Host}), (data, status) => {
      if (status === "success") {
        state.gamepin = data.gamePin
        state.uuid = data.uuid
        $("#Pinfeld").html(data.gamePin)
        showScreen(screenIds.indexOf("showPinScreen"))
        waitToStartGame()
      }
    })
  }

  // Auf beide Spieler warten
  const waitToStartGame = () => {
    startPolling(`${server}/game/${state.uuid}`, {}, (data) => {
      state.creatorName = data.names.creatorName
      state.teammateName = data.names.teammateName
      state.round = data.nextRoundID
      state.healthPoints = data.HealthPoints
      getQuestion()
    })
  }

  // Enter PinScreen anzeigen
  const enterPinScreen = () => {
    showScreen(screenIds.indexOf("enterPinScreen"))

  }

  const getQuestion = () => {
    $.get(`${server}/game/${state.uuid}/round/${state.round}`,{}, (responseData, status) => {
      if (status === 200) {
        console.log(response)
      }
    })
  }

  // Spiel beitreten
  const joinGame = () => {
    var Joiner = $("#nameJoiner").val()
    var Pin = $("#PinEingeben").val()
    console.log(Joiner, Pin)
    $.post(`${server}/join/${Pin}`,JSON.stringify({"name": Joiner}), (data, status) => {
      console.log(data)
      console.log(status)
      state.gamepin = data.gamePin
      state.uuid = data.uuid

      showScreen(screenIds.indexOf("questionScreen"))
      waitToStartGame()
    })
  }

  // Server-Anfrage alle 2sek wiederholen bis eine Antwort kommt
  const startPolling = (url, data, callback) => {
    const request = () => {
      $.get(url,data, (responseData, status) => {
        if (status !== 409) {
          clearInterval(interval)
          callback(responseData, status)
        }
      })
    }

    // Poll für 3sek
    const interval = setInterval(request, 3000);
  }

  return {
    start: start,
    nextScreen: nextScreen,
    startNewGame: startNewGame,
    joinGame: joinGame,
    enterPinScreen: enterPinScreen,
    state: state
  }
})();

// Funktion die ausgeführt wird, wenn die Seite gerendert wurde
$( document ).ready(() => {
  // Debug Funktion um durch die Screens zu klicken
  $("#nextScreenLink").click(() => {
    app.nextScreen();
  })

  // Button to Start Game
  $("#startNewGameBtn").click(() => {
    app.startNewGame();
  })

  // Button to Join Game
  $("#joinGameBtn").click(() => {
    app.enterPinScreen();
  })

  $("#startBtn").click(() => {
    app.joinGame();
  })

  // Starte app
  app.start();
});
