//Initializing bootstrap
//

var margin = {top:20,right:20,bottom:30,left:80};
var barChartWidth = 960-margin.left-margin.right;
var barChartHeight = 500-margin.top-margin.bottom;
var tempDataset;
var countryList=[];
var currentCountry;
var USDataset=[];
var USDataset2012=[];

var lookup ={};
var xScale,yScale,heightScale,xAxis,yAxis;


var bootstrap = d3.select("body")
                  .append("div")
                  .attr("class","container-fluid");

//bar-chart placeholders
 bootstrap.append("section")
          .attr("class","bar_charts bar_chart_1")
          .append("h1")
          .style("text-align","center")
          .text("bar chart 1");


var USStateList = bootstrap.append("select")
                           .attr("class","form-control")
                           .attr("id","countryList");



// bar chart
  var svgBarContainer =  //bootstrap.select("section.bar_chart_1")
                                  d3.select("body").append("svg")
                                  .attr("id","chart")
                                  .attr("width","100%")//barChartWidth + margin.left + margin.right)
                                  .attr("height","100%")//barChartHeight + margin.top + margin.bottom)
                                  .attr("viewBox","0 0 1060 550")
                                  .attr("preserveAspectRatio","xMinYMin");


  
var chart = $("#chart"),
         aspect = chart.width() / chart.height(),
             container = chart.parent();
$(window).on("resize", function() {
      var targetWidth = container.width();
          chart.attr("width", targetWidth);
              chart.attr("height", Math.round(targetWidth / aspect));
}).trigger("resize");


d3.csv("tempData.csv",function(error,data){

  tempDataset = data;

  console.log("finished loading");
   
  showData();
})

function showData()
{

for(var item,i=0;item = tempDataset[i++];){
  var name = item.NAME;

  if(!(name in lookup)){
    lookup[name] = 1;
    countryList.push({"distinctState":item.NAME});
  }

 /* USDataset.push({"State":item.NAME,"Age":+item.AGE,
                    "Population2012":+item.POPEST2012_CIV});
*/
}

  tempDataset.forEach(function(d){
  if(d.NAME=="United States" && d.SEX == "0" && d.AGE!="999")
  {
    
    USDataset2012.push([+d.AGE,+d.POPEST2012_CIV]);
       //USDataset.push({"State":d.NAME});

}
});



USStateList.selectAll("option")
           .data(countryList)
           .enter()
           .append("option")
           .attr("value",function(d){return d.distinctState;})
           .text(function(d){return d.distinctState;});

currentCountry = $("#countryList :selected").val();

 for(var item,i=0;item = tempDataset[i++];){
  var name = item.NAME;

if(item.NAME == currentCountry && item.SEX=="0" && item.AGE!=999)
  USDataset.push({"State":item.NAME,"Age":+item.AGE,"Sex":item.SEX,
                    "Population2012":+item.POPEST2012_CIV});

}


  console.log(USDataset)


xScale = d3.scale.linear()
                 .domain([0,d3.max(USDataset,function(d){
                   if(d.Age!=999)
                     return d.Age
                 })])
                 .range([0,barChartWidth]);

xScaleOrdinal = d3.scale.ordinal()
                 .domain(d3.range(USDataset.length))
                 .rangeRoundBands([0,barChartWidth],0.2);

yScale = d3.scale.linear()
                 .domain([0,d3.max(USDataset,function(d){
                      return d.Population2012;})])
                 .range([barChartHeight,0]);
 
heightScale = d3.scale.linear()
                      .domain([0,d3.max(USDataset,function(d){
                          return d.Population2012;})])
                      .range([0,barChartHeight]);

xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom").ticks(30);

yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left").ticks(10);

svgBarContainer.append("g")
               .attr("class","axis x_axis")
               .attr("transform","translate("+ margin.left +","+ barChartHeight + ")")
               .call(xAxis);

svgBarContainer.append("g")
               .attr("class","axis y_axis")
               .attr("transform","translate("+margin.left+ ",0)")
               .call(yAxis);

//enter
svgBarContainer.selectAll("rect")
               .data(USDataset)
               .enter()
               .append("rect")
               .attr({
                 x:function(d,i){
                   return i * (barChartWidth/USDataset.length) + margin.left;
                 },

                 y:function(d){
                  return (barChartHeight-heightScale(d.Population2012));
                 },

                 width: barChartWidth/USDataset.length -1,

                 height: function(d){
                   return heightScale(d.Population2012);
                 },

                 fill: function(d){
                  return "rgb(0,0,"+d.Population2012+")";
                 }
              });



/*$("#countryList").click(function(){
currentCountry = $("#countryList :selected").val();
USDataset=[];
for(var item,i=0;item = tempDataset[i++];){
  var name = item.NAME;

if(item.NAME == currentCountry&&item.SEX==0&&item.AGE!=999)
  USDataset.push({"State":item.NAME,"Age":+item.AGE,"Sex":item.SEX,
                    "Population2012":+item.POPEST2012_CIV});

}

console.log(USDataset);

});


*/

//transition
bootstrap.select("#countryList")
        .on("change",function(){
       

currentCountry = $("#countryList :selected").val();
USDataset=[];
for(var item,i=0;item = tempDataset[i++];){
  var name = item.NAME;

if(item.NAME == currentCountry&&item.SEX==0&&item.AGE!=999)
  USDataset.push({"State":item.NAME,"Age":+item.AGE,"Sex":item.SEX,
                    "Population2012":+item.POPEST2012_CIV});

}



xScale.domain([0,d3.max(USDataset,function(d){
                     return d.Age
                 })
              ]);
                 


yScale.domain([0,d3.max(USDataset,function(d){
                 

                    return d.Population2012;})
              ]);
 
heightScale.domain([0,d3.max(USDataset,function(d){
                      return d.Population2012;})
                   ]);


            svgBarContainer.select(".x_axis")
                           .transition()
                           .duration(1000)
                           .call(xAxis);
            svgBarContainer.select(".y_axis")
                           .transition()
                           .duration(1000)
                           .call(yAxis);



          svgBarContainer.selectAll("rect")
             .data(USDataset)
             .transition()
             .delay(function(d,i){
              return i /USDataset.length *1000;
             })
             .duration(1000)
             .ease("cubic-in-out")
            /* .each("start",function(d,i){
                
               d3.select(this)
                 .attr("fill","red");
             })*/
             .attr("x",function(d,i){
                return i * (barChartWidth/USDataset.length) + margin.left;
 
             })
             .attr("y",function(d){
                return barChartHeight - heightScale(d.Population2012);
             })
             .attr("height",function(d){
                return heightScale(d.Population2012);
             })
             .attr("width", barChartWidth/USDataset.length -1)


             /*.each("end",function(){
                d3.select(this)
                  .transition()
                  .duration(1000)
                  .attr("fill","green");
             })*/;

             svgBarContainer.selectAll("rect").data(USDataset).exit()
             .transition()
             .duration(500)
             .remove();

        });

}

               
  

