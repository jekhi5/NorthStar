import { ObjectId } from 'mongodb';
import mongoose, { QueryOptions } from 'mongoose';
import {
  Answer,
  AnswerResponse,
  Comment,
  CommentResponse,
  OrderType,
  PostNotification,
  PostNotificationResponse,
  Question,
  QuestionResponse,
  Tag,
  TagResponse,
  User,
  UserResponse,
} from '../types';
import AnswerModel from './answers';
import QuestionModel from './questions';
import TagModel from './tags';
import CommentModel from './comments';
import UserModel from './user';
import PostNotificationModel from './postNotifications';

/**
 * Parses tags from a search string.
 *
 * @param {string} search - Search string containing tags in square brackets (e.g., "[tag1][tag2]")
 *
 * @returns {string[]} - An array of tags found in the search string
 */
const parseTags = (search: string): string[] =>
  (search.match(/\[([^\]]+)\]/g) || []).map(word => word.slice(1, -1));

/**
 * Parses keywords from a search string by removing tags and extracting individual words.
 *
 * @param {string} search - The search string containing keywords and possibly tags
 *
 * @returns {string[]} - An array of keywords found in the search string
 */
const parseKeyword = (search: string): string[] =>
  search.replace(/\[([^\]]+)\]/g, ' ').match(/\b\w+\b/g) || [];

/**
 * Checks if given question contains any tags from the given list.
 *
 * @param {Question} q - The question to check
 * @param {string[]} taglist - The list of tags to check for
 *
 * @returns {boolean} - `true` if any tag is present in the question, `false` otherwise
 */
const checkTagInQuestion = (q: Question, taglist: string[]): boolean => {
  for (const tagname of taglist) {
    for (const tag of q.tags) {
      if (tagname === tag.name) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Checks if any keywords in the provided list exist in a given question's title or text.
 *
 * @param {Question} q - The question to check
 * @param {string[]} keywordlist - The list of keywords to check for
 *
 * @returns {boolean} - `true` if any keyword is present, `false` otherwise.
 */
const checkKeywordInQuestion = (q: Question, keywordlist: string[]): boolean => {
  for (const w of keywordlist) {
    if (q.title.includes(w) || q.text.includes(w)) {
      return true;
    }
  }

  return false;
};

/**
 * Gets the newest questions from a list, sorted by the asking date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to sort
 *
 * @returns {Question[]} - The sorted list of questions
 */
const sortQuestionsByNewest = (qlist: Question[]): Question[] =>
  qlist.sort((a, b) => {
    if (a.askDateTime > b.askDateTime) {
      return -1;
    }

    if (a.askDateTime < b.askDateTime) {
      return 1;
    }

    return 0;
  });

/**
 * Gets unanswered questions from a list, sorted by the asking date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to filter and sort
 *
 * @returns {Question[]} - The filtered and sorted list of unanswered questions
 */
const sortQuestionsByUnanswered = (qlist: Question[]): Question[] =>
  sortQuestionsByNewest(qlist).filter(q => q.answers.length === 0);

/**
 * Records the most recent answer time for a question.
 *
 * @param {Question} question - The question to check
 * @param {Map<string, Date>} mp - A map of the most recent answer time for each question
 */
const getMostRecentAnswerTime = (question: Question, mp: Map<string, Date>): void => {
  // This is a private function and we can assume that the answers field is not undefined or an array of ObjectId
  const answers = question.answers as Answer[];
  answers.forEach((answer: Answer) => {
    if (question._id !== undefined) {
      const currentMostRecent = mp.get(question?._id.toString());
      if (!currentMostRecent || currentMostRecent < answer.ansDateTime) {
        mp.set(question._id.toString(), answer.ansDateTime);
      }
    }
  });
};

/**
 * Gets active questions from a list, sorted by the most recent answer date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to filter and sort
 *
 * @returns {Question[]} - The filtered and sorted list of active questions
 */
const sortQuestionsByActive = (qlist: Question[]): Question[] => {
  const mp = new Map();
  qlist.forEach(q => {
    getMostRecentAnswerTime(q, mp);
  });

  return sortQuestionsByNewest(qlist).sort((a, b) => {
    const adate = mp.get(a._id?.toString());
    const bdate = mp.get(b._id?.toString());
    if (!adate) {
      return 1;
    }
    if (!bdate) {
      return -1;
    }
    if (adate > bdate) {
      return -1;
    }
    if (adate < bdate) {
      return 1;
    }
    return 0;
  });
};

/**
 * Sorts a list of questions by the number of views in descending order. First, the questions are
 * sorted by creation date (newest first), then by number of views, from highest to lowest.
 * If questions have the same number of views, the newer question will be before the older question.
 *
 * @param qlist The array of Question objects to be sorted.
 *
 * @returns A new array of Question objects sorted by the number of views.
 */
const sortQuestionsByMostViews = (qlist: Question[]): Question[] =>
  sortQuestionsByNewest(qlist).sort((a, b) => b.views.length - a.views.length);

/**
 * Updates the reputation of a user.
 *
 * @param uid The uid of the user to update
 * @param reputationChange the amount to change the reputation by
 * @returns a Promise that resolves to the updated user or an error message if the operation fails
 */
export const updateUserReputation = async (
  uid: string,
  reputationChange: number,
): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { uid },
      { $inc: { reputation: reputationChange } },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    return { error: `Error updating user reputation` };
  }
};

/**
 * Adds a tag to the database if it does not already exist.
 *
 * @param {Tag} tag - The tag to add
 *
 * @returns {Promise<Tag | null>} - The added or existing tag, or `null` if an error occurred
 */
export const addTag = async (tag: Tag): Promise<Tag | null> => {
  try {
    // Check if a tag with the given name already exists
    const existingTag = await TagModel.findOne({ name: tag.name });

    if (existingTag) {
      return existingTag as Tag;
    }

    // If the tag does not exist, create a new one
    const newTag = new TagModel(tag);
    const savedTag = await newTag.save();

    return savedTag as Tag;
  } catch (error) {
    return null;
  }
};

/**
 * Retrieves questions from the database, ordered by the specified criteria.
 *
 * @param {OrderType} order - The order type to filter the questions
 *
 * @returns {Promise<Question[]>} - Promise that resolves to a list of ordered questions
 */
export const getQuestionsByOrder = async (order: OrderType): Promise<Question[]> => {
  try {
    let qlist = [];
    if (order === 'active') {
      qlist = await QuestionModel.find().populate([
        { path: 'tags', model: TagModel },
        { path: 'answers', model: AnswerModel, populate: { path: 'ansBy', model: UserModel } },
        { path: 'askedBy', model: UserModel },
      ]);
      return sortQuestionsByActive(qlist);
    }
    qlist = await QuestionModel.find().populate([
      { path: 'tags', model: TagModel },
      { path: 'askedBy', model: UserModel },
    ]);
    if (order === 'unanswered') {
      return sortQuestionsByUnanswered(qlist);
    }
    if (order === 'newest') {
      return sortQuestionsByNewest(qlist);
    }
    return sortQuestionsByMostViews(qlist);
  } catch (error) {
    return [];
  }
};

/**
 * Filters a list of questions by the user who asked them.
 *
 * @param qlist The array of Question objects to be filtered.
 * @param askedBy The uid of the user who asked the questions.
 *
 * @returns Filtered Question objects.
 */
export const filterQuestionsByAskedBy = (qlist: Question[], uid: string): Question[] =>
  qlist.filter(q => q.askedBy.uid === uid);

/**
 * Filters questions based on a search string containing tags and/or keywords.
 *
 * @param {Question[]} qlist - The list of questions to filter
 * @param {string} search - The search string containing tags and/or keywords
 *
 * @returns {Question[]} - The filtered list of questions matching the search criteria
 */
export const filterQuestionsBySearch = (qlist: Question[], search: string): Question[] => {
  const searchTags = parseTags(search);
  const searchKeyword = parseKeyword(search);

  if (!qlist || qlist.length === 0) {
    return [];
  }
  return qlist.filter((q: Question) => {
    if (searchKeyword.length === 0 && searchTags.length === 0) {
      return true;
    }

    if (searchKeyword.length === 0) {
      return checkTagInQuestion(q, searchTags);
    }

    if (searchTags.length === 0) {
      return checkKeywordInQuestion(q, searchKeyword);
    }

    return checkKeywordInQuestion(q, searchKeyword) || checkTagInQuestion(q, searchTags);
  });
};

/**
 * Fetches and populates a question or answer document based on the provided ID and type.
 *
 * @param {string | undefined} id - The ID of the question, answer, or tag to fetch.
 * @param {'question' | 'answer' | 'tag'} type - Specifies whether to fetch a question, an answer, or a tag.
 *
 * @returns {Promise<QuestionResponse | AnswerResponse | TagResponse>} - Promise that resolves to the
 *          populated question or answer, or an error message if the operation fails
 */
export const populateDocument = async (
  id: string | undefined,
  type: 'question' | 'answer' | 'tag' | 'user',
): Promise<QuestionResponse | AnswerResponse | TagResponse | UserResponse> => {
  try {
    if (!id) {
      throw new Error('Provided question ID is undefined.');
    }
    let result = null;
    if (type === 'question') {
      result = await QuestionModel.findOne({ _id: id }).populate([
        {
          path: 'tags',
          model: TagModel,
          populate: { path: 'subscribers', model: UserModel },
        },
        {
          path: 'answers',
          model: AnswerModel,
          populate: [
            { path: 'ansBy', model: UserModel },
            {
              path: 'comments',
              model: CommentModel,
              populate: { path: 'commentBy', model: UserModel },
            },
          ],
        },
        {
          path: 'comments',
          model: CommentModel,
          populate: { path: 'commentBy', model: UserModel },
        },
        { path: 'askedBy', model: UserModel },
        { path: 'subscribers', model: UserModel },
      ]);
    } else if (type === 'answer') {
      result = await AnswerModel.findOne({ _id: id }).populate([
        {
          path: 'comments',
          model: CommentModel,
          populate: { path: 'commentBy', model: UserModel },
        },
        { path: 'ansBy', model: UserModel },
      ]);
    } else if (type === 'tag') {
      result = await TagModel.findOne({ _id: id }).populate([
        { path: 'subscribers', model: UserModel },
      ]);
    } else if (type === 'user') {
      result = await UserModel.findOne({ _id: id }).populate([
        { path: 'postNotifications', model: PostNotificationModel },
      ]);
    }
    if (!result) {
      throw new Error(`Failed to fetch and populate a ${type}`);
    }
    return result;
  } catch (error) {
    return { error: `Error when fetching and populating a document: ${(error as Error).message}` };
  }
};

/**
 * Fetches a question by its ID and increments its view count.
 *
 * @param {string} qid - The ID of the question to fetch.
 * @param {string} uid - The uid of the user requesting the question.
 *
 * @returns {Promise<QuestionResponse | null>} - Promise that resolves to the fetched question
 *          with incremented views, null if the question is not found, or an error message.
 */
export const fetchAndIncrementQuestionViewsById = async (
  qid: string,
  uid: string,
): Promise<QuestionResponse | null> => {
  try {
    const q = await QuestionModel.findOneAndUpdate(
      { _id: new ObjectId(qid) },
      { $addToSet: { views: uid } },
      { new: true },
    ).populate([
      { path: 'tags', model: TagModel },
      {
        path: 'answers',
        model: AnswerModel,
        populate: [
          { path: 'ansBy', model: UserModel },
          {
            path: 'comments',
            model: CommentModel,
            populate: { path: 'commentBy', model: UserModel },
          },
        ],
      },
      {
        path: 'comments',
        model: CommentModel,
        populate: { path: 'commentBy', model: UserModel },
      },
      { path: 'askedBy', model: UserModel },
      { path: 'subscribers', model: UserModel },
    ]);
    return q;
  } catch (error) {
    return { error: 'Error when fetching and updating a question' };
  }
};

/**
 * Saves a new question to the database.
 *
 * @param {Question} question - The question to save
 *
 * @returns {Promise<QuestionResponse>} - The saved question, or error message
 */
export const saveQuestion = async (question: Question): Promise<QuestionResponse> => {
  try {
    const result = await QuestionModel.create(question);
    return result;
  } catch (error) {
    return { error: 'Error when saving a question' };
  }
};

/**
 * Saves a new answer to the database.
 *
 * @param {Answer} answer - The answer to save
 *
 * @returns {Promise<AnswerResponse>} - The saved answer, or an error message if the save failed
 */
export const saveAnswer = async (answer: Answer): Promise<AnswerResponse> => {
  try {
    const result = await AnswerModel.create(answer);

    // Every answer is worth 2 reputation points
    await updateUserReputation(answer.ansBy.uid, 2);

    return result;
  } catch (error) {
    return { error: 'Error when saving an answer' };
  }
};

/**
 * Saves a new postNotification to the database.
 *
 * @param {PostNotification} postNotification - the notification to save
 *
 * @returns {Promise<PostNotificationResponse>} - the saved postNotification, or an error message if the save failed
 */
export const savePostNotification = async (
  postNotification: PostNotification,
): Promise<PostNotificationResponse> => {
  try {
    const result = await PostNotificationModel.create(postNotification);
    return result;
  } catch (error) {
    return { error: 'Error when saving a postNotification' };
  }
};

/**
 * Populate notiications to all the subscribers to the question with the given ID.
 * @param qid the qid of the question with action taken on it.
 * @param associatedPostId the post id of the post that the action was taken on (like the ID of the answer or comment posted).
 * @param type the kinda of notification, either 'questionAnswered', 'commentAdded', or 'questionPostedWithTag'.
 * @param user the user who took the action.
 * @returns a Promise that resolves to the postNotification that was posted, or an error message if the operation fails.
 */
export const postNotifications = async (
  qid: string,
  associatedPostId: string,
  type: 'questionAnswered' | 'commentAdded' | 'questionPostedWithTag',
  user: User,
): Promise<PostNotificationResponse> => {
  try {
    const question: Question | null = await QuestionModel.findOne({ _id: qid }).populate({
      path: 'askedBy',
      model: UserModel,
    });
    if (!question || question._id === undefined) {
      throw new Error('Could not find question that had action taken');
    }

    const notificationToPost: PostNotification = {
      title: '',
      text: '',
      notificationType: 'questionAnswered',
      postId: new ObjectId(),
      fromUser: user,
    };

    if (type === 'questionAnswered') {
      const answer: Answer | null = await AnswerModel.findOne({ _id: associatedPostId }).populate({
        path: 'ansBy',
        model: UserModel,
      });

      if (!answer || answer._id === undefined) {
        throw new Error('Could not find answer that was posted');
      }

      notificationToPost.title = `Your question: "${question.title}" has a new answer!`;
      notificationToPost.text = `${answer.ansBy.username} said: "${answer.text}"`;
      notificationToPost.notificationType = 'questionAnswered';
      notificationToPost.postId = answer._id;
    } else if (type === 'commentAdded') {
      const comment: Comment | null = await CommentModel.findOne({
        _id: associatedPostId,
      }).populate({ path: 'commentBy', model: UserModel });

      if (!comment || comment._id === undefined) {
        throw new Error('Could not find comment that was posted');
      }

      notificationToPost.title = 'A Comment Was Added to a Post You Subscribe to!';
      notificationToPost.text = `${user.username} said: "${comment.text}"`;
      notificationToPost.notificationType = 'commentAdded';
      notificationToPost.postId = comment._id;
    } else if (type === 'questionPostedWithTag') {
      notificationToPost.title = 'A Question Was Posted With a Tag You Subscribe to!';
      notificationToPost.text = `The question: "${question.title}" was asked by ${user.username}`;
      notificationToPost.notificationType = 'questionPostedWithTag';
      notificationToPost.postId = question._id;
    } else {
      throw new Error('Invalid notification type');
    }

    const postedNotification = await savePostNotification(notificationToPost);

    if (!postedNotification || 'error' in postedNotification) {
      throw new Error('Error when saving a postNotification');
    }

    question.subscribers.map(async subscriberId => {
      // Don't sent notifications to users about their own actions
      if (user._id?.toString() !== subscriberId.toString()) {
        await UserModel.findOneAndUpdate(
          { _id: subscriberId },
          { $push: { postNotifications: postedNotification } },
          { new: true },
        );
      }
    });

    return postedNotification;
  } catch (error) {
    if (error instanceof Error) {
      return { error: `Error when posting notification: ${error.message}` };
    }
    return { error: 'Error when posting notification' };
  }
};

/**
 * Saves a new comment to the database.
 *
 * @param {Comment} comment - The comment to save
 *
 * @returns {Promise<CommentResponse>} - The saved comment, or an error message if the save failed
 */
export const saveComment = async (comment: Comment): Promise<CommentResponse> => {
  try {
    const result = await CommentModel.create(comment);

    // All comments are worth 1 reputation point
    await updateUserReputation(comment.commentBy.uid, 1);

    return result;
  } catch (error) {
    return { error: 'Error when saving a comment' };
  }
};

/**
 * Saves a new comment to the database.
 *
 * @param {User} user - The user to save
 *
 * @returns {Promise<UserResponse>} - The saved user, or an error message if the save failed
 */
export const saveUser = async (user: User): Promise<UserResponse> => {
  try {
    const result = await UserModel.create(user);
    return result;
  } catch (error) {
    return { error: 'Error when saving a User' };
  }
};

/**
 * Processes a list of tags by removing duplicates, checking for existing tags in the database,
 * and adding non-existing tags. Returns an array of the existing or newly added tags.
 * If an error occurs during the process, it is logged, and an empty array is returned.
 *
 * @param tags The array of Tag objects to be processed.
 *
 * @returns A Promise that resolves to an array of Tag objects.
 */
export const processTags = async (tags: Tag[]): Promise<Tag[]> => {
  try {
    // Extract unique tag names from the provided tags array using a Set to eliminate duplicates
    const uniqueTagNamesSet = new Set(tags.map(tag => tag.name));

    // Create an array of unique Tag objects by matching tag names
    const uniqueTags = [...uniqueTagNamesSet].map(
      name => tags.find(tag => tag.name === name)!, // The '!' ensures the Tag is found, assuming no undefined values
    );

    // Use Promise.all to asynchronously process each unique tag.
    const processedTags = await Promise.all(
      uniqueTags.map(async tag => {
        const existingTag = await TagModel.findOne({ name: tag.name });

        if (existingTag) {
          return existingTag; // If tag exists, return it as part of the processed tags
        }

        const addedTag = await addTag(tag);
        if (addedTag) {
          return addedTag; // If the tag does not exist, attempt to add it to the database
        }

        // Throwing an error if addTag fails
        throw new Error(`Error while adding tag: ${tag.name}`);
      }),
    );

    return processedTags;
  } catch (error: unknown) {
    // Log the error for debugging purposes
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // eslint-disable-next-line no-console
    console.log('An error occurred while adding tags:', errorMessage);
    return [];
  }
};

/**
 * Adds a vote to a question.
 *
 * @param qid The ID of the question to add a vote to.
 * @param uid The uid of the user who voted.
 * @param type The type of vote to add, either 'upvote' or 'downvote'.
 *
 * @returns A Promise that resolves to an object containing either a success message or an error message,
 *          along with the updated upVotes and downVotes arrays.
 */
export const addVoteToQuestion = async (
  qid: string,
  uid: string,
  type: 'upvote' | 'downvote',
): Promise<{ msg: string; upVotes: string[]; downVotes: string[] } | { error: string }> => {
  let updateOperation: QueryOptions;

  if (type === 'upvote') {
    updateOperation = [
      {
        $set: {
          upVotes: {
            $cond: [
              { $in: [uid, '$upVotes'] },
              { $filter: { input: '$upVotes', as: 'u', cond: { $ne: ['$$u', uid] } } },
              { $concatArrays: ['$upVotes', [uid]] },
            ],
          },
          downVotes: {
            $cond: [
              { $in: [uid, '$upVotes'] },
              '$downVotes',
              { $filter: { input: '$downVotes', as: 'd', cond: { $ne: ['$$d', uid] } } },
            ],
          },
        },
      },
    ];
  } else {
    updateOperation = [
      {
        $set: {
          downVotes: {
            $cond: [
              { $in: [uid, '$downVotes'] },
              { $filter: { input: '$downVotes', as: 'd', cond: { $ne: ['$$d', uid] } } },
              { $concatArrays: ['$downVotes', [uid]] },
            ],
          },
          upVotes: {
            $cond: [
              { $in: [uid, '$downVotes'] },
              '$upVotes',
              { $filter: { input: '$upVotes', as: 'u', cond: { $ne: ['$$u', uid] } } },
            ],
          },
        },
      },
    ];
  }

  try {
    const result = await QuestionModel.findOneAndUpdate({ _id: qid }, updateOperation, {
      new: true,
    });

    if (!result) {
      return { error: 'Question not found!' };
    }

    let msg = '';

    if (type === 'upvote') {
      msg = result.upVotes.includes(uid)
        ? 'Question upvoted successfully'
        : 'Upvote cancelled successfully';
    } else {
      msg = result.downVotes.includes(uid)
        ? 'Question downvoted successfully'
        : 'Downvote cancelled successfully';
    }

    return {
      msg,
      upVotes: result.upVotes || [],
      downVotes: result.downVotes || [],
    };
  } catch (err) {
    return {
      error:
        type === 'upvote'
          ? 'Error when adding upvote to question'
          : 'Error when adding downvote to question',
    };
  }
};

/**
 * Adds an answer to a question.
 *
 * @param {string} qid - The ID of the question to add an answer to
 * @param {Answer} ans - The answer to add
 *
 * @returns Promise<QuestionResponse> - The updated question or an error message
 */
export const addAnswerToQuestion = async (qid: string, ans: Answer): Promise<QuestionResponse> => {
  try {
    if (!ans || !ans.text || !ans.ansBy || !ans.ansDateTime) {
      throw new Error('Invalid answer');
    }
    const result = await QuestionModel.findOneAndUpdate(
      { _id: qid },
      { $push: { answers: { $each: [ans._id], $position: 0 } } },
      { new: true },
    );
    if (result === null) {
      throw new Error('Error when adding answer to question');
    }
    return result;
  } catch (error) {
    return { error: 'Error when adding answer to question' };
  }
};

/**
 * Adds a vote to an answer.
 *
 * @param id The ID of the answer to add a vote to.
 * @param uid The username of the user who voted.
 * @param type The type of vote to add, either 'upvote' or 'downvote'.
 *
 * @returns A Promise that resolves to an object containing either a success message or an error message,
 *          along with the updated upVotes and downVotes arrays.
 */
export const addVoteToAnswer = async (
  id: string,
  uid: string,
  type: 'upvote' | 'downvote',
): Promise<{ msg: string; upVotes: string[]; downVotes: string[] } | { error: string }> => {
  let updateOperation: QueryOptions;

  if (type === 'upvote') {
    updateOperation = [
      {
        $set: {
          upVotes: {
            $cond: [
              { $in: [uid, '$upVotes'] },
              { $filter: { input: '$upVotes', as: 'u', cond: { $ne: ['$$u', uid] } } },
              { $concatArrays: ['$upVotes', [uid]] },
            ],
          },
          downVotes: {
            $cond: [
              { $in: [uid, '$upVotes'] },
              '$downVotes',
              { $filter: { input: '$downVotes', as: 'd', cond: { $ne: ['$$d', uid] } } },
            ],
          },
        },
      },
    ];
  } else {
    updateOperation = [
      {
        $set: {
          downVotes: {
            $cond: [
              { $in: [uid, '$downVotes'] },
              { $filter: { input: '$downVotes', as: 'd', cond: { $ne: ['$$d', uid] } } },
              { $concatArrays: ['$downVotes', [uid]] },
            ],
          },
          upVotes: {
            $cond: [
              { $in: [uid, '$downVotes'] },
              '$upVotes',
              { $filter: { input: '$upVotes', as: 'u', cond: { $ne: ['$$u', uid] } } },
            ],
          },
        },
      },
    ];
  }

  try {
    const result = await AnswerModel.findOneAndUpdate({ _id: id }, updateOperation, {
      new: true,
    });

    if (!result) {
      return { error: 'Answer not found!' };
    }

    let msg = '';

    if (type === 'upvote') {
      msg = result.upVotes.includes(uid)
        ? 'Answer upvoted successfully'
        : 'Upvote cancelled successfully';
    } else {
      msg = result.downVotes.includes(uid)
        ? 'Answer downvoted successfully'
        : 'Downvote cancelled successfully';
    }

    return {
      msg,
      upVotes: result.upVotes || [],
      downVotes: result.downVotes || [],
    };
  } catch (err) {
    return {
      error:
        type === 'upvote'
          ? 'Error when adding upvote to answer'
          : 'Error when adding downvote to answer',
    };
  }
};

/**
 * Adds a comment to a question or answer.
 *
 * @param id The ID of the question or answer to add a comment to
 * @param type The type of the comment, either 'question' or 'answer'
 * @param comment The comment to add
 *
 * @returns A Promise that resolves to the updated question or answer, or an error message if the operation fails
 */
export const addComment = async (
  id: string,
  type: 'question' | 'answer',
  comment: Comment,
): Promise<QuestionResponse | AnswerResponse> => {
  try {
    if (!comment || !comment.text || !comment.commentBy || !comment.commentDateTime) {
      throw new Error('Invalid comment');
    }
    let result: QuestionResponse | AnswerResponse | null;
    if (type === 'question') {
      result = await QuestionModel.findOneAndUpdate(
        { _id: id },
        { $push: { comments: { $each: [comment._id] } } },
        { new: true },
      );
    } else {
      result = await AnswerModel.findOneAndUpdate(
        { _id: id },
        { $push: { comments: { $each: [comment._id] } } },
        { new: true },
      );
    }
    if (result === null) {
      throw new Error('Failed to add comment');
    }
    return result;
  } catch (error) {
    return { error: `Error when adding comment: ${(error as Error).message}` };
  }
};

/**
 * Toggles a subscriber for a question.
 *
 * @param id The ID of the question to toggle the subscriber for
 * @param type The type of the document to toggle the subscriber for, either 'Question' or 'Tag'
 * @param user The user to toggle as a subscriber
 *
 * @returns A Promise that resolves to the updated question or an error message if the operation fails
 */
export const toggleSubscribe = async (
  id: string,
  type: 'question' | 'tag',
  user: User,
): Promise<QuestionResponse | TagResponse> => {
  if (!user || !user._id) {
    throw new Error('Invalid user');
  }

  try {
    const updateOp = [
      {
        $set: {
          subscribers: {
            $cond: [
              { $in: [new mongoose.Types.ObjectId(user._id), '$subscribers'] },
              {
                $filter: {
                  input: '$subscribers',
                  as: 's',
                  cond: { $ne: ['$$s', new mongoose.Types.ObjectId(user._id)] },
                },
              },
              { $concatArrays: ['$subscribers', [new mongoose.Types.ObjectId(user._id)]] },
            ],
          },
        },
      },
    ];

    let result: QuestionResponse | TagResponse | null = null;

    if (type === 'question') {
      result = await QuestionModel.findOneAndUpdate({ _id: id }, updateOp, { new: true }).populate(
        'subscribers',
      );
    } else if (type === 'tag') {
      result = await TagModel.findOneAndUpdate({ _id: id }, updateOp, { new: true }).populate(
        'subscribers',
      );
    } else {
      throw new Error('Invalid type');
    }

    if (result === null) {
      throw new Error('Failed to toggle subscriber');
    }
    return result;
  } catch (error) {
    return { error: `Error when toggling subscriber: ${(error as Error).message}` };
  }
};

/**
 * Adds a vote to a comment.
 *
 * @param id The ID of the comment to add a vote to.
 * @param uid The username of the user who voted.
 * @param type The type of vote to add, either 'upvote' or 'downvote'.
 *
 * @returns A Promise that resolves to an object containing either a success message or an error message,
 *          along with the updated upVotes and downVotes arrays.
 */
export const addVoteToComment = async (
  id: string,
  uid: string,
  type: 'upvote' | 'downvote',
): Promise<{ msg: string; upVotes: string[]; downVotes: string[] } | { error: string }> => {
  let updateOperation: QueryOptions;

  if (type === 'upvote') {
    updateOperation = [
      {
        $set: {
          upVotes: {
            $cond: [
              { $in: [uid, '$upVotes'] },
              { $filter: { input: '$upVotes', as: 'u', cond: { $ne: ['$$u', uid] } } },
              { $concatArrays: ['$upVotes', [uid]] },
            ],
          },
          downVotes: {
            $cond: [
              { $in: [uid, '$upVotes'] },
              '$downVotes',
              { $filter: { input: '$downVotes', as: 'd', cond: { $ne: ['$$d', uid] } } },
            ],
          },
        },
      },
    ];
  } else {
    updateOperation = [
      {
        $set: {
          downVotes: {
            $cond: [
              { $in: [uid, '$downVotes'] },
              { $filter: { input: '$downVotes', as: 'd', cond: { $ne: ['$$d', uid] } } },
              { $concatArrays: ['$downVotes', [uid]] },
            ],
          },
          upVotes: {
            $cond: [
              { $in: [uid, '$downVotes'] },
              '$upVotes',
              { $filter: { input: '$upVotes', as: 'u', cond: { $ne: ['$$u', uid] } } },
            ],
          },
        },
      },
    ];
  }

  try {
    const result = await CommentModel.findOneAndUpdate({ _id: id }, updateOperation, {
      new: true,
    });

    if (!result) {
      return { error: 'Comment not found!' };
    }

    let msg = '';

    if (type === 'upvote') {
      msg = result.upVotes.includes(uid)
        ? 'Comment upvoted successfully'
        : 'Upvote cancelled successfully';
    } else {
      msg = result.downVotes.includes(uid)
        ? 'Comment downvoted successfully'
        : 'Downvote cancelled successfully';
    }

    return {
      msg,
      upVotes: result.upVotes || [],
      downVotes: result.downVotes || [],
    };
  } catch (err) {
    return {
      error:
        type === 'upvote'
          ? 'Error when adding upvote to comment'
          : 'Error when adding downvote to comment',
    };
  }
};

/**
 * Gets a map of tags and their corresponding question counts.
 *
 * @returns {Promise<Map<string, number> | null | { error: string }>} - A map of tags to their
 *          counts, `null` if there are no tags in the database, or the error message.
 */
export const getTagCountMap = async (): Promise<Map<string, number> | null | { error: string }> => {
  try {
    const tlist = await TagModel.find();
    const qlist = await QuestionModel.find().populate({
      path: 'tags',
      model: TagModel,
    });

    if (!tlist || tlist.length === 0) {
      return null;
    }

    const tmap = new Map(tlist.map(t => [t.name, 0]));

    if (qlist != null && qlist !== undefined && qlist.length > 0) {
      qlist.forEach(q => {
        q.tags.forEach(t => {
          tmap.set(t.name, (tmap.get(t.name) || 0) + 1);
        });
      });
    }

    return tmap;
  } catch (error) {
    return { error: 'Error when construction tag map' };
  }
};
