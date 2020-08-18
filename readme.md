# CMDC Database Examples
## Usage

This project exists simply to show some basic examples of the constraints of various database types, their advantages, and their disadvantages.

It is not intended to be used in a production environment as it contains almost no security, and is only to be used for in-class activities. Please do not connect this project to any database used for any real-world activities. **You have been warned.**

It's also not intended to demonstrate best best practices or be in any way comprehensive, but just exists to demonstrate some basic querying as well has how different databases treat and store data, and should be used as a visual aid or as a basis for in-class discussion.

The server expects a `.env` file in the `/server` directory. Example values:

```
HOST=127.0.0.1
MYSQL_PASS=my-super-secure-password
MYSQL_USER=some-mysql-user
MONGO_USER=some-mongo-user
MONGO_PASS=my-super-secure-password
REDIS_PASS=my-super-secure-password
```