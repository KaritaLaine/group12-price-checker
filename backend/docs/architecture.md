# Architectural style

We chose to use the layered architecture style, because it makes the code easier to understand, maintain, and modify. Since each layer is independent, changes in one layer (for example. database layer) don't necessarily affect the ohers, which allows better scalability. Following layered architecture style also makes testing easier.

The application is going to be separated into different layers:

- Presentation layer: this applications doesn't have a front-end (yet). There are only REST endpoints you can test.

- Routes layer: defines all API endpoints and maps the requests to the appropriate controller methods.

- Controllers layer: defines how the application behaves (business logic).

- Models layer: defines database schemas and provides functions for interacting with the database.

- Database layer: stores all data, like users, stores, and products.

# Technologies

The application is going to use the following technologies:

- Github for version control.

- MongoDB to store data like users, stores, and products.

- Mongoose to work with mongoDB using schemas.

- Docker to deploy the app in different environments.

- TypeScript to add type safety and make the code easier to maintain.

- Node.js for running the backend server.

- Express.js to handle routing and requests.

- Jest and Supertest for writing and running automated tests.

- JWT for secure authentication and authorization.

A key reason for choosing these technologies was the team’s familiarity with them. We also wanted tools that are widely used and well-documented to make sure they are stable and safe to use in our project. Teachers recommendations were also taken into consideration.

# Design patterns

We chose to follow the MVC (model-view-controller) pattern to complement the layered architecture style. This makes the code more modular, easier to maintain, and easier to test.

- Model layer: contains all database schemas.

- Controller layer: defines how the application behaves (business logic).

- Views: routes in our case. Defines all API endpoints and maps the requests to the appropriate controller methods.

TODO: For the second design pattern , ...

#### Sources

- https://www.baeldung.com/cs/layered-architecture

- https://medium.com/@branimir.ilic93/express-js-best-practices-modular-vs-layered-approach-for-medium-and-large-appsintroduction-626e61cc908d

- https://www.geeksforgeeks.org/system-design/mvc-design-pattern/
