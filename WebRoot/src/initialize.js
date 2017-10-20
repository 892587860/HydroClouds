function initialize() {
	//激活Knockout
    ko.applyBindings(viewModel);

    var data = [];

    viewModel.time.start(new Date(2014,1,1));
    viewModel.time.end(new Date(2015,1,1));
    viewModel.time.recent("90");
    //显式订阅,这里当有值加入到dataArray中时，就会调用plotGraph()画//折线图的方法
    viewModel.dataArray.subscribe(function(newValue) {
        //console.log("plotGraph() called with new value added to dataArray.");
        viewModel.plotGraph();
    });

    //console.log("Initial value of requestData parameters: ");
    //console.log(viewModel.siteId());
    //console.log(viewModel.siteName());
    //console.log("setting viewModel values.");
    //初始化数据
    viewModel.siteId("dv01580000");
    var source = 'USGS-DV';
    viewModel.siteName("Deer Creek at Rocks, MD");
    var initialSiteDict = {
        id : "dv01580000",
        name : "DEER CREEK AT ROCKS, MD",
        area : 94.4,
        impervious : 1.26
    };

    //console.log("Initial call of requestData with: ");
    //console.log(viewModel.siteId());
    //console.log(viewModel.siteName());
    //console.log(viewModel.siteDict().toString());
    //请求数据
    requestData(viewModel.siteId(), source, viewModel.siteName(), initialSiteDict);

   google.maps.event.addDomListener(window, 'load', drawMap);
    //第一次地图显示的时候最好resize一下，使你的位置位于屏幕中心
    google.maps.event.addDomListener(window, 'load', redraw);
    //当调整浏览器窗口的大小时，发生 redraw 事件。
    $(window).resize(redraw);
}