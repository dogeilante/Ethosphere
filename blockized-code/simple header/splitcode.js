/*
Signature

░░░░░░░░░▄░░░░░░░░░░░░░░▄░░░░
░░░░░░░░▌▒█░░░░░░░░░░░▄▀▒▌░░░
░░░░░░░░▌▒▒█░░░░░░░░▄▀▒▒▒▐░░░
░░░░░░░▐▄▀▒▒▀▀▀▀▄▄▄▀▒▒▒▒▒▐░░░
░░░░░▄▄▀▒░▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐░░░
░░░▄▀▒▒▒░░░▒▒▒░░░▒▒▒▀██▀▒▌░░░ 
░░▐▒▒▒▄▄▒▒▒▒░░░▒▒▒▒▒▒▒▀▄▒▒▌░░
░░▌░░▌█▀▒▒▒▒▒▄▀█▄▒▒▒▒▒▒▒█▒▐░░
░▐░░░▒▒▒▒▒▒▒▒▌██▀▒▒░░░▒▒▒▀▄▌░
░▌░▒▄██▄▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒▌░
▐▒▀▐▄█▄█▌▄░▀▒▒░░░░░░░░░░▒▒▒▐░
▐▒▒▐▀▐▀▒░▄▄▒▄▒▒▒▒▒▒░▒░▒░▒▒▒▒▌
▐▒▒▒▀▀▄▄▒▒▒▄▒▒▒▒▒▒▒▒░▒░▒░▒▒▐░
░▌▒▒▒▒▒▒▀▀▀▒▒▒▒▒▒░▒░▒░▒░▒▒▒▌░
░▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▒▄▒▒▐░░
░░▀▄▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▄▒▒▒▒▌░░
░░░░▀▄▒▒▒▒▒▒▒▒▒▒▄▄▄▀▒▒▒▒▄▀░░░
░░░░░░▀▄▄▄▄▄▄▀▀▀▒▒▒▒▒▄▄▀░░░░░
░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▀▀░░░░░░░░
*/



// 6T66391ed95b02a - header
var starterHEX = document.getElementById("[FF-HEX]");
var el = document.createElement("h3")
el.innerHTML = "Submit Proposal";

// starterHEX.appendChild(inputElement)



// --------DAO Selection 8T6639265eea8a4 ----------
var starterHEX = document.getElementById("[FF-HEX]");

var input_label = document.createElement("label");
input_label.innerHTML = "Organization"

var selectInput = document.createElement("select");
option_list = ["Ethosphere", "Desodem", "rDAO", "FocusFrames", "Individual"]
for (option of option_list) {
    var option_input = document.createElement("option")
    option_input.innerHTML = option
    selectInput.appendChild(option_input)
}

var selectElement = document.createElement("div");
selectElement.appendChild(input_label);
selectElement.appendChild(selectInput);

//starterHEX.appendChild(selectElement)

// ---------------Statement 10T66397947935b3---------------
var starterHEX = document.getElementById("[FF-HEX]");

var input_label = document.createElement("label");
input_label.innerHTML = "Statement"

var input = document.createElement("input");

var inputElement = document.createElement("div");
inputElement.appendChild(input_label);
inputElement.appendChild(input);

//starterHEX.appendChild(inputElement)

// --------------Submit Proposal 11T6639799d57bf2-----------
var starterHEX = document.getElementById("[FF-HEX]");

var submitButton = document.createElement("button")
submitButton.innerHTML = "Submit Proposal"
//starterHEX.appendChild(inputElement)


// -----------7T66392236f1bc4 - puts it all together
var header = "6T66391ed95b02a"
var responsibleOrg = "8T6639265eea8a4"
var statementElement = "10T66397947935b3"
var submitElement = "11T6639799d57bf2"


header = el;
responsibleOrg = selectElement;
statementElement = inputElement;
submitElement = submitButton


getFFF(header)
getFFF(responsibleOrg)
getFFF(statementElement)
getFFF(submitElement)






function getFFF(element) {
    var starterHEX = document.getElementById("forFFF");
    starterHEX.appendChild(element)
}