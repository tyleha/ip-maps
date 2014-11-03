Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      return Tasks.find({});
    }
  });

  Template.body.events({
    "submit .new-task": function (event) {
      // This function is called when the new task form is submitted

      var text = event.target.text.value;

      IPMapper.parseAndPlotIPAddress(text);
      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    }
  });

  Template.task.events({
    "click .delete": function () {
      Tasks.remove(this._id);
      
      IPMapper.initializeMap("map");
      var ips = Tasks.find().fetch();
      _.each(ips, function(ip) {
          IPMapper.addIPMarker(ip.latitude, ip.longitude, ip.contentString);
      });
    }
  });

  Template.ipmap.rendered = function(){

    if (! Session.get('map'))
      IPMapper.initializeMap("map");

    // Deps.autorun(function() {
      // Iterate through the existing IP addresses and plot
      // var locs = ["11.11.11.11", "8.8.8.8"];
      // Meteor.subscribe("tasks")
      var ips = Tasks.find().fetch();
      _.each(ips, function(ip) {
        IPMapper.addIPMarker(ip.latitude, ip.longitude, ip.contentString);
      });
    // });
  }


  // Template.ipinput.events({
  //   'click button':function(ip) {
  //     }
  // });

  
} // end Client code



if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
