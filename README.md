URL Shortener
=============

A lightweight Node.js + Express service for creating short, shareable links.
The API stores links in a local NeDB datastore and serves a minimal frontend
you can run anywhere Node is available.

🚀 Live Demo
https://urlshortner-1-5pza.onrender.com

Getting Started
---------------

1. `npm install`
2. `npm start`
3. Visit [http://localhost:4000](http://localhost:4000) to use the UI.

Environment variables:

- `PORT` — defaults to `4000`
- `HOST` — defaults to `0.0.0.0`

API
---

- **POST `/`** — request body must contain the original URL as plain text.
  - **200 OK** — response body is the generated ID (e.g. `D`)
  - **400 Bad Request** — invalid URL or blocked domain
  - **500 Server Error** — something went wrong while storing the link
- **GET `/:id`** — redirects to the stored URL or returns `404` if not found

Request Examples
----------------

### cURL

```
curl -d "https://example.com/" http://localhost:4000/
```

Response:

```
D
```

Visiting `http://localhost:4000/D` now redirects to `https://example.com/`.

### Browser Fetch

```
fetch('http://localhost:4000/', {
	body: 'https://example.com/',
	method: 'POST'
})
	.then(res => res.text())
	.then(id => console.log(id));
```

### Node.js (Axios)

```
const axios = require('axios');

axios.post('http://localhost:4000/', 'https://example.com/')
	.then(res => console.log(res.data));
```

Shortening `"https://example.com/"` results in `http://localhost:4000/D`.
