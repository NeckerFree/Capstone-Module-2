// APIs references
import {
  getLikes, createLike, getComments, getReservations, addComment,
} from './modules/involvementApi.js';
import { getMeals, getMealInfo } from './modules/mealDb.js';

// Styles and images references
import './style.css';
import whiteHeart from './icons/whiteHeart.png';
import redHeart from './icons/redHeart.png';
import restaurant from './icons/restaurant.png';
import close from './icons/close.png';

// DOM references
const section = document.getElementsByTagName('section')[0];
const header = document.getElementsByTagName('header')[0];

// Filter variable
const MEALS_CATEGORY = 'Seafood';

// MealsDB API function
const getMealsCount = async (category) => {
  let mealsCount = 0;
  const meals = await getMeals(category);
  if (meals !== undefined) {
    const data = Object.values(meals)[0];
    mealsCount = data.length;
  }
  return mealsCount;
};

// Involvement API functions
const getInvolvementData = async () => {
  const response = await getLikes();
  return response;
};

const addLike = async (event) => {
  const heart = event.target;
  const response = await createLike(heart.id);
  if (response === true) {
    heart.src = redHeart;
    const container = heart.parentElement;
    const hidden = container.childNodes[0];
    const previous = hidden.value;
    const actual = parseInt(previous, 10) + 1;
    hidden.value = actual;
    const label = container.childNodes[2];
    label.innerText = `${actual} likes`;
  }
};

const getCommentsById = async (itemId) => {
  const comments = await getComments(itemId);
  const countComments = (comments === undefined) ? 0 : comments.length;
  return { countComments, comments };
};

const getReservationsById = async (itemId) => {
  const reservations = await getReservations(itemId);
  const countReservations = (reservations === undefined) ? 0 : reservations.length;
  return { countReservations, reservations };
};
const submitComment = async (e) => {
  e.preventDefault();
  const inputName = document.getElementById('name');
  const inputInsights = document.getElementById('insights');
  const id = document.getElementsByName('mealId')[0].value;
  addComment(id, inputName.value, inputInsights.value);
  const comments = document.getElementsByClassName('comments')[0];
  const liComment = document.createElement('li');
  const date = new Date();
  liComment.innerHTML = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${inputName.value}: ${inputInsights.value}`;
  comments.appendChild(liComment);
  const countComments = document.getElementsByClassName('countComments')[0];
  countComments.innerHTML = `Comments(${comments.childNodes.length})`;
  const form = document.getElementsByTagName('form')[0];
  form.reset();
};
const closePopup = () => {
  const popupContainer = document.getElementsByClassName('popupContainer')[0];
  popupContainer.style.display = 'none';
  document.removeChild(popupContainer);
};
const showCommentsInfo = async (event) => {
  const button = event.target;
  const mealId = button.id;
  const mealInfo = await getMealInfo(mealId);
  if (mealInfo !== undefined) {
    const meal = Object.values(mealInfo.meals)[0];

    const { countComments, comments } = await getCommentsById(mealId);
    let commentsSection = '';
    if (countComments > 0) {
      comments.forEach((comment) => {
        commentsSection += `<li>${comment.creation_date} ${comment.username}: ${comment.comment}</li>`;
      });
    }
    const popupContainer = document.createElement('div');
    popupContainer.classList.add('popupContainer');
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `<div class='heading'> <a class='close' href='#'><img src='${close}' alt='close icon'></a></div>
  <div class="content"><div ><div><img class="dishPop" src="${meal.strMealThumb}" alt="mealImage"></div><h1>${meal.strMeal}</h1><p class='instructions' >${meal.strInstructions}</p></div>
  <h2 class='countComments'>Comments(${countComments})</h2>
  <ul class='comments'>${commentsSection}</ul>
  <form>
  <h2>Add a comment</h2>
  <input type="text" name="name" id="name" placeholder="Your name" required>
  <textarea  id="insights" class="area"  name="insights" rows="5" cols="15" maxlength="500" placeholder="Your insights" required></textarea>
  <input class="newButton" type="submit" value="Comment">
  <input type="hidden" name="mealId" value="${meal.idMeal}">
</form>
  </div>`;

    popupContainer.appendChild(popup);
    document.body.prepend(popupContainer);
    const linkClose = document.getElementsByClassName('close')[0];
    linkClose.addEventListener('click', closePopup);
    const form = document.getElementsByTagName('form')[0];
    form.addEventListener('submit', submitComment);
  }
};

const getInitialData = async () => {
  let content = '';
  let mealsCount = 0;
  const meals = await getMeals(MEALS_CATEGORY);
  if (meals !== undefined) {
    const likes = await getInvolvementData();
    const data = Object.values(meals)[0];
    mealsCount = data.length;
    for (let index = 0; index < mealsCount; index += 1) {
      const meal = data[index];
      const like = likes.filter((l) => l.item_id === meal.idMeal);
      const likesCount = (like.length === 0) ? 0 : like[0].likes;
      const itemTemplate = `<div class='meal'><img class='dish' src='${meal.strMealThumb}' alt='${meal.strMeal} image' ><div class='description'><p>${meal.strMeal}</p><div class='likes'><input type="hidden" name="likesCount" value="${likesCount}"><img class='heart' id='${meal.idMeal}' src='${whiteHeart}' alt='likeImg' ></img><label >${likesCount} likes</label></div></div><input class='commentButton' type='submit' id='${meal.idMeal}' name='CommentsButton' value='Comments'> <input class='commentButton' type='submit' id='${meal.idMeal}' name='ReservationsButton' value='Reservations'></div>`;
      content += itemTemplate;
    }
  }
  header.innerHTML = `<div class='logoContainer'><a href='./index.html' >
  <img src='${restaurant}' alt='Logo' class='logo'></a></div><ul class='links'>
  <li><a  href='./index.html'>${MEALS_CATEGORY} (${mealsCount})</a></li><li>
  <a  href=#'>Beef</a></li><li><a  href='#'>Pasta</a></li><li><a  href='#'>Vegan</a></li></ul>`;
  section.innerHTML = content;
  const heartCollection = document.getElementsByClassName('heart');
  const commentsButtonCollection = document.getElementsByName('CommentsButton');

  [].forEach.call(heartCollection, (heart) => heart.addEventListener('click', addLike));
  [].forEach.call(commentsButtonCollection, (commentButton) => commentButton.addEventListener('click', showCommentsInfo));
};

window.addEventListener('load', () => {
  getInitialData();
});

module.exports = { getCommentsById, getReservationsById, getMealsCount };
