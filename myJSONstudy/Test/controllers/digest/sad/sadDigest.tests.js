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
var badKey = "?key=998bbbc8-6e04-449b-9e66-56fb72cf11e6";
var badDigestId = "15d45b1a-f2b8-45af-91d6-db5076d87e10";
var digestId = undefined;
var digestDescription = undefined;
var digestCount = undefined;

//****************************************************************
//
//        POST TESTS 
//  missing Internal error tests when ES or CS fails
//****************************************************************

describe('api/digests POST create a digest', function() {
  it('should return a 401 response when request is made without a Key', function(done) {
    request({
      uri: "http://localhost:6565/api/digests",
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        "description": "Digest Sad 1"
      })
    }, function(err, res, body) {
      var expectedHeader = {"Content-Type": "application/json"};
      var expectedBody = {
        "errors": "API key parameter missing or invalid." 
        };
      var actualHeader = JSON.parse(res.headers);
      var actualBody = JSON.parse(res.body);

      should.not.exist(err);
      res.statusCode.should.equal(401);
      actualHeader.should.deep.equal(expectedHeader);
      actualBody.should.deep.equal(expectedBody);
      done();
    })
  });
  it('should return a 415 response when request is made without header', function(done) {
    request({
      uri: "http://localhost:6565/api/digests" + key,
      method: "POST",
      body: JSON.stringify({
        "description": "Digest Sad 1"
      })
    }, function(err, res, body) {
      var expectedHeader = {"Content-Type": "application/json"};
      var expectedBody = {
        "errors": "When creating a digest, you must send a Content-Type: application/json header." 
        };
      var actualHeader = JSON.parse(res.headers);
      var actualBody = JSON.parse(res.body);

      should.not.exist(err);
      res.statusCode.should.equal(415);
      actualHeader.should.deep.equal(expectedHeader);
      actualBody.should.deep.equal(expectedBody);
      done();
    })
  });
  it('should return 400 response when request is made with no description in body', function(done) {
    request({
      uri: "http://localhost:6565/api/digests" + key,
      method: "POST",
      headers: {
        "content-type": "application/json"
      }
    }, function(err, res, body) {
      var expectedHeader = {"Content-Type": "application/json"};
      var expectedBody = {
        "errors": "A digest must contain a description." 
        };
      var actualHeader = JSON.parse(res.headers);
      var actualBody = JSON.parse(res.body);

      should.not.exist(err);
      res.statusCode.should.equal(400);
      actualHeader.should.deep.equal(expectedHeader);
      actualBody.should.deep.equal(expectedBody);
      done();
    })
  });
  it('should return 400 response when request is made with a blank description in body', function(done) {
    request({
      uri: "http://localhost:6565/api/digests" + key,
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        "description": ""
      })
    }, function(err, res, body) {
      var expectedHeader = {"Content-Type": "application/json"};
      var expectedBody = {
        "errors": "A digest description must contain a value." 
        };
      var actualHeader = JSON.parse(res.headers);
      var actualBody = JSON.parse(res.body);

      should.not.exist(err);
      res.statusCode.should.equal(400);
      actualHeader.should.deep.equal(expectedHeader);
      actualBody.should.deep.equal(expectedBody);
      done();
    })
  });
  it('should return 400 response when request is made with a null description in body', function(done) {
    request({
      uri: "http://localhost:6565/api/digests" + key,
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        "description": null
      })
    }, function(err, res, body) {
      var expectedHeader = {"Content-Type": "application/json"};
      var expectedBody = {
        "errors": "A digest description must not be null." 
        };
      var actualHeader = JSON.parse(res.headers);
      var actualBody = JSON.parse(res.body);

      should.not.exist(err);
      res.statusCode.should.equal(400);
      actualHeader.should.deep.equal(expectedHeader);
      actualBody.should.deep.equal(expectedBody);
      done();
    })
  });
});

//****************************************************************
//
//				GET TESTS 
//	missing Internal error tests when ES or CS fails
//****************************************************************

describe('api/digests/ GET A single digest for Key', function() {
  //***TODO: need to create a digest - can i make this a BEFORE?
  it('create a digest', function(done) {
    request({
      uri: "http://localhost:6565/api/digests/" + key,
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        description: "Digest Sad 1"
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
    })
  });
  it('should return error when request is made with incorrect digestId but correct Key', function(done) {
    request.get({
      uri: "http://localhost:6565/api/digests/" + badDigestId + key,
      method: "GET"
      }, function(err, res, body) {
        var expectedHeader = {"content-type": "application/json"};
      var expectedBody = {
        "errors": "Could not find a digest with id " + badDigestId 
        };
      var actualHeader = JSON.parse(res.headers);
      var actualBody = JSON.parse(res.body);

      should.not.exist(err);
      res.statusCode.should.equal(404);
      actualHeader.should.deep.equal(expectedHeader);
      actualBody.should.deep.equal(expectedBody);
      done();
    })
  });
  it('should return error when request is made with valid digestId but incorrect Key', function(done) {
    request.get({
      uri: "http://localhost:6565/api/digests/" + digestId + badKey,
      method: "GET"
      }, function(err, res, body) {
      var expectedHeader = {"content-type": "application/json"};
      var expectedBody = {
        "errors": "API key parameter missing or invalid." 
        };
      var actualHeader = JSON.parse(res.headers);
      var actualBody = JSON.parse(res.body);

      should.not.exist(err);
      res.statusCode.should.equal(401);
      actualHeader.should.deep.equal(expectedHeader);
      actualBody.should.deep.equal(expectedBody);
      done();
    })
  });
  it('should return error when request is made with incorrect digestId and incorrect Key', function(done) {
    request.get({
      uri: "http://localhost:6565/api/digests/" + badDigestId + badKey,
      method: "GET"
      }, function(err, res, body) {
        var expectedHeader = {"content-type": "application/json"};
      var expectedBody = {
        "errors": "API key parameter missing or invalid." 
        };
      var actualHeader = JSON.parse(res.headers);
      var actualBody = JSON.parse(res.body);

      should.not.exist(err);
      res.statusCode.should.equal(401);
      actualHeader.should.deep.equal(expectedHeader);
      actualBody.should.deep.equal(expectedBody);
      done();
    })
  });
  it('should return error when request is made with valid digestId but NO Key', function(done) {
    request.get({
      uri: "http://localhost:6565/api/digests/" + digestId,
      method: "GET"
      }, function(err, res, body) {
        var expectedHeader = {"content-type": "application/json"};
      var expectedBody = {
        "errors": "API key parameter missing or invalid." 
        };
      var actualHeader = JSON.parse(res.headers);
      var actualBody = JSON.parse(res.body);

      should.not.exist(err);
      res.statusCode.should.equal(401);
      actualHeader.should.deep.equal(expectedHeader);
      actualBody.should.deep.equal(expectedBody);
      done();
    })
  });
  it('should return 200 response and list of all digests when request is made with NO digestId but correct Key', function(done) {
    request.get({
      uri: "http://localhost:6565/api/digests/" + key,
      method: "GET"
      }, function(err, res, body) {
        var expectedHeader = {"content-type": "application/json"};
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
    })
  });
});

describe('api/digests GET All Digests for Key ', function() {
  it('should return error message with 401 Unauthorized response when request is made without a key.', function(done) {
    request.get({
      uri: "http://localhost:6565/api/digests?workitem=S-11111",
      method: "GET"
    }, function(err, res, body) {
    	var expectedHeader = {"content-type": "application/json"};
    	var expectedBody = {
    		"errors": "API key parameter missing or invalid."
    		};
    	var actualHeader = JSON.parse(res.headers);
     	var actualBody = JSON.parse(res.body);

      should.not.exist(err);
      res.statusCode.should.equal(401);
      actualHeader.should.deep.equal(expectedHeader);
      actualBody.should.deep.equal(expectedBody);
      done();
    })
  });
  it('should return error when request is made with incorrect key.', function(done) {
    request.get({
      uri: "http://localhost:6565/api/digests" + badKey,
      method: "GET"
    }, function(err, res, body) {
    		var expectedHeader = {"content-type": "application/json"};
    	var expectedBody = {
    		"errors": "API key parameter missing or invalid."
    		};
    	var actualHeader = JSON.parse(res.headers);
     	var actualBody = JSON.parse(res.body);

      should.not.exist(err);
      res.statusCode.should.equal(401);
      actualHeader.should.deep.equal(expectedHeader);
      actualBody.should.deep.equal(expectedBody);
      done();
    })
  });
});
