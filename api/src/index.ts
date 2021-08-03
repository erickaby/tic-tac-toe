import express from 'express';

const app = express();
const port = 8001;
app.get('/', (req, res) => res.json({ name: 'hello world'}))
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})