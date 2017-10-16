//initializing feature model
function Feature(data) {
    console.log(data.description);
    this.client_id = ko.observable(data.client_id);
    this.title = ko.observable(data.title);
    this.description = ko.observable(data.description);
    this.product_area = ko.observable(data.product_area);
    this.target_date = ko.observable(data.target_date);
}

//feature view model 
function FeatureListViewModel() {
    // Data
    var self = this;
    //which is binded to list of values shown on UI
    self.features = ko.observableArray([]);
    self.subModule = ko.observableArray([]);
    //fields binding for form
    self.newclient_id = ko.observable();
    self.newtitle = ko.observable();
    self.newdescription = ko.observable();
    self.newproduct_area = ko.observable();
    self.newtarget_date = ko.observable();
    self.editFeature = ko.observable()

    //button visibility binding
    self.updateForm = ko.observable(false);

    // Load initial state from server, convert it to Feature instances, then populate self.Features
    $.getJSON("//127.0.0.1:5000/feature/", function (allData) {
        var mappedFeatures = $.map(allData, function (item) {
            var tempFeature = new Feature(item);
            // formatting date similar to input
            var tempdate = new Date(tempFeature.target_date());
            tempFeature.target_date = tempdate.getMonth() + "/" + tempdate.getDate() + "/" + tempdate.getFullYear();
            return tempFeature;
        });
        console.log(mappedFeatures);
        self.features(mappedFeatures);
    });

    //save and adding feature to frontend and make backend call to server
    // Operations
    self.addFeature = function () {

        $.ajax("//127.0.0.1:5000/feature/", {
            data: ko.toJSON({
                "client_id": parseInt(this.newclient_id()),
                "title": this.newtitle(),
                "description": this.newdescription(),
                "product_area": this.newproduct_area(),
                "target_date": this.newtarget_date(),
            }),
            type: "post",
            contentType: "application/json",
            success: function (result) {
                console.log(result);
                self.features.push(result);
                //clear form after adding
                self.newclient_id("");
                self.newtitle("");
                self.newdescription("");
                self.newproduct_area("");
                self.newtarget_date("");
            },
            error: function (err) {
                // if form was not saved throw and log error
                alert("Error: Data was not saved! Try again" + err.responseText);
                console.log(err.responseText);
            }

        });

    };
    //make backend call and update feature once user clicks on update button below form.
    self.updateBackend = function (feature) {
        console.log("updating backend");

        //make call to backend on success destroy on frontend
        if (feature.newclient_id()) {
            $.ajax("//127.0.0.1:5000/feature/" + feature.newclient_id(), {
                data: ko.toJSON({
                    "client_id": parseInt(feature.newclient_id()),
                    "title": feature.newtitle(),
                    "description": feature.newdescription(),
                    "product_area": feature.newproduct_area(),
                    "target_date": feature.newtarget_date(),
                }),
                type: "PUT",
                contentType: "application/json",
                success: function (result) {
                    console.log(result);
                    self.editFeature().client_id(self.newclient_id());
                    self.editFeature().title(self.newtitle());
                    self.editFeature().description(self.newdescription());
                    self.editFeature().product_area(self.newproduct_area());
                    self.editFeature().target_date(self.newtarget_date());

                },
                error: function (err) {
                    // if form was not saved throw and log error
                    alert("Error: Updating was not successfull! Try again");
                    console.log(err.responseText);
                }
            });
        } else {
            alert("something went wrong!");
        }
        self.cancelUpdate();
    };
    //loads form with current  record data
    //once the user clicks on update button next to record
    self.updateFeature = function (feature) {
        console.log(feature);
        self.editFeature(feature);
        self.newclient_id(feature.client_id());
        self.newtitle(feature.title());
        self.newdescription(feature.description());
        self.newproduct_area(feature.product_area());

        //format date according to date widget
        var tempdate = new Date(feature.target_date);
        //feature.target_date = tempdate.getFullYear() + "-" + tempdate.getMonth() + "-" + tempdate.getDate();
        self.newtarget_date(self.getFormattedDate(tempdate));
        self.updateForm(true);


    };
    //deletes the future
    //waits for backend confirmation and then destroys frontend feature
    self.removeFeature = function (feature) {
        console.log(feature);
        //make call to backend on success destroy on frontend
        if (feature.client_id()) {
            $.ajax("//127.0.0.1:5000/feature/" + feature.client_id(), {

                type: "delete",
                success: function (result) {
                    console.log(result);
                    if (result.message == "feature " + feature.client_id() + " deleted successfully") {
                        self.features.destroy(feature);
                    } else {
                        alert("Error: Deleting was not successfull! Try again");
                        console.log(result.message);
                    }

                },
                error: function (err) {
                    // if form was not saved throw and log error
                    alert("Error: Deleting was not successfull! Try again");
                    console.log(err.responseText);
                }


            });
        } else {
            alert("something not wrong");
        }

    };

    self.clearForm = function () {
        //clear form after adding
        self.newclient_id("");
        self.newtitle("");
        self.newdescription("");
        self.newproduct_area("");
        self.newtarget_date("");
    };

    // if user clicks on cancel before clicking save/update button
    self.cancelUpdate = function () {
        console.log("cancelling form");
        self.updateForm(false);
        self.clearForm();

    };
    // format date in MM-dd-yyyy
    self.getFormattedDate = function (date) {
        var year = date.getFullYear();

        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return year + '-' + month + '-' + day;
    };
}

$(document).ready(function () {
    //initial binding
    ko.applyBindings(new FeatureListViewModel());
});