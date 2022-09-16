const moviesList = $('.js-movies-list');
const moviesCardTemplate = $('#template-element').content;

const searchInput = $('.js-search-input');
const searchSelect = $('.js-search-select');
const searchBtn = $('.js-search-btn');
const elFailTxt = $('.js-fail-txt');

let arr = [];
let selectedCategory = [];
let mainData  = 'All';
let savedMovies = JSON.parse(localStorage.getItem('savedMovies') || '[]');


// render function
function mainFunc() {
    // check if there is a search value
    let filt = arr;
    if (mainData == 'All') {
        if (selectedCategory == null) {
        } else {
            arr = [...selectedCategory];
        }
        filt = arr;
        arr = filt;
    } else if (mainData == 'movie') {
        if (selectedCategory == null) {
        } else {
            arr = [...selectedCategory];
        }
        filt = arr.filter(item => item.Type.includes(searchSelect.value))
        arr = filt;
    } else if (mainData == 'series') {
        if (selectedCategory == null) {
        } else {
            arr = [...selectedCategory];
        }
        filt = arr.filter(item => item.Type.includes(searchSelect.value))
        arr = filt;
    }
    // creating elements for movies list
    let createMovieElement = function (arr) {
        let movieElement = moviesCardTemplate.cloneNode(true);
        if (arr.Poster == 'N/A' || arr.Poster == null) {
            movieElement.querySelector('.js-movie-img').src = 'img/not-found.png';
        } else {
            movieElement.querySelector('.js-movie-img').src = arr.Poster;
        }
        movieElement.querySelector('.js-movie-img').alt = arr.Title;
        movieElement.querySelector('.js-modal-movie-img').src = arr.Poster;
        movieElement.querySelector('.js-modal-movie-img').alt = arr.title;
        movieElement.querySelector('.js-movie-title').textContent = arr.Title;
        movieElement.querySelector('.js-modal-title').textContent = arr.Title;
        movieElement.querySelector('.js-movie-release-year').textContent = arr.Year;
        movieElement.querySelector('.js-movie-language').textContent = arr.Type;
        movieElement.querySelector('.js-yt-link').href = `https://www.imdb.com/title/${arr.imdbID}/?ref_=hm_fanfav_tt_i_2_pd_fp1`;
        movieElement.querySelector('.js-modal').id = `exampleModal${arr.imdbID}`;
        movieElement.querySelector('.js-modal-title').id = `exampleModal${arr.imdbID}`;
        movieElement.querySelector('.js-modal-btn').setAttribute('data-bs-target', `#exampleModal${arr.imdbID}`);
    
        return movieElement;
    }

    // render function
    let renderMovies = function (arr) {
        moviesList.innerHTML = null;
        let fragment = document.createDocumentFragment();
    
        arr.forEach(movie => {
            fragment.appendChild(createMovieElement(movie));
        });
        
        moviesList.appendChild(fragment);
    }
    
    renderMovies(arr);
}

// api request
function searchMovies(event) {
    let urlApi = `https://www.omdbapi.com/?apikey=5f77c14a&s=${event}`;

    setTimeout(() => {
        moviesList.innerHTML = null;
        mainFunc();
    }, 1000);
    
    fetch(urlApi)
    .then(response => response.json())
    .then(data => {
        if (data.Response == 'True') {
            arr = [...data.Search];
            selectedCategory = arr.slice();
            console.log('heave data');
        } else {
            arr = [];
            selectedCategory = [];
            console.log('no data');
        }
    })
    .catch(err => console.log(err))
}

// search select
searchSelect.addEventListener('change', function () {
    if (searchSelect.value === 'All') {
        let filt = arr;
        arr = [...selectedCategory];
        filt = arr;
        arr = filt;
        mainData = 'All';
    } else if (searchSelect.value === 'movie') {
        arr = [...selectedCategory];
        filt = arr.filter(item => item.Type.includes(searchSelect.value))
        arr = filt;
        mainData = 'movie';
    } else if (searchSelect.value === 'series') {
        arr = [...selectedCategory];
        filt = arr.filter(item => item.Type.includes(searchSelect.value))
        arr = filt;
        mainData = 'series';
    }

    mainFunc();
    elFailTxt.classList.add('d-none');
});
// category select end
searchMovies('batman');
// Search input
searchInput.oninput = function () {
    let value = searchInput.value;
    moviesList.innerHTML = null;
    setTimeout(() => {
        if (arr == '' || arr == null) {
            elFailTxt.classList.remove('d-none');
            if (value == '') {
                elFailTxt.classList.add('d-none');
            }
        } else {
            elFailTxt.classList.add('d-none');
        }
    }, 1000);

    searchMovies(value)
}
// Search input end