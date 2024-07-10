const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const textarea = document.getElementById("scrollTextarea");

async function expandTextarea() {
    textarea.style.height = "300px";
    // await delay(3000);
    textarea.style.transition = "height 2.2s ease-in";
    await delay(2500);
    textarea.style.transition = "height 0s";
}
async function collapseTextArea() {
    textarea.style.transition = "height 0.6s ease-in";
    // await delay(1000);
    textarea.style.height = "0px";
    await delay(600);
}

window.addEventListener("load", expandTextarea);

async function updateInputs() {
    const proposalInput = document.getElementById("proposalType");
    const declarationLabel = document.getElementById("proposalType_label");
    await collapseTextArea();
    declarationLabel.innerHTML =
        proposalInput.options[proposalInput.selectedIndex].text;

    await expandTextarea();
}

async function loadTemplate(templateName) {
    const response = await fetch(`templates/${templateName}.html`);
    return await response.text();
}
// Add event listener to the select element
document
    .getElementById("proposalType")
    .addEventListener("change", updateInputs);

updateInputs();

//=======================Add event listeners for dialog=================
const openDialogBtn = document.querySelector(".open-dialog-btn");
const dialogOverlay = document.getElementById("dialogOverlay");
const closeDialogBtn = document.getElementById("closeDialogBtn");
const submittedProposal = document.getElementById("submitted-signed");
openDialogBtn.addEventListener("click", () => {
    submittedProposal.innerHTML = textarea.value;
    dialogOverlay.style.display = "flex";
});

closeDialogBtn.addEventListener("click", () => {
    dialogOverlay.style.display = "none";
});

dialogOverlay.addEventListener("click", (e) => {
    if (e.target === dialogOverlay) {
        dialogOverlay.style.display = "none";
    }
});

profileList = ["doge", "hey", "test"];
var mentionMenu = document.getElementById("mention-txtarea");

var triggerIdx, menuList;
replaceFn = (user, trigger) => `${trigger}${user.Username} `;

setInputValueFn = (mention) => {
    let currentPostModel = `${mention}`;
    //console.log("test");
    //console.log(currentPostModel);
};
addMention(textarea);
/**
 * ================== FIND profiles dropdown
 *
 */
function addMention(textarea) {
    textarea.addEventListener("keydown", (ev) => {
        const positionIndex = textarea.selectionStart;
        const textBeforeCaret = textarea.value.slice(0, positionIndex) + ev.key;
        const tokens = textBeforeCaret.split(/\s/);
        const lastToken = tokens[tokens.length - 1];
        triggerIdx = textBeforeCaret.endsWith(lastToken)
            ? textBeforeCaret.length - lastToken.length
            : -1;
        //console.log(`${triggerIdx}-triggeridx`);
        const maybeTrigger = textBeforeCaret[triggerIdx];
        const keystrokeTriggered = maybeTrigger === "@" && lastToken.length > 2;

        if (!keystrokeTriggered) {
            return;
        }
        //console.log(lastToken);
        const query = textBeforeCaret.slice(triggerIdx + 1);
        var currentToken = query;
        menuList = getProfileList();
        /**
         * GET COORDINATES OF CARET, to place menu
         */
        const coords = setMenuCoordinates(textarea, positionIndex);

        if (mentionMenu.length !== 0 && currentToken) {
            renderMenu();
        }
    });
    /*
      textarea.addEventListener("input", (event) => {
          console.log('test');
      });*/
}
function getProfileList() {
    return profileList;
}
function renderMenu() {
    if (mentionMenu.style.top == "") {
        mentionMenu.hidden = true;
        return;
    }
    // where do we reside on the page?
    menuList.forEach((option, idx) => {
        mentionMenu.appendChild(menuItemFn(option, idx, false));
    });
    mentionMenu.hidden = false;
}
const isFirefox = typeof window !== "undefined";
function setMenuCoordinates(element, position) {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const style = div.style;
    const computed = getComputedStyle(element);

    // Copy styles from the textarea
    for (let prop of computed) {
        style[prop] = computed[prop];
    }
    
    // Set additional styles
    style.whiteSpace = "pre-wrap";
    style.position = "absolute";
    style.visibility = "hidden";
    style.overflow = "hidden";

    // Handle Firefox scrolling
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        if (element.scrollHeight > parseInt(computed.height))
            style.overflowY = "scroll";
    }

    // Set content
    div.textContent = element.value.substring(0, position);
    const span = document.createElement("span");
    span.textContent = element.value.substring(position) || ".";
    div.appendChild(span);

    // Calculate coordinates
    const rect = element.getBoundingClientRect();
    const coords = {
        top: span.offsetTop + parseInt(computed.borderTopWidth) + rect.top,
        left: span.offsetLeft + parseInt(computed.borderLeftWidth) + rect.left,
        height: span.offsetHeight
    };

    // Clean up
    div.remove();

    // Position the menu
    const staticLeftOffset = 30;
    mentionMenu.style.position = "fixed";
    mentionMenu.style.top = `${coords.top + coords.height - element.scrollTop}px`;
    mentionMenu.style.left = `${coords.left + element.scrollLeft + staticLeftOffset}px`;
}

function selectItem(active) {
    //console.log(active);
    //console.log(triggerIdx);
    const preMention = textarea.value.substr(0, triggerIdx);
    //console.log(preMention);
    const option = menuList[active];
    //console.log(option);
    const mention = replaceFn(option, textarea.value[triggerIdx]);
    const postMention = textarea.value.substr(textarea.selectionStart);
    setInputValueFn(`${preMention}${mention}${postMention}`);
    const caretPosition = textarea.value.length - postMention.length;
    textarea.setSelectionRange(caretPosition, caretPosition);
    closeMenu();
    textarea.focus();
}
function closeMenu() {
    setTimeout(() => {
        mentionMenu.style.left = "";
        mentionMenu.style.top = "";
        currentToken = "";
        renderMenu();
    }, 0);
}

// Create and format the item in the dropdown
menuItemFn = (user, idx, selected) => {
    const div = document.createElement("div");
    div.setAttribute("role", "option");
    div.className = "menu-item";
    if (selected) {
        div.classList.add("selected");
        div.setAttribute("aria-selected", "");
    }

    // Although it would be hard for an attacker to inject a malformed public key into the app,
    // we do a basic _.escape anyways just to be extra safe.
    const profPicURL = "sex";
    div.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${profPicURL}" height="30px" width="30px" style="border-radius: 10px" class="mr-5px">
        <p>${user}</p>
        ${user ? `<i class="fas fa-check-circle fa-md ml-5px fc-blue"></i>` : ""
        }
      </div>`;
    div.addEventListener("click", function () {
        selectItem(idx);
    });
    return div;
};
