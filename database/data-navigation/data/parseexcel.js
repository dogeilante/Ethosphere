//vgimport {fs} from 'fs';//
/**
 * Things that need to be changed: 
 *      separation between 
 */
const fs = require('fs').promises
const LEFT_DIRECTION = -1;
var dimension_ids_global = []
// Dimensions are currently structured like this when parsed: dimension1: [{},{},{}], dimension2: [{},{},{}]
// because otherwise, there is no way to differentiate between a datapoint within dimension1 or dimension2
// THIS IS HOW IT WILL BE STORED ON BLOCKCHAIN TOO, post->comments=datavalues
var posts = []
var giantJson = {}
var row_name = "users_dim"
main()
// });
async function main() {
    data_to_read = "colors"
    await readCSVAndConvert(data_to_read);
    //console.log(data);
    //console.log(posts);
    // printRowDimension("row_name")
    convertToGiantJson()
    //console.log(giantJson);
    try {
        await fs.writeFile(__dirname + "\\" + data_to_read + ".json", JSON.stringify(giantJson), 'utf8');
        console.log('File written successfully');
    } catch (err) {
        console.error('Error writing to the file:', err);
    }
}


async function readCSVAndConvert() {
    path_file = 
    data = await fs.readFile(__dirname + "\\" + data_to_read + ".csv", 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
        return data;
    })
    convertCSVToData(data);
}
function convertCSVToData(csvString) {
    // Convert to array of json objects
    const lines = csvString.split('\r\n');
    dimensionIds = lines[0].split(',');
    const dimensionData = parseRowsTo2dArray(lines);
    // create header dimensions
    addDimensions(dimensionIds)
    // populate values of each dimension
    populate_1D_Dimensions(dimensionIds, dimensionData)
    // row dimensions are different in that they reference other dimensions
    addDimension(row_name)
    dimension_ids_global = dimensionIds;
    populateRowDimension(row_name, dimensionIds, dimensionData)
}

function populate_1D_Dimensions(dimensionIds, datatable) {
    // we need to check if we're creating a new dimension, or if they already exist
    // dimensionIds = dimensionIsExist()
    for (let row = 0; row < datatable.length; row++) {
        for (let col = 0; col < datatable[row].length; col++) {
            currDimension = dimensionIds[col];
            addValueToDimension(currDimension, datatable[row][col], compareAlphabetical);
        }
    }
}
/***
 * 
 */
function populateRowDimension(row_dim, col_hexes, datatable) {
    for (let row = 0; row < datatable.length; row++) {
        var row_pointers = new Array(datatable[row].length);
        for (let col = 0; col < datatable[row].length; col++) {
            const element = datatable[row][col];
            row_pointers[col] = getDimensionValueHex(col_hexes[col], element, compareAlphabetical)
        }
        addValueToDimension(row_dim, row_pointers, compareArrayDimAlphabetical)
    }
}

function addDimension(dimensionId) {
    posts[dimensionId] = {}
}

function addDimensions(dimensionIds) {
    dimensionIds.forEach(dimensionId => {
        addDimension(dimensionId)
        
    });

}
/**
 * Retrieve parent post for a group of data
 */
function getDimension(dimensionId) {
    return posts[dimensionId]
}

function getDimensionValueHex(dimensionId, value, comparatorFunction) {
    var curr_dimension = getDimension(dimensionId)
    //console.log(curr_dimension);
    
    for (key of Object.keys(curr_dimension)) {
        if (comparatorFunction(value, curr_dimension[key].value) == 0) {
            return key
        }
    }
    return -1;
    
}
function getValue(dimensionId, hex) {
    var curr_dimension = getDimension(dimensionId)
    return curr_dimension[hex].value
}
function getValuePost(dimensionId, hex) {
    var curr_dimension = getDimension(dimensionId)
    return curr_dimension[hex]
}
function insertDimensionValue(dimensionId, placement_hash, uniqueHex, value) {
    uniqueHex = dimensionId+uniqueHex
    // values that are arrays reference other dimension values
    // 
    isDimensionCombinations = Array.isArray(value)

    var curr_dimension = getDimension(dimensionId)
    if (Object.keys(curr_dimension).length == 0) {
        curr_dimension[uniqueHex] = {
            value: value,
            left: uniqueHex,
            right: uniqueHex,
            refs: []
         }
    } else {
        right_hex = placement_hash
        right_data = curr_dimension[placement_hash]
        left_hex = right_data.left
        left_data = curr_dimension[left_hex]
        // insert by pushing right data point right once
        left_data.right = uniqueHex;
        right_data.left = uniqueHex;
        curr_dimension[uniqueHex] = {
            value: value,
            left: left_hex,
            right: right_hex,
            refs: []
        }
    }
    if (isDimensionCombinations) {
        for (let i = 0; i < value.length; i++) {
            var curr_value = getValuePost(dimension_ids_global[i], value[i])
            curr_value.refs.push(uniqueHex)
            
        }
    }
}


function addValueToDimension(dimensionId, value_to_add, comparatorFunction) {
    // check if value_to_add already exists in this dimension
    //  if (checkForDupeValue(dataPoint))
    
    // Retrieve dimension post
    var post = getDimension(dimensionId)
    if (post == null) {
        console.log("ERROR: " + dimensionId + " Dimension not found")
        
    }
    var numDimensionValues = Object.keys(post).length

    var uniqueHex = numDimensionValues;
    // var placement_location = numDimensionValues;
    // Case 1: 0 data values in array
    // 1 data submission
    if (numDimensionValues == 0) {
        // simply submit data point
        insertDimensionValue(dimensionId, uniqueHex, uniqueHex, value_to_add)
    } else if (numDimensionValues == 1) {
        insertDimensionValue(dimensionId, Object.keys(post)[0], uniqueHex, value_to_add)
        // insert value
    } else {
        // retrieve the BEGINNING key within
        var starting_key = Object.keys(post)[0]
        var previous_key = starting_key
        var previous_data = post[starting_key]

        var placement_key = starting_key;
        
        // Move direction is a variable that tracks where our current data point is headed.
        var moveDirection = comparatorFunction(value_to_add, post[starting_key].value);
        while (true) {
            var curr_key, curr_data;
            if (moveDirection == -1) {
                curr_key = previous_data.left;
            } else if (moveDirection == 1) {
                curr_key = previous_data.right;
            } else {
                console.log("WARNING: DUPLICATE VALUE DETECTED");
                return
            }
            var curr_data = post[curr_key];
            // 1: ensure that we have not looped back to beginning. THIS WILL NEVER HAPPEN!! All dimensions are ordered on some metric... I think
            /*if (curr_key == starting_key) {
                console.log("ERROR: THIS IS NOT POSSIBLE TO HAVE NOT FOUND A LOCATION YET!!!");
                break;
            }*/
            // 1: If we have looped to the other side of a dimension, insert at beginning hex
            //      in an ordered dimension, the previous data value should never be greater than the rightmost
            var curr_moveDirection = comparatorFunction(curr_data.value, previous_data.value)
            if (curr_moveDirection != moveDirection) {
                if (moveDirection == LEFT_DIRECTION) {
                    placement_key = previous_key
                } else {
                    placement_key = curr_key
                }
                break;
            }
            var curr_dataComparison = comparatorFunction(value_to_add, curr_data.value)
            // 2: Check if duplicate value
            if (curr_dataComparison == 0) {
                console.log("WARNING: DUPLICATE VALUE DETECTED");
                return;
                // 3: we have found that inserting our current datapoint that goes against our move direction. Insert here
            } else if (curr_dataComparison != moveDirection) {
                if (moveDirection == LEFT_DIRECTION) {
                    placement_key = previous_key
                } else {
                    placement_key = curr_key
                }
                break;
            }
            

            placement_key = previous_data.right;

            previous_data = curr_data
            previous_key = curr_key
        } 
        insertDimensionValue(dimensionId, placement_key, uniqueHex, value_to_add)
    }
}
/**
 * This method compares dimensions where the value is an array
 * @param {} dimension 
 * @param {*} arr1 
 * @param {*} arr2 
 * @returns 
 */
function compareArrayDimAlphabetical(arr1, arr2) {
    for (let idx = 0; idx < arr1.length; idx++) {
        compare_alph = compareAlphabetical(getValue(dimension_ids_global[idx], arr1[idx]), getValue(dimension_ids_global[idx], arr2[idx]))
        if (compare_alph != 0)
            return compare_alph;
    }
    // All values were equal!
    return 0
}
function compareStrings(str1, str2) {
    if (str1 == str2) {
        return 0
    } else {
        return -1
    }
}

function compareAlphabetical(str1, str2) {
    // we're adding in integer comparison lol
    if (parseInt(str1) != NaN) {
        str1 = parseInt(str1)
        str2 = parseInt(str2)
        if (str1 == str2)
            return 0
        else if (str1 > str2)
            return 1;
        else 
            return -1
    }
    
    
    return str1.localeCompare(str2)
    
}


// ====================================== PRINT / Visualization METHODS ====================================
function parseRowDimension() {

}
function printDimension(start_hash) {
    curr_post = giantJson[start_hash]
    for (let id = 0; id < 100; id++) {
        //console.log(curr_post.value);
        curr_post = giantJson[curr_post.left]
    }
}

function parseRowsTo2dArray(lines) {
    result = []
    for (let i = 1; i < lines.length; i++) {
        let line = lines[i].trim();
        if (line) { // Skip empty lines if any
            let row = [];
            let insideQuotes = false;
            let field = '';
            line[0]
            for (let char of line) {
                if (char === '"') {
                    insideQuotes = !insideQuotes;
                } else if (char === ',' && !insideQuotes) {
                    row.push(field);
                    field = '';
                } else {
                    field += char;
                }
            }
            row.push(field); // Push the last field
            result.push(row);
        }
    }
    return result
}
/**
 * Purpose: So that in datanav.js, a data value is retrieved similar to how it will be received on the blockchain
 * However, this will need to be removed, because there is no way to differentiate between dimensions
 */
function convertToGiantJson() {
    for (var key of Object.keys(posts)) {
        //var num_rows = 0
        var curr_dimension = getDimension(key)
        for (data_key of Object.keys(curr_dimension)) {
            giantJson[data_key] = curr_dimension[data_key]
            //num_rows++;
        }
        // console.log(key + ": " + num_rows);
        
    }
    giantJson["dimensions"] = dimensionIds.concat([row_name])
}


/**
 * ===================TESTING TESTING TESTING=================================
 */


//testAddDimensionValues()

function testAddDimensionValues() {
    addDimension("sports")
    sportsArray = ["poker", 'basketball', 'aaa', 'z', 'zeee', 'toast']
    for (sport of sportsArray) {
        addValueToDimension("sports", sport, compareAlphabetical)
    }
    console.log(posts["sports"]);
    console.log("test");
}



//testCompareStringsAlphabetically()
function testCompareStringsAlphabetically() {
    // alphabetically less
    console.log("----Alphabetically Less----");
    console.log(compareAlphabetical('a', 'b'));
    // alphabetically equal
    console.log("----Alphabetically Equal----");
    console.log(compareAlphabetical('a', 'a'));


    console.log("----Alphabetically GReater----");
    console.log(compareAlphabetical('b', 'a'));
}
