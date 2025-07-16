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

    this._init();
}

LaniTabs.prototype._init = function () {
    const tabActive = this.tabs[0];
    tabActive.closest('li').classList.add('lanitabs--active');

    this.panels.forEach(panel => panel.hidden = true);

    this.tabs.forEach(tab => {
        tab.onclick = (event) => {
            this._handleTabsClick(event, tab);
        }
    })

    const panelActive = this.panels[0];
    panelActive.hidden = false;
}

LaniTabs.prototype._handleTabsClick = function (event, tab) {
    event.preventDefault();

    this.tabs.forEach(tab => {
        tab.closest('li').classList.remove('lanitabs--active');
    });

    tab.closest('li').classList.add('lanitabs--active');

    this.panels.forEach(panel => panel.hidden = true);
    const panelActive = document.querySelector(tab.getAttribute('href'));
    panelActive.hidden = false;
}