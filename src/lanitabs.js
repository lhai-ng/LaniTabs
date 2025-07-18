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
    
    this.panels = this.tabs
        .map(tab => {
            const panel = document.querySelector(tab.getAttribute('href'));
            if (!panel) {
                console.error(`LaniTabs: No panel found for selector: '${tab.getAttribute('href')}'`);
                
            }
            return panel;
        })
        .filter(Boolean);
    if (this.tabs.length !== this.panels.length) return;
    
    this._paramKey = selector.replace(/[^a-zA-Z0-9]/g, '');
    this.opt = Object.assign({
        remember: false,
    }, options);

    this._init();
}

LaniTabs.prototype._init = function () {
    const params = new URLSearchParams(location.search);
    const tabSelector = params.get(this._paramKey);
    const tab = 
        (this.opt.remember && tabSelector && this.tabs.find((tab) => tab.getAttribute('href').replace(/[^a-zA-Z0-9]/g, '') === tabSelector)) || 
        this.tabs[0];
    
    this._activateTab(tab);

    this.tabs.forEach(tab => {
        tab.onclick = (event) => {
            this._handleTabsClick(event, tab);
        }
    })
}

LaniTabs.prototype._handleTabsClick = function (event, tab) {
    event.preventDefault();
    this._activateTab(tab);
}

LaniTabs.prototype._activateTab = function (tab) {
    this.tabs.forEach(tab => {
        tab.closest('li').classList.remove('lanitabs--active');
    });

    tab.closest('li').classList.add('lanitabs--active');

    this.panels.forEach(panel => panel.hidden = true);
    const panelActive = document.querySelector(tab.getAttribute('href'));
    panelActive.hidden = false;

    if (this.opt.remember) {
        const paramsSearch = new URLSearchParams(location.search);
        paramsSearch.set(this._paramKey, tab.getAttribute('href').replace(/[^a-zA-Z0-9]/g, ''))
        history.replaceState(null, null, `?${paramsSearch}`);
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

    this._activateTab(tabToActivate);
}

LaniTabs.prototype.destroy = function () {
    this.container.innerHTML = this._originalTabs;
    this.panels.forEach(panel => panel.hidden = false);
    this.container = null;
    this.tabs = null;
    this.panels = null;
}