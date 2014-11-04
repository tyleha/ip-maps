IPAddresses = new Mongo.Collection("ipaddresses");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    ipaddresses: function () {
      return IPAddresses.find({});
    }
  });

  Template.body.events({
    "submit .new-ip": function (event) {
      // This function is called when the new IP address form is submitted
      var text = event.target.text.value;
      // Split entered IP addresses by comma
      var addresses = text.split(',');
      // For each bit of text separated by a comma,
      _.each(addresses, function(addr) {
        // parse, check ip address validity, and plot on the map
        IPMapper.parseAndPlotIPAddress(addr);
      });
      
      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    }
  });

  Template.iplist.events({
    // If someone clicks the delete button
    "click .delete": function () {
      IPAddresses.remove(this._id);
      // Re-initialize map to clear all markers (TODO: remove specific marker)
      IPMapper.initializeMap("map");
      // Plot each ip address still in the database
      var ips = IPAddresses.find().fetch();
      _.each(ips, function(ip) {
          // Already have serialized lat and lon - bypass parseAndPlot
          IPMapper.addIPMarker(ip.latitude, ip.longitude, ip.contentString);
      });
    }
  });

  Template.ipmap.rendered = function(){
    // If we haven't rendered the map before
    if (! Session.get('map'))
      IPMapper.initializeMap("map");
      Session.set('map', true)

    Deps.autorun(function() {
      // Iterate through the existing IP addresses and plot
      var ips = IPAddresses.find().fetch();
      _.each(ips, function(ip) {
        // Already have serialized lat and lon - bypass parseAndPlot
        IPMapper.addIPMarker(ip.latitude, ip.longitude, ip.contentString);
      });
    });
  }
  
} // end Client-side code


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
