var forDoge = document.getElementById("forFFF");
create_r_DAO_website();


function create_r_DAO_website() {
    navbar = create_r_DAO_header();
    // create Pages for navbar
    create_r_DAO_pages(navbar)
}

function create_r_DAO_header() {
    var header = document.createElement("header")
    // LOGO
    var logo = document.createElement("img")
    header.appendChild(logo)
    //navbar with Page Links
    var navbar = document.createElement("nav");
    page_tablist = createTabList(navbar, ["Home", "DAO Manager", "TabsDemo"])
    navbar.appendChild(page_tablist)

    header.appendChild(navbar)
    setActivationControls(page_tablist, "pagetab")
    // Create Tab Pages
    forDoge.appendChild(header)
    return page_tablist
}

function create_r_DAO_pages(page_tablist) {
    setTabPanelContent(page_tablist, "Home", createHomePage)
    setTabPanelContent(page_tablist, "DAO Manager", createDAOmanager)
    setTabPanelContent(page_tablist, "TabsDemo", createTabDemo);
}



// workspace
var container = document.createElement("div");
container.id = "container";






function setTabListStyling(tablist) {
}
function createHomePage(page_container) {
    initTxtElement(page_container, "h1", "Welcome to rDAO")
}
function createDAOmanager(page_container) {
    initTxtElement(page_container, "h1", "rDAO Manager")
    initTxtElement(page_container, "h3", "Request to join a DAO")
    // Proto: 6T66391ed95b02a
    var el = document.createElement("h3")
    el.innerHTML = "Submit Proposal";
    // starterHEX.appendChild(el)
    /**
     * hexBuild = "73007300";
     * getFFF(hexBuild);
     */
    // header = "6T66391ed95b02a"
    // getFFF(hexBuild);
    var input_label = document.createElement("label");
    var id = Math.round(Math.random()*100)
    input_label.setAttribute("for", id)
    input_label.innerHTML = "Proposal Type"

    var input = document.createElement("input");
    input.setAttribute("labelled-by", id)

    var inputElement = document.createElement("div");
    inputElement.appendChild(input_label);
    inputElement.appendChild(input);

    compiler.appendChild(inputElement)
    el = document.createElement("input")
    el.innerHTML = "Submit Proposal";
    // starterHEX.appendChild(el)
}
function createTabDemo(page_container) {
    initTxtElement(page_container, "h2", "Tabs Demonstration")
    initTxtElement(page_container, "p", "Using Keyboard only, navigate the following page.")
    initTxtElement(page_container, "h3", "Navbar Style (tab/shift+tab)")
    tablist = createTabList(page_container, ["Home", "add member"])
    setActivationControls(tablist, "pagetab")
    setTabListContent(tablist)
    setTabListStyling(tablist)
    initTxtElement(page_container, "h3", "Manual Activation (arrow keys)")
    tablist = createTabList(page_container, ["Home", "add member"])
    tablist.setAttribute("class", "tabs")
    setActivationControls(tablist, "manual")
    setTabListContent(tablist)
    setTabListStyling(tablist)
    initTxtElement(page_container, "h3", "Automatic Activation (arrow keys)")
    tablist = createTabList(page_container, ["Home", "add member"])
    setActivationControls(tablist, "auto")
    setTabListContent(tablist)
    setTabListStyling(tablist)
}

forDoge.appendChild(container)














function initTxtElement(divToAppend, elementType, innerHTML, styling) {
    el = document.createElement(elementType)
    el.innerHTML = innerHTML;
    divToAppend.appendChild(el)
}
//==========================Tabs==================
/*------------------------------------------------ 
-----------------------Universal for Tabs---------
--------------------------------------------------
*/
function createTabList(divToAppend, tabItems) {
    var tablist = document.createElement("div")
    tablist.role = "tablist"
    // Initialize tabs
    for (tabName of tabItems) {
        var tab = document.createElement("button")
        tab.innerHTML = tabName;
        tab.role = "tab"
        tablist.appendChild(tab)
    }
    initTabPanels(tablist)
    divToAppend.appendChild(tablist)
    return tablist
}
function initTabPanels(tablist) {
    // Initialize Tabpanels
    for (tab of tablist.querySelectorAll("[role=tab]")) { 
        var tabpanel = document.createElement("div")
        tabpanel.role = "tabpanel"
        tablist.appendChild(tabpanel)
    }
}

 
function setActivationControls(tablist, activationType) {
    // setup for accessibility
    // tabs[i].button.role = "tab"
    var tabs = tablist.querySelectorAll("[role=tab]")
    for (var i = 0; i < tabs.length; i++) {
        var curr_tab = tabs[i];

        curr_tab.setAttribute("aria-selected", "false");
        if (activationType === "pagetab") {
            // Navigation via tab/shift_tab
            curr_tab.addEventListener("click", e=>{openPage(e)})
        } else { 
            // Navigation via arrow keys
            curr_tab.tabIndex = -1;
            // Add Accessibility Options
            curr_tab.addEventListener("keydown", e => {onKeydown(activationType, e)});
            curr_tab.addEventListener("click", e => {onclick(e)});
        }
    }
    if (activationType == "pagetab") {
        setSelectedTabPage(tabs[0])
    } else {
        setSelectedTab(tabs[0])
    }
    // SET .is-hidden to false
    var style = document.createElement("style");
    style.textContent = ".is-hidden { display: none; }";
    document.head.appendChild(style);
}

function setSelectedTab(currentTab) {
    tablist = currentTab.parentElement;
    var tabs = tablist.querySelectorAll("[role=tab]")
    var tabpanels = tablist.querySelectorAll("[role=tabpanel]")
    for (var i = 0; i < tabs.length; i++) {
        tab = tabs[i];
        if (currentTab === tab) {
            tab.setAttribute("aria-selected", "true");
            tab.removeAttribute("tabIndex");
            tabpanels[i].classList.remove("is-hidden");
        } else {
            tab.setAttribute("aria-selected", "false");
            tab.tabIndex = -1;
            tabpanels[i].classList.add("is-hidden")
        }
    }
}
function setTabPanelContent(tablist, tabName, function_to_create_inner_html) {
    var tabs = tablist.querySelectorAll("[role=tab]")
    var tabpanels = tablist.querySelectorAll("[role=tabpanel]")
    var tabIndex = -1;
    tabs.forEach(function(tab, index) {
        // Check if the innerHTML of the tab matches the target tabName
        if (tab.innerHTML.trim() === tabName) {
            // If found, store the index of the tab
            tabIndex = index;
            // Exit the loop since we found the tab
            return;
        }
    });

    function_to_create_inner_html(tabpanels[tabIndex])
}
function setTabListContent(tablist) {
    for (tabpanel of tablist.querySelectorAll("[role=tabpanel]")) {
        tabpanel.innerHTML = Math.random()
    }
}

//-------------------------------------------------------------
//-----------------Method 2-3: Numpad Activation---------------
//-------------------------------------------------------------
function onKeydown(activationType, e) {
    var curr_tab = e.currentTarget
    // get list of tabs, so we can move to bottom/top tab
    var tablist = e.currentTarget.parentElement
    var tabs = Array.from(tablist.querySelectorAll("[role=tab]"))
    var flag = false;
    var indexOfTargetTab = tabs.indexOf(curr_tab);
    switch (e.key) {
      case "ArrowLeft":
        indexOfTargetTab--;
        flag = true;
        break;

      case "ArrowRight":
        indexOfTargetTab++;
        flag = true;
        break;
      case "Home":
        indexOfTargetTab = 0;
        flag = true;
        break;

      case "End":
        indexOfTargetTab = tabs.length-1;
        flag = true;
        break;

      default:
        break;
    }
    // if outside of target range, we must set to beginning tab or ending
    if (indexOfTargetTab === -1) {
        indexOfTargetTab = tabs.length-1;
    } else if (indexOfTargetTab === tabs.length) {
        indexOfTargetTab = 0;
    }

    // AUTO/MANUAL ACTIVATION
    if (activationType === "auto") {
        setSelectedTab(tabs[indexOfTargetTab])
        
    } 
    moveFocusToTab(tabs[indexOfTargetTab]);

    if (flag) {
      e.stopPropagation();
      e.preventDefault();
    }
}

function moveFocusToTab(currentTab) {
    currentTab.focus()
}

function onclick(e) {
    // Pass targetTab and tablist element 
    setSelectedTab(e.currentTarget)
}

//-------------------------------------------------------------
//-----------------Method 1:  tab/shift_tab Activation---------
//-------------------------------------------------------------
function openPage(e) {
    var curr_tab = e.currentTarget
    setSelectedTabPage(curr_tab)
}
function setSelectedTabPage(currentTab) {
    tablist = currentTab.parentElement;
    var tabs = tablist.querySelectorAll("[role=tab]")
    var tabpanels = tablist.querySelectorAll("[role=tabpanel]")
    for (var i = 0; i < tabs.length; i++) {
        tab = tabs[i];
        if (currentTab === tab) {
            tab.setAttribute("aria-selected", "true");
            tab.removeAttribute("tabIndex");
            tabpanels[i].classList.remove("is-hidden");
        } else {
            tab.setAttribute("aria-selected", "false");
            tabpanels[i].classList.add("is-hidden")
        }
    }
}