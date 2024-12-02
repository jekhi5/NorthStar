![Logo](north-star-logo.png)
# North Star - Your guiding light when it comes to coding struggles


Table of Contents:
- <a href="#about" style="color: #d177f7;">About</a>
- <a href="#notable-features" style="color: #d177f7;">Notable features</a>
- <a href="#future-implementations" style="color: #d177f7;">Future implementations</a>
- <a href="#how-to-start-the-development-environment" style="color: #d177f7;">How to start the development environment</a>
- <a href="#database-architecture" style="color: #d177f7;">Database Architecture</a>
- <a href="#making-contributions" style="color: #d177f7;">Making Contributions</a>
- <a href="#credits" style="color: #d177f7;">Credits</a>
- <a href="#project-authors" style="color: #d177f7;">Project Authors</a>
- <a href="#additional-contributors" style="color: #d177f7;">Additional contributors</a>
- <a href="#thanks" style="color: #d177f7;">Thanks</a>

## About

<a href="https://cs4530-f24-202.onrender.com" style="color: #d177f7;">North star</a> is a question and answer forum designed by and for software developers. Here, you can get answers about niche errors, interact with other community members, earn status and show your flair, and so much more!

This project is hosted in this monorepo and is created with love in Typescript and React using Express and sockets. Additionally, authentication functionality is integrated with Firebase and the data is stored securely in MongoDB. These services were chosen due to their ease in integration with web applications and emphasis on security. While we aim to help users understand their own bugs in security infrastructure, we'd like to lead by example in the way we host our platform.

## Notable features

- Subscription and notification system
  - Email notifications
  - Live updates on the site
- Reputation
  - Tiered badge system
  - Increasing reputation on site interactions
- Global chatroom

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
  - Install dependencies: `npm install`
  - Initialize a local instance of MongoDb:
    - Follow the <a href="https://www.mongodb.com/docs/manual/administration/install-community/" style="color: #d177f7;">instructions in the official MongoDB documentation</a> to install the free community edition
    - Choose ‘Install on Linux’, ‘Install on macOS’, or ‘Install on Windows’, depending on your system
      - **For Windows:**
        - Scroll down to the section labeled ‘Install MongoDB Community Edition.’ and click on <a href="https://www.mongodb.com/try/download/compass" style="color: #d177f7;">here</a>
        - For Windows, in the Package dropdown, select msi. Then download and run the installer
        - On Windows, select the “Install MongoDB as a Service” checkbox and install. This will start MongoDB as a background service
        - Install “MongoDB Compass” if prompted
        - Verify if the MongoDB server is running using the Windows Services app
      - **For Mac:**
        - Download the dmg file from <a href="https://www.mongodb.com/try/download/compass" style="color: #d177f7;">here</a>. Once the application starts:
          - Click on “Add new connection” in the left sidebar.
          - Make sure the URI field contains `mongodb://localhost:27017`
          - Click on “Connect” - MongoDB will need to be running as a macOS service
    - Install the Mongo shell (mongosh)
      - **For Windows:**:
        - Download it <a href="https://www.mongodb.com/try/download/shell_" style="color: #d177f7;">here</a> using the msi package. You can also use mongosh to see if the MongoDB server is running. Try the MongoDB Community Edition and the command show dbs; you should see a list of existing databases in your local instance
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

- <a href="https://expressjs.com/en/guide/routing.html" style="color: #d177f7;">Express Tutorial</a>
- MongoDB tutorial: A mini tutorial.
- <a href="https://mongoosejs.com/docs/queries.html" style="color: #d177f7;">Mongoose Queries</a>
- <a href="https://mongoosejs.com/docs/documents.html" style="color: #d177f7;">Mongoose Documents</a>
- <a href="https://jestjs.io/docs/getting-started" style="color: #d177f7;">Jest Basics</a>
- <a href="https://jestjs.io/docs/mock-functions" style="color: #d177f7;">Mocking in Jest</a>
- <a href="https://github.com/alonronin/mockingoose" style="color: #d177f7;">Mocking Mongoose functions</a>


## Database Architecture

The schemas for the database are documented in the directory `server/models/schema`.
A class diagram for the schema definition is shown below:

![Class Diagram](class-diagram.png)

## Making Contributions

- We encourage users to add your own contributions to this project! Here is how we would appreciate you doing that:
  - Ensure you follow the <a href="/ContributorCovenant.md" style="color: #d177f7;">Contributor Covenant</a>
  - Make an <a href="https://github.com/neu-cs4530/fall24-project-fall24-team-project-group-202/issues" style="color: #d177f7;">issue</a>
  - Make a branch off of the `main` branch named with a _clear_ and _succinct_ branch name (no more than 30 characters)
  - Ensure your commit messages are <a href="https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/#https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/#heading-5-steps-to-write-better-commit-messages:~:text=5%20Steps%20to%20Write%20Better%20Commit%20Messages" style="color: #d177f7;">professional and clear</a>
  - When you're ready, open up a <a href="https://github.com/neu-cs4530/fall24-project-fall24-team-project-group-202/pulls" style="color: #d177f7;">pull request</a> (PR)
    - Please fill out the pre-populated form to ensure that your PR is read in a timely manner. When you

## Credits

### Project Authors

Ken Borrero - <a href="https://github.com/KennHenn" style="color: #d177f7;">GitHub</a>, <a href="https://www.linkedin.com/in/kennethborrero/" style="color: #d177f7;">LinkedIn</a>  
Ashley Davis - <a href="https://github.com/ashleytdavis" style="color: #d177f7;">GitHub</a>, <a href="https://www.linkedin.com/in/ashleytdavis/" style="color: #d177f7;">LinkedIn</a>  
Jacob Kline - <a href="https://github.com/jekhi5" style="color: #d177f7;">GitHub</a>, <a href="https://www.linkedin.com/in/jacob-e-kline/" style="color: #d177f7;">LinkedIn</a>  
Grace Theobald - <a href="https://github.com/getheobald" style="color: #d177f7;">GitHub</a>, <a href="https://www.linkedin.com/in/gracelyn-theobald/" style="color: #d177f7;">LinkedIn</a>

#### Additional contributors

- _Could be you_

### Thanks

Thank you to Anikesh Kamath, our TA, who was incredibly supportive and helpful as we move through this project!

Thank you to <a href="https://www.khoury.northeastern.edu/home/abhutta/" style="color: #d177f7;">Professor Adeel Bhutta</a> and <a href="https://www.khoury.northeastern.edu/home/wand/" style="color: #d177f7;">Professor Mitch Wand</a> for their work on the <a href="https://neu-se.github.io/CS4530-Fall-2024/" style="color: #d177f7;">CS4530 - Foundations of Software Engineering</a> course at Northeastern University that made this project possible