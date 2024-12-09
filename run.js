(() => {
  const findValues = new Promise((resolve, reject) => {
    const root = document.querySelector('#root');
    if (!root) return reject(`Failed to find Deltamath root are you sure you're on the right page?`);
    const queries = Object.values(root)[0].memoizedState.element.props.client.queryCache.queries;
    if (!queries) return reject(`Failed to find Deltamath queries are you sure you're on the right page?`);
    for (const query of queries) {
      if (query?.queryHash) {
        let problem = query?.queryKey;
        if (!problem) return reject(`Failed to find query key`);
        if (problem[0] !== 'problemByAssignment') continue;
        let assignmentId = problem[1];
        let skillCode = problem[2];

        let problemData = fetch(`https://www.deltamath.com/api/student/problemByAssignment/${assignmentId}?sk=${skillCode}&last_edit=1`, {
          credentials: 'include',
        })
          .then((res) => res.json())
          .then((data) => {
            resolve(data.problem);
          });
      }
    }
  })
    .then((data) => {
      const key = btoa(unescape(encodeURIComponent(JSON.stringify(data))))
      window.open(`https://localhost:3000/deltamath#${key}`);
    })
    .catch((err) => {
      alert(err);
    });
})();
