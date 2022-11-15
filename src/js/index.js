const $ = (selector) => document.querySelector(selector);

function App() {
  const $menuName = $("#espresso-menu-name");
  const $menuForm = $("#espresso-menu-form");

  $menuForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if ($menuName.value === "") {
      alert("값을 입력해 주세요");
      return;
    }
    const menuName = $("#espresso-menu-name").value;
    const menuItemTemplate = (espressoMenuName) => `
    <li class="menu-list-item d-flex items-center py-2">
    <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
    <button
      type="button"
      class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
    >
      수정
    </button>
    <button
      type="button"
      class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
    >
      삭제
    </button>
  </li>
    `;
    $("#espresso-menu-list").insertAdjacentHTML(
      "beforeend",
      menuItemTemplate(menuName)
    );
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").textContent = `총 ${menuCount}개`;
    $menuName.value = "";
  });

  $menuName.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
    }
  });
}

App();
