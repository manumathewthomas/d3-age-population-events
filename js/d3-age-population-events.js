//
// Author : Manu Mathew Thomas
// E-mail : mthoma52@uic.edu
// Website: mthoma52.com
//


// Global Variables
var barMargin = {top:20,right:20,bottom:30,left:5};
var barChartWidth = 800 - barMargin.left-barMargin.right;
var barChartHeight = 400 - barMargin.top-barMargin.bottom;
var barChart1Width = barChartWidth/3;
var barChart2Width = barChart1Width + barChartWidth/3;
var barChart3Width = barChart2Width + barChartWidth/3;
var xScale1,yScale1,heightScale1,xAxis1,yAxis1;
var xScale2,yScale2,heightScale2,xAxis2,yAxis2;
var xScale3,yScale3,heightScale3,xAxis3,yAxis3;
var selectedCountryList=["California","Illinois","Utah"];
var currentEvent;
var regionalDataset;
var stateList=[];
var countryList=["United States","China","India","Norway","Canada"];
var eventList=["Event1","Event2","Event3","Event4","Event5",
               "Event6","Event7","Event8","Event9","Event10"];
var lookup={};
var currentCountry;
var chartDataset1=[],chartDataset2=[],chartDataset3=[];
var filePath="../assets/dataset/";

var barOrPie = true;

// Header Elements
var header = d3.select("body")
               .append("header");

  header.append("h1")
        .attr("id","mainHeading")
        .text("Still Crazy After All These Years !");

  header.append("h2")
        .attr("id","secondaryHeading")
        .text("Age-Population-Events Visualized.");

// Navigation Elements

var nav = header.append("nav");

    nav.selectAll("a")
       .data(["Home","How it works","Source","About the data","Thoughts","Credits"])
       .enter()
       .append("a")
       .attr("href","#")
       .append("li")
       .text(function(d){
         return d;
       });

// Listing the DataSource
 d3.select("body")
   .append("p")
   .attr("id","datasource")
   .text("Data Source: US Census Bureau.");


// Implementation of Bar Charts   
var barSection = d3.select("body")
                   .append("section")
                   .attr("class","bar_chart_collection");

var barCharts = barSection.append("div")
                          .attr("id","bar_chart1")
                          .attr("class","bar_chart");


var svgBarTitleContainer = barCharts.append("svg")
                                    .attr("class","svgBarTitle")
                                    .attr("width","100%")
                                    .attr("height","100%")
                                    .attr("viewBox","0 0 2000 60 ")
                                    .attr("preserveAspectRatio","xMinYMid");
                                 
var barChartTitle1 = svgBarTitleContainer.append("text")
                                   .attr("x","10%")
                                   .attr("y","50px")
                                   .attr("fill","white")
                                   .text(selectedCountryList[0]);

var barChartTitle2 = svgBarTitleContainer.append("text")
                                         .attr("x","45%")
                                         .attr("y","50px")
                                         .attr("fill","white")
                                         .text(selectedCountryList[1]);

var barChartTitle3 = svgBarTitleContainer.append("text")
                                         .attr("x","80%")
                                         .attr("y","50px")
                                         .attr("fill","white")
                                         .text(selectedCountryList[2]);


                                   
var svgBarContainer = barCharts.append("svg")
                                .attr("id","bar_charts_svg")
                                .attr("width","100%")
                                .attr("height","100%")
                                .attr("viewBox","0 0 "+(barChartWidth+barMargin.left+barMargin.right)
                                                      +" "+(barChartHeight+barMargin.top+barMargin.bottom)/3)
                                .attr("preserveAspectRatio","xMinYMid");
                                  

var barChartGroup1 = svgBarContainer.append("g")
                                    .attr("id","barChartGroup1")
                                    .attr("transform","translate("+barMargin.left+",0)");

var barChartGroup2 = svgBarContainer.append("g")
                                    .attr("id","barChartGroup2")
                                   .attr("transform","translate("+barMargin.left*2+",0)");
var barChartGroup3 = svgBarContainer.append("g")
                                    .attr("id","barChartGroup3")
                                    .attr("transform","translate("+barMargin.left*3+",0)");

var pieChartGroup1 = svgBarContainer.append("g")
                                    .attr("id","pieChartGroup1")
                                    .attr("transform","translate("+barChart1Width/2+","+barChartHeight/5+")");

var pieChartGroup2 = svgBarContainer.append("g")
                                    .attr("id","pieChartGroup2")
                                    .attr("transform","translate("+(barChart1Width/2+barChart1Width)+","+barChartHeight/5+")");

var pieChartGroup3 = svgBarContainer.append("g")
                                    .attr("id","pieChartGroup3")
                                    .attr("transform","translate("+(barChart1Width/2+barChart1Width*2)+","+barChartHeight/5+")");



 var barPieToogle = function(barVisibility,pieVisibility){ 
      d3.select("#barChartGroup1").attr("visibility",barVisibility);
      d3.select("#barChartGroup2").attr("visibility",barVisibility);
      d3.select("#barChartGroup3").attr("visibility",barVisibility);

      d3.select("#pieChartGroup1").attr("visibility",pieVisibility);
      d3.select("#pieChartGroup2").attr("visibility",pieVisibility);
      d3.select("#pieChartGroup3").attr("visibility",pieVisibility);
 }



                                    
// Resizing Bar Charts
var barChartToBeResized = $(".bar_chart_svg");
var barChartAspect = barChartToBeResized.width()/barChartToBeResized.height();
var barChartContainer = barChartToBeResized.parent();

var barChartTitleToBeResized = $(".svgBarTitle");
var barChartTitleAspect = barChartTitleToBeResized.width()/barChartTitleToBeResized.height();
var barChartTitleContainer = barChartTitleToBeResized.parent();


$(window).on("resize", function(){
  var targetBarChartWidth = barChartContainer.width();
    barChartToBeResized.attr("width",targetBarChartWidth);
    barChartToBeResized.attr("height", Math.round(targetBarChartWidth / barChartAspect));

    var targetBarChartTitleWidth = barChartTitleContainer.width();
    barChartTitleToBeResized.attr("width",targetBarChartTitleWidth);
    barChartTitleToBeResized.attr("height", Math.round(targetBarChartTitleWidth / barChartTitleAspect));

}).trigger("resize");


                               
//Dropdown Container
var stateDropdown = d3.select("body")
                      .append("div")
                      .attr("class","ui fluid multiple selection dropdown stateDropdown");

    stateDropdown.append("input")
                 .attr("type","hidden")
                 .attr("id","country")
                 .attr("name","country");

    stateDropdown.append("i")
                 .attr("class","dropdown icon");

    stateDropdown.append("div")
                 .attr("class","default text")
                 .text("Select Country");

    var dropdown_menu = stateDropdown.append("div")
                                     .attr("class","menu");


var eventDropdown = d3.select("body")
                      .append("div")
                      .attr("class","ui fluid selection dropdown eventDropdown");

    eventDropdown.append("input")
                 .attr("type","hidden")
                 .attr("id","events")
                 .attr("name","events");

    eventDropdown.append("i")
                 .attr("class","dropdown icon");

    eventDropdown.append("div")
                 .attr("class","default text")
                 .text("Select Event");

    var eventDropdown_menu = eventDropdown.append("div")
                                          .attr("class","menu");
            
        eventDropdown_menu.selectAll("div")
                     .data(eventList)
                     .enter()
                     .append("div")
                     .attr("class","item")
                     .attr("data-value",function(d){
                        return d;
                       })
                     .append("i")
                     .select(function(){
                        return this.parentNode;
                       }).insert("span","div")
                     .text(function(d){
                        return d;
                      });

//buttons
//

var barPieButton = d3.select("body")
  .append("div")
  .attr("class","ui large  buttons");

barPieButton.append("button")
          .attr("class","ui button positive")
          .attr("id","barButton") 
          .text("Bar");

barPieButton.append("div")
          .attr("class","or");

barPieButton.append("button")
          .attr("class","ui button")
          .attr("id","pieButton")
          .text("Pie");

var barPieButton = d3.select("body")
  .append("div")
  .attr("class","ui large buttons");

barPieButton.append("button")
          .attr("class","ui button")
          .text("Overview");

barPieButton.append("div")
          .attr("class","or");

barPieButton.append("button")
          .attr("class","ui button")
          .text("Detailed View");

var genderButton = d3.select("body")
  .append("div")
  .attr("class","ui large buttons");

genderButton.append("button")
          .attr("class","ui button")
          .text("All");

genderButton.append("div")
          .attr("class","or");

genderButton.append("button")
          .attr("class","ui button")
          .text("Male");

genderButton.append("div")
            .attr("class","or");

genderButton.append("button")
            .attr("class","ui button")
            .text("Female");



//Regional Data
var getRegionalData = function(){
   d3.csv(filePath+"US2010-2014.csv",function(error,data){
        regionalDataset = data;
        console.log(regionalDataset);
        showRegionalData();

   })

}   


showRegionalData = function(){
  for(var item,i=0;item = regionalDataset[i++];){
    var name = item.NAME;

    if(!(name in lookup)){
      lookup[name] = 1;
       stateList.push({"distinctState":item.NAME});
    }
  }

  dropdown_menu.selectAll("div")
               .data(stateList)
               .enter()
               .append("div")
               .attr("class","item")
               .attr("data-value",function(d){
                    return d.distinctState;
               })
               .append("i")
               .select(function(){
                 return this.parentNode;
               }).insert("span","div")
               .text(function(d){
                  return d.distinctState;
               });


    currentEvent="2012";
    

    insertDataToBarCharts();
  $('.stateDropdown').on("change",function(){     
      selectedCountryList=d3.select("#country").property("value").split(",");
      chartDataset1=[];
      chartDataset2=[];
      chartDataset3=[];
      insertDataToBarCharts();
      updateBarChart1();
      updateBarChart2();
      updateBarChart3();
    });

  $('#barButton').on("click",function(){
           d3.select("#barButton").attr("class","ui button positive"); 
           d3.select("#pieButton").attr("class","ui button");
          
           barOrPie = true;
          
           barPieToogle("visible","hidden");
  });

  $('#pieButton').on("click",function(){
           d3.select("#pieButton").attr("class","ui button positive");
           d3.select("#barButton").attr("class","ui button");
          
           barOrPie = false;

           barPieToogle("hidden","visible");
  });
  

//insertDataToBarChart1();
drawBarCharts();

   /*  dropdown_menu.append("div")
            .attr("class","item")
            .attr("data-value","ca")
            .append("i")
            .attr("class","ca flag")
            .select(function(){
              return this.parentNode;
            }).insert("span","div")
            .text("Canada");
            */
  
     
 
  
 
   
}


//call to event-data handling function
getRegionalData();


var drawBarCharts = function(){

scaleBarChart1();

barChartGroup1.selectAll("rect")
              .data(chartDataset1)
              .enter()
              .append("rect")
              .attr({
                  x:function(d,i){
                    return i * (barChart1Width/chartDataset1.length);
                    },

                  y:function(d){
                     return barChartHeight/3-heightScale1(d.Population);
                  },

                  width:barChart1Width/chartDataset1.length -1,
                  
                  height: function(d){
                    return heightScale1(d.Population);
                  },

                  fill:function(d){
                    return "#56baec";
                  }
                  });

/*
svgBarContainer.append("g")
                .attr("class","axis y_axis")
                .attr("transform","translate(20,0)")
              .call(yAxis);
*/
scaleBarChart2();

barChartGroup2.selectAll("rect")
                .data(chartDataset2)
                .enter()
                .append("rect")
                .attr({
                  x:function(d,i){
                    return i * (barChart1Width/chartDataset2.length)+barChart1Width;
                    },

                  y:function(d){
                     return barChartHeight/3-heightScale2(d.Population);
                  },

                  width:barChart1Width/chartDataset2.length -1,
                  
                  height: function(d){
                    return heightScale2(d.Population);
                  },

                  fill:function(d){
                    return "#b0e57c";
                  }
                  });


/*
svgBarContainer.append("g")
                .attr("class","axis y_axis")
                .attr("transform","translate(20,0)")
                .call(yAxis);
*/
scaleBarChart3();

barChartGroup3.selectAll("rect")
                .data(chartDataset3)
                .enter()
                .append("rect")
                .attr({
                  x:function(d,i){
                    return i * (barChart1Width/chartDataset3.length) + barChart1Width*2;
                    },

                  y:function(d){
                     return barChartHeight/3-heightScale3(d.Population);
                  },

                  width:barChart1Width/chartDataset3.length -1,
                  
                  height: function(d){
                    return heightScale3(d.Population);
                  },

                  fill:function(d){
                    return "#fe8402";
                  }
                  });


          pie = d3.layout.pie()
                         .value(function(d){return d.Population});

          var outerRadius1 = barChart1Width/3 - barMargin.bottom;
          var innerRadius1 = 0;
          arc = d3.svg.arc()
                      .innerRadius(innerRadius1)
                      .outerRadius(outerRadius1);
          
          pieChartGroup1.append("g")
                         .attr("transform","translate("+barChartWidth/2+","+barChartWidth/2+")");

          pieColor = d3.scale.category20();

          pieArcs1 = pieChartGroup1.datum(chartDataset1)
                                  .selectAll("path")
                                  .data(pie)
                                  .enter();

         piePath1 = pieArcs1.append("path")
                    .attr("fill",function(d,i){return pieColor(i);})
                    .attr("d",arc)
                    .each(function(d){return this._current=d.Population2012;});

         pieArcs1.append("text")
             .attr("transform",function(d){
                return "translate("+arc.centroid(d)+")";
             })
             .attr("text-anchor","middle")
             .text(function(d,i){
                return chartDataset1[i].Age;
             });
       
         pieChartGroup2.append("g")
                         .attr("transform","translate("+(barChartWidth/2+barChart1Width)+","+barChartWidth/2+")");


         pieArcs2 = pieChartGroup2.datum(chartDataset2)
                                  .selectAll("path")
                                  .data(pie)
                                  .enter();

         piePath2 = pieArcs2.append("path")
                    .attr("fill",function(d,i){return pieColor(i);})
                    .attr("d",arc)
                    .each(function(d){return this._current=d.Population2012;});

         pieArcs2.append("text")
             .attr("transform",function(d){
                return "translate("+arc.centroid(d)+")";
             })
             .attr("text-anchor","middle")
             .text(function(d,i){
                return chartDataset2[i].Age;
             });
 
          pieChartGroup3.append("g")
                         .attr("transform","translate("+(barChartWidth/2+barChart1Width)+","+barChartWidth/2+")");


         pieArcs3 = pieChartGroup3.datum(chartDataset3)
                                  .selectAll("path")
                                  .data(pie)
                                  .enter();

         piePath3 = pieArcs3.append("path")
                    .attr("fill",function(d,i){return pieColor(i);})
                    .attr("d",arc)
                    .each(function(d){return this._current=d.Population2012;});

         pieArcs3.append("text")
             .attr("transform",function(d){
                return "translate("+arc.centroid(d)+")";
             })
             .attr("text-anchor","middle")
             .text(function(d,i){
                return chartDataset3[i].Age;
             });
             
             barPieToogle("visible","hidden");

}


var scaleBarChart1 = function(){
xScale1 = d3.scale.linear()
                 .domain([0,d3.max(chartDataset1,function(d){
                    if(d.Age!=999)
                      return d.Age;
                 })])
                  .range([0,barChartWidth/3]);
yScale1 = d3.scale.linear()
                 .domain([0,d3.max(chartDataset1,function(d){
                      return d.Population;
                 })])
                .range([barChartHeight/3,0]);

heightScale1 = d3.scale.linear()
                      .domain([0,d3.max(chartDataset1,function(d){
                          return d.Population;
                      })])
                      .range([0,barChartHeight/3]);

xAxis1 = d3.svg.axis()
              .scale(xScale1)
              .orient("bottom").ticks(10);

yAxis1 = d3.svg.axis()
              .scale(yScale1)
              .orient("left").ticks(10);

svgBarContainer.append("g")
               .attr("class","axis x_axis")
               .attr("transform","translate("+barMargin.left+","+(barChartHeight/3)+")");
              // .call(xAxis1);
              
svgBarContainer.append("g")
               .attr("class","axis y_axis")
               .attr("transform","translate("+(barMargin.left+barMargin.right)+",0)");
              // .call(yAxis1);

}


var scaleBarChart2 = function(){
xScale2 = d3.scale.linear()
                 .domain([0,d3.max(chartDataset2,function(d){
                    if(d.Age!=999)
                      return d.Age;
                 })])
                  .range([0,barChartWidth/3]);
yScale2 = d3.scale.linear()
                 .domain([0,d3.max(chartDataset2,function(d){
                      return d.Population;
                 })])
                .range([barChartHeight/3,0]);

heightScale2 = d3.scale.linear()
                      .domain([0,d3.max(chartDataset2,function(d){
                          return d.Population;
                      })])
                     .range([0,barChartHeight/3]);
 
xAxis2 = d3.svg.axis()
              .scale(xScale2)
              .orient("bottom").ticks(10);

yAxis2 = d3.svg.axis()
              .scale(yScale2)
              .orient("left").ticks(10);

/*svgBarContainer.append("g")
               .attr("class","axis x_axis")
               .attr("transform","translate(300,0)")
               .call(xAxis2);
              
svgBarContainer.append("g")
               .attr("class","axis y_axis")
               .attr("transform","translate(50,0)")
               .call(yAxis2);
*/
}


var scaleBarChart3 = function(){
xScale3 = d3.scale.linear()
                 .domain([0,d3.max(chartDataset3,function(d){
                    if(d.Age!=999)
                      return d.Age;
                 })])
                  .range([0,barChartWidth]);
yScale3 = d3.scale.linear()
                 .domain([0,d3.max(chartDataset3,function(d){
                      return d.Population;
                 })])
                .range([barChartHeight/3,0]);

heightScale3 = d3.scale.linear()
                      .domain([0,d3.max(chartDataset3,function(d){
                          return d.Population;
                      })])
                      .range([0,barChartHeight/3]);

xAxis3 = d3.svg.axis()
              .scale(xScale3)
              .orient("bottom").ticks(10);

yAxis3 = d3.svg.axis()
              .scale(yScale3)
              .orient("left").ticks(10);

/*svgBarContainer.append("g")
               .attr("class","axis x_axis")
               .attr("transform","translate("+barMargin.left+",0)")
               .call(xAxis3);
              
svgBarContainer.append("g")
               .attr("class","axis y_axis")
               .attr("transform","translate(50,0)")
               .call(yAxis3);
*/

}



var insertDataToBarCharts = function(){
for(var item,i=0;item=regionalDataset[i++];){
    var name = item.NAME;

    if(item.NAME == selectedCountryList[0] && item.SEX=="0" && item.AGE>70&&item.AGE<80)
      chartDataset1.push({"State":item.NAME,"Age":+item.AGE,"Sex":item.SEX,"Population":+item.POPEST2012_CIV});
    if(item.NAME == selectedCountryList[1] && item.SEX=="0" && item.AGE<999)
      chartDataset2.push({"State":item.NAME,"Age":+item.AGE,"Sex":item.SEX,"Population":+item.POPEST2012_CIV});
    if(item.NAME == selectedCountryList[2] && item.SEX=="0" && item.AGE<999)
      chartDataset3.push({"State":item.NAME,"Age":+item.AGE,"Sex":item.SEX,"Population":+item.POPEST2012_CIV});
  }
}


var updateBarChart1 = function(){

scaleBarChart1();
barChartGroup1.selectAll("rect")
              .data(chartDataset1)
              .transition()
              .delay(function(d,i){
                return i/chartDataset1.length *1000;
              })
              .duration(1000)
              .ease("cubic-in-out")
              .attr({
                  x:function(d,i){
                    return i * (barChart1Width/chartDataset1.length);
                    },

                  y:function(d){
                     return barChartHeight/3-heightScale1(d.Population);
                  },

                  width:barChart1Width/chartDataset1.length -1,
                  
                  height: function(d){
                    return heightScale1(d.Population);
                  },

                  fill:function(d){
                    return "#56baec";
                  }
                  })
        
barChartTitle1.text(selectedCountryList[0]);
              
barChartGroup1.selectAll("rect")
              .data(chartDataset1)
              .exit()
              .transition();

  piePath1 = pieChartGroup1.datum(chartDataset1)
                           .selectAll("path")
                           .data(pie)
                           .attr("d",arc);

  piePath2 = pieChartGroup2.datum(chartDataset2)
                           .selectAll("path")
                           .data(pie)
                           .attr("d",arc);

  piePath3 = pieChartGroup3.datum(chartDataset3)
                           .selectAll("path")
                           .data(pie)
                           .attr("d",arc);



}


var updateBarChart2 = function(){

scaleBarChart2();
barChartGroup2.selectAll("rect")
              .data(chartDataset2)
              .transition()
              .delay(function(d,i){
                return i/chartDataset2.length *1000;
              })
              .duration(1000)
              .ease("cubic-in-out")
              .attr({
                   x:function(d,i){
                    return i * (barChart1Width/chartDataset2.length)+barChart1Width;
                    },

                  y:function(d){
                     return barChartHeight/3-heightScale2(d.Population);
                  },

                  width:barChart1Width/chartDataset2.length -1,
                  
                  height: function(d){
                    return heightScale2(d.Population);
                  },

                  fill:function(d){
                    return "#b0e57c";
                  }
                  });

        
barChartTitle2.text(selectedCountryList[1]);
              
barChartGroup2.selectAll("rect")
              .data(chartDataset2)
              .exit()
              .transition();


}

var updateBarChart3 = function(){

scaleBarChart3();
barChartGroup3.selectAll("rect")
              .data(chartDataset3)
              .transition()
              .delay(function(d,i){
                return i/chartDataset3.length *1000;
              })
              .duration(1000)
              .ease("cubic-in-out")
              .attr({
                x:function(d,i){
                    return i * (barChart1Width/chartDataset2.length) + barChart1Width*2;
                    },

                  y:function(d){
                     return barChartHeight/3-heightScale3(d.Population);
                  },

                  width:barChart1Width/chartDataset3.length -1,
                  
                  height: function(d){
                    return heightScale3(d.Population);
                  },

                  fill:function(d){
                    return "#fe8402";
                  }
                  });
     
       
barChartTitle3.text(selectedCountryList[2]);
              
barChartGroup3.selectAll("rect")
              .data(chartDataset3)
              .exit()
              .transition();


}



