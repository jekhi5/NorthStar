import { Q1_DESC, A1_TXT, A2_TXT } from '../../../server/data/posts_strings';

describe("Cypress Tests repeated to verify adding hyperlinks to text", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("npx ts-node ../server/remove_db.ts mongodb://127.0.0.1:27017/fake_so");
    cy.exec("npx ts-node ../server/populate_db.ts mongodb://127.0.0.1:27017/fake_so");
  });


  it("9.1 | Adds a question with a hyperlink and verifies", () => {
    cy.visit("http://localhost:3000");
    cy.contains('Welcome to FakeStackOverflow!');
    cy.get("#usernameInput").type("testuser")
    cy.contains("Submit").click();
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("How to add a hyperlink in Markdown?");
    cy.get("#formTextInput").type(
      "Here is a link: [Google](https://www.google.com)"
    );
    cy.get("#formTagInput").type("markdown");
    cy.contains("Post Question").click();
    cy.contains("How to add a hyperlink in Markdown?").click();
    cy.get("#questionBody")
      .find("a")
      .should("have.attr", "href", "https://www.google.com");
  });

  it("9.2 | Create new answer should be displayed at the top of the answers page", () => {
    const answers = [
      "Check this link for more info: [Documentation](https://docs.example.com)",
      A1_TXT,
      A2_TXT,
    ];
    cy.visit("http://localhost:3000");
    cy.contains('Welcome to FakeStackOverflow!');
    cy.get("#usernameInput").type("testuser")
    cy.contains("Submit").click();
    cy.contains(Q1_DESC).click();
    cy.contains("Answer Question").click();
    cy.get("#answerTextInput").type(
      "Check this link for more info: [Documentation](https://docs.example.com)"
    );
    cy.contains("Post Answer").click();
    cy.get(".answerText")
      .first()
      .within(() => {
        cy.get("a").should("have.attr", "href", "https://docs.example.com");
      });
    cy.contains("testuser");
    cy.contains("0 seconds ago");
  });

  it("9.3 | Tries to add a question with an invalid hyperlink and verifies failure", () => {
    const invalidUrls = [
      "[Google](htt://www.google.com)",
      "[Microsoft](microsoft.com)",
      "[](https://www.google.com/)",
      "[link]()",
      "dfv[]()",
      "[link](http://www.google.com/)",
      "[Google](https//www.google.com)",
      "[GitHub](http//github.com)",
      "[Facebook](https:/facebook.com)",
      "[Twitter](://twitter.com)",
      "[Netflix](htps://www.netflix)",
      "[Google](htts://www.goo<gle.com)",
      "[Google](http://www.google)",
      "[Dropbox](ttps://www.dropbox.c-m)",
      "[LinkedIn](ps:/www.linkedin.com)",
      "[Adobe](ttps://www.adobe..com)",
      "[Spotify](ttp:///www.spotify.com)",
      "[Reddit](http://reddit)",
      "[Wikipedia](tps://www.wikipedia=com)",
    ];
    cy.visit("http://localhost:3000");
    cy.contains('Welcome to FakeStackOverflow!');
    cy.get("#usernameInput").type("testuser")
    cy.contains("Submit").click();
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type(
      "How to add an invalid hyperlink in Markdown?"
    );
    invalidUrls.forEach((url) => {
      cy.get("#formTextInput").clear().type(`This is an invalid link: ${url}`);
      cy.get("#formTagInput").clear().type("markdown");
      cy.contains("Post Question").click();
      cy.contains("Invalid hyperlink");
    });
    cy.visit("http://localhost:3000");
    cy.contains('Welcome to FakeStackOverflow!');
    cy.get("#usernameInput").type("testuser")
    cy.contains("Submit").click();
    cy.contains("How to add an invalid hyperlink in Markdown?").should(
      "not.exist"
    );
  });

  it("9.4 | Attempts to add an answer with an invalid hyperlink and verifies failure", () => {
    cy.visit("http://localhost:3000");
    cy.contains('Welcome to FakeStackOverflow!');
    cy.get("#usernameInput").type("testuser")
    cy.contains("Submit").click();
    cy.contains(Q1_DESC).click();
    cy.contains("Answer Question").click();
    cy.get("#answerTextInput").type(
      "Check this invalid link: [](https://wrong.url)"
    );
    cy.contains("Post Answer").click();
    cy.contains("Invalid hyperlink");
    cy.visit("http://localhost:3000");
    cy.contains('Welcome to FakeStackOverflow!');
    cy.get("#usernameInput").type("testuser")
    cy.contains("Submit").click();
    cy.contains(Q1_DESC).click();
    cy.get(".answerText").should("not.contain", "https://wrong.url");
  });

  it("9.5 | Adds multiple questions with valid hyperlinks and verify", () => {
    cy.visit("http://localhost:3000");
    cy.contains('Welcome to FakeStackOverflow!');
    cy.get("#usernameInput").type("testuser")
    cy.contains("Submit").click();

    // List of question data
    const questions = [
      {
        title: "Test Question 1",
        text: "Test Question 1 Text [Google](https://www.google.com)",
        tag: "javascript",
        link: "https://www.google.com",
      },
      {
        title: "Test Question 2",
        text: "Test Question 2 Text [Yahoo](https://www.yahoo.com)",
        tag: "react",
        link: "https://www.yahoo.com",
      },
      {
        title: "How to add a hyperlink in Markdown?",
        text: "Here is a link: [Google](https://www.google.com)",
        tag: "markdown",
        link: "https://www.google.com",
      },
    ];

    // Add multiple questions with hyperlinks
    questions.forEach((question) => {
      cy.contains("Ask a Question").click();
      cy.get("#formTitleInput").type(question.title);
      cy.get("#formTextInput").type(question.text);
      cy.get("#formTagInput").type(question.tag);
      cy.contains("Post Question").click();
    });

    cy.contains("Questions").click();
    questions.reverse().forEach((q) => {
      cy.contains(q.title).click();
      cy.get("#questionBody").find("a").should("have.attr", "href", q.link);
      cy.contains("Questions").click();
    });
  });
});
