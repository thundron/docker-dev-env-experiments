import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { get, set } from './database';

const PORT = parseInt(process.env.SPEEDTEST_SERVER_PORT || '3000');

const parseForm = bodyParser.urlencoded({ extended: false })

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(compression());

export type Method = 'get' | 'post' | 'put' | 'delete';

const methods: Method[] = [
  'get',
  'post',
  'put',
  'delete',
];

app.get('/', parseForm, async (req, res) => {
  res.send();
})

app.get('/redirect', parseForm, async (req, res) => {
  res.redirect('http://localhost:3000');
})

methods.forEach((method) => {
  const appMethod = app[method].bind(app);
  appMethod(`/api/HTTP/${method}/:json`, parseForm, async (req, res) => {
    let jsonData;
    try {
      jsonData = JSON.parse(req.params.json);
      console.log('data?', jsonData);
      const reqMethod = req.method.toLowerCase();
      console.log('reqMethod', reqMethod)
      if (reqMethod === 'get') {
        const data = await get(req.query.id as string);
        res.type('json');
        res.send(data);
        return;
      }
      if (reqMethod === 'post') {
        const data = await set(jsonData.id, req.params.json);
        res.type('json');
        res.send(data);
        return;
      }
    } catch (error: any) {
      res.status(400);
      res.send(error.message);
      return;
    }
  });
});

app.listen(PORT, async () => {
  console.log(`⚡️ Speedtest application server is running on port ${PORT}.`);
});
