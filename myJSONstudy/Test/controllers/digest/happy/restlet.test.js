var restlet = require("restlet");
var clientResource = new restlet.resource.ClientResource("http://versionone.com");
clientResource.get(function(representation) {
    var content = representation.getText();
    console.log(content);
    })