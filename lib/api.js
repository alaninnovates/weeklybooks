export const get = (url, params = {}) => fetch(`${url}?${new URLSearchParams(params)}`);
export const post = (url, body) => fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
});
