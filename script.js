
const API_KEY = "1287c48a7a5e41c88a78fa2aa907854d";
const url = "https://newsapi.org/v2/everything?q=";

let currentQuery = "India";
let currentPage = 1;
const pageSize = 3; 

window.addEventListener("load", () => fetchNews(currentQuery));

function reload() {
  window.location.reload();
}

async function fetchNews(query, page = 1) {
  const res = await fetch(
    `${url}${query}&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`
  );
  const data = await res.json();
  if (page === 1) {
    bindData(data.articles);
  } else {
    appendData(data.articles);
  }
}

function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.urlToImage) return;
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

function appendData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  articles.forEach((article) => {
    if (!article.urlToImage) return;
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description;

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  newsSource.innerHTML = `${article.source.name} · ${date}`;

  const cardContent = cardClone.querySelector(".card-content");

  const actionContainer = document.createElement("div");
  actionContainer.className = "action-container";

  const readMore = document.createElement("p");
  readMore.innerHTML = "<strong>Click to read more</strong>";
  readMore.style.color = "green";
  readMore.style.cursor = "pointer";
  readMore.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });

  const saveArticleButton = document.createElement("button");
  saveArticleButton.textContent = "Save Article";
  saveArticleButton.className = "save-article-button";
  saveArticleButton.addEventListener("click", () =>
    saveArticle(article, saveArticleButton)
  );

  actionContainer.appendChild(readMore);
  actionContainer.appendChild(saveArticleButton);

  cardContent.appendChild(actionContainer);
}

let curSelectedNav = null;
function onNavItemClick(id) {
  currentQuery = id;
  currentPage = 1;
  fetchNews(id);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value;
  if (!query) return;
  currentQuery = query;
  currentPage = 1;
  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});

const loadMoreButton = document.createElement("button");
loadMoreButton.textContent = "Load More";
loadMoreButton.className = "load-more-button";
loadMoreButton.addEventListener("click", () => {
  currentPage++;
  fetchNews(currentQuery, currentPage);
});

document.body.appendChild(loadMoreButton);

// Additional functionality for saving favorite articles
const savedArticles = [];

function saveArticle(article, button) {
  savedArticles.push(article);
  button.textContent = "Saved";
  button.disabled = true; // Disable the button after saving
  console.log("Saved Articles:", savedArticles);
}

function showSavedArticles() {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardsContainer.innerHTML = "";

  savedArticles.forEach((article) => {
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);

    const actionContainer = cardClone.querySelector(".action-container");
    actionContainer.innerHTML = ""; // Clear existing buttons

    const goBackButton = document.createElement("button");
    goBackButton.textContent = "Go Back";
    goBackButton.className = "save-article-button";
    goBackButton.addEventListener("click", () => {
      cardsContainer.innerHTML = ""; // Clear saved articles and go back to regular view
      fetchNews(currentQuery); // Reload the regular articles
    });

    actionContainer.appendChild(goBackButton);

    cardsContainer.appendChild(cardClone);
  });
}

const saveButton = document.createElement("button");
saveButton.textContent = "Show Saved Articles";
saveButton.className = "save-button";
saveButton.addEventListener("click", showSavedArticles);

document.body.appendChild(saveButton);

