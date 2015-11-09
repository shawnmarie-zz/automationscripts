import request from "request";
let epics = ["SMAS-513", "SMAS-514", "SMDEF-23", "SMDEF-24", "SMDEF-25"];

for (let epic of epics) {
	var options = { method: 'DELETE',
	  url: `http://jira-6.cloudapp.net:8080/rest/api/2/issue/${epic}`,
	  headers: 
	   { 'cache-control': 'no-cache',
		 'content-type': 'application/json',
		 authorization: 'Basic YWRtaW46YWRtaW4=' } };
	console.log(options);
	request(options, (error, response, body) => {
	  if (error) throw new Error(error);

	  console.log(body);
	});
}