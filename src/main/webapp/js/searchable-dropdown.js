function initSearchableDropdown(allItems) {
    const dropdownWrapper = document.querySelector(".searchable-dropdown");
    const selectBtn = dropdownWrapper.querySelector(".searchable-dropdown-select-btn");
    const searchInput = dropdownWrapper.querySelector(".searchable-dropdown-search input");

    allItems.unshift(''); // add first empty item to the array
    populateOptions(dropdownWrapper, allItems, allItems);

    searchInput.addEventListener("keyup", () => {
        let searchedVal = searchInput.value;
        let filteredItems = allItems.filter((item) => {
            return getLabel(item).toLowerCase().includes(searchedVal.toLowerCase())
        });
        populateOptions(dropdownWrapper, filteredItems, allItems);
    });

    selectBtn.addEventListener("click", () => {
        if (getAttribute(dropdownWrapper, "aria-disabled").toLowerCase() !== "true") {
            dropdownWrapper.classList.toggle("active");
        }
    });
}

function populateOptions(dropdown, showItems, allItems, selectedItem) {
    const options = dropdown.querySelector(".searchable-dropdown-options")
    options.innerHTML = "";
    // add items from the collection:
    showItems.forEach(item => {
        let isSelected = item == selectedItem ? "selected" : "";
        let li = createLiElement(item, isSelected);
        li.addEventListener("click", () => {
            updateSelectedValue(dropdown, allItems, li);
        })
        options.appendChild(li);
    })
}

function createLiElement(contentData, isSelected) {
    let li = document.createElement('li');
    li.setAttribute('class', isSelected);
    li.setAttribute('customvalue', getValue(contentData));
    li.innerHTML = getLabel(contentData);
    return li;
}

function updateSelectedValue(dropdown, allItems, selectedLi) {
    const searchInput = dropdown.querySelector(".searchable-dropdown-search input");
    const selectBtn = dropdown.querySelector(".searchable-dropdown-select-btn");
    const hiddenInput = selectBtn.querySelector("input");
    searchInput.value = "";
    populateOptions(dropdown, allItems, allItems, selectedLi.innerText);
    dropdown.classList.remove("active");
    selectBtn.firstElementChild.innerText = selectedLi.innerText;
    hiddenInput.value = selectedLi.getAttribute('customvalue');
}

function getLabel(item) {
    return item ? item.label : "";
}

function getValue(item) {
    return item ? item.value : "";
}

function getAttribute(element, attributeName) {
    let attribute = element.getAttribute(attributeName);
    return attribute ? attribute : '';
}
