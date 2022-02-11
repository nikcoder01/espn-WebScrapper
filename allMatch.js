const cheerio=require('cheerio')
const request=require('request')
const scorecardObj = require('./scorecard')
function getAllMatchesLink(uri){  // Again using request and cheerio
    request(uri,x)
    
    function x(error,response,html){
       if (error){
           console.error(error);
       }
       else{
       extractAllLink(html);  //calling another fuction
       // console.log(html)
       }
       }

}

function extractAllLink(html)
{
   let $=cheerio.load(html)
   let ScoreCardArr=$('a[data-hover="Scorecard"]')  //selecting array of scorecards of 60 elements
   for(let i=0;i<ScoreCardArr.length;i++)
   {
       let link=$(ScoreCardArr[i]).attr('href');     
        //***TO USE $('') again because it is under the loop and we need to imply it to be cherrio func again and again***/
       let fulllink='https://www.espncricinfo.com/'+link   // adding full link to incomplete link as browser auto-completes it
    //    console.log(fulllink)

    scorecardObj.ps(fulllink)  //for each link, we are evaluating it via scorecard function(which prints required data for each function)
   }
}

module.exports={   //exporting this js to main for ful calculation
    getAllMatch : getAllMatchesLink
}