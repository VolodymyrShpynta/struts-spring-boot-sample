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

    // Private constants and variables:
    #DROPDOWN_ACTIVE_CLASS = "active";
    #OPTION_HIGLIGHTED_CLASS = "selected";
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

    // Public methods:

    getSelectedValue() {
        return this.#hiddenSourceSelect.value;
    }

    clearSelectedValue() {
        this.#hiddenSourceSelect.value = '';
        this.#selectedValueLabel.innerText = '';
        this.#searchInput.value = '';
    }

    disableDropdown() {
        this.#dropdownWrapper.setAttribute("aria-disabled", "true");
    }

    enableDropdown() {
        this.#dropdownWrapper.setAttribute("aria-disabled", "false");
    }

    updateDropdown(items) {
        this.clearSelectedValue();

        const options = this.#createOptions(items);
        this.#updateHiddenSelectOptions(options);
        this.#populateSelectOptions(options, options);
    }

    // Private methods:

    #initSearchableDropdown() {
        this.#initDropdownWrapper();
        this.#initSourceSelect();
        this.#initDropdownSelectButton();
        this.#initDropdownSelectOptions();

        const allOptions = Array.from(this.#hiddenSourceSelect.options);
        this.#populateSelectOptions(allOptions, allOptions);

        this.#searchInput.addEventListener("keydown", keyDownEvent => {
            if (keyDownEvent.key === "ArrowDown") {
                keyDownEvent.preventDefault(); // Prevent the cursor from moving in the input field
                this.#highlightNextOption();
            } else if (keyDownEvent.key === "ArrowUp") {
                keyDownEvent.preventDefault(); // Prevent the cursor from moving in the input field
                this.#highlightPrevOption();
            } else if (keyDownEvent.key === "Enter") {
                keyDownEvent.preventDefault(); // Prevent form submission
                this.#selectHighlightedOption();
            }
        });

        // listening to 'input' event for filtering:
        this.#searchInput.addEventListener("input", () => {
            this.#filterOptionsAccordingToSearchInput();
        });

        this.#selectButton.addEventListener("click", () => {
            if (this.#getAttribute(this.#dropdownWrapper, "aria-disabled").toLowerCase() !== "true") {
                this.#dropdownWrapper.classList.toggle(this.#DROPDOWN_ACTIVE_CLASS);
                // set focus on search input and scroll to the selected option in case of open dropdown:
                if (this.#dropdownWrapper.classList.contains(this.#DROPDOWN_ACTIVE_CLASS)) {
                    this.#searchInput.focus();
                    this.#scrollToHighlightedOption();
                }
            }
        });

        // close the dropdown on click mouse outside the dropdown:
        document.addEventListener("click", mouseEvent => {
            if (!this.#dropdownWrapper.contains(mouseEvent.target)) {
                this.#dropdownWrapper.classList.remove(this.#DROPDOWN_ACTIVE_CLASS);
            }
        });
    }

    #highlightPrevOption() {
        const highlightedLi = this.#findHighlightedLiOption();
        if (highlightedLi && highlightedLi.previousElementSibling) {
            highlightedLi.classList.remove(this.#OPTION_HIGLIGHTED_CLASS);
            highlightedLi.previousElementSibling.classList.add(this.#OPTION_HIGLIGHTED_CLASS);
            this.#scrollToOption(highlightedLi.previousElementSibling);
        } else {
            const liOptions = this.#dropdownOptions.children;
            if (liOptions && liOptions.length > 0) {
                liOptions[0].classList.add(this.#OPTION_HIGLIGHTED_CLASS);
                this.#scrollToOption(liOptions[0]);
            }
        }
    }

    #highlightNextOption() {
        const highlightedLi = this.#findHighlightedLiOption();
        if (highlightedLi) {
            if (highlightedLi.nextElementSibling){
                highlightedLi.classList.remove(this.#OPTION_HIGLIGHTED_CLASS);
                highlightedLi.nextElementSibling.classList.add(this.#OPTION_HIGLIGHTED_CLASS);
                this.#scrollToOption(highlightedLi.nextElementSibling);
            }
        } else { // highlight first option only in case when no option is currently highlighted
            const liOptions = this.#dropdownOptions.children;
            if (liOptions && liOptions.length > 0) {
                liOptions[0].classList.add(this.#OPTION_HIGLIGHTED_CLASS);
                this.#scrollToOption(liOptions[0]);
            }
        }
    }

    #selectHighlightedOption() {
        const selectedLi = this.#findHighlightedLiOption();
        if (selectedLi) {
            this.#updateSelectedValue(Array.from(this.#hiddenSourceSelect.options), selectedLi);
        }
    }

    #filterOptionsAccordingToSearchInput() {
        let searchedVal = this.#searchInput.value;
        const options = Array.from(this.#hiddenSourceSelect.options); // fetch up-to-date options from the hidden select source
        let filteredOptions = options.filter((option) => {
            return this.#getLabel(option).toLowerCase().includes(searchedVal.toLowerCase());
        });
        this.#populateSelectOptions(filteredOptions, options);
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
        const dropdownContent = this.#createHtmlElement("div", "searchable-dropdown-content", '');
        this.#dropdownWrapper.appendChild(dropdownContent);

        const dropdownSearch = this.#createHtmlElement("div", "searchable-dropdown-search", '');
        dropdownContent.appendChild(dropdownSearch);

        this.#searchInput = this.#createHtmlElement("input", '', '');
        this.#searchInput.type = "text";
        this.#searchInput.placeholder = this.#getSearchPlaceholder();
        dropdownSearch.appendChild(this.#searchInput);

        this.#dropdownOptions = this.#createHtmlElement("ul", "searchable-dropdown-options", '');
        dropdownContent.appendChild(this.#dropdownOptions);
    }

    #populateSelectOptions(showOptions, allOptions) {
        this.#dropdownOptions.innerHTML = "";
        // add items from the collection:
        showOptions.forEach(option => {
            let isSelected = option.value === this.#hiddenSourceSelect.value ? this.#OPTION_HIGLIGHTED_CLASS : "";
            let li = this.#createLiElement(option, isSelected);
            li.addEventListener("click", () => {
                this.#updateSelectedValue(allOptions, li);
            });
            this.#dropdownOptions.appendChild(li);
        });

        // ensure the highlighted option is visible:
        this.#scrollToHighlightedOption();
    }

    #findHighlightedLiOption() {
        return this.#dropdownOptions.querySelector(`.${this.#OPTION_HIGLIGHTED_CLASS}`);
    }

    #createLiElement(option, selectedClass) {
        const li = this.#createHtmlElement("li", selectedClass, this.#getLabel(option));
        li.setAttribute(this.#CUSTOM_VALUE_ATTR_NAME, option.value);
        return li;
    }

    #getLabel(option) {
        return option ? option.label || option.innerText : "";
    }

    #getSelectedOptionText() {
        return this.#hiddenSourceSelect.selectedOptions.length > 0 ? this.#getLabel(this.#hiddenSourceSelect.selectedOptions[0]) : "";
    }

    #updateSelectedValue(allOptions, selectedLi) {
        this.#searchInput.value = "";
        this.#selectedValueLabel.innerText = selectedLi.innerText;
        this.#hiddenSourceSelect.value = selectedLi.getAttribute(this.#CUSTOM_VALUE_ATTR_NAME);
        this.#dropdownWrapper.classList.remove(this.#DROPDOWN_ACTIVE_CLASS); // close the dropdown

        // populate dropdown with all options to be ready for the next usage:
        this.#populateSelectOptions(allOptions, allOptions);

        // fire 'change' event:
        let event = new Event('change');
        this.#hiddenSourceSelect.dispatchEvent(event);
    }

    #scrollToHighlightedOption() {
        let highlightedLiOption = this.#findHighlightedLiOption();
        if (highlightedLiOption) {
            this.#scrollToOption(highlightedLiOption);
        }
    }

    #scrollToOption(option) {
        if (option) {
            option.scrollIntoView({block: "nearest", behavior: "instant"});
        }
    }

    #createOptions(items) {
        return items.map(item => new Option(item.label, item.value));
    }

    #updateHiddenSelectOptions(options) {
        this.#hiddenSourceSelect.innerHTML = "";
        options.forEach(option => this.#hiddenSourceSelect.add(option));
    }

    #createHtmlElement(tag, className, innerHtml) {
        const element = document.createElement(tag);
        if (className) {
            element.className = className;
        }
        if (innerHtml) {
            element.innerHTML = innerHtml;
        }
        return element;
    }

    #getSearchPlaceholder() {
        const searchLabel = this.#dropdownWrapper.querySelector(".searchable-dropdown-search-placeholder");
        return searchLabel ? searchLabel.innerText : "Search...";
    }

    #getAttribute(element, attributeName) {
        return element.getAttribute(attributeName) || "";
    }
}
