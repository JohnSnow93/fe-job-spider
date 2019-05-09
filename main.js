const request = require("request-promise");

console.log("Started!");

async function start(){
const res = await request.get("https://www.lagou.com/jobs/list_前端?labelWords=&fromSearch=true&suginput=", {
    resolveWithFullResponse: true
});

console.log(res.headers['content-type'])

}

start()