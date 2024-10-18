import {
  displayMovieCards,
  displayIdCard,
  displaySearchResultCards,
} from "./ui.js";

const $movieGroup = document.querySelector(".movie__group");
const $navLinks = document.querySelectorAll(".header__list__item");
const $backMoveBtn = document.querySelector(".movie__detail__back");

// 검색
const $searchInput = document.querySelector(".movie__search__input");
const $searchResults = document.querySelector(".movie__search__results");
const $searchBtn = document.querySelector(".movie__search__btn");

// 무한 스크롤
const $trigger = document.querySelector(".trigger");

// const $secondTrigger = document.querySelector(".second__trigger");

// 상세페이지
const $movieContainer = document.querySelector(".movie__info__container");

const currentPage = window.location.pathname.split("/")[1];
let page = 1;
let totalPage = 0; // 2일차 totalpage 값 넣기
let hasNextPage = true;
let loading = true;
// let searchMovie = "";

const observer = new IntersectionObserver(
  async (entries) => {
    const firstEntry = entries[0];
    // const secondEntry = entries[1];

    if (firstEntry.isIntersecting && hasNextPage && loading) {
      try {
        page++;
        loading = false;
        $trigger.classList.add("loader");
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

    // if (secondEntry.isIntersecting && hasNextPage && loading) {
    //   try {
    //     page++;
    //     loading = false;
    //     $secondTrigger.classList.add("loader");
    //     await displaySearchResultCards(page, searchMovie, $movieGroup);
    //     loading = true;
    //     $secondTrigger.classList.remove("loader");

    //     // footer를 보기 위해 넣어둠 무한크스롤 기능은 없애면 동작함
    //     // if (page > 5 || page >= totalPage) {
    //     //   observer.unobserve($trigger);
    //     // }
    //   } catch (error) {
    //     throw new Error(`이런 ${error} 가 발생했습니다.`);
    //   }
    // }
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

    $backMoveBtn.addEventListener("click", () => {
      history.back();
      // $backMoveBtn.removeEventListener("click", () => {
      //   history.back();
      // });
    });
  }

  if (currentPage === "movieList.html") {
    page = 1;
    // observer.observe($secondTrigger);
    // $searchInput.addEventListener("keydown", (e) => {
    //   displayMovieCards(page, $searchResults, e.target.value);
    // });

    $searchInput.addEventListener("input", (e) => {
      const searchText = e.target.value.toLowerCase().trim();

      displaySearchResultCards(page, searchText, $searchResults);
    });

    $searchBtn.addEventListener("click", () => {
      if ($searchInput.value) {
        const searchWord = $searchInput.value.toLowerCase().trim();
        displaySearchResultCards(page, searchWord, $searchResults);
      } else {
        alert("검색어를 입력해 주세요");
      }
    });
  }
});
