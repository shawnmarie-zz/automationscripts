var request = require("request");

var date = new Date();
var currentDateTime = date.getDay();
var options = { method: 'POST',
  url: 'http://jira-7.cloudapp.net:8080/rest/api/2/issue/bulk',
  headers: 
   { 'postman-token': '342f4e63-cee5-99f6-a49f-60ad05a04559',
     'cache-control': 'no-cache',
     'content-type': 'application/json',
     authorization: 'Basic YWRtaW46YWRtaW4=' },
  body: 
   { issueUpdates: 
      [ { update: {},
          fields: 
           { project: { key: 'TS' },
             summary: 'Bug  the first' ,
             description: 'this is one nutty thing',
             priority: { name: 'Lowest' },
             issuetype: { name: 'Bug' },
             assignee: {name: 'samantha'} 
         	} 
         },
        { update: {},
          fields: 
           { project: { key: 'TS' },
             summary: 'Bug  the second' ,
             description: 'this is bugger of a bug',
             priority: { name: 'Low' },
             issuetype: { name: 'Bug' },
             assignee: {name: 'samantha'} 
         	} 
         },
         { update: {},
          fields: 
           { project: { key: 'TS' },
             summary: 'Bug  the third' ,
             description: 'once upon an application, there appeared a might BUG',
             priority: { name: 'Highest' },
             issuetype: { name: 'Bug' },
             assignee: {name: 'samantha'} 
         	} 
         },
         { update: {},
          fields: 
           { project: { key: 'TS' },
             summary: 'Bug  the fourth' ,
             description: 'A pie-maker, with the power to bring dead people back to life, solves murder mysteries with his alive-again childhood sweetheart, a cynical private investigator, and a lovesick waitress.',
             priority: { name: 'High' },
             issuetype: { name: 'Bug' },
             assignee: {name: 'samantha'} 
         	} 
         },

        { update: {},
          fields: 
           { project: { key: 'TS' },
             summary: 'story aon',
             description: 'this is a tale of two kitties',
             priority: { name: 'Highest' },
             assignee: { name: 'samantha'},
             issuetype: { name: 'Story' } 
         	} 
         },
         { update: {},
          fields: 
           { project: { key: 'TS' },
             summary: 'story do',
             description: 'whomsoever shall be found without a soul for getting down...',
             priority: { name: 'Highest' },
             assignee: { name: 'samantha'},
             issuetype: { name: 'Story' } 
         	} 
         },
         { update: {},
          fields: 
           { project: { key: 'TS' },
             summary: 'story tri',
             description: 'an olann tu tae?',
             priority: { name: 'Highest' },
             assignee: { name: 'samantha'},
             issuetype: { name: 'Story' } 
         	} 
         },
         { update: {},
          fields: 
           { project: { key: 'TS' },
             summary: 'story ceathair',
             description: 'Saolaitear na daoine uile saor agus comhionann ina ndinit agus ina gcearta.',
             priority: { name: 'Highest' },
             assignee: { name: 'samantha'},
             issuetype: { name: 'Story' } 
         	} 
         },    
      ] 
  },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
