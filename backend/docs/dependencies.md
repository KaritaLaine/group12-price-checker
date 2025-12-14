# Dependencies

All dependencies used are well known and actively maintained. Only necessary dependencies are used to minimize security risks.

**Main dependencies and their purposes in the system:**

- Mongoose to work with MongoDB using schemas.

- TypeScript to add type safety and reduce errors, making the code easier to maintain.

- Jest and Supertest for writing and running automated tests to make sure the app works as intended.

- Bcrypt for hashing and salting passwords before saving them to the database.

- Express as the backend framework for handling API requests.

- JWT (jsonwebtoken) for handling safe authentication and authorization using JSON Web Tokens.

- Dotenv for managing environment variables and keeping sensitive information out of the codebase.

- Cookie-parser for safely handling cookies in requests.

- Development dependencies such as nodemon, ts-node, and tsx are used only during development and do not affect production security.
