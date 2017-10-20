/**
 * Created by Marty on 3/12/2017.
 */
function flowduration(id) {
    //console.log("flowduration");
    var data = chooseData(id);
    //If there is no data for a site, keep the previous graph alive & do nothing.
    if(!data) return;

    var myScreen = {
        width : viewModel.width(),
        height : viewModel.height()
    };

    var sitename = id;

    data.sort(function(a, b) {
        return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0;
    });

    var margin = {
        top : 10,
        right : 10,
        bottom : 50,
        left : 70
    }, width = myScreen.width - margin.left - margin.right, height = myScreen.height - margin.top - margin.bottom;
    //定义比例尺 值域
    var xScale = d3.scale.linear().range([0, width]);
    //This will plot from high values to low.
    //var x = d3.scale.linear().range([width, 0]); //This will plot from low values to high.
    //var y = d3.scale.linear().range([height, 0]); //Use this for a linear scale on the Y axis.
    //定义比例尺 值域
    var yScale = d3.scale.log().range([height, 0]);
    //Dealt with trouble switching to log by changing y.domain to have a min of 1, not zero.
    //定义坐标轴。orient()：指定刻度的朝向，bottom 表示在坐标轴的下方显示。scale()：指定比例尺。
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    var yAxis = d3.svg.axis().scale(yScale).orient("left");

    var rank = 0;
    //使用intepolation()方法，可以告诉构造器使用不同的插值策略,step-before - 步进插值，曲线只能沿y轴和x轴交替伸展(曲线的样式)
    var area = d3.svg.line().interpolate("step-before").x(function(d) {
        rank = rank + 1;
        return xScale(rank);
    }).y(function(d) {
        return yScale(d[1]);
    });

    d3.select("#graph_div svg").remove();
    var svg = d3.select("#graph_div").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
    //(defs定义箭头),clipPath(裁剪路径)用来定义剪裁路径
    svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);
    //g分组元素 ，是 SVG 画布中的元素，意思是 group。此元素是将其他元素进行组合的容器，在这里是用于将坐标轴的其他元素分组存放。
    //坐标轴的位置，可以通过 transform 属性来设定
    var focus = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //定义比例尺 定义域  d3.extent - 找出一个数组中的最大值和最小值。
    xScale.domain(d3.extent([0, data.length]));
    yScale.domain([1, d3.max(data.map(function(d) {
        return d[1];
    }))]);
    //If y.domain has a min value of 0, then you can't plot in a log scale.
    //path坐标轴的轴线
    focus.append("path").datum(data).attr("clip-path", "url(#clip)").attr("d", area).attr("stroke", "blue");
    //append the path to the graph, but clip it with the rectangle we defined above.
    //class axis定义坐标轴的样式
    focus.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
    focus.append("g").attr("class", "y axis").call(yAxis);

    //title block 标题栏
    var title = focus.append("g").attr("transform", "translate(125,20)");
    title.append("svg:text").attr("class", "Title").text(viewModel.siteName());
    title.append("svg:text").attr("class", "subTitle").attr("dy", "1em").text(data.length + " measurements");

    //axis labels
    focus.append("text").attr("class", "axisTitle").attr("transform", "rotate(-90)").attr("x", 0).attr("y", 0).attr("dy", "1em").style("text-anchor", "end").text("instantaneous stream discharge (cfs)");
    focus.append("text").attr("class", "axisTitle").attr("x", width).attr("y", height - 2).style("text-anchor", "end").text("Number of measurements that exceed this discharge");
}
