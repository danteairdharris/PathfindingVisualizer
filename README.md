# [Graph Theory Pathfinding Visualizer](https://pathfinding-visualizer-app.herokuapp.com/)
## Project Overview
This Web app visualizes a simple alogorithm (Breadth-First Search) as it pertains to shortest path calculation in graph theory. After generating a random graph representation using an adjacency matrix, the app creates and renders the nodes and edges using cytoscape.js. The user can press on the 'BFS' button to calculate the shortest path from the source node to the target node and the app will visualize the process. 

### How to use the Web App:
* After the graph component mounts, you can either re-mount the component to generate another random graph ('Generate new Random Graph') or you can calculate and visualize the shortest path between the source and target nodes (BFS).

## Graph Creation and Representation
The graph representation is stored in an array as an adjacency list. That is, each index represents a node and each node contains the nodes it's connected to. First, there are n nodes created. Each node can only be connected to a node that exists 5 nodes or less away from the current node. This helps keep the graph neat and linear since it's being rendered in 2D. At the same time, when a new node is added, an edgename is created and associated with the pair. As each node and edge is created and added to the adjacency list, a corresponding cytoscape element is being initialized. After n nodes are created, the graph continues to make extra nodes and edges to increase the graphs complexity. Currently, the graph creates a total of n+8 edges. After all the data has been generated, the cytoscape graph is rendered via the graph component.

## BFS Algorithm
The breadthFirst function I created takes the adjacency list graph representaion in and runs a BFS algorithm on it to search for the target node. I used an array to represent the queue structure which held the nodes to be visited and another array which held the previously visited nodes. Additionally, a 'path' array and a 'spread' array are used to hold the final path and the entire list of edges traversed in order respectively. The algorithm takes a node from the adjacency list and looks at its adjacent nodes. Then it adds them to the nodes to be visited while adding the current node to the visited array. Every edge that is traversed is added to the spread array. This algorithm repeats until the target node is found. The path and spread arrays are returned to generate animations and reveal the calculated shortest path.

![alt text](https://github.com/danteairdharris/PathfindingVisualizer/blob/main/app.png)
![alt text](https://github.com/danteairdharris/PathfindingVisualizer/blob/main/visualized.png)
