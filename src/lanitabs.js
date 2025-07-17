function LaniTabs(selector, options = {}) {
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
    
    this.opt = Object.assign({
        remember: false,
    }, options);

    this._originalTabs = this.container.innerHTML;

    this._init();
}

LaniTabs.prototype._init = function () {
    const hash = location.hash;
    const tab = 
        (this.opt.remember && hash && this.tabs.find(tab => tab.getAttribute('href') === hash)) || 
        this.tabs[0]
    
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
        history.replaceState(null, null, tab.getAttribute('href'));
    }
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

    this._activateTab(tabToActive);
}

LaniTabs.prototype.destroy = function () {
    this.container.innerHTML = this._originalTabs;
    this.panels.forEach(panel => panel.hidden = false);
    this.container = null;
    this.tabs = null;
    this.panels = null;
}