

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
    } else {
        addControlsForPoint2(container, hashHex, getNextRowFromValue)
    }
}

function setControlsForRow(container, hashHex) {
    var dataPt = getDataPt(hashHex)
    //addControlsForPoint(container, getDataPt(dataPt.value[0]), dataPt.left, dataPt.right)
    addControlsForPoint2(container, hashHex, getNextRowFromValue)
    for (valueHex of dataPt.value) {
        addControlsForPoint2(container, valueHex, getNextRowFromValue)
    }
}

function addControlsForPoint2(container, currHex, getNext) {
    isLocked = isValueLocked(getDimensionHex(currHex))
    var dataPt = getDataPt(currHex)
    var value = dataPt.value
    const row = document.createElement('div');
    row.className = 'data-row';
    const leftArrow = document.createElement('button');
    leftArrow.innerHTML = '←';
    leftArrow.onclick = function () {
        setCurrentDataPoint(getNext(currHex, false))
    }
    row.appendChild(leftArrow);

    const dataValue = document.createElement('span');
    dataValue.innerHTML = value;
    dataValue.style = "width:500px;"
    row.appendChild(dataValue);

    const lockButton = document.createElement('button');
    lockButton.innerHTML = isLocked ? '🔒' : '🔓';
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
        setCurrentDataPoint(getNext(currHex, true))
    }
    row.appendChild(rightArrow);
    container.appendChild(row);
}
function isValueLocked(dimensionId) {
    for (dimVal of locked_DIMS) {
        if (getDimensionHex(dimVal) == dimensionId)
            return true
    }
    return false
}
function getNextNorm(dataPt, isRight) {
    if (isRight) 
        return dataPt.right
    else
        return dataPt.left
}

function getNextRowFromValue(currHex, isRight) {
    // This variable is used to ensure that we are in the correct dimension
    // blockchain-wise, this would just pull the parentHex
    var dataPt = getDataPt(currHex)
    // Used to determine if the current element a value under the overarching data point or if it's the data point itself
    var valueDimension = getDimensionHex(currHex)
    var curr_pointDimension = getDimensionHex(curr_nav_hex)
    //console.log(locked_DIMS);
    var nextHex = curr_nav_hex;
    direction = isRight ? 'right' : 'left'
    // Case 1: Ensure that we are not traversing a LOCKED dimension
    if (locked_DIMS.indexOf(currHex) != -1) {
        console.log("ERROR: DIMENSION IS LOCKED!!!");
    // Case 2: we are traversing on the dimension of the currently selected data point
    } else if (valueDimension == curr_pointDimension) {
        // TODO TODOTODOTODOTODOTODOTODOTODOTODO
        // IF WE DO NOT HAVE THIS LINE AND LOCK a value dim, then traverse on this dim
        if (locked_DIMS.length != 0)
            console.log("ERROR: cannot parse while there are locked");
        else
            nextHex = dataPt[direction];
    // Case 3: if there are no Locks in place, we can traverse by going to left/right of value dimension and getting first possible reference
    } else if (locked_DIMS.length == 0) {
        var isNextRow = false
        var nextUniqueInDimension = getDataPt(dataPt[direction])
        while (!isNextRow) {
            for (ref of nextUniqueInDimension.refs) {
                if (getDimensionHex(ref) == curr_pointDimension) {
                    isNextRow = true;
                    nextHex = ref;
                    break;
                }
            }
            nextUniqueInDimension = getDataPt(nextUniqueInDimension[direction])
        }
     // Case 4: Use locks to determine next value
    } else {
        // valid_hexes keeps track of the combination of the locked dimension values
        var valid_hexes = getDataPt(locked_DIMS[0]).refs
        // INNER JOIN ON EACH locked dimension's references
        for (let dimdex = 1; dimdex < locked_DIMS.length; dimdex++) {
            var curr_dim_valid = getDataPt(locked_DIMS[dimdex]).refs
            // perform inner join on valid_hexes and current dimension's value list
            var inner_join = [];
            for (curr_value_hex of curr_dim_valid) {
                if (valid_hexes.includes(curr_value_hex))
                    inner_join.push(curr_value_hex);
            }
            valid_hexes = inner_join;
        }
        console.log('Number of valid ' + curr_pointDimension + ' using the locked dimensions is ' +  valid_hexes.length);
        // we MUST find a user within our valid hexes
        var isNextRow = false
        var nextUniqueInDimension = getDataPt(dataPt[direction])
        while (!isNextRow) {
            for (ref of nextUniqueInDimension.refs) {
                if (getDimensionHex(ref) == curr_pointDimension && valid_hexes.includes(ref)) {
                    isNextRow = true;
                    nextHex = ref;
                    break;
                }
            }
            nextUniqueInDimension = getDataPt(nextUniqueInDimension[direction])
        }
    }
    
    
    curr_nav_hex = nextHex;
    return nextHex
}
function innerJoinArrays(arr1, arr2) {
    return arr1.filter

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
    curr_nav_hex = initialDimHex;
    setCurrentDataPoint(initialDimHex)
}
async function getJson(data_to_read) {
    const data = await fetch("./data/" + data_to_read + ".json");
    return data.json()
}
var data = {};
async function main() {
    data_to_read = "colors"
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
var curr_nav_hex
var row_dimension = "users_dim"
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