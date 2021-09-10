const { DEFAULT_HOST, DEFAULT_PORT } = process.env || {};

const getHost = (route: string) => {
  let host = DEFAULT_HOST;
  let port = DEFAULT_PORT;

  if (!host) {
    host = 'localhost';
  } else if (host.substr(host.length - 1) === '/') {
    host = host.substring(0, host.length - 1);
  }

  if (!port) {
    port = '';
  }

  return `${host}:${port}/${route}`;
};

const get = async (route: string): Promise<any> => {
  try {
    const response = await fetch(getHost(route), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return Promise.resolve({
        data: null,
        error: response.statusText,
        code: 'internal_error',
      });
    }

    return response.json();
  } catch (error) {
    return Promise.resolve({ data: null, error, code: 'internal_error' });
  }
};

const api = {
  get,
};

export default api;
