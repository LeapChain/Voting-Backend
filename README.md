# Voting-Backend

## Getting started

### Docker

Copy the contents of `.env.example` file to `.env` and update the environment variables.

Build the image

```shell
docker build -t leapcoin-voting-api .
```

Run the server

```shell
docker run -d -p 3000:3000 --name leapcoin-voting-api leapcoin-voting-api
```

Now navigate to `http://127.0.0.1:3000/` and the server should be running.

Backend for auth and api for the website and bot

Development Server: https://7nfr0m.deta.dev/
