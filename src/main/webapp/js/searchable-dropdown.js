/*  Prerequisites:
    Before the initialization the source select should have the following structure:
    <div id="cities-dropdown">
       <span class="searchable-dropdown-search-placeholder" hidden="">Search..</span>
       <select name="cityName">
          <option value="Kyiv">KYIV</option>
          <option value="Berlin">BERLIN</option>
       </select>
    </div>

    Then after the initialization, searchable dropdown will have the following structure:
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

class SearchableDropdown {

    #DROPDOWN_ACTIVE_CLASS = "active";
    #CUSTOM_VALUE_ATTR_NAME = 'customvalue';

    #dropdownSelector;

    #dropdownWrapper;
    #hiddenSourceSelect;
    #selectButton;
    #selectedValueLabel;
    #searchInput;
    #dropdownOptions;

    constructor(dropdownSelector) {
        this.#dropdownSelector = dropdownSelector;
        this.#initSearchableDropdown();
    }

    // -------------- Public API: ----------------

    getSelectedValue() {
        return this.#hiddenSourceSelect.value;
    }

    clearSelectedValue() {
        this.#hiddenSourceSelect.value = '';
        this.#selectedValueLabel.innerText='';
    }

    disableDropdown() {
        this.#dropdownWrapper.setAttribute("aria-disabled", "true");
    }

    enableDropdown() {
        this.#dropdownWrapper.setAttribute("aria-disabled", "false");
    }

    updateDropdown(items) {
        this.#selectedValueLabel.innerText = '';

        const options = this.#createOptions(items)
        this.#updateHiddenSelectOptions(options);
        this.#populateSelectOptions(options, options);
    }

    // -------------- Private API: ----------------

    #initSearchableDropdown() {
        this.#initDropdownWrapper();
        this.#initSourceSelect();
        this.#initDropdownSelectButton();
        this.#initDropdownSelectOptions();

        const allOptions = Array.from(this.#hiddenSourceSelect.options);
        this.#populateSelectOptions(allOptions, allOptions);

        this.#searchInput.addEventListener("keyup", () => {
            let searchedVal = this.#searchInput.value;
            const options = Array.from(this.#hiddenSourceSelect.options); //fetch up-to-date options from the hidden select source
            let filteredOptions = options.filter((option) => {
                return this.#getLabel(option).toLowerCase().includes(searchedVal.toLowerCase())
            });
            this.#populateSelectOptions(filteredOptions, options);
        });

        this.#selectButton.addEventListener("click", () => {
            if (this.#getAttribute(this.#dropdownWrapper, "aria-disabled").toLowerCase() !== "true") {
                this.#dropdownWrapper.classList.toggle(this.#DROPDOWN_ACTIVE_CLASS);
            }
        });
    }

    #initDropdownWrapper() {
        this.#dropdownWrapper = document.querySelector(this.#dropdownSelector);
        this.#dropdownWrapper.className = "searchable-dropdown";
    }

    #initSourceSelect() {
        this.#hiddenSourceSelect = this.#dropdownWrapper.getElementsByTagName("select")[0];
        this.#hiddenSourceSelect.hidden = true;
    }

    #initDropdownSelectButton() {
        this.#selectButton = this.#createHtmlElement("div", "searchable-dropdown-select-btn", '');
        this.#dropdownWrapper.appendChild(this.#selectButton);

        this.#selectedValueLabel = this.#createHtmlElement("span", "searchable-dropdown-selected-value-label",
            this.#getSelectedOptionText());
        const angleDown = this.#createHtmlElement("span", "searchable-dropdown-angle-down", '&#xfe40;');
        this.#selectButton.appendChild(this.#selectedValueLabel);
        this.#selectButton.appendChild(angleDown);
    }

    #initDropdownSelectOptions() {
        const dropdownContent = this.#createHtmlElement("div", "searchable-dropdown-content", '')
        this.#dropdownWrapper.appendChild(dropdownContent);

        const dropdownSearch = this.#createHtmlElement("div", "searchable-dropdown-search", '')
        dropdownContent.appendChild(dropdownSearch)

        this.#searchInput = this.#createHtmlElement("input", '', '');
        this.#searchInput.type = "text";
        this.#searchInput.placeholder = this.#getSearchPlaceholder();
        dropdownSearch.appendChild(this.#searchInput);

        this.#dropdownOptions = this.#createHtmlElement("ul", "searchable-dropdown-options", '');
        dropdownContent.appendChild(this.#dropdownOptions);
    }

    #populateSelectOptions(showOptions, allOptions, selectedOption) {
        this.#dropdownOptions.innerHTML = "";
        // add items from the collection:
        showOptions.forEach(option => {
            let isSelected = option.innerText === selectedOption ? "selected" : "";
            let li = this.#createLiElement(option, isSelected);
            li.addEventListener("click", () => {
                this.#updateSelectedValue(allOptions, li);
            })
            this.#dropdownOptions.appendChild(li);
        })
    }

    #updateHiddenSelectOptions(newOptions) {
        this.#hiddenSourceSelect.options.length = 0; //erase existing options
        for (const option of newOptions) {
            this.#hiddenSourceSelect.options.add(option);
        }
    }

    #updateSelectedValue(allItems, selectedLi) {
        this.#searchInput.value = "";
        this.#populateSelectOptions(allItems, allItems, selectedLi.innerText);
        this.#dropdownWrapper.classList.remove(this.#DROPDOWN_ACTIVE_CLASS);
        this.#selectedValueLabel.innerText = selectedLi.innerText;
        this.#hiddenSourceSelect.value = selectedLi.getAttribute(this.#CUSTOM_VALUE_ATTR_NAME);

        //fire 'change' event:
        let event = new Event('change');
        this.#hiddenSourceSelect.dispatchEvent(event);
    }

    #createLiElement(contentData, isSelected) {
        let li = this.#createHtmlElement("li", isSelected, this.#getLabel(contentData));
        li.setAttribute(this.#CUSTOM_VALUE_ATTR_NAME, this.#getValue(contentData));
        return li;
    }

    #createOptions(labelValueBeans) {
        return labelValueBeans ? labelValueBeans.map(bean => this.#createOption(bean)) : [];
    }

    #createOption(labelValueBean) {
        const option = document.createElement("option");
        option.innerText = labelValueBean.label;
        option.value = labelValueBean.value;
        return option;
    }

    #createHtmlElement(tagName, className, content) {
        let element = document.createElement(tagName);
        element.className = className;
        element.innerHTML = content;
        return element;
    }

    #getLabel(option) {
        return option ? option.innerText : "";
    }

    #getValue(option) {
        return option ? option.value : "";
    }

    #getAttribute(element, attributeName) {
        let attribute = element.getAttribute(attributeName);
        return attribute ? attribute : '';
    }

    #getSearchPlaceholder() {
        const searchLabel = this.#dropdownWrapper.querySelector(".searchable-dropdown-search-placeholder");
        return searchLabel ? searchLabel.innerText : "Search...";
    }

    #getSelectedOptionText() {
        if (this.#hiddenSourceSelect.selectedIndex >= 0) {
            return this.#hiddenSourceSelect.options[this.#hiddenSourceSelect.selectedIndex].text;
        }
        return '';
    }
}
