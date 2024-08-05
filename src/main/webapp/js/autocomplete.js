let citiesList = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique'
];

const wrapper = document.querySelector(".wrapper");
const selectBtn = wrapper.querySelector(".select-btn");
const searchInput = wrapper.querySelector(".search input");
const options = wrapper.querySelector(".options")

function addOptions(selectedItem) {
    options.innerHTML = "";
    // add first empty item:
    options.insertAdjacentHTML("beforeend", `<li onclick="updateName(this)"></li>`);
    // add items from the collection:
    citiesList.forEach(item => {
        let isSelected = item == selectedItem ? "selected" : "";
        let li = `<li onclick="updateName(this)" class="${isSelected}">${item}</li>`;
        options.insertAdjacentHTML("beforeend", li);
    })
}

addOptions();

function updateName(selectedLi) {
    searchInput.value = "";
    addOptions(selectedLi.innerText);
    wrapper.classList.remove("active");
    selectBtn.firstElementChild.value = selectedLi.innerText;
}

searchInput.addEventListener("keyup", () => {
    let result = [];
    let searchedVal = searchInput.value;
    result = citiesList.filter((item) => {
        return item.toLowerCase().includes(searchedVal.toLowerCase())
    }).map(item => `<li onclick="updateName(this)">${item}</li>`).join("");
    options.innerHTML = result;
});

selectBtn.addEventListener("click", () => {
    wrapper.classList.toggle("active");
});
