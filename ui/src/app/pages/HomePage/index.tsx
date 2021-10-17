import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  FormControl,
  FormHelperText,
  Input,
  MenuItem,
  Select as RawSelect,
  Typography,
} from '@mui/material';
import { Box, styled } from '@mui/system';
import { FormEvent } from 'hoist-non-react-statics/node_modules/@types/react';

const Select = styled(RawSelect)`
  border: none;
`;

type URLInfo =
  | undefined
  | {
      domain: string;
      scheme: string;
      path: string;
      status: string;
      statusCode: number;
      responses: Response[];
    };

type Method = 'get' | 'post' | 'put' | 'delete';

const methods: Method[] = ['get', 'post', 'put', 'delete'];

const getUrlInfo = (url: URL, method: Method) => {
  console.log(url.toString());
  return fetch(url.toString(), {
    method,
    mode: 'cors',
  });
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

const DEFAULT_URL = 'http://localhost:3000';

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
      const info = await getUrlInfo(url, method);
      console.log(info);
      setUrlInfo({
        domain: url.hostname,
        scheme: url.protocol,
        path: url.pathname,
        status: info.statusText,
        statusCode: info.status,
        responses: [info],
      });
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
                backgroundColor: '#f6f6f6',
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
                flexDirection: 'row',
              }}
            >
              <Card
                variant="outlined"
                sx={{ minWidth: 275, backgroundColor: '#e9e9e9' }}
              >
                <CardContent>
                  <Typography>URL INFO</Typography>
                </CardContent>
              </Card>
              {urlInfo.responses.map(response => (
                <Card
                  key={response.url}
                  variant="outlined"
                  sx={{ minWidth: 275 }}
                >
                  <CardContent>
                    <Typography>
                      {response.status} - {response.statusText}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};
