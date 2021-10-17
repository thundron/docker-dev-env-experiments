import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { deleteURL, getURL as get, getURLs, insertURL as set, updateURL } from './database';
import request from 'axios';
import { platform } from 'os';

const PORT = parseInt(process.env.SPEEDTEST_SERVER_PORT || '3000');

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

export type Method = 'get' | 'post' | 'put' | 'delete';

const methods: Method[] = [
  'get',
  'post',
  'put',
  'delete',
];

app.post('/get-url-info', async (req, res) => {
  try {
    const urlResponse = await request({
      url: req.body.url,
      method: req.body.method,
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    let urlData, redirectResponse;

    if (urlResponse.status >= 300) {
      const redirectResponse = await request({
        url: req.body.url,
        method: req.body.method,
      });
      urlData = {
        domain: redirectResponse.request.host,
        scheme: `${redirectResponse.request.protocol} ${redirectResponse.request.res.httpVersion}`,
        path: urlResponse.request.path,
        status: redirectResponse.statusText,
        statusCode: redirectResponse.status,
        server: `${redirectResponse.headers['x-powered-by']} (${platform()})`,
        date: redirectResponse.headers.date,
        
        redirectedFrom: {
          domain: urlResponse.request.host,
          scheme: `${urlResponse.request.protocol} ${urlResponse.request.res.httpVersion}`,
          path: redirectResponse.request.path,
          status: urlResponse.statusText,
          statusCode: urlResponse.status,
          server: `${urlResponse.headers['x-powered-by']} (${platform()})`,
          date: urlResponse.headers.date,
        },
      };
    } else {
      urlData = {
        config: urlResponse.config,
        data: urlResponse.data,
        headers: urlResponse.headers,
        status: urlResponse.status,
        statusText: urlResponse.statusText,
      };
    }

    set({
      method: req.body.method,
      url: req.body.url,
      data: stringify({
        request: req,
        response: redirectResponse || urlResponse,
      }),
    });

    res.type('json').send(urlData);
  } catch (error: any) {
    const errorResponse = error.response;
    if (errorResponse) {
      res.send({
        status: errorResponse.status,
        statusText: errorResponse.statusText,
        date: errorResponse.headers.date,
      });
      return;
    }
    res.send({
      status: 500,
      statusText: 'Internal Server Error: ' + error.message,
      date: new Date('now'),
    })
  }
})

methods.forEach((method) => {
  const appMethod = app[method].bind(app);
  appMethod(`/api/HTTP/${method}/:json?`, async (req, res) => {
    let jsonData;
    const jsonParam = req.params.json;
    if (jsonParam === undefined) {
      const data = await getURLs();
      res.type('json');
      res.send(data);
      return;
    }
    try {
      jsonData = JSON.parse(jsonParam);
      if (method === 'get') {
        await getEndpoint(jsonData);
      } else if (method === 'post') {
        await postEndpoint(method, jsonData);
      } else if (method === 'put') {
        await putEndpoint(jsonData);
      } else if (method === 'delete') {
        await deleteEndpoint(jsonData);
      }
      res.send('NO');
    } catch (error: any) {
      res.status(400);
      res.send(error.message);
      return;
    }
  });

  appMethod('/example', (req, res) => {
    if (req.query.noRedirect === 'true') {
      return res.status(200).send('yoyo all good');
    }
    return res.redirect(302, `${req.url}?noRedirect=true`)
  })
});

app.listen(PORT, async () => {
  console.log(`⚡️ Speedtest application server is running on port ${PORT}.`);
});

async function getEndpoint(jsonData: any) {
  const id = jsonData.id;
  let data;
  if (id === undefined) {
    data = await getURLs();
  } else {
    data = await get(jsonData.id as string);
  }
  return data;
}

async function postEndpoint(method: string, jsonData: any) {
  const data = await set({
    method,
    url: jsonData.url,
    data: jsonData.data
  });
  return data;
}

async function putEndpoint(jsonData: any) {
  const data = await updateURL(jsonData.url, {
    method: jsonData.method,
    data: jsonData.data,
    url: jsonData.url,
  });
  return data;
}
async function deleteEndpoint(jsonData: any) {
  const data = await deleteURL(jsonData.url);
  return data;
}

function stringify(obj: any) {
  const seen: any[] = [];
  return JSON.stringify(obj, function(_, value) {
    if (typeof value === 'object' && value !== null) {
      if (seen.indexOf(value) !== -1) return;
      else seen.push(value);
    }
    return value;
  });
}
