const movieSearchBox = document.getElementById('search_box');
const searchList = document.getElementById('search_listing');
const resultGrid = document.getElementById('result_grid_section');

// loading movies from API omdb API

async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=261f248a`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // we get data after search

    if(data.Response == "True")
    displayMovieList(data.Search);
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length>0){
        searchList.classList.remove('hide_search_list');
        loadMovies(searchTerm);
    }else{
        searchList.classList.add('hide_search_list');
    }
}

//displaying movies list
function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx<movies.length;idx++ ){
        let movieListItem = document.createElement('div');
        //setting id of movie in data

        movieListItem.dataset.id = movies[idx].imdbID;

        movieListItem.classList.add('search_list_item');
        if(movies[idx].Poster != "N/A")
        moviePoster = movies[idx].Poster;
        else
        moviePoster = "../asset/image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search_item_thumbnail">
        <img src = "${moviePoster}">
        </div>
        <div class = "search_item_info">
        <h3>${movies[idx].Title}</h3>
        <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

//loading movielist details from IMDB api

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll(`.search_list_item`);
    searchListMovies.forEach(movie =>{
        movie.addEventListener('click', async() => {
            searchList.classList.add('hide_search_list');
            movieSearchBox.value = "";
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=261f248a`);
            const movieDetails = await result.json();

            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie_poster">
    <img src = "${(details.Poster != "N/A") ? details.Poster: "../asset/image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie_info>
    <h3 class = "movie_title"><span style = "color:violet"><span style = "padding-left:10px">${details.Title}</span></span></h3>
    

    <a id = "fav_detail" style = "color:white; cursor:pointer;"><i class="fa-solid fa-heart"></i></a>

    

    <ul class = "movie_misc_information">
        <li class = "year"><span style="font-size:1.2rem">Year:</span><span style = "color:yellow"><span style = "padding-left:10px">${details.Year}</span></span></li>
        <li class = "rated"><span style="font-size:1.2rem">Ratings:</span><span style = "color:yellow"><span style = "padding-left:10px">${details.Rated}</span></span></li>
        <li class = "released"><span style="font-size:1.2rem">Released:</span><span style = "color:yellow"><span style = "padding-left:10px">${details.Released}</span></span></li>
    </ul>
    <p class = "genre"><span style="font-size:1.2rem"><b><i>Genre:</i></b></span><span style = "color:yellow"><span style = "padding-left:10px"> ${details.Genre}</span></span></p>
    <p class = "Writer"><span style="font-size:1.2rem"><b><i>Writer:</i></b> </span><span style = "color:yellow"><span style = "padding-left:10px">${details.Writer}</span></span></p>
    <p class = "actors"><span style="font-size:1.2rem"><b><i>Actors:</i></b></span><span style = "color:yellow"><span style = "padding-left:10px"> ${details.Actors}</span></span></p>
    <p class = "plot"><span style="font-size:1.2rem"><b><i>Plot:</i></b></span> <span style = "color:yellow"><span style = "padding-left:10px">${details.Plot}</span></span></p>
    <p class = "language"><span style="font-size:1.2rem"><b><i>Language:</i></b></span><span style = "color:yellow"><span style = "padding-left:10px"> ${details.Language}</span></span></p>
    <p class = "awards"><b><i><i class = "fas fa-award">Awards:</i></i></b> <span style = "color:yellow"><span style = "padding-left:10px">${details.Awards}</span></span></p>

    </div>
    `;

    const favDetail = document.getElementById('fav_detail');
    let flag = addedCheck(details.imdbID);

    if(flag){
        favDetail.style.color = 'red';
    }
    favDetail.addEventListener('click',function(){
        if(flag){
            removeLocalFavs(details.imdbID);
            favDetail.style.color = 'white';
            flag = false;
        }else{
            favDetail.style.color = 'red';
            saveLocalFavs(details.imdbID);
            flag = true;
        }
    });
    function saveLocalFavs(id){
        let fav;
        if(localStorage.getItem("fav") === null){
            fav = [];
        }else{
            fav = JSON.parse(localStorage.getItem("fav"));
        }
        let obj = {
            imdbID : id
        }
        fav.push(obj);
        localStorage.setItem("fav",JSON.stringify(fav));
        // window.location.assign("../html/fav.html");
    }

    function addedCheck(id){
        let fav;
        if(localStorage.getItem("fav") === null){
            fav = [];
        }else{
            fav = JSON.parse(localStorage.getItem("fav"));
        }
        const delIndex = fav.findIndex(function(item,_index){
            if(item.imdbID ==  id){
                return true;
            }
        });
        if(delIndex >-1)
        return true;
    }

    function removeLocalFavs(id){
        let fav;
        if(localStorage.getItem("fav") === null){
            fav = [];
        }else{
            fav = JSON.parse(localStorage.getItem("fav"));
        }
        const delIndex = fav.findIndex(function(item,_index){
            if(item.imdbID ==  id){
                return true;
            }
        });
        if(delIndex >-1)
        fav.splice(delIndex, 1);
        localStorage.setItem("fav", JSON.stringify(fav));

    }
}


//event listener for favourites icon

favDetail.addEventListener('click', function(e){
    console.log('inside fav');
    favDetail.style.color='red';
},true);