const $ = (selector) => document.querySelector(selector);

function App() {
  const $menuForm = $("#espresso-menu-form");

  $menuForm.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  const $menuName = $("#espresso-menu-name");

  $menuName.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      console.log($menuName.value);
    }
  });
}

App();
