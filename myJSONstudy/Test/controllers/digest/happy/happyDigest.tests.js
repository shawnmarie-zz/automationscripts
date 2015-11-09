var chai = require('chai'),
  should = chai.should(),
  sinon = require('sinon'),
  sinonChai = require('sinon-chai'),
  _ = require('underscore'),
  request = require('request'),
  uuid = require('uuid-v4'),
  EventStore = require('eventstore-client'),
  base = require('./lib/base');

 base.enableLogging(true);
 _.extend(global, base);
  _.extend(global, require("./testData.js");

chai.use(sinonChai);
chai.config.includeStack = true;

var key = "?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7";
var digestId = undefined;
var digestDescription = undefined;
var digestCount = undefined;

//****************************************************************
//
//          POST TESTS
//
//****************************************************************
describe('api/digests POST create a digest', function() {
  it('should return a 201 response with a body containing 4 elements', function(done) {
    request({
      uri: "http://localhost:6565/api/digests" + key,
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        "description": "Digest Happy 1"
      })
    }, function(err, res, body) {
      var digestIdCreated = JSON.parse(body).digestId;
      digestId = digestIdCreated;
      var expectedHeader = {
        "Location": "http://localhost:6565/api/digests/" + digestId,
        "Content-Type": "application/hal+json"};
      var expectedBody = {
          "_links": {
            "self": {
              "href": "http://localhost:6565/api/digests" + digestId
            },
            "digests": {
              "href": "http://localhost:6565/api/digests"
            },
            "inbox-create": {
              "href": "http://localhost:6565/api/inboxes",
              "method": "POST",
              "title": "Endpoint for creating an inbox for a repository on digest" + digestId +"."
            }
          },
          "digestId": digestId,
          };
      var actualHeader = JSON.parse(res.headers);
      var actualBody = JSON.parse(res.body);
      
      should.not.exist(err);
      res.statusCode.should.equal(201);
      digestIdCreated.should.exist; 
      actualHeader.should.deep.equal(expectedHeader);
      actualBody.should.deep.equal(expectedBody);     
      done();
    })
  });
});


//****************************************************************
//
//		    	GET TESTS 
//
//****************************************************************

//Get info about all digests for an API Key
describe('api/digests GET All Digests for Key', function() {
  before(function(done) {
    request({
      uri: "http://localhost:2113/streams/digests",
      headers: {
        'Authorization': 'Basic YWRtaW46Y2hhbmdlaXQ=',        
      },
      method: 'DELETE'
    }, function(err, res) {
      done();
    });
  });
  //Digest Happy - initial test
  it('should return a response header foramtted as hal+json and an empty array for no digests created.', function(done) {
    setTimeout(function() {
      request.get({
        uri: "http://localhost:6565/api/digests" + key,
        method: "GET"
      }, function(err, res) {
      	
      	var expectedHeader = {"content-type": "application/hal+json"};
        var expectedBody = {
          "_links": {
          "self": {
            "href": "http://localhost:6565/api/digests",
            }
          },
          "count": 0,
          "_embedded": {
            "digests": []
          }
        };
        var actualHeader = JSON.parse(res.headers);
       	var actualBody = JSON.parse(res.body);

       	should.not.exist(err);
       	res.statusCode.should.equal(200);
       	actualHeader.should.deep.equal(expectedHeader);
        actualBody.should.deep.equal(expectedBody);
        done();
      });
    }, 0);
  });
  //***TODO: need to create a digest - can i make this a BEFORE?
  it('create a digest', function(done) {
  	request({
      uri: "http://localhost:6565/api/digests/" + key,
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        "description": "Digest 1"
      })
    }, function(err, res, body) {
      should.not.exist(err);
      var digestIdCreated = JSON.parse(body).digestId;
      var digestDescrpCreated = JSON.parse(body).description;
      //urlToCreateInbox = JSON.parse(body)._links['inbox-create'].href;
      digestIdCreated.should.exist;
      digestDescrpCreated.should.exist;
      digestId = digestIdCreated;
      digestDescription = digestDescrpCreated;
      done();
    });
  });
  it('should return a response header as hal+json, a 200 statusCode, and a body with 5 elements.', function(done) {
  	request.get({
  		uri: "http://localhost:6565/api/digests"  + key,
  		method: "GET"
  	}, function(err, res) {
  		var expectedHeader = {"content-type": "application/hal+json"};
      var expectedBody = {
          "_links": {
          	"self": {
            	"href": "http://localhost:6565/api/digests"
          	}
          },
          "count": 1,
          "_embedded": {
          	"digests": [
          		{
          			"_links": {
          					"self": {"href": "http://localhost:6565/api/digests/" + digestId}
          			},
          			"digestId": digestId,
          			"description": digestDescription
          		}
          	]
          }
      };
      var actualHeader = JSON.parse(res.headers);
     	var actualBody = JSON.parse(res.body);

     	should.not.exist(err);
     	res.statusCode.should.equal(200);
     	actualHeader.should.deep.equal(expectedHeader);
      actualBody.should.deep.equal(expectedBody);
      done();
  	});
	});
});

//Get info about a particular digest for an api key
describe('api/digests/digestId GET A single Digest ', function(done) {
	it('should return a response header as hal+json, a 200 statusCode, and a body with 5 elements', function(done) {
		request.get({
			uri: "http://localhost:6565/api/digests/" + digestId + key,
			method: "GET"
		}, function(err, res) {
			var expectedHeader = {"content-type": "application/hal+json"};
			var expectedBody = {
          "_links": {
          	"self": {
            	"href": "http://localhost:6565/api/digests",
            },
           "digests": {
           		"href": "http://localhost:6565/api/digests" 
           },
           "inbox-create": {
           		"href": "http://localhost:6565/api/inboxes",
           		"method": "POST",
           		"title": "Endpoint for creating an inbox for a repository on digest " + digestId + "."
           },
           "inboxes": {
           		"href": "http://localhost:6565/api/digests/" + digestId + "/inboxes"
            }
          },
         	"description": digestDescription,
         	"digestId": digestId
          };
      var actualHeader = JSON.parse(res.headers);
     	var actualBody = JSON.parse(res.body);

     	should.not.exist(err);
     	res.statusCode.should.equal(200);
     	actualHeader.should.deep.equal(expectedHeader);
      actualBody.should.deep.equal(expectedBody);
      done();  
		});
	});
}); //closes describe



