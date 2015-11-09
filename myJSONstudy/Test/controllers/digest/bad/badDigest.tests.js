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

//****************************************************************
//
//          POST TESTS
//
//****************************************************************
describe('api/digests POST create a digest', function() {
  it('should return a 401 response when a request is made with a non-UUID Key', function(done) {
    request({
      uri: "http://localhost:6565/api/digests?key=mississippi" ,
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        "description": "Digest Bad 1"
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
  it('should return a 415 response when request is made with invalid Content-Type header', function(done) {
    request({
      uri: "http://localhost:6565/api/digests" + key ,
      method: "POST",
      headers: {
        "content-type": "application/javascript"
      },
      body: JSON.stringify({
        "description": "Digest Bad 1"
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
  it('should return a 400 response when request is made with Description in body rather than description in body', function(done) {
    request({
      uri: "http://localhost:6565/api/digests" + key ,
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        "Description": "Digest Bad 1"
      })
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
  it('should return 400 response when request is made with script tags in the description in body', function(done) {
    request({
      uri: "http://localhost:6565/api/digests" + key ,
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
         "description": "<script>var x = 123; alert(x);</script>"
      })
    }, function(err, res, body) {
      var expectedHeader = {"Content-Type": "application/json"};
      var expectedBody = {
        "errors": "A digest description cannot contain script tags or HTML."    
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
  it('should return 400 response when request is made with HTML tags in the description in body', function(done) {
    request({
      uri: "http://localhost:6565/api/digests" + key ,
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
         "description": "<html>var x = 123; alert(x);</html>"
      })
    }, function(err, res, body) {
      var expectedHeader = {"Content-Type": "application/json"};
      var expectedBody = {
        "errors": "A digest description cannot contain script tags or HTML."    
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
  it('should return 400 response when request is made without literal word description prefix in body', function(done) {
    request({
      uri: "http://localhost:6565/api/digests" + key ,
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
         "testing it out"
      })
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
  it('should return 400 response when request is made with description greater than 140 characters in body', function(done) {
    request({
      uri: "http://localhost:6565/api/digests" + key ,
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
         { "description": "Digest 47lkjiou987876678687687687678687678iuyiuyiuy98797899887979798798798798uouoiiu9898798798798987ouoiuiou987909809piplrtyui8765wsqrgbj890k"
      })
    }, function(err, res, body) {
      var expectedHeader = {"Content-Type": "application/json"};
      //TODO: need to be able to count characters in description name for test
      var expectedBody = {
        "errors": "A digest description cannot contain more than 140 characters. The description you submitted contains 141 characters."    
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
//				  GET TESTS
//
//****************************************************************

describe('api/digests/ GET A single digest for a Key ', function() {
  it('should return an error with a non-UUID digestId and corret Key', function(done) {
    request.get({
      uri: "http://localhost:6565/api/digests/mississippi" + key,
      method: "GET"
    }, function(err, res, body) {
        var expectedHeader = {"content-type": "application/json"};
      var expectedBody = {
        "errors": "The value \"mississippi\" is not recognized as a valid digest identifier."
        };
      var actualHeader = JSON.parse(res.headers);
      var actualBody = JSON.parse(res.body);

      should.not.exist(err);
      actualHeader.should.deep.equal(expectedHeader);
      actualBody.should.deep.equal(expectedBody);
      done();
    })
  });
  it('should return error when request is made with a valid digestId but non-UUID Key', function(done) {
    request.get({
      uri: "http://localhost:6565/api/digests/mississippi" + key,
      method: "GET"
    }, function(err, res, body) {
        var expectedHeader = {"content-type": "application/json"};
      var expectedBody = {
        "errors": "API key parameter missing or invalid."
        };
      var actualHeader = JSON.parse(res.headers);
      var actualBody = JSON.parse(res.body);

      should.not.exist(err);
      actualHeader.should.deep.equal(expectedHeader);
      actualBody.should.deep.equal(expectedBody);
      done();
    })
  });
});


describe('api/digests GET All Digests for Key ', function() {
  it('should return error when request is made with an non-UUID key.', function(done) {
    request.get({
      uri: "http://localhost:6565/api/digests?key=mississippi",
      method: "GET"
    }, function(err, res, body) {
    		var expectedHeader = {"content-type": "application/json"};
    	var expectedBody = {
    		"errors": "API key parameter missing or invalid."
    		};
    	var actualHeader = JSON.parse(res.headers);
     	var actualBody = JSON.parse(res.body);

      should.not.exist(err);
      actualHeader.should.deep.equal(expectedHeader);
      actualBody.should.deep.equal(expectedBody);
      done();
    })
  });
});