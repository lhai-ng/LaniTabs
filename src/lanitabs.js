function LaniTabs(selector) {
    this.container = document.querySelector(selector);
    if (!this.container) {
        console.error(`LaniTabs: No container found for this selector: ${selector}`);
        return;
    }
    
    this.tabs = Array.from(document.querySelectorAll('li a'));
    this.tabs.onclick = (e) => {
        console.log(e.target);
  
    }
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
    
    this._originalTabs = this.container.innerHTML;
    this._init();
}

LaniTabs.prototype._init = function () {
    this._activeTab(this.tabs[0]);

    this.tabs.forEach(tab => {
        tab.onclick = (event) => {
            this._handleTabsClick(event, tab);
        }
    })
}

LaniTabs.prototype._handleTabsClick = function (event, tab) {
    event.preventDefault();
    this._activeTab(tab);
}

LaniTabs.prototype._activeTab = function (tab) {
    this.tabs.forEach(tab => {
        tab.closest('li').classList.remove('lanitabs--active');
    });

    tab.closest('li').classList.add('lanitabs--active');

    this.panels.forEach(panel => panel.hidden = true);
    const panelActive = document.querySelector(tab.getAttribute('href'));
    panelActive.hidden = false;
}

LaniTabs.prototype.switch = function (input) {
    let tabToActive = null;

    if (typeof input === 'string') {
        tabToActive = this.tabs.find(tab => tab.getAttribute('href') === input);
    } else if (this.tabs.includes(input)) {
        tabToActive = input;
    }

    if (!tabToActive) {
        console.error(`LaniTabs: No tab found with: ${input}`);
        return;
    }

    this._activeTab(tabToActive);
}

LaniTabs.prototype.destroy = function () {
    this.container.innerHTML = this._originalTabs;
    this.panels.forEach(panel => panel.hidden = false);
    this.container = null;
    this.tabs = null;
    this.panels = null;
}