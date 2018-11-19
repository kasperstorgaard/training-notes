import { installRouter } from 'pwa-helpers/router'

let listeners = [];
let isInitial = true;

const scriptKeys = {};
const styleKeys = {};

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
  const fragmentId = getFragmentId(filePath);

  const fragment = document.getElementById(fragmentId);

  req.then(response => {
    if (response.ok) {
      response.text().then(text => {
        let {html, scripts} = extractScripts(text);
        const stylesOut = extractStyles(html);
        html = stylesOut.html;
        const styles = stylesOut.styles;
        fragment.innerHTML = html;
        scripts.forEach(script => addScript(script));
        styles.forEach(style => addStyles(style));
        updatePageName(filePath);
        console.info(`[${fragmentId}]: ${filePath}`);
      });
    }
  });
}
 
export function onNavigate(listener) {
  listeners.push(listener);
  return () => listeners = listeners.filter(item => item !== listener);
}

function getFragmentId(filePath) {
  const fragmentName = /\/([^\/]+)\.[^.]+$/.exec(filePath)[1];
  return `fragment-${fragmentName}`;
}

function updatePageName(filePath) {
  const matches = /\/pages\/([^\/]+)\//.exec(filePath);
  if (!matches) {
    return;
  }

  const htmlElement = document.documentElement;
  const previousPageName = Array.from(htmlElement.classList.values())
    .find(str => str.startsWith('page-'));
  const nextPageName = `page-${matches[1]}`;

  htmlElement.classList.remove(previousPageName || '');
  htmlElement.classList.add(nextPageName);
}

function extractScripts(text) {
  const scripts = [];
  const html = text.replace(/<script [^>]+>(?:<\/script>)?\s*\n?/g, script => {
    scripts.push(script.trim());
    return '';
  });
  return {html, scripts};
}

function extractStyles(text) {
  const styles = [];
  const linkMatcher = /<link\s+((rel="stylesheet"|href="[^"]+"|type="text\/css")\s*){3}\/>/g;
  const html = text.replace(linkMatcher, style => {
    styles.push(style.trim());
    return '';
  });
  return {html, styles};
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

function addStyles(text) {
  const div = document.createElement('div');
  div.innerHTML = text;
  const original = div.querySelector('link');

  if (styleKeys[original.getAttribute('href')]) {
    return;
  }

  const link = document.createElement('link');
  Array.from(original.attributes).forEach(attribute => 
    link.setAttribute(attribute.name, attribute.value));
  document.head.appendChild(link);

  styleKeys[link.getAttribute('href')] = true;
}