function main(){
    const width = 1600;
    const height = 800;

    const svg = d3.select("body").append("svg")
        .attr("width",width)
        .attr("height",height);

    

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    d3.csv('../CSV/soc-tribes.csv',function(d){return {start:  +d.id-1,end:+d.id2-1,weight:d.weight}}).then((data)=>{
        const nodesByName = [];
        const edges = []
        const isVisited = new Set();

        data.forEach(function(d){
            if(isVisited.has(d.start) == false){
                nodesByName.push({"name":d.start});
                isVisited.add(d.start);
            }
            if(isVisited.has(d.end)==false){
                nodesByName.push({"name":d.end});
                isVisited.add(d.end);
            }
            edges.push({"source":d.start,"target":d.end})
        });

        var force = d3.forceSimulation(nodesByName)
              .force("charge", d3.forceManyBody().strength(-400))
              .force("link", d3.forceLink(edges))
              .force("center", d3.forceCenter().x(width/2).y(height/2));

        const link = svg.selectAll(".link")
          .data(edges)
          .enter().append("line")
          .attr("class","link");

        const node = svg.selectAll(".node")
          .data(nodesByName)
          .enter().append("circle")
          .attr("class","node")
          .attr("r",10)
          .style("fill", function(i){
              return color(i);
            }).call(d3.drag()  //Define what to do on drag events
            .on("start", function(event,d){ if(!event.active){ 
                force.alphaTarget(0.3).restart();
                d.fx = event.x;
                d.fy = event.y
                }
                })
            .on("drag",function(event,d){
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", function(event,d){ if(!event.active){
                d.fx = null;
                d.fy = null;
            }}));
         

        node.on("mouseover", function (Event, d) {
                d3.select(this)
                    .attr("stroke-width",3)
                    .attr("stroke", "white")
            })
            .on("mouseout", function () {
                d3.select(this)
                    .attr("stroke", "none");
            }).append("title")
            .text(function(d){
                return "Tribe Number: "+ d.name;
            });

        force.on("tick", function() {

        link.attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; });
    });
    });
}
main();