## Application Brief

This project is a small example of microservices architecture with monorepo in NESTJS which allows admin users to generate
access keys for users and rate-limit their requests for information retrieval along with other admin functionalites.
This project uses MONGODB as the database. There are 2 microservices in this project **"access-key-m1"** and **"token-information-m2"**.
There is common library as well which is shared by both microservices which contains guardss, pipes etc which can be used by any
microservices in the project.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
