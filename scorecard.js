const request = require('request')//Request is Asyncly executed in JAVASCRIPT
const cheerio = require('cheerio')

const fs = require('fs')  //requiring fs module
const path = require('path')  //requiring path module

const xlsx = require('xlsx')

let url = 'https://www.espncricinfo.com//series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard'
// console.log('Before')
function processScoreCard(url) {
    request(url, cb)
}

function cb(error, response, html) {
    if (error) {
        console.error(error);
    }
    else {
        handleHtml(html);
    }
}

function handleHtml(html) {
    let selTool = cheerio.load(html)  //loading html
    // let contentArr=selTool('.name-link .name')  //slector tool selecting opponents and team name
    let descele = selTool('.header-info .description')  //selecting venue,date
    let result = selTool('.match-info.match-info-MATCH.match-info-MATCH-half-width .status-text span').text() // to print winner
    let desc = descele.text().split(",") //splitting description in terms of , for venue and date
    // let TmName= selTool(contentArr[0]).text();
    // let OpName= selTool(contentArr[1]).text();
    let venue = desc[1].trim();  //trimming any left spaces so that we dont get error ahead
    let date = desc[2].trim();
    // console.log('Team Name ',TmName)
    // console.log('Opponent Name ',OpName)
    // console.log('Details:'+desc)
    console.log("Venue : " + venue)
    console.log("Date : " + date)
    console.log(result)  // printed as a single as it contains single value
    console.log("''''''''''''''''''''''''''''''''''''''''''''''''")

    let innings = selTool('.card.content-block.match-scorecard-table > .Collapsible')  // contains html for table
    //TWO COLLAPSIBLE TABLES FOR BOTH TEAMS
    let htmlString = "";
    for (let i = 0; i < innings.length; i++)  // RUNNING LOOP FOR 2 TIMES FOR 2 TEAMS
    {
        htmlString += selTool(innings[i]).html()  //coz innings contains all html of the tables
        let teamName = selTool(innings[i]).find('h5').text()  // team Name is contained in h5
        // find func(function of ccheerio module) finds text in html doc 

        teamName = teamName.split('INNINGS')[0].trim()// SELECTING OUT NAME ONLY FR THE TEAM, TRIMMING ON BASIS OF INNINGS STRING

        let opponentIdx = i == 0 ? 1 : 0;  //Ternary operator to find index for opponent name in single iteration of loop
        let opponentName = selTool(innings[opponentIdx]).find('h5').text()
        opponentName = opponentName.split('INNINGS')[0].trim()
        console.log(teamName, opponentName)


        let cInnings = selTool(innings[i]);   //storing html for table in cInnings
        let allRows = cInnings.find('.table.batsman tbody tr')  //for finding table row in body

        for (let j = 0; j < allRows.length; j++) {
            let allCols = selTool(allRows[j]).find('td')   // finding colms in each row for specific datas for each players
            let isWorthy = selTool(allCols[0]).hasClass('batsman-cell')  // checkimng specifically 1st colm of row for data of table with required values

            if (isWorthy == true) {   //Cheking isWorthy for selecting correct tdata table row
                let playerName = selTool(allCols[0]).text().trim() //player name
                let runs = selTool(allCols[2]).text().trim()  //runs
                let balls = selTool(allCols[3]).text().trim()  //balls
                let fours = selTool(allCols[5]).text().trim()  //fours
                let sixes = selTool(allCols[6]).text().trim()  //sixes
                let STR = selTool(allCols[7]).text().trim()    //strike rate

                console.log(`${playerName} | ${runs} |${balls} | ${fours} | ${sixes} | ${STR}`)  //this is templete literal 
                // ----------$('') -->backtick inside dollar symbol is the template literal to be used so we can print it without using concatenation or commas--------------------------
                processPlayer(teamName, opponentName, playerName, runs, balls, fours, sixes, venue, date, result)
            }

        }
        console.log(" ''''''''''''''''''''''''''''''''''''''''' ")

    }
    // console.log(htmlString)   // This was just to copy html for te table seperately in scorecard_table.html and  extracting relevant data
}

function processPlayer(teamName, opponentName, playerName, runs, balls, fours, sixes, venue, date, result) {
    let pathName = path.join(__dirname, "IPL", teamName)  // creating path name for each team
    dirCreator(pathName)  // passing it to dirCreator to create folder of respective team Names
    let filePath = path.join(pathName, playerName + ".xlsx")

    let content = excelReader(filePath, playerName) // returns [] empty array presently
    //Now on getting empty array, we will create a loop and pass all objects in loop which will
    //read it and store it inside content

    let playerObj = {   //creating object for all entry values
        // "teamName":teamName,  == teamName when keyName and value Name is same , therefore
        teamName,
        opponentName,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        venue,
        date,
        result
    };
    content.push(playerObj)   //pushing dataa for single player in a loop

    excelWriter(filePath, playerName, content)  //writtting all values in excel wjhich creates excel files
   // now , as all loop runs, it keeps on adding all player data in the sheet

}

function dirCreator(path) {
    if (fs.existsSync(path) == false) {
        fs.mkdirSync(path)
    }
}
function excelWriter(fileName, sheetName, json_data) {
    let newWB = xlsx.utils.book_new();   // creating a new work-book
    let newWS = xlsx.utils.json_to_sheet(json_data);    //  changing json to sheet(into rows and cols)
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName); //appending workbook and worksheets  
    xlsx.writeFile(newWB, fileName);
}
function excelReader(fileName, sheetName) {
    if (fs.existsSync(fileName) == false) {
        return [];
    }
    let wb = xlsx.readFile(fileName);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

module.exports = {      // exporting scorecard.js to be used in allMatch.js for calculating required scorecard data for all the matcges linkwise
    ps: processScoreCard
}
