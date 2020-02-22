$(document).ready(function() {
  $('#updateStatus').click(function() {
    location.reload(true);
  });
  // If you want to use this code for your own underground status app, please register for a different App ID & API key at https://api-portal.tfl.gov.uk/login, and insert the details in the line below.
  var app_id = "INSERT APP ID";
  var app_key = "INSERT APP API KEY";
  $.ajax({
    type: 'GET',
    url: 'https://api.tfl.gov.uk/Line/Mode/tube,overground,dlr,tflrail,tram/Status?detail=False&app_id=' + app_id + '&app_key=' + app_key,
    success: function(data) {
      // console.log(data);
      $.each(data, function(index, element) {
        //Get the time of the latest update
        document.getElementById("time").innerHTML = Date();
        //Get the name of each line, and change the background of the div depending on the result of the line
        var lineName = element.name;
        // Remove the spaces and ampersands from names, so they match the CSS
        var lineFixed = lineName.replace(/ |&/g, "_");
        // console.log(lineFixed);
        var lineDisplay = "<div class='top-buffer col-xs-6 col-sm-5 col-md-4 col-lg-3 col-sm-offset-1 col-md-offset-2 col-lg-offset-3 " + lineFixed + "' id='" + lineFixed + "'>" + "<h4>" + element.name + "</h4>";
        // console.log(lineDisplay);
        // Check the line status from the JSON, and change the background colour of the div depending on the result
        var lineStatus = element.lineStatuses[0].statusSeverityDescription;
        //var lineStatus = "Minor Delays";
        var statusColour = "";
        if (lineStatus == "Good Service") {
          statusColour = "<div class='top-buffer text-center col-xs-6 col-sm-5 col-md-4 col-lg-3 goodService'><h4>";
        } else if (lineStatus == "Minor Delays") {
          statusColour = "<div class='top-buffer text-center col-xs-6 col-sm-5 col-md-4 col-lg-3 minorAlert delayedService'><h4>";
        } else if (lineStatus == "Reduced Service") {
          statusColour = "<div class='top-buffer text-center col-xs-6 col-sm-5 col-md-4 col-lg-3 minorAlert reducedService'><h4>";
        } else if (lineStatus == "Suspended") {
          statusColour = "<div class='top-buffer text-center col-xs-6 col-sm-5 col-md-4 col-lg-3 majorAlert closedService'><h4>";
        } else {
          statusColour = "<div class='top-buffer text-center col-xs-6 col-sm-5 col-md-4 col-lg-3 majorAlert suspendedService'><h4>";
        }

        // Get the reason for the closure/delay, remove the name from the front, then store it as closureReason
        var closureReason = "";
        if (element.lineStatuses[0].reason) {
          var reason = element.lineStatuses[0].reason;
          closureReason = reason;
        } else {
          closureReason = "Good Service reported on the " + element.name + " line";
        }

        // Variable settings
        var lineStatusButton = "";
        var lineInformationDisplay = "";

        // This gives each info div a unique name based on the line name
        var lineInfoDiv = lineFixed + "Modal";

        // I got all official, and set the colours for alerts to match TFL standards, as listed here: http://content.tfl.gov.uk/tfl-colour-standards-issue04.pdf
        var tflGreen = "rgb(0, 125, 50)";
        var tflYellow = "rgb(255, 211, 41)";
        var tflRed = "rgb(220, 36, 31)";
        var tflBlue = "rgb(0, 96, 168)";

        // Code reducing variables, since most are shared by each line, divided by alert severity of goodService, minorAlert, majorAlert and extremeAlert
        var goodService = "<button type='button' class='btn btn-link btn-lg btn-block' data-toggle='modal' data-target='#" + lineInfoDiv + "'><h4>" + lineStatus + "</h4></button>";
        var minorAlert = "<button type='button' class='btn btn-link btn-lg btn-block' data-toggle='modal' data-target='#" + lineInfoDiv + "'><h4><span style='color: " + tflYellow + "'><i class='fas fa-exclamation-triangle fa-2x animate-flicker' style='vertical-align: middle;'></i></span> " + lineStatus + "</h4></button>";
        var majorAlert = "<button type='button' class='btn btn-link btn-lg btn-block' data-toggle='modal' data-target='#" + lineInfoDiv + "'><h4><span style='color: " + tflRed + "'><i class='fas fa-exclamation-triangle fa-2x animate-flicker' style='vertical-align: middle;'></i></span> " + lineStatus + "</h4></button>";
        var extremeAlert = "<button type='button' class='btn btn-link btn-lg btn-block' data-toggle='modal' data-target='#" + lineInfoDiv + "'><h4><span style='color: " + tflRed + "'><i class='fas fa-ban fa-2x animate-flicker' style='vertical-align: middle;'></i></span> " + lineStatus + "</h4></button>";
        var lineStatusModal = "<div id='" + lineInfoDiv + "' class='modal fade' role='dialog'><div class='modal-dialog'><div class='modal-content'><div class='modal-header " + lineFixed + "'><h3 class='modal-title'>" + lineName + "</h3></div><div class='modal-body'><p>" + closureReason + "</p></div><div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>Close</button></div></div></div>";

        // Now, we start seeing what each line has said, and use the appropriate display mode set above. The last one gets any lineStatus return that doesn't match, and I'd have to add a new line to suit in the future
        if (lineStatus == "Suspended") {
          lineStatusButton = extremeAlert;
          lineInformationDisplay = lineStatusModal;
        } else if (lineStatus == "Part Suspended") {
          lineStatusButton = majorAlert;
          lineInformationDisplay = lineStatusModal;
        } else if (lineStatus == "Planned Closure") {
          lineStatusButton = extremeAlert;
          lineInformationDisplay = lineStatusModal;
        } else if (lineStatus == "Part Closure") {
          lineStatusButton = majorAlert;
          lineInformationDisplay = lineStatusModal;
        } else if (lineStatus == "Severe Delays") {
          lineStatusButton = majorAlert;
          lineInformationDisplay = lineStatusModal;
        } else if (lineStatus == "Reduced Service") {
          lineStatusButton = minorAlert;
          lineInformationDisplay = lineStatusModal;
        } else if (lineStatus == "Minor Delays") {
          lineStatusButton = minorAlert;
          lineInformationDisplay = lineStatusModal;
        } else if (lineStatus == "Special Service") {
          lineStatusButton = minorAlert;
          lineInformationDisplay = lineStatusModal;
        } else if (lineStatus == "Good Service") {
          lineStatusButton = goodService;
          lineInformationDisplay = lineStatusModal;
        } else if (lineStatus == "Service Closed") {
          lineStatusButton = extremeAlert;
          lineInformationDisplay = lineStatusModal;
        } else {
          lineStatusButton = "Information Unavailable";
          lineInformationDisplay = "<div id='" + lineInfoDiv + "' class='modal fade' role='dialog'><div class='modal-dialog'><div class='modal-content'><div class='modal-header " + lineFixed + "'><h3 class='modal-title'>" + lineName + "</h3></div><div class='modal-body'><p><strong>Congratulations! You've found a bug!</strong></p><p>Sadly, sometimes TFL have tags I haven't seen before. If you see this message, please drop me an email at <a href='mailto:development@newsworthyvision.com' target='_blank'>development@newsworthyvision.com</a>, along with the following information please:</p><p>Line = " + lineFixed + "<br>lineStatus = " + lineStatus + "<br>closureReason = " + closureReason + "</p></div><div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>Close</button></div></div></div>";
        }
        // This line adds to the HTML for the page with the information gathered above, and then the whole process starts again until the TFL API data has been exhausted
        $("#content").append("<div class='row row-eq-height'>" + lineDisplay + "</div>" + statusColour + lineStatusButton + "</div>" + lineInformationDisplay);
      });
    }
  });

});
