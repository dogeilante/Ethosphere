function getInitPostWithinDimension(curr_dimension) {
    return curr_dimension + "0"

}
function getDataPt(hashHex) {
    return data[hashHex]
}
function getLeftDataPt() {

}
function addDimensionRow() {

}
function setRowDataPoint() {

}
function addDimensionSelector(container, dimensionIds) {
    //const dimensionsSelect = document.getElementById('dimensions')

    dimSelectLbl = document.createElement("label");
    dimSelectLbl.innerHTML ="Dimensions:"
    dimSelectLbl.setAttribute("for", 'dimensions')
    dimSelect = document.createElement("select");
    dimSelect.setAttribute("id", 'dimensions')
    dimSelect.addEventListener("change", setupStartingDataPoint);
    // Populate the select input with options from the array
    dimensionIds.forEach(dimension => {
        const option = document.createElement('option');
        option.value = dimension;
        option.text = dimension;
        dimSelect.appendChild(option);
    });
    // Manually trigger change event for first page load
    const event = new Event('change');
    dimSelect.dispatchEvent(event);
    container.appendChild(dimSelectLbl)
    container.appendChild(dimSelect)
}



function setCurrentDataPoint(hashHex) {
    const container = document.getElementById('dataContainer');
    // RESET VARIABLES
    container.innerHTML = ''

    dataPt = getDataPt(hashHex)
    
    var dimension_header = document.createElement("h3")
    dimension_header.innerHTML = curr_dimension + " dimension"
    container.appendChild(dimension_header)
    

    data_value = dataPt.value
    // This is an array, meaning it is a row of dimension value references
    if (Array.isArray(data_value)) {
        setControlsForRow(container, hashHex)
        return
    }
    addControlsForPoint(container, dataPt.value, dataPt.left, dataPt.right)
}

function addControlsForPoint(container, value, leftHex, rightHex) {
    const row = document.createElement('div');
    row.className = 'data-row';
    const left5Arrow = document.createElement('button');
    left5Arrow.innerHTML = '←←←←←';
    left5Arrow.onclick = function () {
        setCurrentDataPoint(getDataPt(getDataPt(getDataPt(getDataPt(leftHex).left).left).left).left)
    }
    row.appendChild(left5Arrow);
    const leftArrow = document.createElement('button');
    leftArrow.innerHTML = '←';
    leftArrow.onclick = function () {
        setCurrentDataPoint(leftHex)
    }
    row.appendChild(leftArrow);

    const dataValue = document.createElement('span');
    dataValue.innerHTML = value;
    dataValue.style = "width:500px;"
    row.appendChild(dataValue);

    const lockButton = document.createElement('button');
    lockButton.innerHTML = '🔓';
    row.appendChild(lockButton);

    const rightArrow = document.createElement('button');
    rightArrow.innerHTML = '→';
    rightArrow.onclick = function () {
        setCurrentDataPoint(rightHex)
    }
    row.appendChild(rightArrow);
    const right5Arrow = document.createElement('button');
    right5Arrow.innerHTML = '→→→→→→';
    right5Arrow.onclick = function () {
        setCurrentDataPoint(getDataPt(getDataPt(getDataPt(getDataPt(rightHex).right).right).right).right)
    }
    row.appendChild(right5Arrow);
    container.appendChild(row);
}
function setControlsForRow(container, hashHex) {
    var dataPt = getDataPt(hashHex)
    addControlsForPoint(container, getDataPt(dataPt.value[0]), dataPt.left, dataPt.right)
    for (dimensionHex of dataPt.value) {
        addControlsForPoint2(container, dimensionHex, getNextRowFromValue)
    }
}
function getNextNorm(dataPt, isRight) {
    if (isRight) 
        return dataPt.right
    else
        return dataPt.left
}

function getNextRowFromValue(dataPt, isRight, currHex) {
    // This variable is used to ensure that we are in the correct dimension
    // blockchain-wise, this would just pull the parentHex
    curr_dimension = getDimensionHex(currHex)
    locked_DIMS;
    if (locked_DIMS.indexOf(currHex) != -1) {
        console.log("ERROR: DIMENSION IS LOCKE");
        
    }
    if (isRight) 
        return dataPt.right
    else
        return dataPt.left
}
function addControlsForPoint2(container, currHex, getNext) {
    dataPt = getDataPt(currHex)
    var value = dataPt.value
    const row = document.createElement('div');
    row.className = 'data-row';
    const leftArrow = document.createElement('button');
    leftArrow.innerHTML = '←';
    leftArrow.onclick = function () {
        setCurrentDataPoint(getNext(dataPt, true, currHex))
    }
    row.appendChild(leftArrow);

    const dataValue = document.createElement('span');
    dataValue.innerHTML = value;
    dataValue.style = "width:500px;"
    row.appendChild(dataValue);

    const lockButton = document.createElement('button');
    lockButton.innerHTML = '🔓';
    lockButton.onclick = function () {
        if (lockButton.innerHTML == '🔓') {
            lockButton.innerHTML = '🔒'
            locked_DIMS.push(currHex)
        } else {
            lockButton.innerHTML = '🔓'
            indexOfLockedDim = locked_DIMS.indexOf(currHex)
            locked_DIMS.splice(indexOfLockedDim, 1)
        }
        console.log(locked_DIMS);
        
    }
    row.appendChild(lockButton);

    const rightArrow = document.createElement('button');
    rightArrow.innerHTML = '→';
    rightArrow.onclick = function () {
        setCurrentDataPoint(getNext(dataPt, true, currHex))
    }
    row.appendChild(rightArrow);
    container.appendChild(row);
}
function getDimensionHex(currHex) {
    var dimensionHex =  currHex.match(/[a-zA-Z]+/g);
    return dimensionHex[0]
}
/**
 * Populates the current data point with its information
 * @param {*} container 
 * @param {*} data 
 */
function setupStartingDataPoint(event) {
    locked_DIMS = []
    curr_dimension = event.target.value
    initialDimHex = getInitPostWithinDimension(curr_dimension)
    setCurrentDataPoint(initialDimHex)
}
async function getJson(data_to_read) {
    const data = await fetch("./data/" + data_to_read + ".json");
    return data.json()
}
var data = {};
async function main() {
    data_to_read = "mlb_players"
    data = await getJson(data_to_read)
    console.log(data);
    const container = document.getElementById('navigation');
    //console.log(data["dimensions"]);
    //console.log(data);
    addDimensionSelector(container, data["dimensions"])
    // this point will be a 
    //console.log(Object.keys(data)[5]);
    //getPostData(0)
    //console.log('testt');

}
const row_dimension = "users_dim"
var locked_DIMS = []
main()















// // Sample data
// const proposals = [
//     {
 
//        "data": []
//     },
//  ];
//  /**
//   * Retrieve all data existing within a specific post
//   * @param {*} postHex 
//   */
//  function getPostData(postHex) {
//     currPostData = []
//     proposals.forEach(prop => {
//        if (prop.postHex == postHex) {
//           currPostData.push(prop)
//        }
       
//     });
    
//     populateData(container, currPostData)
//  }
// function convertCSVToStructure(csv) {
//    const rows = csv.split('\n');
//    const result = [];

//    rows.forEach(row => {
//        const columns = row.split(',');

//        columns.forEach((col, index) => {
//            let obj = {
//                value: col,
//                valueHex: 0,
//                left: -1,
//                right: -1
//            };

//            // Conditional keys based on column index
//            if (index === 0) {
//                obj.postMembers = [0, 1];
//            } else {
//                obj.duplicates = [];
//            }

//            result.push(obj);
//        });
//    });

//    return result;
// }

// // Example usage
// const csvData = `Tangy,F,pizza
// SegFlt,M,chips
// Doge,F,chips
// DiamondThumb,M,pizza
// Arnoud,M,kale
// Darian,F,pizza
// Dolinski,M,kale`;

// const result = convertCSVToStructure(csvData);
// console.log(JSON.stringify(result, null, 2));





// Proposal 1
// { value: 'Membership', postHex:0, left:1, right:1, postMembers: [0, 1]}
// ,{ value: 'Doge', postHex:0, left:1, right:1, duplicates: []}
// ,{ value: '6/1/2024', postHex:0, left:1, right:1, duplicates: []}
// ,{ value: 'TangledBrush918', postHex:0, left:1, right:1, duplicates: []}
// // Proposal 2
// ,{ value: 'Membership', postHex:1, valueHex, left:1, right:1, postMembers: [0]}
// ,{ value: 'Doge', postHex:1, left:1, right:1, duplicates: []}
// ,{ value: '6/1/2024', postHex:1, left:1, right:1, duplicates: []}
// ,{ value: 'TangledBrush918', postHex:1, left:1, right:1, duplicates: []}
/**
 * 
 * name,gender,food
Tangy,F,pizza
SegFlt,M,chips
Doge,F,chips
DiamondThumb,M,pizza
Arnoud,M,kale
Darian,F,pizza
Dolinski,M,kale

Give me a function that reads this data and creates a json object for each row. 

You must keep track of each column's unique values and point to neighbors upon a unique value being added.

For example of row 1 and 2:
{
"hashHex": 0,
"data": [
{ value: 'Tangy', hashHex: 1, left:1, right:2, duplicates: [] },
{
 */