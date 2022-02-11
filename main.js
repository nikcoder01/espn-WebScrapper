const cheerio=require('cheerio')
const request=require('request')

const fs=require('fs')  //requiring fs module
const path=require('path')  //requiring path module

const allMatchobj=require('./allMatch')

let iplPath=path.join(__dirname,'IPL') // __dirname gives parent directory path combining with IPL folder path
dirCreator(iplPath)   //passing iplPath to dirCreator Function
//  [ NOTE: __dirname gives parent directory name, __filename gives path of file]
const url='https://www.espncricinfo.com/series/ipl-2020-21-1210595'

request(url,cb)

function cb(error,response,html){
    if (error){
        console.error(error);
    }
    else{
    extractLink(html);
    }
    }
function extractLink(html)
{
    let $=cheerio.load(html)     // loading all the html

    let anchorElem=$('a[data-hover="View All Results"]')    //selecting link for view all results using attribute selector  
    let link=anchorElem.attr('href')    // attr function extracts href element from whole selected elements 
    // console.log(link)
    let fulllink='https://www.espncricinfo.com/'+link   // adding full link to incomplete link as browser auto-completes it
    console.log(fulllink)


    allMatchobj.getAllMatch(fulllink)
}

function dirCreator(path)
{
    if(fs.existsSync(path)==false)
    {
        fs.mkdirSync(path)
    }
} 

