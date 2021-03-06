/**
 * Created by Marty on 3/12/2017.
 */

function hydrograph(id) {

    var myScreen = {
        width : viewModel.width(),
        height : viewModel.height()
    };
    data.sort(function(a, b) {
        return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
    });

    var sitename = id;
    //future versions of the data object may store the name and site ID. For now, we'll just fake it.

    var margin = {//margin is for the larger focus graph.
        top : 10,
        right : 10,
        bottom : 100,
        left : 40
    }, margin2 = {//margin2 is for the smaller context graph.
        top : myScreen.height - 70,
        right : 10,
        bottom : 20,
        left : 40
    }, width = myScreen.width - margin.left - margin.right, height = myScreen.height - margin.top - margin.bottom, height2 = myScreen.height - margin2.top - margin2.bottom;

    var x = d3.time.scale().range([0, width]);
    //x is focus
    var x2 = d3.time.scale().range([0, width]);
    //x2 is context
    var y = d3.scale.linear().range([height, 0]);
    var y2 = d3.scale.linear().range([height2, 0]);
    //var y = d3.scale.log().range([height, 0]); //Dealt with trouble switching to log by changing y.domain to have a min of 1, not zero.
    //var y2 = d3.scale.log().range([height2, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    //X axis for the focus graph.
    var xAxis2 = d3.svg.axis().scale(x2).orient("bottom");
    //X axis for the context graph.
    var yAxis = d3.svg.axis().scale(y).orient("left");
    //Y axis for the focus graph. Don't bother with a context Y axis.

    function brush() {
        x.domain(brush.empty() ? x2.domain() : brush.extent());
        focus.select("path").attr("d", area);
        focus.select(".x.axis").call(xAxis);
    }

    var brush = d3.svg.brush().x(x2).on("brush", brush);

    var area = d3.svg.area().interpolate("step-before")//If you use the "monotone" interpolate, it will be smooth. "step-before" will give a better idea of the data granularity.
        .x(function(d) {
            return x(d.date);
        }).y0(height).y1(function(d) {
            return y(d.value);
        });

    var area2 = d3.svg.area().interpolate("linear")
        .x(function(d) {
            return x2(d.date);
        })
        .y0(height2)
        .y1(function(d) {
            return y2(d.value);
        });

    d3.select("#graph_div svg").remove();
    var svg = d3.select("#graph_div").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
    svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);
    var focus = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var context = svg.append("g").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    x.domain(d3.extent(data.map(function(d) {
        return d.date;
    })));
    y.domain([1, d3.max(data.map(function(d) {
        return d.value;
    }))]);
    //If y.domain has a min value of 0, then you can't plot in a log scale.'
    x2.domain(x.domain());
    //make the context domain the same as the focus domain.
    y2.domain(y.domain());
    focus.append("path").datum(data).attr("clip-path", "url(#clip)").attr("d", area);
    focus.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
    focus.append("g").attr("class", "y axis").call(yAxis);
    context.append("path").datum(data).attr("d", area2);
    context.append("g").attr("class", "x axis").attr("transform", "translate(0," + height2 + ")").call(xAxis2);
    context.append("g").attr("class", "x brush").call(brush).selectAll("rect").attr("y", -6).attr("height", height2 + 7);

    //title block
    var title = focus.append("g").attr("transform", "translate(125,20)");
    //title.append("svg:text").attr("class", "Title").text(sitename);
    title.append("svg:text").attr("class", "Title").text(viewModel.siteName());
    title.append("svg:text").attr("class", "subTitle").attr("dy", "1em").text(data.length + " measurements");

    //axis labels
    focus.append("text").attr("class", "axisTitle").attr("transform", "rotate(-90)").attr("x", 0).attr("y", 0).attr("dy", "1em").style("text-anchor", "end").text("Stream discharge (cfs)");
    focus.append("text").attr("class", "axisTitle").attr("x", width).attr("y", height - 2).style("text-anchor", "end").text("time");
}

