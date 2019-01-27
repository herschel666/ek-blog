export const CATEGORY_API_URL = `${__blog__.baseUrl}api/categories`;
export const BLOGPOST_API_URL = `${__blog__.baseUrl}api/posts`;

export const api = ['get', 'post', 'put', 'delete'].reduce(
  (apiInterface, method) => {
    apiInterface[method] = (url, body) => {
      if (method === 'get') {
        return fetch(url);
      }

      const options = {
        method: method.toUpperCase(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      };

      return fetch(url, options);
    };
    return apiInterface;
  },
  {}
);
