function Feature(data) {
    console.log(data.description);
    this.client_id = ko.observable(data.client_id);
    this.title = ko.observable(data.title);
    this.description = ko.observable(data.description);
    this.product_area = ko.observable(data.product_area);
    this.target_date = ko.observable(data.target_date);
}

function FeatureListViewModel() {
    // Data
    var self = this;
    
    self.features = ko.observable();
   
    // Load initial state from server, convert it to Feature instances, then populate self.Features
    $.getJSON("//127.0.0.1:5000/feature/", function(allData) {
        var mappedFeatures = $.map(allData, function(item) { return new Feature(item) });
        console.log(mappedFeatures);
        self.features(mappedFeatures);
    });    
}

ko.applyBindings(new FeatureListViewModel());