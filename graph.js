function main(){
    const width = 800;
    const height = 800;

    const svg = d3.select("body").append("svg")
        .attr("width",width)
        .attr("height",height);

    

    d3.csv('soc-tribes.csv',function(d){return {start:  +d.id-1,end:+d.id2-1,weight:d.weight}}).then((data)=>{
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

        nodes = nodesByName;
        console.log(nodes);
        console.log(edges);

        var force = d3.forceSimulation(nodesByName)
              .force("charge", d3.forceManyBody())
              .force("link", d3.forceLink(edges))
              .force("center", d3.forceCenter().x(width/2).y(height/2));

        const link = svg.selectAll(".link")
          .data(data)
          .enter().append("line")
          .attr("class","link");

        const node = svg.selectAll(".node")
          .data(nodes)
          .enter().append("circle")
          .attr("class","node")
          .attr("r",4.5)
    });
}
main();