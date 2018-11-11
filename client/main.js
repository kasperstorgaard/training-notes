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
      response.json().then(data => 
        data.filePaths.forEach(filePath => swapFile(filePath))
      );
    }
  });
});

function swapFile(filePath) {
  const req = fetch(filePath);
  const name = /\/([^\/]+)\.[^.]+$/.exec(filePath)[1];
  const fragmentId = `fragment-${name}`;

  const fragment = document.getElementById(fragmentId);


  req.then(response => {
    if (response.ok) {
      response.text().then(text => {
        fragment.innerHTML = text;
        console.log([
          `hotswapped fragment: ${fragmentId}`,
          `with html of: ${filePath}`
        ].join('\n'))
      });
    }
  });
}

