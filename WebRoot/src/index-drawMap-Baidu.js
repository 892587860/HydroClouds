var map;
var fusionLayerInfoWindow;
function drawMap_Baidu() {

	map = new BMap.Map("map_div", {}); // 创建Map实例
	map.centerAndZoom(new BMap.Point(-76.609, 39.395), 8); // 初始化地图,设置中心点坐标和地图级别
	map.enableScrollWheelZoom(); // 启用滚轮放大缩小
	if (document.createElement('canvas').getContext) { // 判断当前浏览器是否支持绘制海量点
		var points = []; // 添加海量点数据
		for ( var i = 0; i < data.data.length; i++) {
			var p = new BMap.Point(data.data[i].lng, data.data[i].lat);
			p.sId = data.data[i].sId;
			p.siteName = data.data[i].siteName;
			p.area = data.data[i].area;
			p.impervious = data.data[i].impervious;
			points.push(p);
		}
		console.log(points)
		var options = {
			size : BMAP_POINT_SIZE_BIG,
			shape : BMAP_POINT_SHAPE_STAR,
			color : '#ff0000'
		}
		var pointCollection = new BMap.PointCollection(points, options); // 初始化PointCollection
		pointCollection.addEventListener('click', function(e) {

			// 从event中获取所点击站点的信息
			var sId = String(e.point.sId);
			var siteName = e.point.siteName;
			// TODO: At some point it will be necessary to create a system that
			// requests IV or Daily Values.
			// USGS美国地质勘探局（United States Geological Survey）
			// Many of the USGS sites don't have their Source set yet, so
			// automatically set to 'USGS-DV' if empty.
			// 许多usgs站点没有他们来源，所以当来源为空时把来源自动的设置为'USGS-DV'
			var source = e.point.source || 'USGS-DV';
			// TODO: Some USGS sites have Source set to 'USGS', which is not in
			// the providerList right now.
			// 有些usgs站点的源为‘usgs’，该名称在providerList还不存在
			if (source == 'USGS')
				source = 'USGS-DV';
			var prefix = providerList[source].idPrefix;
			sId = prefix + sId;
			var siteDict = {
				id : sId,
				name : siteName || null,
				area : +e.point.area || null,
				impervious : +e.point.impervious || null
			};

			// Update our viewModel with the current site information.
			// 用点击获取的实时数据更新viewModel
			viewModel.siteId(sId);
			viewModel.siteName(siteName);

		
			fusionLayerInfoWindow = new BMap.InfoWindow("<div class='googft-info-window'>" +
                    "<b>" + siteName + "</b><br>" +
                    "<b>site ID: </b>" + sId + "<br>" +
                    "</div>"); // 创建信息窗口对象
			
			map.openInfoWindow(fusionLayerInfoWindow, e.point); // 开启信息窗口

			requestData(sId, source, siteName, siteDict);

		});
		map.addOverlay(pointCollection); // 添加Overlay
		
	} else {
		alert('请在chrome、safari、IE8+以上浏览器查看本示例');
	}
}