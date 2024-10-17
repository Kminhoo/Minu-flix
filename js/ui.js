import { getIdMovie, getRatedMovies } from "./api.js";

// 문자열 길이 조절
const strCut = (str, cutNum) => {
  if (str.length > cutNum) return str.substring(0, cutNum) + "....";

  return str;
};

// 영화 카드 UI 그리기
export const displayMovieCards = async (page, Element) => {
  const moviesData = await getRatedMovies(page);

  if (moviesData && moviesData.results.length > 0) {
    try {
      moviesData.results.forEach((movie) => {
        const divEl = document.createElement("div");
        divEl.setAttribute("key", movie.id);
        divEl.classList.add("movie__card");
        const movieItem = `
        <a class='movie__link' href='./movieDetail.html?id=${movie.id}'>
          <img class="movie__img" src="https://image.tmdb.org/t/p/w300${
            movie.backdrop_path
          }" alt="${movie.title}"/>
          <div class="movie__text__container">
            <h3 class="movie__title">${strCut(movie.title, 20)}</h3>
            <p class="movie__date"> 개봉 : ${movie.release_date}</p>
            <p class="movie__desc">${
              movie.overview ? strCut(movie.overview, 35) : "설명이 없습니다."
            }</p>
          </div>
        </a>
        `;

        divEl.innerHTML = movieItem;
        Element.append(divEl);
      });
    } catch (error) {
      throw new Error(`이런 ${error} 가 발생했습니다.`);
    }
  }
};

// 영화 상세 페이지 그리기
export const displayIdCard = async (id, element) => {
  const movieData = await getIdMovie(id);

  if (movieData && movieData.id) {
    try {
      const movieInfoEl = document.createElement("div");
      movieInfoEl.classList.add("movie__info");
      movieInfoEl.innerHTML = `
        <div class="movie__info__img">
          <img src="https://image.tmdb.org/t/p/w500${
            movieData.poster_path
          }" alt="${movieData.title}"/>
        </div>
        <div class="movie__info__desc">
          <h2>${movieData.title}</h2>
          <p>개봉일 : ${movieData.release_date}</p>
          <p>장르 : ${movieData.genres[0]["name"]}</p>
          <p>평점 : ${movieData.vote_average.toFixed(1)}</p>
          <p>줄거리 :</p>
          <p>${
            movieData.overview ? movieData.overview : "줄거리가 없습니다."
          }</p>
        </div>
      `;

      element.append(movieInfoEl);
    } catch (error) {
      throw new Error(`이런 ${error} 가 발생했습니다.`);
    }
  }
};
