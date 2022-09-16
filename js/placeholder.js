const elSearchPlaceholderSelect = document.querySelector('.js-search-select');
const elSearchPlaceholderSearchInput = document.querySelector('.js-search-input');
const elSearchPlaceholderSearchBtn = document.querySelector('.js-search-btn');
const elBookmarksBtn = document.querySelector('.js-bookmarks-btn');
const elMain = document.querySelector('.main');

var mainStatus = true;

window.onload = function(){
  mainStatus = false;
};

function placeholderRemover () {
  elSearchPlaceholderSelect.classList.remove('placeholder');
  elSearchPlaceholderSearchInput.classList.remove('placeholder');
  elSearchPlaceholderSearchBtn.classList.remove('placeholder');
  elBookmarksBtn.classList.remove('placeholder');
}
setInterval(function () {
  if (mainStatus === false) {
      placeholderRemover();
  }
} , 1100);