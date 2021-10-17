const express = require('express');
const axios = require('axios');
const app = express();
const port = 9000;

app.post('/*', (req, res) => {
  const { authorization, owner, repo, eventType = 'update-cms' } = req.headers;
  console.info(`request: owner=${owner}, repo=${repo}, authorization=${authorization}`);

  if (!authorization || !owner || !repo) {
    res.status(400).send('invalid params');
    return;
  }

  const dispatchUrl = `https://api.github.com/repos/${owner}/${repo}/dispatches`;
  axios
    .post(
      dispatchUrl,
      { event_type: eventType },
      {
        headers: { authorization },
        // proxy: { host: '127.0.0.1', port: 8899 }
      }
    )
    .then((response) => {
      console.log('dispatch statusCode', response.status);
      res.status(response.status).send(response.data || 'success');
    })
    .catch((e) => {
      console.log('dispatch error', e);
      res.status(500).send(e.message);
    });
});

app.listen(port, () => {
  console.log(`Server started listening port:${port}`);
});
