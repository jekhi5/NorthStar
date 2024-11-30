import { Socket } from 'socket.io-client';

export type FakeSOSocket = Socket<ServerToClientEvents>;

/**
 * Interface representing a notification in the application, which contains:
 * - _id - The unique identifier for the PostNotification. Optional field.
 * - title - The title of the PostNotification.
 * - text - The content of the PostNotification.
 * - postType - The type of the post that the PostNotification is about.
 * - postId - The unique identifier of the post that the PostNotification is about.
 * - fromUser - The user who triggered the PostNotification.
 */
export interface PostNotification {
  _id?: string;
  title: string;
  text: string;
  notificationType:
    | 'questionAnswered'
    | 'commentAdded'
    | 'questionPostedWithTag'
    | 'questionUpvoted'
    | 'welcomeNotification';
  postId?: string;
  fromUser?: User;
  questionId?: string;
}

/**
 * Represents a user in the application.
 */
export interface User {
  _id?: string;
  uid: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  status: 'Not endorsed' | 'Endorsed' | 'Super Smarty Pants' | 'Mentor' | 'Grandmaster';
  postNotifications: { postNotification: PostNotification; read: boolean }[];
  reputation: number;
  emailsEnabled: boolean;
}

/**
 * Interface represents the data for a user that is necessary for displaying user on Users page.
 * This is different from the User type because there is less information required when displaying
 * Users on the Users page. This type is representative of that.
 *
 * uid - The unique identifier of the user.
 * username - The username of the user.
 * profilePicture - The profile picture of the user.
 * status - The status of the user.
 * reputation - The reputation number of the user.
 */
export interface UserData {
  uid: string;
  username: string;
  profilePicture: string;
  status: string;
  reputation: number;
}

/**
 * Enum representing the possible ordering options for questions.
 * and their display names.
 */
export const orderTypeDisplayName = {
  newest: 'Newest',
  unanswered: 'Unanswered',
  active: 'Active',
  mostViewed: 'Most Viewed',
  voteCount: 'Vote Count',
} as const;

/**
 * Type representing the keys of the orderTypeDisplayName object.
 * This type can be used to restrict values to the defined order types.
 */
export type OrderType = keyof typeof orderTypeDisplayName;

/**
 * Interface represents a comment.
 *
 * text - The text of the comment.
 * commentBy - The author of the comment.
 * commentDateTime - Time at which the comment was created.
 * upVotes - An array of usernames who upvoted the comment.
 * downVotes - An array of usernames who downvoted the comment.
 */
export interface Comment {
  _id?: string;
  text: string;
  commentBy: User;
  commentDateTime: Date;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing a tag associated with a question.
 *
 * @property name - The name of the tag.
 * @property description - A description of the tag.
 */
export interface Tag {
  _id?: string;
  name: string;
  description: string;
  subscribers: User[];
}

/**
 * Interface represents the data for a tag.
 *
 * name - The name of the tag.
 * qcnt - The number of questions associated with the tag.
 */
export interface TagData {
  name: string;
  qcnt: number;
}

/**
 * Interface representing the voting data for a question, which contains:
 * - qid - The ID of the question being voted on
 * - upVotes - An array of user IDs who upvoted the question
 * - downVotes - An array of user IDs who downvoted the question
 */
export interface VoteData {
  id: string;
  upVotes: string[];
  downVotes: string[];
  type: 'Question' | 'Answer' | 'Comment';
}

/**
 * Interface representing the subscriber data for a question, which contains:
 * - id - The ID of the question being voted on
 * - subscribers - An array of user IDs who are subscribed the question
 */
export interface SubscribeData {
  id: string;
  subscribers: string[];
}

/**
 * Interface representing an Answer document, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - text - The content of the answer
 * - ansBy - The username of the user who wrote the answer
 * - ansDateTime - The date and time when the answer was created
 * - upVotes - An array of usernames who upvoted the answer.
 * - downVotes - An array of usernames who downvoted the answer.
 * - comments - Comments associated with the answer.
 */
export interface Answer {
  _id?: string;
  text: string;
  ansBy: User;
  ansDateTime: Date;
  upVotes: string[];
  downVotes: string[];
  comments: Comment[];
}

/**
 * Interface representing the structure of a Question object.
 *
 * - _id - The unique identifier for the question.
 * - tags - An array of tags associated with the question, each containing a name and description.
 * - answers - An array of answers to the question
 * - title - The title of the question.
 * - views - An array of usernames who viewed the question.
 * - text - The content of the question.
 * - askedBy - The User who asked the question.
 * - askDateTime - The date and time when the question was asked.
 * - upVotes - An array of usernames who upvoted the question.
 * - downVotes - An array of usernames who downvoted the question.
 * - comments - Comments associated with the question.
 * - subscribers - An array of Users subscribed to the question.
 */
export interface Question {
  _id?: string;
  tags: Tag[];
  answers: Answer[];
  title: string;
  views: string[];
  text: string;
  askedBy: User;
  askDateTime: Date;
  upVotes: string[];
  downVotes: string[];
  comments: Comment[];
  subscribers: User[];
}

/**
 * Interface representing a Message document, which contains:
 * - _id - The unique identifier for the message. Optional field.
 * - content - The content of the message.
 * - sentBy - The user who wrote the message.
 * - sentDateTime - The date and time when the message was sent.
 */
export interface Message {
  _id?: string;
  content: string;
  sentBy: User;
  sentDateTime: Date;
}

/**
 * Interface representing the payload for a vote update socket event.
 */
export interface VoteUpdatePayload {
  id: string;
  upVotes: string[];
  downVotes: string[];
  type: 'Question' | 'Answer' | 'Comment';
}

export interface AnswerUpdatePayload {
  qid: string;
  answer: Answer;
}

export interface CommentUpdatePayload {
  result: Question | Answer;
  type: 'question' | 'answer';
}

export interface SubscriberUpdatePayload {
  result: Question | Tag;
  type: 'question' | 'tag';
}

export interface PostNotificationUpdatePayload {
  notification?: PostNotification;
  type: 'markRead' | 'newNotification';
  forUserUid: string;
}

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: Question) => void;
  answerUpdate: (update: AnswerUpdatePayload) => void;
  viewsUpdate: (question: Question) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (update: CommentUpdatePayload) => void;
  subscriberUpdate: (payload: SubscriberUpdatePayload) => void;
  newMessage: (message: Message) => void;
  messageUpdate: (updatedMessage: Message) => void;
  messageDelete: (messageId: string) => void;
  postNotificationUpdate: (payload: PostNotificationUpdatePayload) => void;
}
