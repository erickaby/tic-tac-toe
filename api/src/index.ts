import express from 'express';
import expressWs from 'express-ws'

const appBase = express();
const wsInstance = expressWs(appBase);
const { app } = wsInstance;

const port = 8001;
app.get('/', (req, res) => res.json({ name: 'hello world' }))

app.ws('/game', function (ws, req) {
    console.log(ws)
    ws.on('message', function(msg) {
        ws.send('testing');
        console.log(msg);
    });
    console.log('socket');
  });

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})