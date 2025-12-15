# Price checker

Group 12's software architecture course project: a backend for a price checker software system.

## Recommended tech / features

- Recommended languages: Python, JavaScript, and TypeScript

- Recommended databases: MySQL and MariaDB. Do not embbed SQL directly into code (so Mongoose should also be OK)

- Automatically tested code

- The backend system should be portable to almost any platform. => Use Docker.

- All communication between client applications and backend shall be encrypted (e.g., HTTPS).

## Shopper functionality

[] - Get the product price by barcode

    [] - If there's no price for the product, make the shopper manually enter it

    [] - Add location and timestamp to the data

    [] - Securely send and save the following data to the backend

        [] - barcode (type and GTIN number)

        [] - price of product

        [] - location (latitudes and longitudes)

        [] - timestamp

        [] - optional user preferences (how many kilometers the user thinks is still nearby)

[] - If the barcode has no product, notify the shopper

[] - Query backend and receive a list of nearby store prices for the same product

    [] - Return a sorted list in ascending order by price of nearby stores with

        [] - Store name and location

        [] - Product price

        [] - Also contain the store where the customer is currently in

        [] - Label of the product based on relative price (e.g., cheap, expensive)

        [] - Show discounts (added by store users)

    [] - Show the list in a user-friendly format with visual indicators (color coding, icons, labels)

## Store user functionality

[x] - Sign up (needs admin approval)

[x] - Sign in

[x] - Add new products one by one or multiple at a time

    [x] - Barcode (type and GTIN number)

    [x] - Location (latitudes and longtitudes)

    [x] - Price of the product

[x] - Add discounts to specific products

[x] - Edit store info

    [x] - Store name

    [x] - Store location

## Admin functionality

[x] - Accept or decline sign up requests (from store users)

[x] - Lock and unlock store users

[x] - Delete store user accounts

[x] - Create another admins

[x] - Log admin operations for auditing

# Evaluation checklist

[x] - Key architectural characteristics are clear, justified, and explained. (2 points)

[x] - Technology, design, and implementation choices are justified and based on functional requirements, architectural characteristics, and resource availability. (2 points)

[x] - Frontend and backend responsibilities are divided logically. No frontends need to be implemented. (2 points)

[x] - Separation of concerns (SoC) is applied. Fast-changing parts should not break slow-changing parts. (2 points)

[] - Code is approachable. It follows established standards and conventions. It documents itself. Abstractions are used in a self-documenting way. Unnecessary documentation is avoided, and part of the documentation is automated. (2 points)

[x] - Selected architectural style for the backend is suitable for the task, justified, and well-documented. (2 points)

[] - YAGNI: only necessary functionality is implemented. (2 points)

[] - DRY: duplicate code is avoided or justified. (2 points)

[] - KISS: solutions are kept as simple as possible. (2 points)

[] - SOLID principles are applied with examples in code. (2 points)

[x] - At least 2 design patterns are applied. Their use is evaluated and documented. (2 points)

[] - Backend is easy to deploy on different platforms (like Linux, Windows, cloud…) => use Docker! (2 points)

[] - Backend is easy to configure for different installations. (2 points)

[] - Backend's deployment process is clearly documented, and the documentation is kept up to date and is easily accessible. (2 points)

[] - Deployment is tested on at least two different platforms. (2 points)

[x] - All third-party dependencies are safe and documented. (2 points)

[] - Authentication and authorization is secure and the mechanisms are evaluated. Only secure ones are used. (2 points)

[] - Secure logging practices are implemented. Sensitive activities are auditable and no secrets are exposed in logs. (2 points)

[x] - API is well-defined and follows standard conventions and principles. (2 points)

[x] - API is versioned to support changes without breaking existing clients. (2 points)

[x] - Code structure makes it easy to find modules and components. (2 points)

[] - It is relatively easy to change the technologies the application uses (e.g., persistent storage, web framework), and to update major library and package versions. (2 points)

[] - Project is easy for new developers to join and code is reviewed before merging to dev (peer reviews). (2 points)

[] - It’s easy to add new features without breaking existing ones. (2 points)

[] - Selection and use of suitable tools is documented. **(Max 4 points, 1 point each)**

    [] a. Version control

    [] b. Project management & issue tracking

    [] c. Modeling & documenting architecture

    [] d. Detecting code smells & enforcing standards

    [] e. Managing dependencies

    [] f. Automatization

    [] g. Refactoring.

[x] - Code is easily available for stakeholders. Permissions are managed to guarantee security and safety. Branching strategies are followed. (2 points)

[] - DevOps practices are implemented in development, testing, and deployment to automate workflows. (2 points)
