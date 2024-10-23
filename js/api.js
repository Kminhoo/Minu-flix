import TMDB_API_KEY from "./apiKey.js";

// 영화 데이터들 가져오기
export const getRatedMovies = async (page) => {
  const url = `https://api.themoviedb.org/3/movie/top_rated?page=${page}&language=ko`;

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`이런 ${error} 가 발생했어요!`);
  }
};

// id로 영화 데이터 가져오기
export const getIdMovie = async (id) => {
  const url = `https://api.themoviedb.org/3/movie/${id}?language=ko`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`이런 ${error} 가 발생했어요!`);
  }
};

// 영화 검색 데이터 가져오기
export const getSearchMovies = async (page, title) => {
  const url = `https://api.themoviedb.org/3/search/movie?query=${title}&language=ko&page=${page}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`이런 ${error} 가 발생했어요!`);
  }
};
