import * as model from './model.js';
import paginatioView from './views/paginatioView.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import bookMarkView from './views/bookMarkView.js';
// import icons from 'url:../img/icons.svg'; // parcel 2
import searchView from './views/searchView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  // 1) Loading recipe
  try {
    const id = window.location.hash.slice(1);
    console.log(id);
    if (!id) return;
    recipeView.renderSpinner();
    // Updates results view to mark selected search results
    resultsView.update(model.getSearchResutlsPage());
    await model.loadRecipe(id);
    // 2) render recipe

    recipeView.render(model.state.recipe);
    // updating the bookmarks
    bookMarkView.update(model.state.bookmarks);
  } catch (error) {
    recipeView.renderError();
    console.error(error);
  }
};

const controlsSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    console.log(resultsView);
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;
    //  Load search results
    await model.loadSearchResult(query);
    // Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResutlsPage());
    // 4) Render initial pagination buttons
    paginatioView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // Render new results
  resultsView.render(model.getSearchResutlsPage(goToPage));
  // 4) Render new pagination buttons
  paginatioView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings(in the state)
  model.updateServings(newServings);
  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  // add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookMark(model.state.recipe);
  } else {
    model.deleteBookMark(model.state.recipe.id);
  }
  // update recipe view
  recipeView.update(model.state.recipe);
  // render bookmarks
  bookMarkView.render(model.state.bookmarks);
};
const controlBookMarks = function () {
  bookMarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner

    addRecipeView.renderSpinner();
    // upload new Recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    // Render recipe
    recipeView.render(model.state.recipe);
    // Render message
    addRecipeView.renderMessage();
    // render bookmark view

    bookMarkView.render(model.state.bookmarks);
    // change in the url

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // close form window

    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};
const init = function () {
  bookMarkView.addhandlerRender(controlBookMarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView._addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookMark(controlAddBookMark);
  searchView.addHandlerSearch(controlsSearchResults);
  paginatioView._addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
