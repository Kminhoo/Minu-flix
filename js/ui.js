import { getRatedMovies } from "./api.js";

// 문자열 길이 조절
const strCut = (str, cutNum) => {
  if (str.length > cutNum) return str.substring(0, cutNum) + "....";

  return str;
};

// 영화 카드 UI 그리기
export const displayMovieCard = async (page, plusElement) => {
  const moviesData = await getRatedMovies(page);

  if (moviesData && moviesData.results.length > 0) {
    try {
      moviesData.results.forEach((movie) => {
        const divEl = document.createElement("div");
        divEl.setAttribute("key", movie.id);
        divEl.classList.add("movie__card");
        const movieItem = `
            <img class="movie__img" src="https://image.tmdb.org/t/p/w300${
              movie.poster_path
            }" alt="${movie.title}"/>
            <h3 class="movie__title">${strCut(movie.title, 20)}</h3>
            <p class="movie__desc">${
              movie.overview ? strCut(movie.overview, 35) : "설명이 없습니다."
            }</p>
        `;

        divEl.innerHTML = movieItem;
        plusElement.append(divEl);
      });
    } catch (error) {
      throw new Error(`이런 ${error} 가 발생했습니다.`);
    }
  }
};
