export const fetcher = async (url, method = 'GET', body = null, headers = {}) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      credentials: 'include'
    };
  
    if (body) {
      options.body = JSON.stringify(body);
    }
  
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
  
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
  
    return data;
  };
  