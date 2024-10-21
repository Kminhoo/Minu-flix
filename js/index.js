// import {
//   displayMovieCards,
//   displayIdCard,
//   displaySearchResultCards,
//   displayBookMarkResultCards,
//   bookMarkCheck,
// } from "./ui.js";

// const $movieGroup = document.querySelector(".movie__group");
// const $navLinks = document.querySelectorAll(".header__list__item");
// const $backMoveBtn = document.querySelector(".movie__detail__back");
// const $bookMarkGroup = document.querySelector(".bookMark__results");
// const $movieContainer = document.querySelector(".movie__info__container");

// // 검색
// const $searchInput = document.querySelector(".movie__search__input");
// const $searchResults = document.querySelector(".movie__search__results");
// const $searchBtn = document.querySelector(".movie__search__btn");

// // 무한 스크롤 트리거
// const $trigger = document.querySelector(".trigger");
// const $searchTrigger = document.querySelector(".search__trigger");

// const currentPage = window.location.pathname.split("/")[1];

// let page = 1;
// let totalPages = 0;
// let hasNextPage = true;
// let loading = true;
// let inputSearch = "";

// const observer = new IntersectionObserver(
//   async (entries) => {
//     const firstEntry = entries[0];

//     if (firstEntry.isIntersecting && hasNextPage && loading) {
//       try {
//         page++;
//         loading = false;
//         $trigger.classList.add("loader");
//         totalPages = await displayMovieCards(page, $movieGroup);
//         loading = true;
//         $trigger.classList.remove("loader");

//         if (page === totalPages) {
//           console.log("더이상 페이지가 없습니다.");
//           observer.unobserve($trigger);
//         }
//       } catch (error) {
//         throw new Error(`이런 ${error} 가 발생했습니다.`);
//       }
//     }
//   },
//   {
//     threshold: 0.3,
//   }
// );

// const observer2 = new IntersectionObserver(
//   async (entries) => {
//     const firstEntry = entries[0];

//     if (firstEntry.isIntersecting && hasNextPage && loading) {
//       try {
//         console.log(totalPages);
//         console.log("관찰 시작");
//         page++;
//         loading = false;
//         $searchTrigger.classList.add("loader");
//         totalPages = await displaySearchResultCards(
//           page,
//           inputSearch,
//           $searchResults
//         );
//         loading = true;
//         $searchTrigger.classList.remove("loader");

//         if (page === totalPages) {
//           observer2.unobserve($searchTrigger);

//           const divEl = document.createElement("p");
//           divEl.classList.add("no__search");
//           divEl.textContent = "더 이상 검색결과가 없습니다.";
//           $searchResults.append(divEl);
//         }
//       } catch (error) {
//         throw new Error(`이런 ${error} 가 발생했습니다.`);
//       }
//     }
//   },
//   {
//     threshold: 0.3,
//   }
// );

// document.addEventListener("DOMContentLoaded", () => {
//   $navLinks.forEach((link) => {
//     const path = link.getAttribute("href").split("/")[1];

//     if (path === currentPage) {
//       link.style.color = "var(--red-text-color)";
//     }
//   });

//   // 홈 페이지 동작
//   if (currentPage === "index.html") {
//     page = 1;
//     observer.observe($trigger);

//     displayMovieCards(page, $movieGroup);

//     $movieGroup.addEventListener("click", (e) => {
//       bookMarkCheck(e);
//     });
//   }

//   // 상세 페이지 동작
//   if (currentPage === "movieDetail.html") {
//     const params = new URL(window.location.href).searchParams;
//     const movieId = params.get("id");

//     displayIdCard(movieId, $movieContainer);

//     $backMoveBtn.addEventListener("click", () => {
//       history.back();
//     });
//   }

//   // 영화 검색 페이지 동작
//   if (currentPage === "movieList.html") {
//     observer2.observe($searchTrigger);

//     $searchResults.addEventListener("click", (e) => {
//       bookMarkCheck(e);
//     });

//     $searchInput.addEventListener("input", (e) => {
//       page = 1;
//       inputSearch = e.target.value.toLowerCase().trim();

//       displaySearchResultCards(page, inputSearch, $searchResults);
//     });

//     $searchInput.addEventListener("keydown", (e) => {
//       page = 1;
//       inputSearch = e.target.value.toLowerCase().trim();

//       if (e.key === "Enter") {
//         inputSearch
//           ? displaySearchResultCards(page, inputSearch, $searchResults)
//           : alert("검색어를 입력해 주세요");
//       }
//     });

//     $searchBtn.addEventListener("click", () => {
//       page = 1;
//       inputSearch = $searchInput.value.toLowerCase().trim();
//       inputSearch
//         ? displaySearchResultCards(page, inputSearch, $searchResults)
//         : alert("검색어를 입력해 주세요");
//     });
//   }

//   // 북마크 페이지 동작
//   if (currentPage === "movieMark.html") {
//     displayBookMarkResultCards($bookMarkGroup);

//     $bookMarkGroup.addEventListener("click", (e) => {
//       if (e.target.classList.contains("movie__mark")) {
//         $bookMarkGroup.innerHTML = "";
//         bookMarkCheck(e);
//         displayBookMarkResultCards($bookMarkGroup);
//       }
//     });
//   }
// });

// ==============================
import {
  displayMovieCards,
  displayIdCard,
  displaySearchResultCards,
  displayBookMarkResultCards,
  bookMarkCheck,
} from "./ui.js";

const $movieGroup = document.querySelector(".movie__group");
const $navLinks = document.querySelectorAll(".header__list__item");
const $backMoveBtn = document.querySelector(".movie__detail__back");
const $bookMarkGroup = document.querySelector(".bookMark__results");
const $movieContainer = document.querySelector(".movie__info__container");

// 검색
const $searchInput = document.querySelector(".movie__search__input");
const $searchResults = document.querySelector(".movie__search__results");
const $searchBtn = document.querySelector(".movie__search__btn");

// 무한 스크롤 트리거
const $trigger = document.querySelector(".trigger");
const $searchTrigger = document.querySelector(".search__trigger");

const currentPage = window.location.pathname.split("/")[1];

let page = 1;
let totalPages = 0;
let hasNextPage = true;
let loading = true;
let inputSearch = "";
let totalResults = 0;
let searchObserver = null;

// index.html 옵저버
const observer = new IntersectionObserver(
  async (entries) => {
    const firstEntry = entries[0];

    if (firstEntry.isIntersecting && hasNextPage && loading) {
      try {
        page++;
        loading = false;
        $trigger.classList.add("loader");
        totalPages = await displayMovieCards(page, $movieGroup);
        loading = true;
        $trigger.classList.remove("loader");

        if (page === totalPages) {
          observer.unobserve($trigger);
        }
      } catch (error) {
        throw new Error(`이런 ${error} 가 발생했습니다.`);
      }
    }
  },
  {
    threshold: 0.3,
  }
);

// movieList.html 옵저버
const initializeSearchObserver = () => {
  // 기존 observer가 있다면 해제
  if (searchObserver) {
    searchObserver.disconnect();

    if (document.querySelector(".no__search")) {
      document.querySelector(".no__search").remove();
    }
  }

  if (totalResults < 20) {
    if (!document.querySelector(".no__search")) {
      const divEl = document.createElement("p");
      divEl.classList.add("no__search");
      divEl.textContent = "더 이상 검색결과가 없습니다.";
      $searchResults.after(divEl);
    }
    return;
  }

  searchObserver = new IntersectionObserver(
    async (entries) => {
      const firstEntry = entries[0];

      if (firstEntry.isIntersecting && hasNextPage && loading) {
        try {
          page++;
          console.log("page", page);
          loading = false;
          $searchTrigger.classList.add("loader");

          await displaySearchResultCards(page, inputSearch, $searchResults);

          loading = true;
          $searchTrigger.classList.remove("loader");

          if (page == totalPages) {
            searchObserver.unobserve($searchTrigger);
            hasNextPage = false;

            if (!document.querySelector(".no__search")) {
              const divEl = document.createElement("p");
              divEl.classList.add("no__search");
              divEl.textContent = "더 이상 검색결과가 없습니다.";
              $searchResults.after(divEl);
            }
          }
        } catch (error) {
          console.error(`Error: ${error}`);
          $searchTrigger.classList.remove("loader");
        }
      }
    },
    {
      threshold: 0.3,
    }
  );

  searchObserver.observe($searchTrigger);
};

const handleSearch = async () => {
  page = 1;
  hasNextPage = true;
  loading = true;

  const { totalPages: searchPages = 0, totalResults: searchResults = 0 } =
    await displaySearchResultCards(page, inputSearch, $searchResults);

  totalPages = searchPages;
  totalResults = searchResults;

  console.log("totalPage:", totalPages);
  console.log("totalResults:", totalResults);

  if (totalPages >= 1) {
    initializeSearchObserver();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  $navLinks.forEach((link) => {
    const path = link.getAttribute("href").split("/")[1];
    if (path === currentPage) {
      link.style.color = "var(--red-text-color)";
    }
  });

  // 홈 페이지 동작
  if (currentPage === "index.html") {
    page = 1;
    observer.observe($trigger);

    displayMovieCards(page, $movieGroup);

    $movieGroup.addEventListener("click", (e) => {
      bookMarkCheck(e);
    });
  }

  // 상세 페이지 동작
  if (currentPage === "movieDetail.html") {
    const params = new URL(window.location.href).searchParams;
    const movieId = params.get("id");

    displayIdCard(movieId, $movieContainer);

    $backMoveBtn.addEventListener("click", () => {
      history.back();
    });
  }

  // 영화 검색 페이지 동작
  if (currentPage === "movieList.html") {
    $searchResults.addEventListener("click", (e) => {
      bookMarkCheck(e);
    });

    $searchInput.addEventListener("input", async (e) => {
      inputSearch = e.target.value.toLowerCase().trim();
      if (inputSearch) {
        await handleSearch();
      }
    });

    $searchInput.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        if (!inputSearch) {
          alert("검색어를 입력해 주세요");
          return;
        }
        await handleSearch();
      }
    });

    $searchBtn.addEventListener("click", async () => {
      inputSearch = $searchInput.value.toLowerCase().trim();
      if (!inputSearch) {
        alert("검색어를 입력해 주세요");
        return;
      }
      await handleSearch();
    });
  }

  // 북마크 페이지 동작
  if (currentPage === "movieMark.html") {
    displayBookMarkResultCards($bookMarkGroup);

    $bookMarkGroup.addEventListener("click", (e) => {
      if (e.target.classList.contains("movie__mark")) {
        $bookMarkGroup.innerHTML = "";
        bookMarkCheck(e);
        displayBookMarkResultCards($bookMarkGroup);
      }
    });
  }
});
