var request = require("sync-request");

var res = request('POST','http://jira-6.cloudapp.net:8080/rest/api/2/issue/bulk',{
	headers:
	  {'content-type': 'application/json',
		authorization: 'Basic YWRtaW46YWRtaW4=' },
	body:
	{ issueUpdates: 
      [ { update: {},
          fields: 
           { project: { key: 'SMAS' },
             summary: 'b auto',
             priority: { name: 'Medium' },
             issuetype: { name: 'Bug' } } },
        { update: {},
          fields: 
           { project: { key: 'SMAS' },
             summary: 'story my first auto',
             priority: { name: 'Medium' },
             issuetype: { name: 'Story' } } } ] },
  	json: true });
