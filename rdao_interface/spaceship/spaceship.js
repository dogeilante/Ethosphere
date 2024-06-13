document.createElement("div");



spaceship_src = "spaceinvader.png"


setCommander("degen_doge", "dogeFlipped.jpg", spaceship_src)


setcopilot("DiamondThumb", "thumb-pfp.png", spaceship_src)

setcopilot("ArnoudVanDerPlas", "arnoud.png", spaceship_src)

proposalList = [
   {
      proposer_addr: "degen_doge", 
      starting_lvl: 5,
      proposal_title: "Add member TangledBrush918", 
      votes_for: [ {user_addr: "degen_doge", lvl: 5}, {user_addr: "DiamondThumb", lvl: 5}]
   },
   {
      proposer_addr: "Arnoud",
      starting_lvl: 3,
      proposal_title: "Add member Bootlicker", 
      votes_for: [ {user_addr: "degen_doge", lvl: 5}, {user_addr: "DiamondThumb", lvl: 5}]
   },
   {
      proposer_addr: "DiamondThumb",
      starting_lvl: 3,
      proposal_title: "Use chat.deso.com for Ethosphere communications", 
      votes_for: [ {user_addr: "degen_doge", lvl: 2}, {user_addr: "DiamondThumb", lvl: 3}]
   },
   {
      proposer_addr: "That70sRobot",
      starting_lvl: 3,
      proposal_title: "Use Telegram for community discussion", 
      votes_for: [ {user_addr: "degen_doge", lvl: 2}, {user_addr: "DiamondThumb", lvl: 3}]
   }
]
proposals_div = document.getElementById("proposal_list")
addProposals(proposals_div, proposalList)

function addProposals(proposals_div, proposals) {
   proposals.forEach(element => {
      proposal = document.createElement("li");
      proposal.textContent = element.proposal_title

      
      proposals_div.appendChild(proposal)
   });
}


 function setCommander(commander, pfp_src, spaceship_src) {
   commanderDiv = document.getElementById("commander")

   spaceshipDiv = document.createElement("div")
   spaceshipImg = new Image(200,175 )
   spaceshipImg.src = spaceship_src
   spaceshipDiv.appendChild(spaceshipImg)


   commanderPic = new Image(75, 75)
   commanderPic.src = pfp_src;

   commanderName = document.createElement("h3")
   commanderName.textContent = commander;

   commanderDiv.appendChild(spaceshipDiv)
   commanderDiv.appendChild(commanderPic)
   commanderDiv.appendChild(commanderName)
   
 }

 function setcopilot(copilot, pfp_src, spaceship_src) {
   copilotDiv = document.getElementById("copilot1")


   if (copilotDiv.children.length > 1) {
      copilotDiv = document.getElementById("copilot2")
   }
   if (copilotDiv.hasChildNodes()) {
      console.log("You already have sufficient copilots!")
   }

   spaceshipDiv = document.createElement("div")
   spaceshipImg = new Image(150, 125)
   spaceshipImg.src = spaceship_src
   spaceshipDiv.appendChild(spaceshipImg)
   // profile picture
   copilot_pfp = new Image(75, 75)
   copilot_pfp.src = pfp_src

   copilotName = document.createElement("h3")
   copilotName.textContent = copilot
   copilotDiv.appendChild(spaceshipDiv)
   copilotDiv.appendChild(copilot_pfp)
   copilotDiv.appendChild(copilotName)
 }



/**
 * Purpose: all proposals this user has voted for
 * @param {*} user_addr 
 */
function getProposalsByInterest(user_addr) {

}
/**
 * Purpose: all proposals at a certain level
 * @param {*} glom_level 
 */
function getProposalsAtLevel(glom_level) {

}