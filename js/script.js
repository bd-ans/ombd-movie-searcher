const moviesList = $('.js-movies-list');
const moviesCardTemplate = $('#template-element').content;

const elSearchInput = $('.js-search-input');
const elSearchSelect = $('.js-search-select');
const elSearchBtn = $('.js-search-btn');
const elFailTxt = $('.js-fail-txt');

let arr = [];
let selectedCategory = [];
let mainData  = 'All';
let savedMovies = JSON.parse(localStorage.getItem('savedMovies') || '[]');

// default api request details
const apiKey = '5f77c14a'; // api key
let type = '';            // type of search
let title = 'humans';    // default title of search
let page = '1';         // page of search

function mainFunc() {
    // creating elements for news list
    let createMovieElement = function (arr) {

        let movieElement = moviesCardTemplate.cloneNode(true);
        if (arr.Poster == 'N/A' || arr.Poster == null) {
            movieElement.querySelector('.js-movie-img').src = 'img/not-found.png';
            movieElement.querySelector('.js-modal-movie-img').src = 'img/not-found.png';
        } else {
            movieElement.querySelector('.js-movie-img').src = arr.Poster;
            movieElement.querySelector('.js-modal-movie-img').src = arr.Poster;
        }
        movieElement.querySelector('.js-movie-img').alt = arr.Title;
        movieElement.querySelector('.js-modal-movie-img').alt = arr.Title;

        if (arr.Title.length > 65) {
            movieElement.querySelector('.js-movie-title').textContent = arr.Title.slice(0, 65) + '...';
        } else {
            movieElement.querySelector('.js-movie-title').textContent = arr.Title;
        }

        movieElement.querySelector('.js-modal-title').textContent = arr.Title;
        movieElement.querySelector('.js-movie-release-year').textContent = arr.Year;
        movieElement.querySelector('.js-movie-language').textContent = arr.Type;
        movieElement.querySelector('.js-omdb-link').href = `https://www.imdb.com/title/${arr.imdbID}/?ref_=hm_fanfav_tt_i_2_pd_fp1`;

        movieElement.querySelector('.js-modal').id = `q${arr.imdbID}`;
        movieElement.querySelector('.js-modal-title').id = `q${arr.imdbID}`;
        movieElement.querySelector('.js-modal-btn').setAttribute('data-bs-target', `#q${arr.imdbID}`);

        return movieElement;
    }

    // render function
    let renderNews = function (arr) {
        moviesList.innerHTML = null;
        let fragment = document.createDocumentFragment();
    
        arr.forEach(movies => {
            fragment.appendChild(createMovieElement(movies));
        });
        
        moviesList.appendChild(fragment);
    }
    
    renderNews(arr);
    if (arr.length === 0) {
        elFailTxt.classList.remove('d-none');
    } else {
        elFailTxt.classList.add('d-none');
    }
}

// default api request
const defaultMoviesList = async movie => {
    try {
        const urlApi = await fetch('https://www.omdbapi.com/?apikey='
                        +apiKey+'&type='  // api key
                        +type+'&s='     // type of search
                        +title+'&page=' // title of search
                        +page+')');     // page of search
        const data = await urlApi.json();
        
        if (data.status === 404) {
            arr = [];
            elFailTxt.classList.remove('d-none');
            return;
        } else {
            elSearchInput.blur();
            elFailTxt.classList.add('d-none');
            arr = data.Search;
            mainFunc();
        }
    } catch (err) {
        elFailTxt.classList.remove('d-none');
    } finally {
        elSearchInput.value = '';
            elSearchBtn.disabled = false;
            elSearchBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>`;
            elSearchBtn.style.display = 'none';
    }
}
defaultMoviesList();

// api request
const searchMovies = async movie => {
    try {
        const urlApi = await fetch('https://www.omdbapi.com/?apikey='
                        +apiKey+'&type='  // api key
                        +type+'&s='     // type of search
                        +movie+'&page=' // title of search
                        +page+')');     // page of search
        const data = await urlApi.json();
        
        if (data.status === 404) {
            arr = [];
            elFailTxt.classList.remove('d-none');
            return;
        } else {
            elSearchInput.blur();
            elFailTxt.classList.add('d-none');
            arr = data.Search;
            mainFunc();
        }
    } catch (err) {
        elFailTxt.classList.remove('d-none');
        return;
    } finally {
        elSearchInput.value = '';
        elSearchBtn.disabled = false;
        elSearchBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>`;
    }
}


// search select change
elSearchSelect.addEventListener('change', () => {
    if (elSearchSelect.value === 'default') {
        type = '';
    } else {
        type = elSearchSelect.value;
    }
});

// Search input enter
elSearchInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        elSearchBtn.click();
    }
});

// Search btn click
elSearchBtn.onclick = function () {
    let value = elSearchInput.value.toLowerCase().trim();
    if (value === '') {
        elSearchInput.value = null;
        return;
    } else {
    moviesList.innerHTML = null;
    arr = [];
    elSearchBtn.disabled = true;
    elSearchBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

    searchMovies(value)
    }
}

// // Pagination
// async function paginationFunction() {
//     const postsData = arr;
//     let currentPage = 1;
//     let rows = 5;

//     // let pagination calc function
//     function displayList(arrData, rowPerPage, page) {
//         page--;

//         const start = rowPerPage * page;
//         const end = start + rowPerPage;
//         const paginatedData = arrData.slice(start, end);

//         paginatedData.forEach((el) => {
//         const postEl = document.createElement("div");
//         postEl.classList.add("post");
//         postEl.innerText = `${el.Title}`;
//         })
//         arr = paginatedData;
//         mainFunc();
//     }

//     // render pagination
//     function displayPagination(arrData, rowPerPage) {
//         const paginationEl = document.querySelector('.pagination');
//         paginationEl.innerHTML = "";
//         const pagesCount = Math.ceil(arrData.length / rowPerPage);
//         const ulEl = document.createElement("ul");
//         ulEl.classList.add('pagination__list');
    
//         for (let i = 0; i < pagesCount; i++) {
//             const liEl = displayPaginationBtn(i + 1);
//             ulEl.appendChild(liEl)
//         }
//         paginationEl.appendChild(ulEl)
//     }
//     // render pagination btn and func
//     function displayPaginationBtn(page) {
//         const liEl = document.createElement("li");
//         liEl.classList.add('pagination__item')
//         liEl.innerText = page
    
//         if (currentPage == page) liEl.classList.add('pagination__item--active');
    
//         liEl.addEventListener('click', () => {
//         currentPage = page
//         displayList(postsData, rows, currentPage)

//         let currentItemLi = document.querySelector('li.pagination__item--active');
//         currentItemLi.classList.remove('pagination__item--active');

//         liEl.classList.add('pagination__item--active');
//     })

//     return liEl;
//     }

//     displayList(postsData, rows, currentPage);
//     displayPagination(postsData, rows);
// }


// const moviesList = $('.js-movies-list');
// const moviesCardTemplate = $('#template-element').content;

// const searchInput = $('.js-search-input');
// const searchSelect = $('.js-search-select');
// const searchBtn = $('.js-search-btn');
// const elFailTxt = $('.js-fail-txt');

// let arr = [];
// let selectedCategory = [];
// let mainData  = 'All';
// let savedMovies = JSON.parse(localStorage.getItem('savedMovies') || '[]');


// // render function
// function mainFunc() {
//     // check if there is a search value
//     let filt = arr;
//     if (mainData == 'All') {
//         if (selectedCategory == null) {
//         } else {
//             arr = [...selectedCategory];
//         }
//         filt = arr;
//         arr = filt;
//     } else if (mainData == 'movie') {
//         if (selectedCategory == null) {
//         } else {
//             arr = [...selectedCategory];
//         }
//         filt = arr.filter(item => item.Type.includes(searchSelect.value))
//         arr = filt;
//     } else if (mainData == 'series') {
//         if (selectedCategory == null) {
//         } else {
//             arr = [...selectedCategory];
//         }
//         filt = arr.filter(item => item.Type.includes(searchSelect.value))
//         arr = filt;
//     }
//     // creating elements for movies list
//     let createMovieElement = function (arr) {
//         let movieElement = moviesCardTemplate.cloneNode(true);
//         if (arr.Poster == 'N/A' || arr.Poster == null) {
//             movieElement.querySelector('.js-movie-img').src = 'img/not-found.png';
//         } else {
//             movieElement.querySelector('.js-movie-img').src = arr.Poster;
//         }
//         movieElement.querySelector('.js-movie-img').alt = arr.Title;
//         movieElement.querySelector('.js-modal-movie-img').src = arr.Poster;
//         movieElement.querySelector('.js-modal-movie-img').alt = arr.Title;
//         movieElement.querySelector('.js-movie-title').textContent = arr.Title;
//         movieElement.querySelector('.js-modal-title').textContent = arr.Title;
//         movieElement.querySelector('.js-movie-release-year').textContent = arr.Year;
//         movieElement.querySelector('.js-movie-language').textContent = arr.Type;
//         movieElement.querySelector('.js-omdb-link').href = `https://www.imdb.com/title/${arr.imdbID}/?ref_=hm_fanfav_tt_i_2_pd_fp1`;
//         movieElement.querySelector('.js-modal').id = `exampleModal${arr.imdbID}`;
//         movieElement.querySelector('.js-modal-title').id = `exampleModal${arr.imdbID}`;
//         movieElement.querySelector('.js-modal-btn').setAttribute('data-bs-target', `#exampleModal${arr.imdbID}`);
    
//         return movieElement;
//     }

//     // render function
//     let renderMovies = function (arr) {
//         moviesList.innerHTML = null;
//         let fragment = document.createDocumentFragment();
    
//         arr.forEach(movie => {
//             fragment.appendChild(createMovieElement(movie));
//         });
        
//         moviesList.appendChild(fragment);
//     }
    
//     renderMovies(arr);
// }

// // api request
// function searchMovies(event) {
//     let urlApi = `https://www.omdbapi.com/?apikey=5f77c14a&s=${event}`;

//     setTimeout(() => {
//         moviesList.innerHTML = null;
//         mainFunc();
//     }, 1000);
    
//     fetch(urlApi)
//     .then(response => response.json())
//     .then(data => {
//         if (data.Response == 'True') {
//             arr = [...data.Search];
//             selectedCategory = arr.slice();
//             console.log('heave data');
//         } else {
//             arr = [];
//             selectedCategory = [];
//             console.log('no data');
//         }
//     })
//     .catch(err => console.log(err))
// }

// // search select
// searchSelect.addEventListener('change', function () {
//     if (searchSelect.value === 'All') {
//         let filt = arr;
//         arr = [...selectedCategory];
//         filt = arr;
//         arr = filt;
//         mainData = 'All';
//     } else if (searchSelect.value === 'movie') {
//         arr = [...selectedCategory];
//         filt = arr.filter(item => item.Type.includes(searchSelect.value))
//         arr = filt;
//         mainData = 'movie';
//     } else if (searchSelect.value === 'series') {
//         arr = [...selectedCategory];
//         filt = arr.filter(item => item.Type.includes(searchSelect.value))
//         arr = filt;
//         mainData = 'series';
//     }

//     mainFunc();
//     elFailTxt.classList.add('d-none');
// });
// // category select end
// searchMovies('humans');
// // Search input
// searchInput.oninput = function () {
//     let value = searchInput.value;
//     moviesList.innerHTML = null;
//     setTimeout(() => {
//         if (arr == '' || arr == null) {
//             elFailTxt.classList.remove('d-none');
//             if (value == '') {
//                 elFailTxt.classList.add('d-none');
//             }
//         } else {
//             elFailTxt.classList.add('d-none');
//         }
//     }, 1000);

//     searchMovies(value)
// }
// // Search input end