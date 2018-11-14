import { installRouter } from 'pwa-helpers/router'

let listeners = [];
let isInitial = true;

installRouter((location) => {
  if (location.hostname !== window.location.hostname) {
    window.location.href = location.href;
    return;
  }

  listeners.forEach(listener => listener());

  fetch(location.href).then(isInitial ? () => null : response => {
    if (!isInitial && response.ok) {
      response.json().then(data => 
        data.filePaths.forEach(filePath => swapFragment(filePath))
      );
    }
  });

  isInitial = false;
});

function swapFragment(filePath) {
  const req = fetch(filePath);
  const name = /\/([^\/]+)\.[^.]+$/.exec(filePath)[1];
  const fragmentId = `fragment-${name}`;

  const fragment = document.getElementById(fragmentId);


  req.then(response => {
    if (response.ok) {
      response.text().then(text => {
        fragment.innerHTML = text;
        console.info(`[${fragmentId}]: ${filePath}`);
      });
    }
  });
}
 
export function onNavigate(listener) {
  listeners.push(listener);
  return () => listeners = listeners.filter(item => item !== listener);
}