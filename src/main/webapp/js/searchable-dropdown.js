/*
    After the initialization, searchable dropdown should have the following structure:
    <div id="cities-dropdown" class="searchable-dropdown">
       <select name="cityName" hidden="true">
          <option value="Kyiv">KYIV</option>
          <option value="Berlin">BERLIN</option>
       </select>
       <div class="searchable-dropdown-select-btn">
          <span class="searchable-dropdown-selected-value-label"></span>
          <span class="searchable-dropdown-angle-down">﹀</span>
       </div>
       <div class="searchable-dropdown-content">
          <div class="searchable-dropdown-search">
            <input class="" type="text" placeholder="Search..">
          </div>
          <ul class="searchable-dropdown-options">
             <li class="" customvalue="Kyiv">KYIV</li>
             <li class="" customvalue="Berlin">BERLIN</li>
          </ul>
       </div>
    </div>

    When some option is selected, searchable dropdown will have the following structure:
    <div id="cities-dropdown" class="searchable-dropdown">
       <select name="cityName" hidden="true">
          <option value="Kyiv">KYIV</option>
          <option value="Berlin">BERLIN</option>
       </select>
       <div class="searchable-dropdown-select-btn">
          <span class="searchable-dropdown-selected-value-label">KYIV</span>
          <span class="searchable-dropdown-angle-down">﹀</span></div>
       <div class="searchable-dropdown-content">
          <div class="searchable-dropdown-search">
             <input class="" type="text" placeholder="Search..">
          </div>
          <ul class="searchable-dropdown-options">
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
const DROPDOWN_SEARCH_PLACEHOLDER_CLASS = "searchable-dropdown-search-placeholder";
const DROPDOWN_OPTIONS_CLASS = "searchable-dropdown-options";
const DROPDOWN_ACTIVE_CLASS = "active";
const DROPDOWN_OPTION_SELECTED_CLASS = "selected";
const CUSTOM_VALUE_ATTR_NAME = 'customvalue';
const ANGLE_DOWN_UNICODE_CHAR = '&#xfe40;';

// -------------- Public API: ----------------

function getSearchableDropdownValue(dropdownSelector) {
    const dropdownWrapper = document.querySelector(dropdownSelector);
    const sourceSelect = getSourceSelect(dropdownWrapper);
    return sourceSelect.value;
}

function disableSearchableDropdown(dropdownSelector) {
    const dropdownWrapper = document.querySelector(dropdownSelector);
    dropdownWrapper.setAttribute("aria-disabled", "true");
}

function enableSearchableDropdown(dropdownSelector) {
    const dropdownWrapper = document.querySelector(dropdownSelector);
    dropdownWrapper.setAttribute("aria-disabled", "false");
}

function updateSearchableDropdown(dropdownSelector, items) {
    const dropdownWrapper = document.querySelector(dropdownSelector);
    const selectedValueLabel = dropdownWrapper.querySelector(`.${DROPDOWN_SELECTED_VALUE_LABEL_CLASS}`);

    selectedValueLabel.innerText = '';

    const options = createOptions(items)
    updateHiddenSelectOptions(dropdownWrapper, options);
    populateOptions(dropdownWrapper, options, options);
}

function initSearchableDropdown(dropdownSelector) {
    const dropdownWrapper = initDropdownWrapper(document.querySelector(dropdownSelector));
    const sourceSelect = initSourceSelect(dropdownWrapper);
    const selectBtn = initDropdownSelectButton(dropdownWrapper);
    const dropdownContent = initDropdownSelectOptions(dropdownWrapper);
    const searchInput = dropdownWrapper.querySelector(".searchable-dropdown-search input");

    const allOptions = Array.from(sourceSelect.options);
    populateOptions(dropdownWrapper, allOptions, allOptions);

    searchInput.addEventListener("keyup", () => {
        let searchedVal = searchInput.value;
        const options = Array.from(getSourceSelect(dropdownWrapper).options); //fetch up-to-date options from the hidden select source
        let filteredOptions = options.filter((option) => {
            return getLabel(option).toLowerCase().includes(searchedVal.toLowerCase())
        });
        populateOptions(dropdownWrapper, filteredOptions, options);
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

function initSourceSelect(dropdownWrapper) {
    const sourceSelect = getSourceSelect(dropdownWrapper);
    sourceSelect.hidden = true;
    return sourceSelect;
}

function initDropdownSelectButton(dropdownWrapper) {
    const selectBtn = createHtmlElement("div", DROPDOWN_SELECT_BTN_CLASS, '')
    dropdownWrapper.appendChild(selectBtn);

    const selectedValueLabel = createHtmlElement("span", DROPDOWN_SELECTED_VALUE_LABEL_CLASS,
        getSelectedOptionText(dropdownWrapper));
    const angleDown = createHtmlElement("span", DROPDOWN_ANGLE_DOWN_CLASS, ANGLE_DOWN_UNICODE_CHAR);
    selectBtn.appendChild(selectedValueLabel);
    selectBtn.appendChild(angleDown);

    return selectBtn;
}

function initDropdownSelectOptions(dropdownWrapper) {
    const dropdownContent = createHtmlElement("div", DROPDOWN_CONTENT_CLASS, '')
    dropdownWrapper.appendChild(dropdownContent);

    const dropdownSearch = createHtmlElement("div", DROPDOWN_SEARCH_CLASS, '')
    dropdownContent.appendChild(dropdownSearch)

    const searchInput = createHtmlElement("input", '', '');
    searchInput.type = "text";
    searchInput.placeholder = getSearchPlaceholder(dropdownWrapper);
    dropdownSearch.appendChild(searchInput);

    const dropdownOptions = createHtmlElement("ul", DROPDOWN_OPTIONS_CLASS, '');
    dropdownContent.appendChild(dropdownOptions);

    return dropdownContent;
}

function populateOptions(dropdown, showOptions, allOptions, selectedOption) {
    const optionsContainer = dropdown.querySelector(`.${DROPDOWN_OPTIONS_CLASS}`)
    optionsContainer.innerHTML = "";
    // add items from the collection:
    showOptions.forEach(option => {
        let isSelected = option.innerText === selectedOption ? DROPDOWN_OPTION_SELECTED_CLASS : "";
        let li = createLiElement(option, isSelected);
        li.addEventListener("click", () => {
            updateSelectedValue(dropdown, allOptions, li);
        })
        optionsContainer.appendChild(li);
    })
}

function updateHiddenSelectOptions(dropdownWrapper, newOptions) {
    const hiddenSelect = getSourceSelect(dropdownWrapper);
    hiddenSelect.options.length = 0; //erase existing options
    for (const option of newOptions) {
        hiddenSelect.options.add(option);
    }
}

function updateSelectedValue(dropdown, allItems, selectedLi) {
    const searchInput = dropdown.querySelector(`.${DROPDOWN_SEARCH_CLASS} input`);
    const selectBtn = dropdown.querySelector(`.${DROPDOWN_SELECT_BTN_CLASS}`);
    const selectedValueLabel = selectBtn.querySelector(`.${DROPDOWN_SELECTED_VALUE_LABEL_CLASS}`);
    const hiddenSelect = getSourceSelect(dropdown);

    searchInput.value = "";
    populateOptions(dropdown, allItems, allItems, selectedLi.innerText);
    dropdown.classList.remove(DROPDOWN_ACTIVE_CLASS);
    selectedValueLabel.innerText = selectedLi.innerText;
    hiddenSelect.value = selectedLi.getAttribute(CUSTOM_VALUE_ATTR_NAME);

    //fire 'change' event:
    let event = new Event('change');
    hiddenSelect.dispatchEvent(event);
}

function createLiElement(contentData, isSelected) {
    let li = createHtmlElement("li", isSelected, getLabel(contentData));
    li.setAttribute(CUSTOM_VALUE_ATTR_NAME, getValue(contentData));
    return li;
}

function createOptions(labelValueBeans) {
    return labelValueBeans ? labelValueBeans.map(bean => createOption(bean)) : [];
}

function createOption(labelValueBean) {
    const option = document.createElement("option");
    option.innerText = labelValueBean.label;
    option.value = labelValueBean.value;
    return option;
}

function createHtmlElement(tagName, className, content) {
    let element = document.createElement(tagName);
    element.className = className;
    element.innerHTML = content;
    return element;
}

function getLabel(option) {
    return option ? option.innerText : "";
}

function getValue(option) {
    return option ? option.value : "";
}

function getAttribute(element, attributeName) {
    let attribute = element.getAttribute(attributeName);
    return attribute ? attribute : '';
}

function getSourceSelect(dropdownWrapper) {
    return dropdownWrapper.getElementsByTagName("select")[0];
}

function getSearchPlaceholder(dropdownWrapper) {
    const searchLabel = dropdownWrapper.querySelector(`.${DROPDOWN_SEARCH_PLACEHOLDER_CLASS}`);
    return searchLabel ? searchLabel.innerText : "Search...";
}

function getSelectedOptionText(dropdownWrapper) {
    const hiddenSelect = getSourceSelect(dropdownWrapper);
    if (hiddenSelect.selectedIndex >= 0) {
        return hiddenSelect.options[hiddenSelect.selectedIndex].text;
    }
    return '';
}
