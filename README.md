# Voting-Backend

## Getting started

### Docker

Copy the contents of `.env.example` file to `.env` and update the environment variables.

To build and run the development server

```shell
# have the container up and running
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# delete the container
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
```

To build and run the production server

```shell
# have the container up and runnin
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

# take the container down and delete
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
```

Now navigate to `http://127.0.0.1:3000/` and the server should be running.

Backend for auth and api for the website and bot

Development Server: https://7nfr0m.deta.dev/
