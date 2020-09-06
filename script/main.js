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

  // Funktion um zum nächsten Screen zu gehen (in der Reihenfolge 0, 1, 2, 3)
  const nextScreen = () => {
    state.currentScreenId = state.currentScreenId + 1;
    if (state.currentScreenId >= screenIds.length) {
      state.currentScreenId = 0;
    }
    showScreen(state.currentScreenId);
  }

  const startNewGame = () => {
    console.log("Hallo welt")
    var Host = $("#username").val()
    console.log(Host)
    // API-Aufruf /create
    $.post(`${server}/create`,JSON.stringify({"name": Host}), (data, status) => {
      console.log(data)
      console.log(status)
      state.gamepin = data.gamePin
      state.uuid = data.id 
      $("#Pinfeld").html(data.gamePin)
      showScreen(screenIds.indexOf("showPinScreen"))
    })

  }

  const enterPinscreen = () => {
    
    // API-Aufruf /join
    showScreen(screenIds.indexOf("enterPinScreen"))

  }
  const joinGame = () => {
    var Joiner = $("#nameJoiner").val()
    var Pin = $("#PinEingeben").val()
    console.log(Joiner, Pin)
  }

  return {
    start: start,
    nextScreen: nextScreen,
    startNewGame: startNewGame,
    joinGame: joinGame,
    enterPinScreen: enterPinscreen,
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
    app.enterPinscreen();
  })

  $("#startBtn").click(() => {
    app.joinGame();
  })

  // Starte app
  app.start();
});
