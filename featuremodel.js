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
   
    //fields binding for form
    self.newclient_id = ko.observable();
    self.newtitle = ko.observable();
    self.newdescription = ko.observable();
    self.newproduct_area = ko.observable();
    self.newtarget_date = ko.observable();

    // Load initial state from server, convert it to Feature instances, then populate self.Features
    $.getJSON("//127.0.0.1:5000/feature/", function(allData) {
        var mappedFeatures = $.map(allData, function(item) { return new Feature(item) });
        console.log(mappedFeatures);
        self.features(mappedFeatures);
    });    

    //save and adding feature to frontend and make backend call to server
     // Operations
     self.addFeature = function() {
       
        $.ajax("//127.0.0.1:5000/feature/", {
            data: ko.toJSON( 
                {	"client_id":parseInt(this.newclient_id()),
                "title": this.newtitle(),
                "description": this.newdescription(),
                "product_area": this.newproduct_area(),
                "target_date":this.newtarget_date(),
                }),
            type: "post", contentType: "application/json",
            success: function(result) 
            {   console.log(result);
                self.features.push(result);
                //clear form after adding
                self.newclient_id("");
                self.newtitle("");
                self.newdescription("");
                self.newproduct_area("");
                self.newtarget_date("");
            },
            error: function(err){
                // if form was not saved throw and log error
                alert("Error: Data was not saved! Try again" + err.responseText);
                console.log(err.responseText);
            }

        });
        
    };
   
}

ko.applyBindings(new FeatureListViewModel());