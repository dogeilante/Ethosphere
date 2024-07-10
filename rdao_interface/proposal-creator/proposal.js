const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const textarea = document.getElementById("scrollTextarea");
const isFirefox = typeof window !== "undefined";
addMention(textarea);


var profileList = ["doge", "hey", "test"];
var mentionMenu = document.getElementById("mention-txtarea");
var currActiveOption;

var triggerIdx, menuList;
replaceFn = (user, trigger) => `${trigger}${user} `;


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


/**
 * ============================================================== 
 * ================== FIND profiles dropdown ====================
 * ==============================================================
 *
 */
setInputValueFn = (mention) => {
    let currentPostModel = `${mention}`;
    //console.log("test");
    //console.log(currentPostModel);
};


function addMention() {
    textarea.addEventListener("input", (ev) => { onInputTxtArea(ev) });
    textarea.addEventListener("keydown", (ev) => { onKeyDown(ev) });
}

async function onInputTxtArea(ev) {
    const positionIndex = textarea.selectionStart;
    const textBeforeCaret = textarea.value.slice(0, positionIndex);
    const tokens = textBeforeCaret.split(/\s/);
    const lastToken = tokens[tokens.length - 1];
    triggerIdx = textBeforeCaret.endsWith(lastToken)
        ? textBeforeCaret.length - lastToken.length
        : -1;
    //console.log(`${triggerIdx}-triggeridx`);
    const maybeTrigger = textBeforeCaret[triggerIdx];
    const keystrokeTriggered = maybeTrigger === "@" && lastToken.length > 3;

    if (!keystrokeTriggered) {
        closeMenu()
        return;
    }

    //console.log(lastToken);
    const query = textBeforeCaret.slice(triggerIdx + 1);
    var currentToken = query;
    await getProfileListAPI(query)
    /**
    * GET COORDINATES OF CARET, to place menu
    */
    setMenuCoordinates(textarea, positionIndex);
    
    if (mentionMenu.length !== 0 && currentToken) {
        active = 0;
        renderMenu();
    }
}
async function getProfileListSample() {
    console.log('api call');
    menuList = profileList;
}
async function getProfileListAPI(userPrefix) {
    const profileAPIsrch = { 
        PublicKeyBase58Check:    "" /*PublicKeyBase58Check*/,
        Username:    "" /*Username*/,
        UsernamePrefix:    userPrefix.trim().replace(/^@/, "") /*UsernamePrefix*/,
        Description:    "" /*Description*/,
        OrderBy:    "influencer_coin_price" /*Order by*/,
        NumToFetch:    5 /*NumToFetch*/,
        ReaderPublicKeyBase58Check:    "",//this.globalVars.loggedInUser?.PublicKeyBase58Check /*ReaderPublicKeyBase58Check*/,
        ModerationType:    "" /*ModerationType*/,
        FetchUsersThatHODL:    false /*FetchUsersThatHODL*/,
        AddGlobalFeedBoo:    false /*AddGlobalFeedBool*/
    }
    let listOfProfiles = [];
    await getProfiles(profileAPIsrch, (thisType, result) => {
        //console.log(thisType);
        //console.log(result);
        result.ProfilesFound.slice(0, 5).forEach((user) => {
            listOfProfiles.push(user);
        });
        menuList = listOfProfiles;
    }, genericError)

    
}
function renderMenu() {
    if (mentionMenu.style.top == "") {
        mentionMenu.hidden = true;
        return;
    }
    // where do we reside on the page?
    mentionMenu.innerHTML = "";
    menuList.forEach((option, idx) => {
        mentionMenu.appendChild(menuItemFn(option, idx, active == idx));
    });
    mentionMenu.hidden = false;
}
function closeMenu() {
    setTimeout(() => {
        mentionMenu.style.left = "";
        mentionMenu.style.top = "";
        currentToken = "";
        renderMenu();
    }, 0);
}

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
    if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
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
        height: span.offsetHeight,
    };

    // Clean up
    div.remove();

    // Position the menu
    const staticLeftOffset = 30;
    mentionMenu.style.position = "fixed";
    mentionMenu.style.top = `${coords.top + coords.height - element.scrollTop}px`;
    mentionMenu.style.left = `${coords.left + element.scrollLeft + staticLeftOffset
        }px`;
}

function selectItem(active) {
    //console.log(active);
    //console.log(triggerIdx);
    const preMention = textarea.value.substr(0, triggerIdx);
    //console.log(preMention);
    const option = menuList[active].Username;
    //console.log(option);
    const mention = replaceFn(option, textarea.value[triggerIdx]);
    const postMention = textarea.value.substr(textarea.selectionStart);
    textarea.value = `${preMention}${mention}${postMention}`
    //setInputValueFn(`${preMention}${mention}${postMention}`);
    const caretPosition = textarea.value.length - postMention.length;
    textarea.setSelectionRange(caretPosition, caretPosition);
    closeMenu();
    textarea.focus();
}



// Create and format the item in the dropdown
menuItemFn = (user, idx, selected) => {
    const div = document.createElement("div");
    div.setAttribute("role", "option");
    div.className = "menu-item";
    if (selected) {
        div.classList.add("selected");
        div.setAttribute("aria-selected", "true");
    }

    // Although it would be hard for an attacker to inject a malformed public key into the app,
    // we do a basic _.escape anyways just to be extra safe.
    // https://node.deso.org/api/v0/get-single-profile-picture/BC1YLiWxwFDrEjccYmUPR5sizydUHdaJLCrUuYeaLZ5DHTJtpUciAJA
    //GetSingleProfilePictureURL(user.PublicKeyBase58Check);
    const profPicURL = "https://node.deso.org/api/v0/get-single-profile-picture/" + user.PublicKeyBase58Check;
    div.innerHTML = `
      <div class="mentionEl">
        <img src="${profPicURL}" height="30px" width="30px" style="border-radius: 10px" class="mr-5px">
        <p style="padding-left:10px">${user.Username}</p>
        ${user.isVerified ? `<i class="fas fa-check-circle fa-md ml-5px fc-blue"></i>` : ""
        }
      </div>`;
    div.addEventListener("click", function () {
        selectItem(idx);
    });
    return div;
};




function onKeyDown(ev) {
    let mentionsList = mentionMenu.children;
    let keyCaught = false;
    if (triggerIdx !== undefined) {
        let previousActive = active;
        switch (ev.key) {
            case "ArrowDown":
                active = Math.min(active + 1, mentionsList.length - 1);
                //renderMenu();
                // SET current selected element and remove selected from previous
                elToRemove = mentionsList[previousActive]
                elToRemove.classList.remove("selected");
                elToRemove.setAttribute("aria-selected", "false");
                elToAdd = mentionsList[active]
                elToAdd.classList.add("selected");
                elToAdd.setAttribute("aria-selected", "true");
                keyCaught = true;
                break;
            case "ArrowUp":
                active = Math.max(active - 1, 0);
                //renderMenu();
                // SET currently selected element and remove selected from previous
                elToRemove = mentionsList[previousActive]
                elToRemove.classList.remove("selected");
                elToRemove.setAttribute("aria-selected", "false");
                elToAdd = mentionsList[active]
                elToAdd.classList.add("selected");
                elToAdd.setAttribute("aria-selected", "true");
                keyCaught = true;
                break;
            case "Enter":
                selectItem(active)
                keyCaught = true;
            case "Tab":
                selectItem(active);
                keyCaught = true;
                break;
        }
    }

    if (keyCaught) {
        ev.preventDefault();
    }
}





//=======================Add event listeners for dialog=================
//======================================================================
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
