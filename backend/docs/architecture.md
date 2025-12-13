# Key architectural characteristics

- Scalability: The customer believes that this sort of application can have a large number of users in the future. The backend must have an application programming interface to serve unknown numbers and types of frontends, which can be anything from mobile apps to websites.

- Maintainability: It is important that the backend system is easy to maintain also in the long run.

- Portability: The backend application should be easy to deploy on diverse types of platforms (like Linux, Windows, cloud…).

- Authentication and authorization: The security of the authentication and authorization mechanisms are evaluated, and only secure ones are used.

- Configurability: The backend application is easy to configure for different installations. User preferences (e.g., How many kilometers the user thinks is still nearby.) should be applied.

- Testability: The customer prefers automatically tested code.

# Architectural style

Based on the key architectural characteristics we chose to use the layered architecture style. It makes the code easier to understand, maintain, and modify. Since each layer is independent, changes in one layer (for example. database layer) don't necessarily affect the ohers, which allows better scalability. Following layered architecture style also makes testing easier.

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

- Bcrypt for hashing and salting passwords before saving them to the database.

- JWT for secure authentication and authorization.

A key reason for choosing these technologies was the team’s familiarity with them. They also meet the functional requirements of the project, such as secure user authentication, automated testing, and portable deployment.

We also wanted tools that are widely used and well-documented to make sure they are stable and safe to use in our project. Teachers recommendations were also taken into consideration.

# Design patterns

We chose to follow the MVC (model-view-controller) pattern to complement the layered architecture style. This makes the code more modular, easier to maintain, and easier to test.

- Model layer: contains all database schemas.

- Controller layer: defines how the application behaves (business logic).

- Views: routes in our case. Defines all API endpoints and maps the requests to the appropriate controller methods.

For the second design pattern we chose to follow the middleware pattern. Instead of components interacting directly with each other, middleware receives requests, performs checks (such as authentication and authorization), and only forwards them to the controller if allowed. This separates different concerns (SoC), making the code simpler and easier to maintain.

Example of our authorize middleware:

```ts
import type { NextFunction, Request, Response } from "express"
import type { UserRole } from "../types/user"

// Check if user has the required role to access the route
const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // If user is not authenticated throw an error
    if (!req.user) {
      res.status(401).json({ error: "Please login and try again." })
      return
    }

    // If user has no permission, throw an error
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: "You don't have the necessary permissions for this action.",
      })
      return
    }

    next()
  }
}
```

#### Sources

- https://www.baeldung.com/cs/layered-architecture

- https://medium.com/@branimir.ilic93/express-js-best-practices-modular-vs-layered-approach-for-medium-and-large-appsintroduction-626e61cc908d

- https://www.geeksforgeeks.org/system-design/mvc-design-pattern/

- https://www.patterns.dev/vanilla/mediator-pattern/
