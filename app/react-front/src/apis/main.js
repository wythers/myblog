export function pullfont(lang) {
  return (setModule, setMsgs, setNotify) => import('../modules/font.js').then(m => {
    const font = lang == 'zh' ? m.font : m.prefont;
    setNotify({ type: 'warn', value: 'sh: pulling font snapshots successfully.' });
    font(setModule, setMsgs, setNotify);
  }).catch(err => {
    setModule('fail');
    setNotify({ type: 'bug', value: 'sh: pulling font snapshot failed.' });
  })
}

export function pullRouter() {
  return (setModule, setMsgs, setNotify) => {
    setNotify({ type: 'info', value: 'sh: pulling the route context...' });
    import('../modules/Router.jsx').then(m => {
      setNotify({ type: 'info', value: 'sh: done!' });
      setModule(m)
    }).catch(err => {
      setModule('fail');
      setNotify({ type: 'bug', value: 'sh: fatal error, try to reload this page.' });
    })
  }
}

export function pullSnapshots() {
  return async (setData, setMsgs, setNotify) => {
    try {

      const response = await fetch('/raw/snapshots.json');
      const str = await response.text();

      function reviver(key, value) {
        if (key == 'date') {
          return new Date(value);
        }
        return value;
      }
      const rawData = JSON.parse(str, reviver);

      const enTozh = new Map();
      const zhToen = new Map();
      const data = {
        en: {
          snapshots: rawData.map(d => {
            enTozh.set(d.title[0], d.title[1]);
            return { ...d, title: d.title[0] }
          }),
          getPeer: (t) => enTozh.get(t)
        },
        zh: {
          snapshots: rawData.map(d => {
            zhToen.set(d.title[1], d.title[0]);
            return { ...d, title: d.title[1] }
          }),
          getPeer: (t) => zhToen.get(t)
        }
      }

      setData(data)
      setNotify({ type: 'info', value: 'sh: pulling snapshots success.' });
    } catch (e) {
      setData('fail');
      setNotify({ type: 'bug', value: `sh: fatal error, try to reload this page.` });
    }
  }
}
