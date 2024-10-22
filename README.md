The individual and team project for this class are designed to mirror the experiences of a software engineer joining a new development team: you will be “onboarded” to our codebase, make several individual contributions, and then form a team to propose, develop and implement new features. The codebase that we’ll be developing on is a Fake Stack Overflow project (let’s call it HuskyFlow). You will get an opportunity to work with the starter code which provides basic skeleton for the app and then additional features will be proposed and implemented by you! All implementation will take place in the TypeScript programming language, using React for the user interface.

Refer to the [Project Overview](https://neu-se.github.io/CS4530-Fall-2024/assignments/project-overview) for more instructions on the project deliverables and expectations.

{ : .note } Refer to [IP1](https://neu-se.github.io/CS4530-Fall-2024/assignments/ip1) and [IP2](https://neu-se.github.io/CS4530-Fall-2024/assignments/ip2) for instructions related to setting up MongoDB, setting environment variables, and running the client and server.

{ : .note } The fields of the Schemas were changed. As a result, features such as view counts will not work on database entries that were made in IP1 and IP2. If you want to test features, delete old database entries and make new questions either through manually making it in the client or run populate_db.ts.

## Database Architecture

The schemas for the database are documented in the directory `server/models/schema`.
A class diagram for the schema definition is shown below:

![Class Diagram](class-diagram.png)
