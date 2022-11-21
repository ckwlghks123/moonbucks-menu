const $ = (selector) => document.querySelector(selector);

const BASE_URL = "http://localhost:3000/api";

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
  this.init = async () => {
    const data = await this.getMenu();
    if (data) {
      this.menu[this.currentCategory] = data;
      this.render();
      initEventListeners();
    }
  };

  this.getMenu = async () => {
    return await fetch(
      `${BASE_URL}/category/${this.currentCategory}/menu`
    ).then((res) => res.json());
  };

  this.render = async () => {
    this.menu[this.currentCategory] = await this.getMenu();
    const template = this.menu[this.currentCategory]
      .map(({ id, name, isSoldOut }) => {
        return `
	<li class="${
    isSoldOut && "sold-out"
  } menu-list-item d-flex items-center py-2" data-menu-id="${id}">
		<span class="w-100 pl-2 menu-name">${name}</span>
		<button
			type="button"
			class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
		>
			품절
		</button>
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
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").textContent = `총 ${menuCount}개`;
  };

  const editMenu = async (target) => {
    const originMenuName = target
      .closest("li.menu-list-item")
      .querySelector("span.menu-name");
    const id = target.closest("li.menu-list-item").dataset.menuId;

    const fixedString = prompt(
      "수정할 문구를 입력하세요",
      originMenuName.textContent
    );

    if (!(fixedString && fixedString.length > 0))
      return alert("문구를 입력해주세요");

    await fetch(`${BASE_URL}/category/${this.currentCategory}/menu/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: fixedString }),
    });

    this.render();
  };

  const removeMenu = async (target) => {
    const id = target.closest("li.menu-list-item").dataset.menuId;
    await fetch(`${BASE_URL}/category/${this.currentCategory}/menu/${id}`, {
      method: "DELETE",
    });

    this.render();
  };

  const addMenu = async () => {
    if ($menuName.value === "") {
      alert("값을 입력해 주세요");
      return;
    }

    const menuName = $("#menu-name").value;
    const id = new Date().getTime() + "";
    const isExist = this.menu[this.currentCategory].find(
      (e) => e.name === menuName
    );

    if (isExist) {
      $menuName.value = "";
      return alert("이미 존재하는 메뉴입니다.");
    }

    await fetch(`${BASE_URL}/category/${this.currentCategory}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: menuName }),
    });
    this.render();
    $menuName.value = "";
  };

  const soldOutMenu = async (target) => {
    const id = target.closest("li.menu-list-item").dataset.menuId;
    const $targetMenu = this.menu[this.currentCategory].find(
      (e) => e.id === id
    );
    await fetch(
      `${BASE_URL}/category/${this.currentCategory}/menu/${id}/soldout`,
      {
        method: "PUT",
      }
    );

    this.render();
  };

  const initEventListeners = () => {
    $menuForm.addEventListener("submit", (e) => {
      e.preventDefault();
      addMenu();
    });

    $menuList.addEventListener("click", ({ target }) => {
      if (target.classList.contains("menu-edit-button")) {
        editMenu(target);
        return;
      }
      if (target.classList.contains("menu-remove-button")) {
        removeMenu(target);
        return;
      }
      if (target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(target);
        return;
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
  };
}

const app = new App();

app.init();
