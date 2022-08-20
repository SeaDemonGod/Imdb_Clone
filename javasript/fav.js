const searchList = document.getElementById('search_listing');
var modal = document.getElementById('myModal');
var span = document.getElementById('close');
const resultGrid = document.getElementById('result_grid_section');


var favMovies = [];

function fetchFavs(){
    if(localStorage.getItem("fav")  === null){
        favMovies = [];

    }else{
        favMovies = JSON.parse(localStorage.getItem("fav"));
    }
    console.log(favMovies);
}
fetchFavs();

// for(let i=0; i<favMovies.length; i++){
//     loadMovies(favMovies[i].imbdID);
// }


async function loadMovies(searchTerm){
    const URL = `https://www.omdbapi.com/?i=${searchTerm}&apikey=261f248a`; 
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if(data.Response == "True"){
        displayMovieList(data);
    }
}

function displayMovieList(movies){

  searchList.innerHTML = "";
  for(let idx = 0; idx<movies.length;idx++){
    let movieListItem = document.createElement('div');
    movieListItem.dataset.id = movies[idx].imbdID;
    movieListItem.classList.add('fav_movie');
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
    ` ;
    searchList.appendChild(movieListItem);

  }

    // let movieListItem = document.createElement('div');
    // movieListItem.setAttribute('id', movies.imbdID);
    // movieListItem.classList.add('fav_movie');
    // let moviePoster = "N/A";
    // if(movies.Poster != "N/A")
    //    moviePoster = movies.Poster;
    //    else 
    //    moviePoster = "../asset/image_not_found.png";

    //    let img = document.createElement('img');
    //    img.classList.add('fav_img');
    //    img.src = moviePoster;
    //    movieListItem.appendChild(img);


    //    let title = document.createElement('h3');
    //    title.classList .add("fav_title");
    //    title.innerText = movies.Title;
    //    movieListItem.appendChild(title);

    //    searchList.appendChild(movieListItem);
    loadMovieDetails();
}


async function loadMovieDetails(favId){
    const URL = `https://www.omdbapi.com/?i=${favId}&apikey=261f248a`; 
    const res = await fetch(`$(URL)`);
    const data = await res.json();
    if(data.Response == "True"){
        displayMovieDetails(data);
    }
}

function eventTarget(e){
    console.log(e.target.parentElement);
    let favId = e.target.parentElement.id;

    console.log(favId);
    loadMovieDetails(favId);
}





// searchList.addEventListener('click', eventTarget, true);


// searchList.onclick = function(){
//     modal.style.display = "block";

// }

// span.onclick = function(){
//     modal.style.display = "none";

// }

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
        window.location.assign("../html/fav.html");
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










































// const searchList = document.getElementById('search_listing');
// var modal = document.getElementById("myModal");
// var span = document.getElementsByClassName("close")[0];
// const resultGrid = document.getElementById('result_grid_section');


// var favMovies = [];

// function fetchFavs(){
//     if(localStorage.getItem("fav")  === null){
//         favMovies = [];

//     }else{
//         favMovies = JSON.parse(localStorage.getItem("fav"));
//     }
//     console.log(favMovies);
// }
// fetchFavs();

// for(let i=0; i<favMovies.length; i++){
//     loadMovies(favMovies[i].imbdID);
// }


// async function loadMovies(searchTerm){
//     const URL = `https://omdbapi.com/?apikey=52d6585f&i=${searchTerm}`;
//     const res = await fetch(`${URL}`);
//     const data = await res.json();
//     if(data.Response == "True"){
//         displayMovieList(data);
//     }
// }

// function displayMovieList(movies){

//     let movieListItem = document.createElement('div');
//     movieListItem.setAttribute('id', movies.imbdID);
//     movieListItem.classList.add('fav-movie');
//     let moviePoster = "N/A";
//     if(movies.Poster != "N/A")
//        moviePoster = movies.Poster;
//        else 
//        moviePoster = "../asset/image_not_found.png";

//        let img = document.createElement('img');
//        img.classList.add('fav_img');
//        img.src = moviePoster;
//        movieListItem.appendChild(img);


//        let title = document.createElement('h3');
//        title.classList .add("fav_title");
//        title.innerText = movies.Title;
//        movieListItem.appendChild(title);

//        searchList.appendChild(movieListItem);
// }


// async function loadMovieDetails(favId){
//     const URL = `https://omdbapi.com/?apikey=261f248a&i=${favId}`;
//     const res = await fetch(`$(URL)`);
//     const data = await res.json();
//     if(data.Response == "True"){
//         displayMovieDetails(data);
//     }
// }

// function eventTarget(e){
//     console.log(e.target.parentElement);
//     let favId = e.target.parentElement.id;

//     console.log(favId);
//     loadMovieDetails(favId);
// }





// searchList.addEventListener('click', eventTarget, false);


// searchList.onclick = function(){
//     modal.style.display = "block";

// }

// span.onclick = function(){
//     modal.style.display = "none";

// }

// function displayMovieDetails(details){
//     resultGrid.innerHTML = `
//      <div class = "movie_poster">
//      <img src = "${(details.Poster != "N/A") ? details.Poster : "../asset/image_not_found.png"}" alt = "movie poster">
//      </div>
//      <div class = "movie_info">
//      <h3 class = "movie_title">${details.Title}</h3>
//      <a id="fav-detail" style="color:white; cursor:pointer;"><i class="fa-heart"></i></a>
     
//      <ul class = "movie_misc_info">
//      <li class = "year">Year: ${details.Year}</li>
//      <li class = "rated">Ratings: ${details.imdbRating}</li>
//      <li class = "released">Released: ${details.Released}</li>
//      </ul>
//      <p class="genre"><b>Genre:</b> ${details.Genre}</p>
//     <p class="writer"><b>Writer:</b> ${details.writer}</p>
//     <p class="actors"><b>Actors:</b> ${details.Actors}</p>
//     <p class="plot"><b>Plot:</b> ${details.Plot}</p>
//     <p class="language"><b>Language:</b> ${details.Language}</p>
//     <p class="awards"><b><i class="fas fa-award"></i></b><b> Awards:</b> ${details.Awards}</p>
//    </div>
//     `;
// }

// var favDetail = document.getElementById('fav_details');


// let flag = addedCheck(details.imdbID);