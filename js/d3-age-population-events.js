//
// Author : Manu Mathew Thomas
// E-mail : mthoma52@uic.edu
// Website: mthoma52.com
//

// Header Elements
var header = d3.select("body")
               .append("header");

  header.append("h1")
        .text("Still Crazy After All These Years !");
  header.append("h2")
        .text("Age-Population-Events Visualized.");

// Navigation Elements

var nav = header.append("nav");

    nav.selectAll("a")
       .data(["Home","How it works","Source","About the data","Credits"])
       .enter()
       .append("a")
       .attr("href","#")
       .text(function(d){
          return d;
       });



