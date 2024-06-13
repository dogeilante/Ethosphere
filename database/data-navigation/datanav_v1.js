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
    container.innerHTML = ''

    dataPt = getDataPt(hashHex)
    
    var dimension_header = document.createElement("h3")
    dimension_header.innerHTML = curr_dimension + " dimension"
    container.appendChild(dimension_header)
    

    data_value = dataPt.value
    // This is an array, meaning it is a row of dimension value references
    if (Array.isArray(data_value)) {
        console.log(data_value);
        console.log("Not supported yet");
        return
    }
    addControlsForPoint(container, dataPt)
}
function addControlsForPoint(container, dataPt) {
    const row = document.createElement('div');
    row.className = 'data-row';
    const left5Arrow = document.createElement('button');
    left5Arrow.innerHTML = '←←←←←';
    left5Arrow.onclick = function () {
        setCurrentDataPoint(getDataPt(getDataPt(getDataPt(getDataPt(dataPt.left).left).left).left).left)
    }
    row.appendChild(left5Arrow);
    const leftArrow = document.createElement('button');
    leftArrow.innerHTML = '←';
    leftArrow.onclick = function () {
        setCurrentDataPoint(dataPt.left)
    }
    row.appendChild(leftArrow);

    const dataValue = document.createElement('span');
    dataValue.innerHTML = data_value;
    dataValue.style = "width:500px;"
    row.appendChild(dataValue);

    const lockButton = document.createElement('button');
    lockButton.innerHTML = '🔓';
    // lockButton.onclick = function () {
    //     item.locked = !item.locked;
    //     lockButton.innerHTML = item.locked ? '🔒' : '🔓';
    // };
    row.appendChild(lockButton);

    const rightArrow = document.createElement('button');
    rightArrow.innerHTML = '→';
    rightArrow.onclick = function () {
        setCurrentDataPoint(dataPt.right)
    }
    row.appendChild(rightArrow);
    const right5Arrow = document.createElement('button');
    right5Arrow.innerHTML = '→→→→→→';
    right5Arrow.onclick = function () {
        setCurrentDataPoint(getDataPt(getDataPt(getDataPt(getDataPt(dataPt.right).right).right).right).right)
    }
    row.appendChild(right5Arrow);
    container.appendChild(row);
}
/**
 * Populates the current data point with its information
 * @param {*} container 
 * @param {*} data 
 */
function setupStartingDataPoint(event) {
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