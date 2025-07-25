function LaniTabs(selector, options = {}) {
    this.container = document.querySelector(selector);
    if (!this.container) {
        console.error(`LaniTabs: No container found for this selector: ${selector}`);
        return;
    }
    
    this.tabs = Array.from(this.container.querySelectorAll('li a'));      
    if (!this.tabs.length) {
        console.error('LaniTabs: No tabs found inside the container');
        return;
    }
    
    this.panels = this._getPanels();
    if (this.tabs.length !== this.panels.length) return;
    
    this._cleanRegex = /[^a-zA-Z0-9]/g;
    this._paramKey = selector.replace(this._cleanRegex, '');
    this.opt = Object.assign({
        remember: false,
        onChange: null,
        activeCssClass: 'lanitabs--active',
    }, options);

    this._init();
}

LaniTabs.prototype._getPanels = function () {
    return this.tabs
            .map(tab => {
                const panel = document.querySelector(tab.getAttribute('href'));
                if (!panel) {
                    console.error(`LaniTabs: No panel found for selector: '${tab.getAttribute('href')}'`);
                    
                }
                return panel;
            })
            .filter(Boolean);
}

LaniTabs.prototype._init = function () {
    const params = new URLSearchParams(location.search);
    const tabSelector = params.get(this._paramKey);
    const tab = 
        (this.opt.remember && tabSelector && this.tabs.find((tab) => tab.getAttribute('href').replace(this._cleanRegex, '') === tabSelector)) || 
        this.tabs[0];
    this.currentTab = tab;
    
    this._activateTab(tab, false, false);

    this.tabs.forEach(tab => {
        tab.onclick = (event) => {
            event.preventDefault();
            this._tryActivateTab(tab);
        }
    })
}

LaniTabs.prototype._tryActivateTab = function (tab) {
    if (this.currentTab !== tab) {
        this.currentTab = tab;
        this._activateTab(tab);
    }
}

LaniTabs.prototype._activateTab = function (tab, triggerOnChange = true, updateURL = true) {
    this.tabs.forEach(tab => {
        tab.closest('li').classList.remove(this.opt.activeCssClass);
    });

    tab.closest('li').classList.add(this.opt.activeCssClass);

    this.panels.forEach(panel => panel.hidden = true);
    const panelActive = document.querySelector(tab.getAttribute('href'));
    panelActive.hidden = false;

    if (this.opt.remember && updateURL) {
        const paramsSearch = new URLSearchParams(location.search);
        paramsSearch.set(this._paramKey, tab.getAttribute('href').replace(this._cleanRegex, ''))
        history.replaceState(null, null, `?${paramsSearch}`);
    }

    if (triggerOnChange && typeof this.opt.onChange === 'function') {
        this.opt.onChange({
            tab,
            panel: panelActive,
        })
    }
}

LaniTabs.prototype.switch = function (input) {
    let tabToActivate = null;

    if (typeof input === 'string') {
        tabToActivate = this.tabs.find(tab => tab.getAttribute('href') === input);
    } else if (this.tabs.includes(input)) {
        tabToActivate = input;
    }

    if (!tabToActivate) {
        console.error(`LaniTabs: No tab found with: ${input}`);
        return;
    }

    this._tryActivateTab(tabToActivate);
}

LaniTabs.prototype.destroy = function () {
    this.container.innerHTML = this._originalTabs;
    this.panels.forEach(panel => panel.hidden = false);
    this.container = null;
    this.tabs = null;
    this.panels = null;
    this.currentTab = null
}