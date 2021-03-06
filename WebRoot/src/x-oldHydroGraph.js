/*
 * hydroGraphs.js created by
 * Martin Roberge (c) 2013
 * October 1, 2013
 *
 * Department of Geography and Environmental Planning
 * Towson University
 * @author Martin Roberge
 */

var header = 40;

var myScreen = {
  width : $(window).width() - 20, //plan is to not use jQuery in future versions
  height : $(window).height() - (header + 60)
};

function hydrograph(id) {

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

  var area2 = d3.svg.area().interpolate("linear").x(function(d) {
    return x2(d.date);
  }).y0(height2).y1(function(d) {
    return y2(d.value);
  });

  var svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
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
  title.append("svg:text").attr("class", "Title").text(sitename);
  title.append("svg:text").attr("class", "subTitle").attr("dy", "1em").text(data.length + " measurements");

  //axis labels
  focus.append("text").attr("class", "axisTitle").attr("transform", "rotate(-90)").attr("x", 0).attr("y", 0).attr("dy", "1em").style("text-anchor", "end").text("Stream discharge (cfs)");
  focus.append("text").attr("class", "axisTitle").attr("x", width).attr("y", height - 2).style("text-anchor", "end").text("time");
};

function loghistogram(id) {

  var sitename = id;
  var margin = {
    top : 10,
    right : 10,
    bottom : 100,
    left : 70
  };
  var width = myScreen.width - margin.left - margin.right;
  var height = myScreen.height - margin.top - margin.bottom;

  var values = [];
  //this will be a simplified array of just the data.value to keep the code clean.
  data.forEach(function(element, index, array) {
    values[index] = element.value;
  });
  //console.log(values);

  // A formatter for counts.
  var formatCount = d3.format(",.0f");
  //A formatter for frequencies.
  var formatFreq = d3.format("%");
  //var formatFreq = (true ? d3.format("%"):function(d){return null;});
  //var formatFreq = function(d) {
  //	(true ? d3.format("%") : null);
  //};

  //var x = d3.scale.linear()//linear
  //	.domain([0, d3.max(values)])
  var min = d3.min(values);
  var max = d3.max(values);
  var x = d3.scale.log()
  //.domain(d3.extent(values)).nice()//This is a little too "nice".  Pads the min and max too much.
  .domain([min, max])//No padding here. the result will spill over the end.
  .range([0, width]);
  //.tickFormat(20,d3.format(",.0r")); //didn't work.
  //.ticks() //didn't work.'

  var low = x.domain()[0];

  var high = x.domain()[1];
  console.log("low, min, max, high: " + low, min, max, high);

  var myBins = [];
  var i = 0;
  do {
    myBins[i] = low * Math.pow(1.2, i);
    //vary the first number to determine the number of bins. Must be above 1.0
    //console.log(i, myBins[i], high)
    i++;
  } while (myBins[i-1]<high);
  console.log(myBins);

  var counts = d3.layout.histogram()
  //.bins(x.ticks(80))
  //.bins(80)
  //.bins([1000,3000,8000,16000,32000,64000,128000,256000,1024000])//seems to work. But I have to generate my own thresholds!
  .bins(myBins) //This works well- I created a logarithmic sequence of bins called myBins.
  .frequency(false) //false:show frequencies; true: show counts
  (values);

  //console.log(counts);

  var y = d3.scale.linear().domain([0, d3.max(counts, function(d) {
    return d.y;
  })]).range([height, 0]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var yAxis = d3.svg.axis().scale(y).orient("left");

  var svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar = svg.selectAll(".bar").data(counts).enter().append("g").attr("class", "bar").attr("transform", function(d) {
    return "translate(" + x(d.x) + "," + y(d.y) + ")";
  });

  //bar.append("rect").attr("x", 1).attr("width", x(counts[0].dx) - 1).attr("height", function(d) {
  bar.append("rect").attr("x", 1).attr("width", width / myBins.length - 1).attr("height", function(d) {
    //bar.append("rect").attr("x", 1).attr("width", 10).attr("height", function(d) {
    return height - y(d.y);
  });

  //bar.append("text").attr("dy", ".75em").attr("y", -10)//add labels to each bar.
  //	//.attr("x", x(counts[0].dx) / 2)
  //	.attr("x", x(counts[0].dx))
  //	.attr("text-anchor", "middle")
  //	//.text(function(d) {return formatCount(d.y);});
  //	.text(function(d) {return (d.y > 0.01 ? formatFreq(d.y) : null);});//format as a % if number is above 1%.

  svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
  svg.append("g").attr("class", "y axis").call(yAxis);
  svg.append("svg:text").attr("class", "axisTitle").attr("x", ((width / 2) - 48)).attr("y", height + 30).text("Discharge (cfs)");
}

function flowduration(id) {

  var sitename = id;
  //future versions of the data object may store the name and site ID. For now, we'll just fake it.
  //var sorted = [];
  //sorted = data;//this just passes a reference, so data will get sorted too.
  data.sort(function(a, b) {
    return a.value < b.value ? 1 : a.value > b.value ? -1 : 0;
  });
  //console.log(sorted);

  var margin = {
    top : 10,
    right : 10,
    bottom : 50,
    left : 70
  }, width = myScreen.width - margin.left - margin.right, height = myScreen.height - margin.top - margin.bottom;

  var x = d3.scale.linear().range([0, width]);
  //This will plot from high values to low.
  //var x = d3.scale.linear().range([width, 0]); //This will plot from low values to high.
  //var y = d3.scale.linear().range([height, 0]); //Use this for a linear scale on the Y axis.
  var y = d3.scale.log().range([height, 0]);
  //Dealt with trouble switching to log by changing y.domain to have a min of 1, not zero.

  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var yAxis = d3.svg.axis().scale(y).orient("left");

  var rank = 0;
  //console.log(sorted.length)
  //var testarray = [];

  var area = d3.svg.line().interpolate("step-before")//If you use the "monotone" interpolate, it will be smooth. "step-before" will give a better idea of the data granularity.
  .x(function(d) {
    rank = rank + 1;
    //console.log(myIndex);
    return x(rank);
  }).y(function(d) {
    //console.log(d.value);
    return y(d.value);
  });

  var svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
  svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);
  var focus = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent([0, data.length]));
  y.domain([1, d3.max(data.map(function(d) {
    return d.value;
  }))]);
  //If y.domain has a min value of 0, then you can't plot in a log scale.'

  focus.append("path").datum(data).attr("clip-path", "url(#clip)").attr("d", area);
  //append the path to the graph, but clip it with the rectangle we defined above.
  //focus.append("path").datum(data).attr("d", area);//This still seems to get clipped even though it doesn't have the clipping path. ???
  focus.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
  focus.append("g").attr("class", "y axis").call(yAxis);

  //title block
  var title = focus.append("g").attr("transform", "translate(125,20)");
  title.append("svg:text").attr("class", "Title").text(sitename);
  title.append("svg:text").attr("class", "subTitle").attr("dy", "1em").text(data.length + " measurements");

  //axis labels
  focus.append("text").attr("class", "axisTitle").attr("transform", "rotate(-90)").attr("x", 0).attr("y", 0).attr("dy", "1em").style("text-anchor", "end").text("instantaneous stream discharge (cfs)");
  focus.append("text").attr("class", "axisTitle").attr("x", width).attr("y", height - 2).style("text-anchor", "end").text("Number of measurements that exceed this discharge");
};

function CSVfile(filename, text) {
  var link = document.createElement('a');
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
  link.setAttribute('download', filename);
  link.click();
}

function USGScsv(id) {//This will request fresh data and output as CSV.
  if (id == "local") {
    var filename = "resources/USGSshort.txt";
  } else {
    var filename = "http://waterservices.usgs.gov/nwis/iv/?format=json&sites=" + id + "&period=P30D&parameterCd=00060";
  }
  data = [];
  d3.json(filename, function(error, json) {
    if (error) {
      if (error.status === 0) {
        alert("CORS is not enabled.");
      };
      return console.warn(error);
    }
    temp = json.value.timeSeries[0].values[0].value;
    //MR Create a new array of objects from the JSON.

    //Clear out the array.
    temp.forEach(function(d, index, array) {
      var date = new Date(d.dateTime);
      var value = +d.value;
      var mstime = (+date / 86400000) + 25569;
      data[index] = {
        date : date,
        MStimeGMT : mstime.toFixed(5),
        value : value
      };
    });

    output = d3.csv.format(data).replace(/\n/g, "\r\n");
    //windows text needs \r\n for a new line.
    //console.log(output);
    CSVfile(id + ".csv", output);

  });

};

function dataCsv(id) {
  data.forEach(function(d, index, array) {
    var mstime = (+d.date / 86400000) + 25569;
    data[index].MStimeGMT = mstime.toFixed(5);
  });
  text = d3.csv.format(data).replace(/\n/g, "\r\n");
  var link = document.createElement('a');
  var filename = id + ".csv";
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
  link.setAttribute('download', filename);
  link.click();
}
