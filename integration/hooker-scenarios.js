var request = require('request');

var quay_example = {
  "name": "mov3y-spa-www",
  "repository": "mag3llan/mov3y-spa-www",
  "namespace": "mag3llan",
  "docker_url": "quay.io/mag3llan/mov3y-spa-www",
  "visibility": "private",
  "homepage": "https://quay.io/repository/mag3llan/mov3y-spa-www",
  "updated_tags": {
    "develop.255": "fc031c925349c6581721ac9f528229a293a0f1f6f9181d8e19f6355209d6f209"
  }
}

describe('hook3r', function() {
  before(function(){
    // The before() callback gets run before all tests in the suite. Do one-time setup here.
  });
  
  beforeEach(function(){
    // The beforeEach() callback gets run before each test in the suite.
  });
  
  it('does x when y', function(){
    // Now... Test!
  });
  
  after(function() {
  	// after() is run after all your tests have completed. Do teardown here.
  });
});