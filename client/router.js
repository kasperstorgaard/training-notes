import { installRouter } from 'pwa-helpers/router'

let listeners = [];
let isInitial = true;

const scriptKeys = {};

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
        const {html, scripts} = extractScripts(text);
        fragment.innerHTML = html;
        scripts.forEach(script => addScript(script));
        console.info(`[${fragmentId}]: ${filePath}`);
      });
    }
  });
}
 
export function onNavigate(listener) {
  listeners.push(listener);
  return () => listeners = listeners.filter(item => item !== listener);
}

function extractScripts(text) {
  const scripts = [];
  const html = text.replace(/<script [^>]+>(?:<\/script>)?\s*\n?/g, script => {
    scripts.push(script.trim());
    return '';
  });
  return {html, scripts};
}

function addScript(text) {
  const div = document.createElement('div');
  div.innerHTML = text;
  const original = div.querySelector('script');

  if (scriptKeys[original.getAttribute('src')]) {
    return;
  }

  const script = document.createElement('script');
  Array.from(original.attributes).forEach(attribute => 
    script.setAttribute(attribute.name, attribute.value));
  document.body.appendChild(script);

  scriptKeys[script.getAttribute('src')] = true;
}