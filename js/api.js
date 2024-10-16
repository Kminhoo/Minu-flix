import TMDB_API_KEY from "./apiKey.js";

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

    return {
      results: data.results,
      totalPage: data.totalPage,
      currentPage: data.page,
    };
  } catch (error) {
    throw new Error(`이런 ${error} 가 발생했어요!`);
  }
};
