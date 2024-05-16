export function pullMarkdown(queryClient) {
  return async (setModule, setMsgs, setNotify) => {
    try {
      const module = await queryClient.ensureQueryData({
        queryKey: ['module', 'markdown'],
        queryFn: async () => {
          return await import('../modules/Markdown.jsx');
        },
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60,
      })

      setModule(module);
      setNotify({ type: 'info', value: 'sh: pulling necessary components success.' });
    } catch (e) {
      setModule('fail');
      setNotify({ type: 'bug', value: 'sh: pulling failed, try to reload this page.' });
    }
  }
}

export function pullText(queryClient, pathname) {
  return async (setData, setMsgs, setNotify) => {
    try {
      const text = await queryClient.ensureQueryData({
        queryKey: [pathname],
        queryFn: async () => {
          const res = await fetch(`/raw${pathname}.md`)
          if (!res.ok) {
            throw Error(res.status);
          }
          return res.text();
        },
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60,
      })

      setData(text);
      setNotify({ type: 'info', value: 'sh: pulling hot data success.' });
    } catch (e) {
      setData('fail');
      setNotify({ type: 'bug', value: `sh: ${e.message}, maybe not the current language covered yet.` });
    }
  }
}