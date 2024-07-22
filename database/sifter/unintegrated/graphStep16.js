//Right now this data structure exists in Memory, I need to move this to be stored as a files instead. I will work on an example file structure in the graph directory 
//this can be the basis later to make a 2d visual representation of the graph. The connections will need to be stored in memory, but the full value might not need to be
class Node {
  constructor(id, value) {
    this.id=id;
    this.value = value;
    this.neighbors = []; // Array to store references to neighboring nodes
  }

  addNeighbor(node) {
    this.neighbors.push(node);
  }
}
 
class Graph {
  constructor() {
    this.nodes = new Map(); // Map to store all nodes
    this.next_id=0;
    console.log('load');
  }

  save(){
   console.log('save'); 
  }

  addNode(value) {
    const node = new Node(this.next_id, value);
    this.nodes.set(this.next_id, node); //this currently removes the option to get nodes by value thereby removing direct search. The map could try to store the data as an array? This however would be more costly
    this.next_id+=1;
    return this.next_id-1;
  }

  addEdge(id1, id2) {
    const node1 = this.nodes.get(id1);
    const node2 = this.nodes.get(id2);

    if (node1 && node2) {
      node1.addNeighbor(node2);
      node2.addNeighbor(node1); // For undirected graph
    }
  }

  getNode(id) {
    if(id<this.nodes.size) return this.nodes.get(id);
    else return -1;
  }
  
  getNodeValue(id){
    if(id<this.nodes.size) return this.nodes.get(id).value;
    else return -1;
  }
}

const graph = new Graph();

graph.addNode('0,0,0');
graph.addNode('64,0,0');
graph.addNode('256,0,0');
graph.addNode('0,64,0');
graph.addNode('0,256,0');
graph.addNode('0,0,64');
graph.addNode('0,0,256');

for(let i= 1; i<6;i+=2){
  graph.addEdge(0, i);
  graph.addEdge(1, i+1);
}

//console.log(graph.getNode(0).neighbors); // Will show node 1
//console.log(graph.getNode(2).neighbors); // Will show nodes 1
 //console.log(graph.getNode(0).neighbors); // Will show node 1
//console.log(graph.getNode(2).neighbors); // Will show nodes 1
/**
 *=============================ChatGPT data============================
 * 
 */

const nodeDataDiv = document.getElementById('node-data');
const currentNodeDataList = document.getElementById('data-list');
const historyList = document.getElementById('history-items');
const nodesContainer = document.getElementById('nodes-container');
// Get all div elements inside the container
const nodeList = nodesContainer.querySelectorAll('div');
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');
const guidingVal = document.getElementById('guidingVal')

let currentNodeId = 4;
// what was the last selected value to traverse off of?
var currentNodeVal = ''
var currNodeData = [];
var siftHistory = [] // multiple ways of doing this
// "150r": [#0, #1, #50]
// or [[#0, 150r], [#1, 150r], [#2, 160r]]
/** =============IMPORTANT===========
 * This is the connector to 
 * @param {*} nodeId 
 */
function setNodeData(nodeId) {
  const currNode =  dummyData[nodeId]
  let right_neighbors = []
  //console.log(currNode);
  right_neighbors.push(dummyData[currNode.neighbors[1]])
  right_neighbors.push(dummyData[right_neighbors[0].neighbors[1]])
  right_neighbors.push(dummyData[right_neighbors[1].neighbors[1]])
  right_neighbors.push(dummyData[right_neighbors[2].neighbors[1]])
  let left_neighbors = []
  left_neighbors.unshift(dummyData[currNode.neighbors[0]])
  left_neighbors.unshift(dummyData[left_neighbors[0].neighbors[0]])
  left_neighbors.unshift(dummyData[left_neighbors[0].neighbors[0]])
  left_neighbors.unshift(dummyData[left_neighbors[0].neighbors[0]])
  currNodeData = left_neighbors.concat(currNode, right_neighbors)

}

function createNodeBoxes() {

  for (let i = 0; i < currNodeData.length; i++) {
      const currNode = currNodeData[i]
      const box = nodeList[i]
      box.id = `box${i}`;
      
      if (i === 4) { // the center will ALWAYS be the 
         box.innerHTML = ``
        currNode.vals.forEach(val => {
          valBtn = document.createElement('button')
          valBtn.innerHTML = val;
          valBtn.className = 'slim-button'
          valBtn.onclick = function() {
            // remove all other
            currentNodeVal = val;
            guidingVal.innerText = val;
            this.classList.add('selectedVal')
          }
          box.appendChild(valBtn)
        });
      } else {
        box.innerHTML = `<h2>${currNode.id}</h2>${currNode.vals.join('<br>')}`;
        // box.onclick = () => navigateToNode(currNode.id);
      }
      
      const colorHdr = document.createElement('h3')
      colorHdr.innerHTML = 'Color:'
      box.appendChild(colorHdr)
      const rectangle = document.createElement('div')
      rectangle.style.width = 'calc(100% - 10px)';
      rectangle.style.height = '100px';
      rectangle.style.border = '1px solid #000';
      rectangle.style.display = 'flex';
      rectangle.style.justifyContent = 'space-around';

      rectangle.style.alignItems = 'center';
      rectangle.style.marginBlock = '10px'
      rectangle.style.background = `rgb(${parseInt(currNode.vals[0])}, ${parseInt(currNode.vals[1])}, ${parseInt(currNode.vals[2])})`;
      box.appendChild(rectangle)
      nodesContainer.appendChild(box);
  }
}

function updateCurrentNodeData() {
  currentNodeDataList.innerHTML = '';
  currNodeData[4].vals.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      currentNodeDataList.appendChild(li);
  });
}

function updateNodeData(nodeId) {
  nodeDataDiv.innerHTML = `
      <h1>Node Data</h1>
      <p>Node ID: ${nodeId}</p>
      <p>Additional info about Node ${nodeId} would go here.</p>
  `;
}

function addToHistory(nodeId) {
  // append to visual only if this is a unique value
  var historyContainsVal = siftHistory.some(historyNode => historyNode[1] == currentNodeVal)
  siftHistory.push([nodeId, currentNodeVal])
  if (!historyContainsVal && currentNodeVal != '') {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.textContent = `Node ${nodeId}: ${currentNodeVal}`;

    div.addEventListener('click', () => navigateToNode(nodeId));
    historyList.appendChild(div);
    historyList.scrollTop = historyList.scrollHeight;
  }

  if (currentNodeVal != '') {
    identifier = currentNodeVal[currentNodeVal.length-1]
    if (identifier == 'r') {
      currentNodeVal = currNodeData[4].vals[0];
    } else if (identifier == 'g'){
      currentNodeVal = currNodeData[4].vals[1]
    } else {
      currentNodeVal = currNodeData[4].vals[2]
    }
  }
  
}

function navigateToNode(nodeId) {
  currentNodeId = nodeId;
  setNodeData(nodeId);
  updateCurrentNodeData(nodeId);
  updateNodeData(nodeId);
  createNodeBoxes();
  addToHistory(nodeId);
}

leftArrow.addEventListener('click', () => {
  navigateToNode(currNodeData[3].id);
});

rightArrow.addEventListener('click', () => {
  navigateToNode(currNodeData[5].id);
});

// Initialize with the middle node (4)
const dummyData = generateDummyData();
console.log(dummyData);
setNodeData(90)
createNodeBoxes();
navigateToNode(10, '');










/**
 * 
 * 
 */
// Function to generate all combinations of RGB values
function generateRGBCombinations() {
  const step = 16; // Change this value to see different results
  const maxVal = 255;
  const values = [];
  
  for (let i = 0; i * step <= maxVal; i++) {
    values.push(i * step);
  }
  const combinations = []
  for (let r = 0; r < values.length; r++) {
    for (let g = 0; g < values.length; g++) {
      for (let b = 0; b < values.length; b++) {
        combinations.push([values[r] + 'r', values[g] + 'g', values[b] + 'b']);
      }
    }
  }
  return combinations;
}

// Function to generate neighbors
function generateNeighbors(index, length) {
  return [(index - 1 + length) % length, (index + 1) % length];
}

// Function to generate dummy data
function generateDummyData() {
  const combinations = generateRGBCombinations();
  const dummyData = {};
  for (let i = 0; i < combinations.length; i++) {
    dummyData[i] = {
      "id": i,
      "vals": combinations[i],
      "neighbors": generateNeighbors(i, combinations.length)
    };
  }
  return dummyData;
}




let isLocked = false;
let isInsideTrackpad = false;
let velocity = 1; // Initial speed

const trackpad = document.querySelector('.trackpad');
const verticalBar = trackpad.querySelector('.vertical-bar');
const pauseOverlay = document.getElementById('pause-overlay')
const highlightRegion = trackpad.querySelector('.highlight-region');


trackpad.addEventListener('mousemove', function(event) {
    if (isLocked) return;

    const rect = trackpad.getBoundingClientRect();
    let x = event.clientX - rect.left; // Get the mouse position within the trackpad

    // Ensure the bar stays within the trackpad bounds
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    currentTrackpadPos = x;
    verticalBar.style.left = `${x}px`; // Move the vertical bar to the x position

    // Adjust the highlight region based on the position of the vertical bar
    const middleX = rect.width / 2;
    let distanceFromCenter = Math.abs(x - middleX);
    let maxDistance = middleX;
    let colorRatio = distanceFromCenter / maxDistance;

    // Calculate color from green to yellow to red
    let r = Math.min(255, Math.floor(510 * colorRatio));
    let g = Math.min(255, Math.floor(510 * (1 - colorRatio)));
    let b = 0;

    highlightRegion.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.5)`; // Adjust color intensity

    if (x < middleX) {
        highlightRegion.style.left = `${x}px`;
        highlightRegion.style.width = `${middleX - x}px`;
    } else {
        highlightRegion.style.left = `${middleX}px`;
        highlightRegion.style.width = `${x - middleX}px`;
    }

    // Update speed based on the distance from center

    velocity = (x - middleX) > 0 ? 1 + colorRatio * 4 : -(1 + colorRatio * 4); // velocity ranges from 1 to 15
});

trackpad.addEventListener('mouseenter', function() {
    isInsideTrackpad = true;
    if (!isLocked) {
        startInfiniteLoop();
    }
});

trackpad.addEventListener('mouseleave', function() {
    isInsideTrackpad = false;
});

trackpad.addEventListener('click', function() {
    isLocked = !isLocked;

    if (isLocked) {
        trackpad.classList.add('locked');
        pauseOverlay.style.display = 'flex';
    } else {
        trackpad.classList.remove('locked');
        pauseOverlay.style.display = 'none';
        if (isInsideTrackpad) {
            startInfiniteLoop();
        }
    }
});

function startInfiniteLoop() {
    function loop() {
        if (!isInsideTrackpad || isLocked) return;
        // Your loop code here
        let speed = Math.abs(velocity)
        // console.log('Looping at speed:', speed);
        setTimeout(loop, 2000 / speed); // Loop frequency based on speed
        // move right
        if (velocity > 0) {
          navigateToNode(currNodeData[5].id)
        // move left
        } else if (velocity < 0) {
          navigateToNode(currNodeData[3].id)
        }
        
    }
    loop();
}
