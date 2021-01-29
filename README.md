## Overview

This project is a Node.js backend implementation of an auction house where users can upload auctions and make offers on other users' auctions.
Some key aspects:
  - Uses MongoDB as the database (mongoose library).
  - Supports login mechanism and user authentication using jsonwebtokens.
  - Provides sensitive user data protection by using bcrypt encryption.
  - Built as a microservices architecure, thus providing modularity, scalability and flexibility.
  - Uses nginx as a reverse proxy.
  - Includes unit tests.
  - Packed inside Docker Compose for easier developing and testing.
  - (Coming soon) Kubernetes configuration for deployment environment.
  
 
## Dependencies
  - [**Express**](https://www.npmjs.com/package/express) - To create and run the application.
  - [**Mongoose**](https://www.npmjs.com/package/mongoose) - To interact with the database.
  - [**jsonwebtoken**](https://www.npmjs.com/package/jwt) (jwt) - To provide login and authentication.
  - [**bcryptjs**](https://www.npmjs.com/package/bcrypt) - To encrypt sensitive user data.
  - [**validator**](https://www.npmjs.com/package/validator) - Provides functions to validate certain conditions (e.g check that email template is correct)

## Dev dependencies
  - [**env-cmd**](https://www.npmjs.com/package/env-cmd) - Load environmental variables from external .env file.
  - [**jest**](https://www.npmjs.com/package/jest) - Javascript testing framework.
  - [**nodemon**](https://www.npmjs.com/package/nodemon) - Restarts every time we save.
  - [**supertest**](https://www.npmjs.com/package/supertest) - Library for testing Node.js Express http servers.
