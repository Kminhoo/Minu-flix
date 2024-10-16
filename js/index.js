import { displayMovieCard } from "./ui.js";

const $movieGroup = document.querySelector(".movie__group");
const $navLinks = document.querySelectorAll(".header__list__item");

// 무한 스크롤
const $trigger = document.querySelector(".trigger");

const currentPage = window.location.pathname.split("/")[1];
let page = 1;
let totalPage = 0;
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
        await displayMovieCard(page, $movieGroup);
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
  observer.observe($trigger);

  displayMovieCard(page, $movieGroup);

  $navLinks.forEach((link) => {
    const path = link.getAttribute("href").split("/")[1];

    if (path === currentPage) {
      link.style.color = "var(--red-text-color)";
    }
  });
});
