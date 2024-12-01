![Logo](north-star-logo.png)
# North Star - Your guiding light when it comes to coding struggles


- [North Star - Your guiding light when it comes to coding struggles](#north-star---your-guiding-light-when-it-comes-to-coding-struggles)
  - [About](#about)
  - [Notable features](#notable-features)
  - [Site navigation](#site-navigation)
  - [Future implementations](#future-implementations)
  - [How to start the development environment](#how-to-start-the-development-environment)
  - [Database Architecture](#database-architecture)
  - [Making Contributions](#making-contributions)
  - [Credits](#credits)
    - [Project Authors](#project-authors)
      - [Additional contributors](#additional-contributors)
    - [Thanks](#thanks)

## About

[North star](https://cs4530-f24-202.onrender.com) is a question and answer forum designed by and for software developers. Here, you can get answers about niche errors, interact with other community members, earn status and show your flair, and so much more!

This project is hosted in this monorepo and is created with love in Typescript and React using Express and sockets. Additionally, authentication functionality is integrated with Firebase and the data is stored securely in MongoDB. These services were chosen due to their ease in integration with web applications and emphasis on security. While we aim to help users understand their own bugs in security infrastructure, we'd like to lead by example in the way we host our platform.

## Notable features

## Site navigation

## Future implementations

- Multiple chat rooms with different topics for users to join and chat in
- Allow users to create their own global chat room on a topic of their choosing
- User can choose designs/themes for the site
- Users can edit their posts after the fact

## How to start the development environment

We've done our best to make it really easy to run this project locally. The client runs on port 3000 and the server on port 8000.

- Client
  - Navigate to the client directory: `cd client`
  - Install dependencies: `npm install`
  - Make a `.env` file in the `/client` directory
    - Add the variable: `REACT_APP_SERVER_URL=http://localhost:8000`
    - Create your own Firebase project and input the following values (from Firebase) into the `.env` file
      - `REACT_APP_FIREBASE_API_KEY=<value_from_firebase>`
      - `REACT_APP_FIREBASE_AUTH_DOMAIN=<value_from_firebase>`
      - `REACT_APP_FIREBASE_PROJECT_ID=<value_from_firebase>`
      - `REACT_APP_FIREBASE_STORAGE_BUCKET=<value_from_firebase>`
      - `REACT_APP_FIREBASE_MESSAGE_SENDER_ID=<value_from_firebase>`
      - `REACT_APP_FIREBASE_APP_ID=<value_from_firebase>`
      - `REACT_APP_FIREBASE_MEASUREMENT_ID=<value_from_firebase>`
  - Start: `npm start`
  - Run the linter with `npm run lint:fix`
- Server
  - Navigate to the server directory: `cd server`
  - Initialize a local instance of MongoDb:
    - Follow the [instructions in the official MongoDB documentation](https://www.mongodb.com/docs/manual/administration/install-community/) to install the free community edition
    - Choose ‘Install on Linux’, ‘Install on macOS’, or ‘Install on Windows’, depending on your system
      - **For Windows:**
        - Scroll down to the section labeled ‘Install MongoDB Community Edition.’ and click on [MongoDB Download Center](https://www.mongodb.com/try/download/community?tck=docs_server)
        - For Windows, in the Package dropdown, select msi. Then download and run the installer
        - On Windows, select the “Install MongoDB as a Service” checkbox and install. This will start MongoDB as a background service
        - Install “MongoDB Compass” if prompted
        - Verify if the MongoDB server is running using the Windows Services app
      - **For Mac:**
        - Download the dmg file from <https://www.mongodb.com/try/download/compass>. Once the application starts:
          - Click on “Add new connection” in the left sidebar.
          - Make sure the URI field contains `mongodb://localhost:27017`
          - Click on “Connect” - MongoDB will need to be running as a macOS service
    - Install the Mongo shell (mongosh)
      - **For Windows:**:
        - Download it [here](https://www.mongodb.com/try/download/shell_) using the msi package. You can also use mongosh to see if the MongoDB server is running. Try the MongoDB Community Edition and the command show dbs; you should see a list of existing databases in your local instance
      - **For Mac:**
        - Mongo shell is automatically installed with MongoDB through the Mac installation instructions. To use it, make sure MongoDB is running as a macOS service, then type mongosh into the terminal
  - Create a `.env` file in the `/server` directory
    - Add the following variables:
      - `MONGODB_URI=mongodb://127.0.0.1:27017`
      - `CLIENT_URL=http://localhost:3000`
      - `PORT=8000`
    - If you want to have your local environment send emails on notifications (not required for dev environment to function), set up a Google Project and add the following variables to the `.env` file (we followed the tutorial [here](https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a)):
      - `EMAIL=<email_to_send_from>`
      - `REFRESH_TOKEN=<refresh_token>`
      - `CLIENT_SECRET=<client_secret>`
      - `CLIENT_ID=<client_id>`
  - When using our program locally, you may want to have some starter data populated. Feel free to use the `server/populate_db.ts` file to automatically populate your database with some dummy data:
    - `npx ts-node populate_db.ts mongodb://127.0.0.1:27017/fake_so`
  - Run the server with `npm start`
  - Run tests with the command `npm run test` in the `/server` directory
  - Run the linter with `npm run lint:fix`

Some potentially useful resources are:

- Express Tutorial: <https://expressjs.com/en/guide/routing.html>
- MongoDB tutorial: A mini tutorial.
- Mongoose Queries: <https://mongoosejs.com/docs/queries.html>
- Mongoose Documents: <https://mongoosejs.com/docs/documents.html>
- Jest Basics: <https://jestjs.io/docs/getting-started>
- Mocking in Jest: <https://jestjs.io/docs/mock-functions>
- Mocking Mongoose functions: <https://github.com/alonronin/mockingoose>

## Database Architecture

The schemas for the database are documented in the directory `server/models/schema`.
A class diagram for the schema definition is shown below:

![Class Diagram](class-diagram.png)

## Making Contributions

- We encourage users to add your own contributions to this project! Here is how we would appreciate you doing that:
  - Ensure you follow the [Contributor Covenant](/ContributorCovenant.md)
  - Make an [issue](https://github.com/neu-cs4530/fall24-project-fall24-team-project-group-202/issues)
  - Make a branch off of the `main` branch named with a _clear_ and _succinct_ branch name (no more than 30 characters)
  - Ensure your commit messages are [professional and clear](https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/#https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/#heading-5-steps-to-write-better-commit-messages:~:text=5%20Steps%20to%20Write%20Better%20Commit%20Messages)
  - When you're ready, open up a [pull request](https://github.com/neu-cs4530/fall24-project-fall24-team-project-group-202/pulls) (PR)
    - Please fill out the pre-populated form to ensure that your PR is read in a timely manner. When you

## Credits

### Project Authors

Ken Borrero - [GitHub](https://github.com/KennHenn), [LinkedIn](https://www.linkedin.com/in/kennethborrero/)  
Ashley Davis - [GitHub](https://github.com/ashleytdavis), [LinkedIn](https://www.linkedin.com/in/ashleytdavis/)  
Jacob Kline - [GitHub](https://github.com/jekhi5), [LinkedIn](https://www.linkedin.com/in/jacob-e-kline/)  
Grace Theobald - [GitHub](https://github.com/getheobald), [LinkedIn](https://www.linkedin.com/in/gracelyn-theobald/)

#### Additional contributors

- _Could be you_

### Thanks

Thank you to Anikesh Kamath, our TA, who was incredibly supportive and helpful as we move through this project!

Thank you to [Professor Adeel Bhutta](https://www.khoury.northeastern.edu/home/abhutta/) and [Professor Mitch Wand](https://www.khoury.northeastern.edu/home/wand/) for their work on the [CS4530 - Foundations of Software Engineering](https://neu-se.github.io/CS4530-Fall-2024/) course at Northeastern University that made this project possible
