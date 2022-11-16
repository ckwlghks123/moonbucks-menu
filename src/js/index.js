const $ = (selector) => document.querySelector(selector);

const store = {
  setStorage(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
  },
  getStorage(name) {
    return JSON.parse(localStorage.getItem(name));
  },
};

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = "espresso";
  this.init = () => {
    if (store.getStorage("menu") && store.getStorage("menu").length > 0) {
      this.menu = store.getStorage("menu");
      this.render();
    }
  };

  this.render = () => {
    const template = this.menu[this.currentCategory]
      .map(({ id, name }) => {
        return `
	<li class="menu-list-item d-flex items-center py-2" data-menu-id="${id}">
		<span class="w-100 pl-2 menu-name">${name}</span>
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
      })
      .join("");

    $("#menu-list").innerHTML = template;

    menuCounter();
  };

  const $menuName = $("#menu-name");
  const $menuForm = $("#menu-form");
  const $menuList = $("#menu-list");
  const $menuHead = $("h2.mt-1");

  const menuCounter = () => {
    const menuCount = $("#menu-list").querySelectorAll("li").length;
    $(".menu-count").textContent = `총 ${menuCount}개`;
  };

  const editMenu = (target) => {
    const originMenuName = target.previousElementSibling;
    const id = target.closest("li.menu-list-item").dataset.menuId;

    const fixedString = prompt(
      "수정할 문구를 입력하세요",
      originMenuName.textContent
    );

    const newState = this.menu[this.currentCategory].map((e) =>
      e.id === id ? { ...e, name: fixedString } : e
    );

    this.menu[this.currentCategory] = newState;
    store.setStorage("menu", this.menu);

    fixedString.length > 0 && (originMenuName.textContent = fixedString);
  };

  const removeMenu = (target) => {
    const id = target.closest("li.menu-list-item").dataset.menuId;
    const newState = this.menu[this.currentCategory].filter((e) => e.id !== id);

    this.menu[this.currentCategory] = newState;
    store.setStorage("menu", newState);
    target.closest("li.d-flex").remove(target.parentNode);

    menuCounter();
  };

  const addMenu = () => {
    if ($menuName.value === "") {
      alert("값을 입력해 주세요");
      return;
    }

    const menuName = $("#menu-name").value;
    const id = new Date().getTime() + "";

    this.menu[this.currentCategory].push({ id, name: menuName });
    store.setStorage("menu", this.menu);

    this.render();
    $menuName.value = "";
  };

  $menuForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addMenu();
  });

  $menuList.addEventListener("click", ({ target }) => {
    if (target.classList.contains("menu-edit-button")) {
      editMenu(target);
    }
    if (target.classList.contains("menu-remove-button")) {
      removeMenu(target);
    }
  });

  $("nav").addEventListener("click", ({ target }) => {
    if (target.dataset.categoryName) {
      this.currentCategory = target.dataset.categoryName;
      $menuHead.innerText = `${target.innerText} 메뉴 관리`;
      $menuName.setAttribute(
        "placeholder",
        `${target.innerText.slice(2)} 메뉴 이름`
      );
      this.render();
    }
  });
}

const app = new App();

app.init();
