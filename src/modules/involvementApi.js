// Involvement API methods access
import { postData, getData } from './apiAccess.js';

const INVOLVEMENT_API_URL = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi';

const apiId = 'mJ38T1cF1k53CeEkLunA';
const getLikes = async () => {
  let likes = [];
  const data = await getData(INVOLVEMENT_API_URL, `apps/${apiId}/likes`);
  likes = data;

  return likes;
};
const createLike = async (itemId) => {
  const data = { item_id: `${itemId}` };
  const response = await postData(INVOLVEMENT_API_URL, `apps/${apiId}/likes`, data);
  return response;
};

const getComments = async (itemId) => {
  let comments = [];
  const data = await getData(INVOLVEMENT_API_URL, `apps/${apiId}/comments?item_id=${itemId}`);
  comments = data;
  return comments;
};
const addComment = async (itemId, name, comment) => {
  const data = { item_id: `${itemId}`, username: `${name}`, comment: `${comment}` };
  const response = await postData(INVOLVEMENT_API_URL, `apps/${apiId}/comments`, data);
  return response;
};
const getReservations = async (itemId) => {
  let reservations = [];
  const data = await getData(INVOLVEMENT_API_URL, `apps/${apiId}/reservations?item_id=${itemId}`);
  reservations = data;

  return reservations;
};

export {
  getLikes, createLike, getComments, getReservations, addComment,
};
