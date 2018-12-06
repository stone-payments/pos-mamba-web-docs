import MambaStore from '../packages/store/src/index.js';
import * as sapper from '../__sapper__/client.js';
import '../packages/pos/simulator/index.js';
import './styles/app.css';

const store = MambaStore();

sapper.start({
  target: document.querySelector('#sapper'),
  store: data => {
    store.set(data);

    fetch(`api/guide/contents`).then(r => r.json()).then(guide_contents => {
      store.set({ guide_contents });
    });

    window.store = store;
    return store;
  },
});

if (navigator.serviceWorker && navigator.serviceWorker.controller) {
  navigator.serviceWorker.controller.onstatechange = function(e) {
    if (e.target.state === 'redundant') {
      import('./components/Toast.html').then(mod => {
        mod.default.show()
      })
    }
  };
}