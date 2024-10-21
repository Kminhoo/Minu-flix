import { getIdMovie, getRatedMovies, getSearchMovies } from "./api.js";

// 문자열 길이 조절
const strCut = (str, cutNum) => {
  if (str.length > cutNum) return str.substring(0, cutNum) + "....";

  return str;
};

// 영화 카드 UI 그리기
export const displayMovieCards = async (page, element) => {
  const moviesData = await getRatedMovies(page);

  if (moviesData && moviesData.results.length > 0) {
    try {
      moviesData.results.forEach((movie) => {
        const bookMarks = JSON.parse(localStorage.getItem("movies")) || [];
        const isBookMarked = bookMarks.some(
          (bookmark) => bookmark.id === String(movie.id)
        );

        const divEl = document.createElement("div");
        divEl.setAttribute("key", movie.id);
        divEl.classList.add("movie__card");
        const movieItem = `
        <a class='movie__link' href='./movieDetail.html?id=${movie.id}'>
          <img class="movie__mark" src='./images/${
            isBookMarked ? "fillstar.svg" : "star.svg"
          }' /> 
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
        element.append(divEl);
      });

      element.lastChild.classList.add("trigger");
      // console.log("트리커", element.querySelector(".trigger"));

      return moviesData.total_pages;
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

// 영화 검색 페이지 그리기
export const displaySearchResultCards = async (page, title, element) => {
  const moviesData = await getSearchMovies(page, title);

  page === 1 ? (element.innerHTML = "") : null;

  if (moviesData && moviesData.results.length > 0) {
    try {
      moviesData.results.forEach((movie) => {
        const bookMarks = JSON.parse(localStorage.getItem("movies")) || [];
        const isBookMarked = bookMarks.some(
          (bookmark) => bookmark.id === String(movie.id)
        );

        const divEl = document.createElement("div");
        divEl.setAttribute("key", movie.id);
        divEl.classList.add("movie__card");
        const movieItem = `
        <a class='movie__link' href='./movieDetail.html?id=${movie.id}'>
          <img class="movie__mark" src='./images/${
            isBookMarked ? "fillstar.svg" : "star.svg"
          }' /> 
          <img class="movie__img" src=${
            movie.backdrop_path
              ? `https://image.tmdb.org/t/p/w300${movie.backdrop_path}`
              : "https://ekari.jp/wp-content/uploads/2020/12/noimage.png"
          } alt="${movie.title}"/>
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
        element.append(divEl);
      });
      console.log("moviesData", moviesData);

      return {
        totalPages: moviesData.total_pages ? moviesData.total_pages : 0,
        totalResults: moviesData.total_results ? moviesData.total_results : 0,
      };
    } catch (error) {
      throw new Error(`이런 ${error} 가 발생했습니다.`);
    }
  } else {
    element.innerHTML = `<p class="movie__no__result">${title} 에 대한 검색 결과가 없습니다.</p>`;
  }
};

// bookMark 체크하기
export const bookMarkCheck = (e) => {
  if (e.target.classList.contains("movie__mark")) {
    e.preventDefault();
    e.stopPropagation();

    const movieLink = e.target.closest(".movie__link");

    const movieTitle = movieLink.querySelector(".movie__title").textContent;
    const movieId = movieLink.getAttribute("href").split("=")[1];
    const movieDate = movieLink
      .querySelector(".movie__date")
      .textContent.split(":")[1]
      .trim();
    const movieDesc = movieLink.querySelector(".movie__desc").textContent;
    const movieSrc =
      movieLink.querySelector(".movie__img").getAttribute("src") ||
      "https://ekari.jp/wp-content/uploads/2020/12/noimage.png";

    const bookMarks = JSON.parse(localStorage.getItem("movies")) || [];

    const isBookMarked = bookMarks.some((movie) => movie.id === movieId);

    if (isBookMarked) {
      const newBookMark = bookMarks.filter((movie) => movie.id !== movieId);
      localStorage.setItem("movies", JSON.stringify(newBookMark));
      e.target.setAttribute("src", "./images/star.svg");
    } else {
      const movie = {
        id: movieId,
        title: movieTitle,
        desc: movieDesc,
        src: movieSrc,
        date: movieDate,
      };
      bookMarks.push(movie);
      localStorage.setItem("movies", JSON.stringify(bookMarks));
      e.target.setAttribute("src", "./images/fillstar.svg");
    }
  }
};

// 북마크 UI 그리기 및
export const displayBookMarkResultCards = (element) => {
  const bookMarkResults = JSON.parse(localStorage.getItem("movies")) || [];

  if (bookMarkResults.length > 0) {
    bookMarkResults.forEach((mark) => {
      const divEl = document.createElement("div");
      divEl.classList.add("movie__card");

      const bookMarkItem = `
      <a class='movie__link' href='./movieDetail.html?id=${mark.id}'>
        <img class="movie__mark" src="./images/fillstar.svg" /> 
        <img class="movie__img" src=${
          mark.src
            ? `${mark.src}`
            : "https://ekari.jp/wp-content/uploads/2020/12/noimage.png"
        } alt="${mark.title}"/>
        <div class="movie__text__container">
          <h3 class="movie__title">${strCut(mark.title, 20)}</h3>
          <p class="movie__date"> 개봉 : ${mark.date}</p>
          <p class="movie__desc">${
            mark.desc ? strCut(mark.desc, 35) : "설명이 없습니다."
          }</p>
        </div>
      </a>
      `;

      divEl.innerHTML = bookMarkItem;

      element.append(divEl);
    });
  } else {
    element.innerHTML =
      '<p class="movie__no__result">북마크한 영화가 없습니다. </p>;';
  }
};
