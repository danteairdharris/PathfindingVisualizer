import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import {breadthSearch} from '../Algorithms/bfs'
import './GraphComponent.css'

cytoscape.use(cola);

export default class GraphComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            w: 0,
            h: 0,
            elements: [],
            options: {
                name: 'cola',
                randomize: true,
                padding: 150,
                avoidOverlap: true,
                maxSimulationTime: 10000,
            },
            // number of nodes present in each new graph
            nodes: 100,
            // current method of keeping track of which nodes are connected to each other: adjaceny List 
            adjacencyList: [],
        };
    }

    componentDidMount() {
        // set the dimensions of container upon mount
        this.setState({
            w: window.innerWidth,
            h: window.innerHeight,
        });
        // create a new graph
        this.resetGraph();
    }

    resetGraph() {
        this.newGraph(this.state.nodes);
    }

    newGraph(n) {
        //clear the graph
        this.cy.elements().remove();
        const edgeList = [];
        const adjList = [];
        //target number of edges: add more to n to make the final graph more chaotic
        const n_edges = n + 8;
        //to make sure there are at least n edges
        var count = n;
        var edgeName = "";
        var randNode = 0;
        //initialize first node with proper values
        this.cy.add({data: {id: "0", label: "n0"}});
        //initialize 2d array: adjacency list
        for (let i = 0; i < n; i++) {
            adjList[i] = [];
        }


        //creation of the graph
        for (let i = 1; i < n; i++) {
            /* the graph only adds edges to a random node 'randNode' within 5 steps from the most recently visited node. 
               this creates a more spread out and linear graph.
            */
            if (i >= 5){
                randNode = RandomIntFromInterval(i-5, i-1);
            } else {
                randNode = RandomIntFromInterval(0, i-1);
            }
            //if at the last node, label it target
            if (i === n-1) {
                this.cy.add({data: {id: i.toString(), label: "target"}});
            } else {
                this.cy.add({data: {id: i.toString(), label: ""}});
            }

            /*create an edge between the current node and a random node within 5 steps and label it with a string that is composed of the 
              source node number + e + target node number.
              Example:   node 8 ---> node 4       would have label: 8e4
              Push this edgename onto array of edgenames and update the adjacency list accordingly.
            */

            this.cy.add({data: {id: randNode.toString()+"e"+i.toString(), source: randNode.toString(), target: i.toString(), label: "e"+i.toString()}});
            edgeName = randNode.toString() + i.toString();
            edgeList.push(edgeName);
            adjList[randNode].push(i);
            adjList[i].push(randNode);
        }

        //after reaching n edges and until reaching target number of edges, add edges between random nodes.
        while (count <= n_edges) {
            var node1 = "0";
            var node2 = "0";
            for ( let i = 0; i < edgeList.length; i++) {
                //handling duplicate edges
                if ((edgeList[i].includes(node1) && edgeList[i].includes(node2)) || node1 === node2) {
                    i = 0;
                    node1 = RandomIntFromInterval(1, n-1).toString();
                    node2 = RandomIntFromInterval(1, n-1).toString();
                }
            }
            this.cy.add({data: {id: node1+"e"+node2, source: node1, target: node2, label: "e"+count.toString()}});
            edgeName = node1 + node2;
            edgeList.push(edgeName);
            adjList[parseInt(node1)].push(parseInt(node2));
            adjList[parseInt(node2)].push(parseInt(node1));
            count++;
        }
        //update adjacency list in state
        this.setState({
            adjacencyList: adjList
        });
    }

    breadthFirstSearch() {
        this.animations(breadthSearch(this.state.adjacencyList));
    }

    //this function is passed an array of edgenames to apply animations to.
    animations(p) {
        //controls timing of first round of animations: the search
        const SPREAD_DELAY = 25;
        //controls timing of second round of animations: the path
        const PATH_DELAY = 100;
        var time = 0;
        //access the element with corresponding edgename and change color after a timeout
        this.cy.$id(p[0].toString()).style('background-color', 'red');
        for (let i = 0; i < p[0].length; i++) {
            const source = p[0][i][0];
            const target = p[0][i][1];
            time = i * SPREAD_DELAY;
            setTimeout(() => {
                this.cy.$id(`${source}e${target}`).style('line-color', 'green');
                this.cy.$id(`${target}e${source}`).style('line-color', 'green');
            }, i * SPREAD_DELAY);
        }

        for (let i = 1; i < p[1].length; i++) {
            const source = p[1][i];
            const target = p[1][i-1];
            //access the element with corresponding edgename and change color after a timeout
            setTimeout(() => {
                this.cy.$id(target.toString()).style('background-color', 'red');
                this.cy.$id(`${source}e${target}`).style('line-style', 'dashed');
                this.cy.$id(`${source}e${target}`).style('line-color', '#BB371B');
                this.cy.$id(`${target}e${source}`).style('line-style', 'dashed');
                this.cy.$id(`${target}e${source}`).style('line-color', '#BB371B');
            }, time + (i * PATH_DELAY));
        }
    }

    render() {
        return (
            <div>
                <div className="button-container">
                    <button className="button" onClick={refreshPage}>Generate New Random Graph</button>
                    <button className="button" onClick={ () => this.breadthFirstSearch()}>Shortest Path (BFS)</button>
                </div>
                <div className="visualizer-container">
                    <CytoscapeComponent 
                    elements={this.state.elements} 
                    cy={(cy) => { 
                        this.cy = cy 
                        cy.on('resize', _evt => {
                            cy.layout(this.state.options).run()
                            cy.fit()
                        })
                    }} 
                    style={{
                            width: this.state.w, 
                            height: this.state.h
                    }}
                    stylesheet={[
                        {
                            selector: 'node',
                            style: {
                                width: 20,
                                height: 20,
                                label: 'data(label)',
                                backgroundColor: 'black',
                                "font-size": 45
                            }
                        },
                        {
                            selector: 'edge',
                            style: {
                                width: 10,
                                "line-color": 'cyan',
                                "line-style": 'solid',
                                
                            }
                        }
                    ]} >
                    </CytoscapeComponent>
                </div>
            </div>
        )
    }
}

function RandomIntFromInterval(min, max) {
    return Math.floor(Math.random() * ( max - min + 1) + min);
}

function refreshPage() {
    window.location.reload(false);
}