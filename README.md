# Currency Finder Project 

This repository contains an implementation of the Currency Finder API. 

## Project structure
  - `.circleci` contains all files related to the CI process [FREE],
  - `app.js` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
  - `config/` - This folder contains configuration for passport as well as a central location for configuration/environment variables.
  - `routes/` - This folder contains the route definitions for our API.
  - `models/` - This folder contains the schema definitions for our Mongoose models.
  - the root directory contains mostly configuration files

# Start project
```bash
npm start
```
or
```bash
yarn start
```

# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [express-jwt](https://github.com/auth0/express-jwt) - Middleware for validating JWTs for authentication
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript 

##
##