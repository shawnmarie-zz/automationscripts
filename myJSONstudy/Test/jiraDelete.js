var request = require("sync-request");

var jiraProjId = "SMAS";

var issuesToDelete = [];
var res = request('GET','http://jira-6.cloudapp.net:8080/rest/api/2/search?jql=project=' +jiraProjId + '&fields=summary',{
	headers:
	  {'content-type': 'application/json',
		authorization: 'Basic YWRtaW46YWRtaW4=' } });

var responseData = JSON.parse(res.getBody());

for(var i = 0; i < responseData.issues.length; i++){
	issuesToDelete.push(responseData.issues[i].key);
}

console.log(issuesToDelete);

for(var i = 0; i < issuesToDelete.length; i++) {
	var toDelete = issuesToDelete[i];
	var res = request('DELETE', 'http://jira-6.cloudapp.net:8080/rest/api/2/issue/' + toDelete, {
	  headers: 
	   { 'cache-control': 'no-cache',
		 'content-type': 'application/json',
		 authorization: 'Basic YWRtaW46YWRtaW4=' } });
}