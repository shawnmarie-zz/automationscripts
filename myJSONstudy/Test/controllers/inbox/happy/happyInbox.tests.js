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
var inboxId = undefined;

//****************************************************************
//
//          TEST INITIALIZE
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
    	var inboxIdCreated = JSON.parse(body).inboxId;
    	inboxId = inboxIdCreated;
      var expectedHeader = {
        "Location": "http://localhost:6565/api/inboxes/" + inboxId,
        "Content-Type": "application/hal+json"};
      var expectedBody = {
          "_links": {
            "self": {
              "href": "http://localhost:6565/api/inboxes/" + inboxId
            },
            "add-commit": {
              "href": "http://localhost:6565/api/inboxes/" + inboxId + "/commits"              
            }
          },
          "inboxId": inboxId,
          };
      var actualHeader = JSON.parse(res.headers);
      var actualBody = JSON.parse(res.body);      

      should.not.exist(err);
      res.statusCode.should.equal(201);
      digestIdCreated.should.exist;
      digestId = digestIdCreated;
      actualHeader.should.deep.equal(expectedHeader);
      actualBody.should.deep.equal(expectedBody); 
      done();
    })
  });
});


//****************************************************************
//
//          POST TESTS
//
//****************************************************************
describe('api/inboxes POST create an inbox', function() {
	it('should return a 201 response with a body containing 3 elements', function(done) {
		request({
      uri: "http://localhost:6565/api/inbxoes" + key,
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        "digestId": digestId,
        "family": "Github",
        "name": "this is my first inbox!",
        //TODO: need to find a way to test url field for invalid data
        "url": "http://github.com/somewhereovertherainbow"
      })
    }, function(err, res, body) {
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
      var digestIdCreated = JSON.parse(body).digestId;

      should.not.exist(err);
      res.statusCode.should.equal(201);      
      inboxIdCreated.should.exist; 
      actualHeader.should.deep.equal(expectedHeader);
      actualBody.should.deep.equal(expectedBody); 
      done();
    })
	});
});
