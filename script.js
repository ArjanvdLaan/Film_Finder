const tmdbKey = "0e6d369627e7fc4ce789d447b9c3e161";
const tmdbBaseUrl = "https://api.themoviedb.org/3";
const playBtn = document.getElementById("playBtn");

const getGenres = async () => {
  const genreRequestEndpoint = "/genre/movie/list?language=en";
  const requestParams = `&api_key=${tmdbKey}`;
  const urlToFetch = `${tmdbBaseUrl}${genreRequestEndpoint}${requestParams}`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      // console.log(jsonResponse);
      const genres = jsonResponse.genres;
      // console.log(genres);
      return genres;
    }
  } catch (error) {
    console.log("There is an " + error);
  }
};

const getMovies = async () => {
  const selectedGenre = getSelectedGenre();
  const discoverMovieEndpoint = `/discover/movie`;
  const requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}`;
  // Generate a random number of pages to fetch between 10 and 50
  const pagesToFetch = Math.floor(Math.random() * 41) + 10;
  let movies = [];

  // Loop over the number of pages to fetch the specified amount
  for (let i = 1; i <= pagesToFetch; i++) {
    const urlToFetch = `${tmdbBaseUrl}${discoverMovieEndpoint}${requestParams}&page=${i}`;

    try {
      const response = await fetch(urlToFetch);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      movies = movies.concat(data.results);
    } catch (error) {
      console.error(`Could not fetch movies, error: ${error}`);
    }
  }

  return movies;
};

const getMovieInfo = async (movie) => {
  const movieId = movie.id;
  const movieEndpoint = `/movie/${movieId}`;
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = `${tmdbBaseUrl}${movieEndpoint}${requestParams}`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const movieInfo = await response.json();
      return movieInfo;
    }
  } catch (error) {
    console.log(error);
  }
};

// Gets a list of movies and ultimately displays the info of a random movie from the list
const showRandomMovie = async () => {
  const movieInfo = document.getElementById("movieInfo");
  if (movieInfo.childNodes.length > 0) {
    clearCurrentMovie();
  }
  const movies = await getMovies();
  console.log(movies);
  const randomMovie = getRandomMovie(movies);
  const info = await getMovieInfo(randomMovie);
  // console.log(info);
  displayMovie(info);
};

getGenres().then(populateGenreDropdown);
playBtn.onclick = showRandomMovie;
