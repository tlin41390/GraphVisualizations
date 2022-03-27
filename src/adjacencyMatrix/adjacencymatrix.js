function main(){
    const width = 800;
    const height = 800;

   
    const svg = d3.select("body").append("svg")
        .attr("width",width)
        .attr("height",height);

        const container_g = svg.append("g")
        .attr("transform",
            "translate(100,100)");

     svg.append("text")
        .attr("transform", "translate(25,0)")
        .attr("x", 100)
        .attr("y", 100)
        .attr("font-size", "40px")
        .attr("font-family", "sans-serif")
        .text("Adjacency Matrix for Tribal Network")


     d3.csv('../CSV/soc-tribes.csv',function(d){return {start:  +d.id-1,end:+d.id2-1,weight:+d.weight}}).then((data)=>{
        const nodesByName = [];
        const edges = [];
        const matrix = [];
        const isVisited = new Set();

        const colorScale = d3.scaleSequential().interpolator(d3.interpolateBlues).domain([-1,1])

        data.forEach(function(d){
            if(!isVisited.has(d.start)){
                nodesByName.push({"name":d.start});
                isVisited.add(d.start);
            }
            if(!isVisited.has(d.end)){
                nodesByName.push({"name":d.end});
                isVisited.add(d.end);
            }
            edges.push({"source":d.start,"target":d.end,"weight":d.weight})
        });

        const edgeHash = {};
        edges.forEach(edge => {
            let id = edge.source + "-" + edge.target;
            edgeHash[id] = edge;
        }) 

        nodesByName.forEach((source,a)=>{
            nodesByName.forEach((target,b) =>{
                const grid = {id: source.name +"-" + target.name, x: b, y:a, weight:0}
                if(edgeHash[grid.id]){
                    grid.weight = edgeHash[grid.id].weight;
                }
            matrix.push(grid);
            })
        })
       container_g.append("g")
            .attr("transform","translate(50,50)")
            .attr("id","adacencyGraph")
            .selectAll("rect")
            .data(matrix)
            .enter()
            .append("rect")
            .attr("width",35)
            .attr("height",35)
            .attr("x", d=> d.x*35)
		    .attr("y", d=> d.y*35)
            .style("stroke","#9A8B7A")
            .style("fill",d=>colorScale(d.weight))
            .on("mouseover", function(d,a) {
                //Get this bar's x/y values, then augment for the tooltip
                var xPosition = parseFloat(d3.select(this).attr("x"))+100;
                var yPosition = parseFloat(d3.select(this).attr("y"))+100;

            //Update the tooltip position and value
            d3.select("#tooltip")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")
            .select("#value")
            .text(a.weight);
            //Show the tooltip
            d3.select("#tooltip").classed("hidden", false);
            })
            .on("mouseout", function() {
            //Hide the tooltip
            d3.select("#tooltip").classed("hidden", true);
        })

        container_g.append("g")
		    .attr("transform","translate(50,45)")
		    .selectAll("text")
		    .data(nodesByName)
		    .enter()
		    .append("text")
            .text(d => d.name)
		    .attr("x", (d,i) => i * 35 + 17.5)
		    .style("text-anchor","middle")
		    .style("font-size","20px")
            .attr("font-family", "sans-serif")

        container_g.append("g")
		    .attr("transform","translate(45,55)")
		    .selectAll("text")
		    .data(nodesByName)
		    .enter()
		    .append("text")
            .text(d => d.name)
		    .attr("y", (d,i) => i * 35 + 16.5)
		    .style("text-anchor","end")
		    .style("font-size","20px")
            .attr("font-family", "sans-serif")
    });
}

main();