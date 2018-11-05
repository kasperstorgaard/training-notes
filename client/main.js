import { installRouter } from 'pwa-helpers/router'

let isInitial = true;

installRouter((location) => {
  if (isInitial) {
    isInitial = false;
    return;
  }

  if (location.hostname !== window.location.hostname) {
    window.location.href = location.href;
    return;
  }

  fetch(location.href).then(response => {
    if (response.ok) {
      response.json().then(data => {
        console.log(data)
      });
    }
  });
});

