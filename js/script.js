const moviesList = $('.js-movies-list');
const moviesCardTemplate = $('#template-element').content;

const elSearchInput = $('.js-search-input');
const elSearchSelect = $('.js-search-select');
const elSearchBtn = $('.js-search-btn');
const elFailTxt = $('.js-fail-txt');
const elPagination = document.querySelector('.js-pagination');
let elAddBookmarkBtn = document.querySelectorAll('.js-add-bookmark-btn');

let arr = [];
let totalResults = '';
let selectedCategory = [];
let mainData  = 'All';
let savedMovies = JSON.parse(localStorage.getItem('savedMovies') || '[]');

// default api request details
const apiKey = '5f77c14a'; // api key
let type = '';
let title = '';
let page = '';

localStorage.removeItem('activePaginationBtn');
function mainFunc() {
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
        movieElement.querySelector('.js-add-bookmark-btn').id = `q${arr.imdbID}`;
        elAddBookmarkBtn = movieElement.querySelector(`#q${arr.imdbID}`);

        return movieElement;
    }

    // render function
    let renderNews = function (arr) {
        moviesList.innerHTML = null;
        let fragment = document.createDocumentFragment();
    
        arr.forEach(movies => {
            fragment.appendChild(createMovieElement(movies));

            //on  bookmark btn clicked
        elAddBookmarkBtn.addEventListener('click', function () {
            var bookmarkBtnStatus = true;
            if (savedMovies.length == 0) {
                savedMovies.push(movies);
                localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
            } else {
                savedMovies.forEach(item => {
                    if (item.imdbID == movies.imdbID) {
                        bookmarkBtnStatus = false;
                        savedMovies.splice(savedMovies.indexOf(item), 1);
                        localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
                    }
                })
                if (bookmarkBtnStatus) {
                    savedMovies.push(movies);
                    localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
                }
            }
            
            // on click change bookmark btn icon
            elAddBookmarkBtn = document.querySelector('#q' + movies.imdbID);
            elAddBookmarkBtn.classList.toggle('active-bookmark');
            if (elAddBookmarkBtn.classList.contains('active-bookmark')) {
                elAddBookmarkBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-bookmark-dash" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M5.5 6.5A.5.5 0 0 1 6 6h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"/>
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                </svg>`;
            } else {
                elAddBookmarkBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-bookmark-plus" viewBox="0 0 16 16">
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                <path d="M8 4a.5.5 0 0 1 .5.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4z"/>
                </svg>`;
            }
            localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
            arr = savedMovies;
        })
        });
        
        moviesList.appendChild(fragment);
    }
    
    renderNews(arr);


    elBookmarksBtn.addEventListener('click', function () {
        elFailTxt.classList.add('d-none');
        if (elBookmarksBtn.textContent == 'Bookmarks') {
            elBookmarksBtn.textContent = 'All Movies';
            renderNews(savedMovies);
            mainData = savedMovies;
        } else {
            elBookmarksBtn.textContent = 'Bookmarks';
            mainFunc();
            // mainData = mainData;
        }
    
        if (savedMovies.length == 0) {
            elBookmarksBtn.textContent = 'Bookmarks';
            renderNews(defaultMoviesList);
            mainFunc();
            // mainData = defaultMoviesList;
        }
    })

    if (arr.length === 0) {
        elFailTxt.classList.remove('d-none');
    } else {
        elFailTxt.classList.add('d-none');
    }
}

// pagination
let pagination = function (totalResults) {
    let totalPages = Math.ceil(totalResults / 10);
    let pagination = '';
    if (totalPages >= 200) {
        pagination += `<li class="page-item"><a class="page-link js-page-link" id="paginate-btn${i}">${i}</a></li>`;
    } else {
    for (let i = 1; i <= totalPages; i++) {
        pagination += `<li class="page-item"><a class="page-link js-page-link" id="paginate-btn${i}">${i}</a></li>`;
    }
    }
    elPagination.innerHTML = pagination;
    
    let elPaginateBtn = document.querySelectorAll('.js-page-link');
    elPaginateBtn.forEach(el => {
        el.addEventListener('click', function (e) {

            e.preventDefault();
            page = e.target.textContent;
            title = elSearchInput.value;
            if (title === '') {
                title = 'humans';
            }
            searchMovies(title);

            document.querySelector('.js-page-ind').textContent = `Page ${page} of ${totalPages}`;
        })
    })
    
}

// default api request
const defaultMoviesList = async movie => {
    try {
        const urlApi = await fetch(`https://www.omdbapi.com/?apikey=5f77c14a&type=&s=humans&page=1`)
        const data = await urlApi.json();
        
        if (data.status === 404) {
            arr = [];
            elFailTxt.classList.remove('d-none');
            alert('No results found');
            return;
        } else {
            elSearchInput.blur();
            elFailTxt.classList.add('d-none');
            arr = data.Search;
            totalResults = data.totalResults;
            mainFunc();
            pagination(totalResults);

        }
    } catch (err) {
        elFailTxt.classList.remove('d-none');
    } finally {
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
                        +page);     // page of search
        const data = await urlApi.json();
        
        if (data.status === 404) {
            arr = [];
            elFailTxt.classList.remove('d-none');
            return;
        } else {
            elSearchInput.blur();
            elFailTxt.classList.add('d-none');
            arr = data.Search;
            totalResults = data.totalResults;
            mainFunc();
        }
    } catch (err) {
        elFailTxt.classList.remove('d-none');
    } finally {
        elSearchBtn.disabled = false;
        elSearchBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>`;
        pagination(totalResults);
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
        return;
    } else {
    moviesList.innerHTML = null;
    arr = [];
    elSearchBtn.disabled = true;
    elSearchBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

    searchMovies(value)
    }
}