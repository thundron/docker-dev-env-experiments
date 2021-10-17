import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Button,
  Card as CardBase,
  CardContent,
  Container,
  CssBaseline,
  FormControl,
  FormHelperText,
  Input,
  MenuItem,
  Select as SelectBase,
  Typography,
} from '@mui/material';
import { Box, styled } from '@mui/system';
import { FormEvent } from 'hoist-non-react-statics/node_modules/@types/react';

const environment = (process.env.NODE_ENV || 'production').toLowerCase();
const SERVER_PORT = '3000';

const Card = styled(CardBase)`
  border-color: #f6f6f6;
`;

const Select = styled(SelectBase)`
  border-color: #fafafa;
`;

type URLInfo =
  | undefined
  | {
      domain: string;
      scheme: string;
      path: string;
      status: string;
      statusCode: number;
      server: string;
      date: string;
      redirectedFrom?: {
        status: string;
        statusCode: number;
        path: string;
        date: string;
        server: string;
      };
    };

type Method = 'get' | 'post' | 'put' | 'delete';

const methods: Method[] = ['get', 'post', 'put', 'delete'];

const getUrlInfo = (url: URL, method: Method) => {
  return fetch(
    `http://speedtest-server-${environment}:${SERVER_PORT}/get-url-info`,
    {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      body: new URLSearchParams({
        url: url.toString(),
        method,
      }),
      redirect: 'manual',
    },
  );
};

const URLStatusInfo = ({ urlInfo }: { urlInfo: URLInfo }) => {
  return urlInfo === undefined ? (
    <Typography component="h1" variant="h3">
      Make a request!
    </Typography>
  ) : (
    <>
      <Typography component="h1" variant="h3">
        {urlInfo.statusCode}
      </Typography>
      <Typography component="h1" variant="h5">
        {urlInfo.status}
      </Typography>
    </>
  );
};

const DEFAULT_URL = 'http://localhost:3000/example';

export const HomePage = () => {
  const [urlInfo, setUrlInfo] = React.useState<URLInfo>();
  const [method, setMethod] = React.useState<Method>('get');
  const [urlString, _setUrlString] = React.useState<string>(DEFAULT_URL);
  const [urlStringError, setUrlStringError] = React.useState(false);
  const [url, setUrl] = React.useState<URL>(new URL(DEFAULT_URL));

  const setUrlString = (str: string) => {
    _setUrlString(str);
    try {
      const urlObj = new URL(str);
      setUrl(urlObj);
      setUrlStringError(false);
    } catch (error) {
      setUrlStringError(true);
    }
  };

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault();

    if (urlStringError) {
      return;
    }

    try {
      const infoRaw = await getUrlInfo(url, method);
      console.log(infoRaw);
      console.log(await infoRaw.text());
      const infoJson = await infoRaw.json();
      setUrlInfo(infoJson);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Helmet>
        <title>Make a request!</title>
        <meta
          name="description"
          content="A React application to check and store URLs information"
        />
      </Helmet>
      <Container component="main">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <URLStatusInfo urlInfo={urlInfo} />
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ backgroundColor: '#f2f2f2', mt: 1, p: 1 }}
          >
            <Select
              className="select-button"
              value={method}
              onChange={evt => setMethod(evt.target.value as Method)}
              size="small"
              sx={{
                marginRight: 2,
                backgroundColor: '#fafafa',
                borderColor: '#fafafa',
              }}
            >
              {methods.map(method => (
                <MenuItem key={method} value={method}>
                  {method.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
            <FormControl error={urlStringError} variant="standard">
              <Input
                disableUnderline={!urlStringError}
                type="text"
                value={urlString}
                onChange={evt => setUrlString(evt.target.value)}
                sx={{
                  marginRight: 2,
                }}
              />
              <FormHelperText>
                {urlStringError ? 'Invalid URL' : ''}
              </FormHelperText>
            </FormControl>
            <Button type="submit" variant="contained">
              SEND
            </Button>
          </Box>
          {urlInfo && (
            <Box
              sx={{
                display: 'flex',
                mt: 2,
                flexDirection: 'row',
              }}
            >
              <Card
                variant="outlined"
                sx={{ width: 250, mr: 1, backgroundColor: '#f6f6f6' }}
              >
                <CardContent sx={{ p: 1 }}>
                  <Typography>URL INFO</Typography>
                  <Box sx={{ backgroundColor: '#e9e9e9', mt: 1, p: 1 }}>
                    <Typography variant="h6">DOMAIN</Typography>
                    <Typography>{urlInfo.domain}</Typography>
                  </Box>
                  <Box sx={{ backgroundColor: '#e9e9e9', mt: 1, p: 1 }}>
                    <Typography variant="h6">SCHEME</Typography>
                    <Typography>{urlInfo.scheme}</Typography>
                  </Box>
                  <Box sx={{ backgroundColor: '#e9e9e9', mt: 1, p: 1 }}>
                    <Typography variant="h6">PATH</Typography>
                    <Typography>{urlInfo.path}</Typography>
                  </Box>
                </CardContent>
              </Card>
              {urlInfo.redirectedFrom && (
                <Card variant="outlined" sx={{ width: 250 }}>
                  <CardContent sx={{ p: 1 }}>
                    <Typography>RESPONSE</Typography>
                    <Box sx={{ backgroundColor: '#f6f6f6', mt: 1, p: 1 }}>
                      <Typography>
                        {urlInfo.scheme} {urlInfo.redirectedFrom.statusCode}
                      </Typography>
                    </Box>
                    <Box sx={{ backgroundColor: '#f6f6f6', mt: 1, p: 1 }}>
                      <Typography>
                        Location: {urlInfo.redirectedFrom.path}
                      </Typography>
                    </Box>
                    <Box sx={{ backgroundColor: '#f6f6f6', mt: 1, p: 1 }}>
                      <Typography>
                        Server: {urlInfo.redirectedFrom.server}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}
              <Card variant="outlined" sx={{ width: 250 }}>
                <CardContent sx={{ p: 1 }}>
                  <Typography>RESPONSE</Typography>
                  <Box sx={{ backgroundColor: '#f6f6f6', mt: 1, p: 1 }}>
                    <Typography>
                      {urlInfo.scheme} {urlInfo.statusCode} {urlInfo.status}
                    </Typography>
                  </Box>
                  <Box sx={{ backgroundColor: '#f6f6f6', mt: 1, p: 1 }}>
                    <Typography>Date: {urlInfo.date}</Typography>
                  </Box>
                  <Box sx={{ backgroundColor: '#f6f6f6', mt: 1, p: 1 }}>
                    <Typography>Server: {urlInfo.server}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};
