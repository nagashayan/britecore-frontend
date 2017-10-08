function Feature(data) {
    this.title = ko.observable(data.title);
}

function FeatureListViewModel() {
    // Data
    var self = this;
    self.title = "naga"
    self.features = ko.observable();
   
    // Load initial state from server, convert it to Feature instances, then populate self.Features
    $.getJSON("//127.0.0.1:5000/feature/", function(allData) {
        var mappedFeatures = $.map(allData, function(item) { return new Feature(item) });
        self.features(mappedFeatures);
    });    
}

ko.applyBindings(new FeatureListViewModel());