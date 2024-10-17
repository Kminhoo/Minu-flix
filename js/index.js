import { displayMovieCards, displayIdCard } from "./ui.js";

const $movieGroup = document.querySelector(".movie__group");
const $navLinks = document.querySelectorAll(".header__list__item");
const $backMoveBtn = document.querySelector(".movie__detail__back");

// 검색
const $searchInput = document.querySelector(".search__input");

// 무한 스크롤
const $trigger = document.querySelector(".trigger");

// 상세페이지
const $movieContainer = document.querySelector(".movie__info__container");

const currentPage = window.location.pathname.split("/")[1];
let page = 1;
let totalPage = 0; // 2일차 totalpage 값 넣기
let hasNextPage = true;
let loading = true;

const observer = new IntersectionObserver(
  async (entries) => {
    const firstEntry = entries[0];

    if (firstEntry.isIntersecting && hasNextPage && loading) {
      try {
        page++;
        loading = false;
        $trigger.classList.add("loader");
        console.log("데이터 가져온다?");
        await displayMovieCards(page, $movieGroup);
        loading = true;
        $trigger.classList.remove("loader");

        // footer를 보기 위해 넣어둠 무한크스롤 기능은 없애면 동작함
        // if (page > 5 || page >= totalPage) {
        //   observer.unobserve($trigger);
        // }
      } catch (error) {
        throw new Error(`이런 ${error} 가 발생했습니다.`);
      }
    }
  },
  {
    threshold: 0.3,
  }
);

document.addEventListener("DOMContentLoaded", () => {
  $navLinks.forEach((link) => {
    const path = link.getAttribute("href").split("/")[1];

    if (path === currentPage) {
      link.style.color = "var(--red-text-color)";
    }
  });

  // 홈 페이지 동작
  if (currentPage === "index.html") {
    observer.observe($trigger);

    console.log(currentPage);
    displayMovieCards(page, $movieGroup);
  }

  // 상세 페이지 동작
  if (currentPage === "movieDetail.html") {
    const params = new URL(window.location.href).searchParams;
    const movieId = params.get("id");

    displayIdCard(movieId, $movieContainer);

    $backMoveBtn.addEventListener("click", () => history.back());
  }

  if (currentPage === "movieList.html") {
    // const getAllMovies = async () => {
    //   const response = await fetch(
    //     "https://api.themoviedb.org/3/movie/top_rated?language=ko",
    //     {
    //       method: "GET",
    //       headers: {
    //         accept: "application/json",
    //         Authorization:
    //           "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYWRjMzlhMzhmODhhOTUzYTkwNjU0N2RjZTc1YTQ4YyIsIm5iZiI6MTcyOTA0MDQwOS4wMzY0OTQsInN1YiI6IjY0ZmI1NTMwYTI4NGViMDEzYWNjNzVmMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ixgBaiSDqIBYrCoQjC5JC-flnMzOw0tQRUkcrvMnWTk",
    //       },
    //     }
    //   );
    //   const data = await response.json();
    //   console.log(data);
    //   return data;
    // };
    // $searchInput.addEventListener("keydown", async (e) => {
    //   const result = await getAllMovies();
    //   let search = e.target.value;
    //   let arr = result.results.filter((item) => {
    //     if (item.title === search) {
    //       return true;
    //     }
    //   });
    //   arr.forEach((item) => {
    //     console.log("이거네", item);
    //   });
    // });
  }
});
