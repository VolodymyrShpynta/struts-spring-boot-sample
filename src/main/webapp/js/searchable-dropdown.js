/*
    After the initialization, searchable dropdown should have the following structure:
    <div id="cities-dropdown" class="searchable-dropdown">
        <div class="searchable-dropdown-select-btn">
            <input type="hidden" name="cityName">
            <span class="searchable-dropdown-selected-value-label"></span>
            <span class="searchable-dropdown-angle-down">﹀</span>
        </div>
        <div class="searchable-dropdown-content">
            <div class="searchable-dropdown-search">
                <input type="text" placeholder="Search..">
            </div>
            <ul class="searchable-dropdown-options">
                <li class="" customvalue=""></li>
                <li class="" customvalue="Kyiv">KYIV</li>
                <li class="" customvalue="Berlin">BERLIN</li>
            </ul>
        </div>
    </div>

    When some option is selected, searchable dropdown will have the following structure:
    <div id="cities-dropdown" class="searchable-dropdown">
        <div class="searchable-dropdown-select-btn">
            <input type="hidden" name="cityName" value="Kyiv">
            <span class="searchable-dropdown-selected-value-label">KYIV</span>
            <span class="searchable-dropdown-angle-down">﹀</span></div>
        <div class="searchable-dropdown-content">
            <div class="searchable-dropdown-search">
                <input type="text" placeholder="Search..">
            </div>
            <ul class="searchable-dropdown-options">
                <li class="" customvalue=""></li>
                <li class="selected" customvalue="Kyiv">KYIV</li>
                <li class="" customvalue="Berlin">BERLIN</li>
            </ul>
        </div>
    </div>
*/

const DROPDOWN_WRAPPER_CLASS = "searchable-dropdown";
const DROPDOWN_SELECT_BTN_CLASS = "searchable-dropdown-select-btn";
const DROPDOWN_SELECTED_VALUE_LABEL_CLASS = "searchable-dropdown-selected-value-label";
const DROPDOWN_ANGLE_DOWN_CLASS = "searchable-dropdown-angle-down";
const DROPDOWN_CONTENT_CLASS = "searchable-dropdown-content";
const DROPDOWN_SEARCH_CLASS = "searchable-dropdown-search";
const DROPDOWN_OPTIONS_CLASS = "searchable-dropdown-options";
const DROPDOWN_ACTIVE_CLASS = "active";
const DROPDOWN_OPTION_SELECTED_CLASS = "selected";
const CUSTOM_VALUE_ATTR_NAME = 'customvalue';
const ANGLE_DOWN_UNICODE_CHAR = '&#xfe40;';

// -------------- Public API: ----------------

function getSearchableDropdownValue(dropdownSelector) {
    const dropdownWrapper = initDropdownWrapper(document.querySelector(dropdownSelector));
    const hiddenInput = dropdownWrapper.querySelector(`.${DROPDOWN_SELECT_BTN_CLASS} input`);
    return hiddenInput.value;
}

function disableSearchableDropdown(dropdownSelector) {
    const dropdownWrapper = initDropdownWrapper(document.querySelector(dropdownSelector));
    dropdownWrapper.setAttribute("aria-disabled", "true");
}

function enableSearchableDropdown(dropdownSelector) {
    const dropdownWrapper = initDropdownWrapper(document.querySelector(dropdownSelector));
    dropdownWrapper.setAttribute("aria-disabled", "false");
}

function initSearchableDropdown(dropdownSelector, allItems) {
    const dropdownWrapper = initDropdownWrapper(document.querySelector(dropdownSelector));
    const selectBtn = initDropdownSelectButton(dropdownWrapper.getElementsByTagName("div")[0]);
    const dropdownContent = initDropdownSelectOptions(dropdownWrapper.getElementsByTagName("div")[1]);
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
            dropdownWrapper.classList.toggle(DROPDOWN_ACTIVE_CLASS);
        }
    });
}

// -------------- Private API: ----------------

function initDropdownWrapper(dropdownWrapper) {
    dropdownWrapper.className = DROPDOWN_WRAPPER_CLASS;
    return dropdownWrapper;
}

function initDropdownSelectButton(selectBtn) {
    selectBtn.className = DROPDOWN_SELECT_BTN_CLASS;

    const selectInput = selectBtn.querySelector("input");
    selectInput.type = "hidden";

    const selectedValueLabel = createHtmlElement("span", DROPDOWN_SELECTED_VALUE_LABEL_CLASS, '');
    const angleDown = createHtmlElement("span", DROPDOWN_ANGLE_DOWN_CLASS, ANGLE_DOWN_UNICODE_CHAR);
    selectBtn.appendChild(selectedValueLabel);
    selectBtn.appendChild(angleDown);

    return selectBtn;
}

function initDropdownSelectOptions(dropdownContent) {
    dropdownContent.className = DROPDOWN_CONTENT_CLASS;

    const dropdownSearch = dropdownContent.firstElementChild;
    dropdownSearch.className = DROPDOWN_SEARCH_CLASS;

    const dropdownOptions = createHtmlElement("ul", DROPDOWN_OPTIONS_CLASS, '');
    dropdownContent.appendChild(dropdownOptions);

    return dropdownContent;
}

function populateOptions(dropdown, showItems, allItems, selectedItem) {
    const options = dropdown.querySelector(`.${DROPDOWN_OPTIONS_CLASS}`)
    options.innerHTML = "";
    // add items from the collection:
    showItems.forEach(item => {
        let isSelected = item.label === selectedItem ? DROPDOWN_OPTION_SELECTED_CLASS : "";
        let li = createLiElement(item, isSelected);
        li.addEventListener("click", () => {
            updateSelectedValue(dropdown, allItems, li);
        })
        options.appendChild(li);
    })
}

function updateSelectedValue(dropdown, allItems, selectedLi) {
    const searchInput = dropdown.querySelector(`.${DROPDOWN_SEARCH_CLASS} input`);
    const selectBtn = dropdown.querySelector(`.${DROPDOWN_SELECT_BTN_CLASS}`);
    const selectedValueLabel = selectBtn.querySelector(`.${DROPDOWN_SELECTED_VALUE_LABEL_CLASS}`);
    const hiddenInput = selectBtn.querySelector("input");

    searchInput.value = "";
    populateOptions(dropdown, allItems, allItems, selectedLi.innerText);
    dropdown.classList.remove(DROPDOWN_ACTIVE_CLASS);
    selectedValueLabel.innerText = selectedLi.innerText;
    hiddenInput.value = selectedLi.getAttribute(CUSTOM_VALUE_ATTR_NAME);

    //fire 'change' event:
    let event = new Event('change');
    hiddenInput.dispatchEvent(event);
}

function createLiElement(contentData, isSelected) {
    let li = createHtmlElement("li", isSelected, getLabel(contentData));
    li.setAttribute(CUSTOM_VALUE_ATTR_NAME, getValue(contentData));
    return li;
}

function createHtmlElement(tagName, className, content) {
    let element = document.createElement(tagName);
    element.className = className;
    element.innerHTML = content;
    return element;
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
