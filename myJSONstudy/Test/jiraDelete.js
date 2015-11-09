var request = require("request");
var jiraProjId = "JST";
//var epics = ["SMAS-509", "SMAS-510", "SMDEF-32", "SMDEF-31", "SMDEF-30", "SMSCRUM-55", "SMSCRUM-54", "SMSCRUM-53"];

var issuesToDelete = [];
var getIssues = { method: "GET",
	url: 'http://jira-6.cloudapp.net:8080/rest/api/2/search?jql=project=' +jiraProjId + '&fields=summary',
	headers:
	  {'content-type': 'application/json',
		authorization: 'Basic YWRtaW46YWRtaW4=' } };
request(getIssues, function(error, response, body) {
	if(error) throw new Error(error);
	//console.log(body + " this is the body.");
	var responseData = JSON.parse(body);
	for(var i = 0; i < responseData.issues.length; i++){
		issuesToDelete.push(responseData.issues[i].key);
	}
	//console.log(body);
	console.log(issuesToDelete);
	console.log("issues inside.");
});

console.log(issuesToDelete);
console.log("issues outside.");

for(var i = 0; i < issuesToDelete.length; i++) {
	var toDelete = issuesToDelete[i];
	var options = { method: 'DELETE',
	  url: 'http://jira-6.cloudapp.net:8080/rest/api/2/issue/' + toDelete,
	  headers: 
	   { 'cache-control': 'no-cache',
		 'content-type': 'application/json',
		 authorization: 'Basic YWRtaW46YWRtaW4=' } };
	console.log(options);
	request(options, function (error, response, body) {
	  if (error) throw new Error(error);

	  console.log(body);
	});
}