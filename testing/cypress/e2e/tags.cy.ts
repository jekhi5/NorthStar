import { Q1_DESC, Q3_DESC, Q4_DESC } from '../../../server/data/posts_strings';

describe("Cypress Tests to verify tagging", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("npx ts-node ../server/remove_db.ts mongodb://127.0.0.1:27017/fake_so");
    cy.exec("npx ts-node ../server/populate_db.ts mongodb://127.0.0.1:27017/fake_so");
  });

  it("7.1 | Adds a question with tags, checks the tags existied", () => {
    cy.visit("http://localhost:3000");
    cy.contains('Welcome to FakeStackOverflow!');
    cy.get("#usernameInput").type("testuser")
    cy.contains("Submit").click();
    
    // add a question with tags
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question A");
    cy.get("#formTextInput").type("Test Question A Text");
    cy.get("#formTagInput").type("test1 test2 test3");
    cy.contains("Post Question").click();

    // clicks tags
    cy.contains("Tags").click();
    cy.contains("test1");
    cy.contains("test2");
    cy.contains("test3");
  });

  it("7.2 | Checks if all tags exist", () => {
    cy.visit("http://localhost:3000");
    cy.contains('Welcome to FakeStackOverflow!');
    cy.get("#usernameInput").type("testuser")
    cy.contains("Submit").click();
    // all tags exist in the page
    cy.contains("Tags").click();
    cy.contains("react", { matchCase: false });
    cy.contains("javascript", { matchCase: false });
    cy.contains("android-studio", { matchCase: false });
    cy.contains("shared-preferences", { matchCase: false });
    cy.contains("storage", { matchCase: false });
    cy.contains("website", { matchCase: false });
  });

  it("7.3 | Checks if all questions exist inside tags", () => {
    cy.visit("http://localhost:3000");
    cy.contains('Welcome to FakeStackOverflow!');
    cy.get("#usernameInput").type("testuser")
    cy.contains("Submit").click();
    // all question no. should be in the page
    cy.contains("Tags").click();
    cy.contains("6 Tags");
    cy.contains("1 question");
    cy.contains("2 question");
  });

  it("8.1 | go to question in tag react", () => {
    cy.visit("http://localhost:3000");
    cy.contains('Welcome to FakeStackOverflow!');
    cy.get("#usernameInput").type("testuser")
    cy.contains("Submit").click();
    // all question no. should be in the page
    cy.contains("Tags").click();
    cy.contains("react").click();
    cy.contains(Q1_DESC);
  });

  it("8.2 | go to questions in tag storage", () => {
    cy.visit("http://localhost:3000");
    cy.contains('Welcome to FakeStackOverflow!');
    cy.get("#usernameInput").type("testuser")
    cy.contains("Submit").click();
    // all question no. should be in the page
    cy.contains("Tags").click();
    cy.contains("storage").click();
    cy.contains(Q4_DESC);
  });

  it("8.3 | create a new question with a new tag and finds the question through tag", () => {
    cy.visit("http://localhost:3000");
    cy.contains('Welcome to FakeStackOverflow!');
    cy.get("#usernameInput").type("testuser")
    cy.contains("Submit").click();

    // add a question with tags
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question A");
    cy.get("#formTextInput").type("Test Question A Text");
    cy.get("#formTagInput").type("test1-tag1");
    cy.contains("Post Question").click();

    // clicks tags
    cy.contains("Tags").click();
    cy.contains("test1-tag1").click();
    cy.contains("Test Question A");
  });

  it("10.1 | Clicks on a tag and verifies the tag is displayed", () => {
    const tagNames = "javascript";

    cy.visit("http://localhost:3000");
    cy.contains('Welcome to FakeStackOverflow!');
    cy.get("#usernameInput").type("testuser")
    cy.contains("Submit").click();
    cy.contains("Tags").click();

    cy.contains(tagNames).click();
    cy.get(".question_tags").each(($el, index, $list) => {
      cy.wrap($el).should("contain", tagNames);
    });
  });

  it("10.2 | Clicks on a tag in homepage and verifies the questions related tag is displayed", () => {
    const tagNames = "storage";

    cy.visit("http://localhost:3000");
    cy.contains('Welcome to FakeStackOverflow!');
    cy.get("#usernameInput").type("testuser")
    cy.contains("Submit").click();

    //clicks the 3rd tag associated with the question.
    cy.get(".question_tag_button").eq(2).click();

    cy.get(".question_tags").each(($el, index, $list) => {
      cy.wrap($el).should("contain", tagNames);
    });
  });
});
