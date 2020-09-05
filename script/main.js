const app = (() => {

  const screenIds = [
    "startScreen", "showPinScreen", "enterPinScreen"
  ];

  let state = {
    currentScreenId: 0
  };

  const showScreen = (id) => {
    // alle screens ausblenden
    screenIds.forEach(screenId => {
      $(`#${screenId}`).hide();
    });

    // screen mit id einblenden
    $(`#${screenIds[id]}`).show();
  }

  const start = () => {
    console.log("App läuft");
    showScreen(state.currentScreenId);
  }

  const nextScreen = () => {
    state.currentScreenId = state.currentScreenId + 1;
    if (state.currentScreenId >= screenIds.length) {
      state.currentScreenId = 0;
    }
    showScreen(state.currentScreenId);
  }

  return {
    start: start,
    nextScreen: nextScreen,
    state: state
  }
})();

$( document ).ready(() => {
  $("#nextScreenLink").click(() => {
    app.nextScreen();
  })

  // App start
  app.start();
});

