import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { Server } from 'socket.io';

export type FakeSOSocket = Server<ServerToClientEvents>;

/**
 * Interface representing a notification in the application, which contains:
 * - _id - The unique identifier for the PostNotification. Optional field.
 * - title - The title of the PostNotification.
 * - text - The content of the PostNotification.
 * - postType - The type of the post that the PostNotification is about.
 * - postId - The unique identifier of the post that the PostNotification is about.
 * - fromUser - The user who triggered the PostNotification.
 * - forUser - The user who the PostNotification is for.
 */
export interface PostNotification {
  _id?: ObjectId;
  title: string;
  text: string;
  postType: 'Question' | 'Answer' | 'Comment';
  postId: ObjectId;
  fromUser: User;
  forUser: User;
}

/**
 * Type representing the possible ordering options for questions.
 */
export type OrderType = 'newest' | 'unanswered' | 'active' | 'mostViewed';

/**
 * Interface representing a user in the application, which contains:
 * - uid - The unique identifier for the user.
 * - username - The username of the user.
 * - email - The email address of the user.
 * - password - The password of the user. Optional field.
 *
 **/
export interface User {
  _id?: ObjectId;
  uid: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  status: 'Not endorsed' | 'Endorsed';
}

/**
 * Interface representing an Answer document, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - text - The content of the answer
 * - ansBy - The User who wrote the answer
 * - ansDateTime - The date and time when the answer was created
 * - comments - Object IDs of comments that have been added to the answer by users, or comments themselves if populated
 */
export interface Answer {
  _id?: ObjectId;
  text: string;
  ansBy: User;
  ansDateTime: Date;
  upVotes: string[];
  downVotes: string[];
  comments: Comment[] | ObjectId[];
}

/**
 * Interface extending the request body when adding an answer to a question, which contains:
 * - qid - The unique identifier of the question being answered
 * - ans - The answer being added
 */
export interface AnswerRequest extends Request {
  body: {
    qid: string;
    ans: Answer;
  };
}

/**
 * Type representing the possible responses for an Answer-related operation.
 */
export type AnswerResponse = Answer | { error: string };

/**
 * Interface representing a Tag document, which contains:
 * - _id - The unique identifier for the tag. Optional field.
 * - name - Name of the tag
 */
export interface Tag {
  _id?: ObjectId;
  name: string;
  description: string;
}

/**
 * Interface representing a Question document, which contains:
 * - _id - The unique identifier for the question. Optional field.
 * - title - The title of the question.
 * - text - The detailed content of the question.
 * - tags - An array of tags associated with the question.
 * - askedBy - The User who asked the question.
 * - askDateTime - he date and time when the question was asked.
 * - answers - Object IDs of answers that have been added to the question by users, or answers themselves if populated.
 * - views - An array of uids of Users that have viewed the question.
 * - upVotes - An array of uids of Users that have upvoted the question.
 * - downVotes - An array of uids of Users that have downvoted the question.
 * - comments - Object IDs of comments that have been added to the question by users, or comments themselves if populated.
 * - subscribers - An array of users who are subscribed to the question.
 */
export interface Question {
  _id?: ObjectId;
  title: string;
  text: string;
  tags: Tag[];
  askedBy: User;
  askDateTime: Date;
  answers: Answer[] | ObjectId[];
  views: string[];
  upVotes: string[];
  downVotes: string[];
  comments: Comment[] | ObjectId[];
  subscribers: User[] | ObjectId[];
}

/**
 * Type representing the possible responses for a Question-related operation.
 */
export type QuestionResponse = Question | { error: string };

/**
 * Interface for the request query to find questions using a search string, which contains:
 * - order - The order in which to sort the questions
 * - search - The search string used to find questions
 * - askedBy - The uid of the user who asked the question
 */
export interface FindQuestionRequest extends Request {
  query: {
    order: OrderType;
    search: string;
    askedBy: string;
  };
}

/**
 * Interface for the request parameters when finding a question by its ID.
 * - qid - The unique identifier of the question.
 */
export interface FindQuestionByIdRequest extends Request {
  params: {
    qid: string;
  };
  query: {
    uid: string;
  };
}

/**
 * Interface for the request body when adding a new question.
 * - body - The question being added.
 */
export interface AddQuestionRequest extends Request {
  body: Question;
}

/**
 * Interface for the request body when upvoting or downvoting a question.
 * - body - The question ID and the uid of the user voting.
 *  - id - The unique identifier of the post being voted on.
 *  - uid - The uid of the user voting.
 */
export interface VoteRequest extends Request {
  body: {
    id: string;
    uid: string;
  };
}

/**
 * Interface for the request body when getting Notifications.
 * - body - The uid of the user voting.
 *  - uid - The uid of the user whom the PostNotification should be delivered to.
 */
export interface NotificationRequest extends Request {
  body: {
    uid: string;
  };
}

/**
 * Interface representing a Comment, which contains:
 * - _id - The unique identifier for the comment. Optional field.
 * - text - The content of the comment.
 * - commentBy - The User of the user who commented.
 * - commentDateTime - The date and time when the comment was posted.
 *
 */
export interface Comment {
  _id?: ObjectId;
  text: string;
  commentBy: User;
  commentDateTime: Date;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing a Message, which contains:
 * - _id - The unique identifier for the message. Optional field.
 * - content - The content of the message.
 * - sentBy - The User who sent the message.
 * - sentDateTime - The date and time when the message was sent.
 */
export interface Message {
  _id?: ObjectId;
  content: string;
  sentBy: User;
  sentDateTime: Date;
}

/**
 * Interface extending the request body when adding a subscriber to a question, which contains:
 * - id - The unique identifier of the question.
 * - user - The user who is subscribing to the question.
 */
export interface ToggleSubscriberRequest extends Request {
  body: {
    id: string;
    user: User;
  };
}

/**
 * Interface representing the payload for a subscriber update event, which contains:
 * - result - The updated question or null if not found.
 */
export interface SubscriberUpdatePayload {
  result: QuestionResponse | null;
}

/**
 * Interface extending the request body when adding a subscriber to a question, which contains:
 * - id - The unique identifier of the question.
 * - user - The user who is subscribing to the question.
 */
export interface ToggleSubscriberRequest extends Request {
  body: {
    id: string;
    user: User;
  };
}

/**
 * Type representing the possible responses for a Subscriber-related operation.
 */
export type SubscriberResponse = User | { error: string };

/**
 * Interface representing the payload for a subscriber update event, which contains:
 * - result - The updated question or null if not found.
 */
export interface SubscriberUpdatePayload {
  result: QuestionResponse | null;
}

/**
 * Interface extending the request body when adding a comment to a question or an answer, which contains:
 * - id - The unique identifier of the question or answer being commented on.
 * - type - The type of the comment, either 'question' or 'answer'.
 * - comment - The comment being added.
 */
export interface AddCommentRequest extends Request {
  body: {
    id: string;
    type: 'question' | 'answer';
    comment: Comment;
  };
}

/**
 * Type representing the possible responses for a Comment-related operation.
 */
export type CommentResponse = Comment | { error: string };

/**
 * Interface representing the payload for a comment update event, which contains:
 * - result - The updated question or answer.
 * - type - The type of the updated item, either 'question' or 'answer'.
 */
export interface CommentUpdatePayload {
  result: AnswerResponse | QuestionResponse | null;
  type: 'question' | 'answer';
}

/**
 * Type representing the possible responses for a User-related operation.
 */
export type UserResponse = User | { error: string };

/**
 * Interface representing the payload for a vote update event, which contains:
 * - id - The unique identifier of post being voted on.
 * - upVotes - An array of uids of Users who upvoted the question.
 * - downVotes - An array of uids of Users who downvoted the question.
 */
export interface VoteUpdatePayload {
  id: string;
  upVotes: string[];
  downVotes: string[];
  type: 'Question' | 'Answer' | 'Comment';
}

/**
 * Interface representing the payload for an answer update event, which contains:
 * - qid - The unique identifier of the question.
 * - answer - The updated answer.
 */
export interface AnswerUpdatePayload {
  qid: string;
  answer: AnswerResponse;
}

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: QuestionResponse) => void;
  answerUpdate: (result: AnswerUpdatePayload) => void;
  viewsUpdate: (question: QuestionResponse) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (comment: CommentUpdatePayload) => void;
  subscriberUpdate: (payload: SubscriberUpdatePayload) => void;
}
