

/**
 * This demo operates with the assumptions:
 * - We already know the appropriate parent dimension a color resides (i.e. color)
 */
var headers = []
var data_before = []
// this data represents how it is stored on the DESO blockchain:
const parent_dimension = dimension_name = "colors";
var blk_data = {}
var next_block_hex = 0;

const DIVE_DIMENSION = 0;
const CHILD_REF = 0;
const LEFT = 0;
const RIGHT = 1;
const R_LOC = 1;
const G_LOC = 2;
const B_LOC = 3;


main()
async function main() {
    data_before = await loadCSV();
    var parentHex = addBlock([{"value": dimension_name}])

    insertDimGroup(parentHex, data_before)
}

function insertDimGroup(parentHex, arr) {
    for (let dimGroup of arr) {
        findPlacement(parentHex, dimGroup)
        break;
    }
}



function findPlacement(parentHex, dimGroup) {
    // Step 1: Child traversal
    var parent = getBlock(parentHex)
    // get any color in child
    childHex = parent[DIVE_DIMENSION].refs[CHILD_REF]

    // BUILDING BLOCKS, a dimension at a time.
    
    // Case 1: Need to add first child for parent_dimension
    if (childHex == parentHex) {
        setReferences()
    }
}





//========================================================
//======================="BLOCKCHAIN" SECTION=============
//========================================================
/**
 * 
 * 
*/ 
function addBlock(block) {
    // IF NO references were provided for a certain dimension, add manually.
    for (dim of block) {
        if (dim.refs == undefined) {
            dim.refs = [next_block_hex, next_block_hex]
        }        
    }
    

    blk_data[next_block_hex] = block;
    return next_block_hex++;
}
function getBlock(hex) {
    return blk_data[hex]
}
/**
 * Updates existing references to reflect new data point inserted
 * Purpose: Prepares references for data point placement on the blockchain
 * @param {*} hexToInsert 
 * @param {*} insertHex 
 * @param {*} dimension_location 
 * @returns 
 */
function setReferences(hexToInsert, insertHex, dimension_location) {
    var rightBlock = getBlock(insertHex)
    var leftBlock = getBlock(placementLocation[dimension_location].refs[LEFT])
    // update left and right block's to new hex location
    rightBlock[dimension_location].refs[LEFT] = hexToInsert;
    leftBlock[dimension_location].refs[RIGHT] = hexToInsert;
    return [left_val, insertHex]
}

//========================================================
//=======================Helper Methods SECTION===========
//========================================================
/**
 * 
 * 
*/ 
async function loadCSV() {
    const data = await fetch("./data/" + dimension_name + ".csv");
    var csv = await data.text()
    var result = []
    const rows = csv.split('\n')
    var isHeaders = true;
    for (let row of rows) {
        // Split the row into columns
        // This regex handles cases where fields may contain commas within quotes
        const columns = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
        
        // Remove quotes from fields if present
        const cleanedColumns = columns.map(column => column.replace(/(^"|"$)/g, ''));
        
        if (isHeaders) {
            isHeaders = false;
            headers = cleanedColumns
        } else {
            // Add the row to the result array
            result.push(cleanedColumns);
        }
    }

    return result
}