export function breadthSearch(adj) {
    var animations = [0,0];
    var q = [];
    var visited = [];
    var path = [];
    var spread = [];

    var previous = [];
    for (let i = 0; i < adj.length; i++) {
        previous[i] = 0;
    }
    
    visited.push(0);
    q.push(0);
    
    while (q.length !== 0) {
        var node_source = q.shift();
        for (let i = 0; i < adj[node_source].length; i++) {
            var node_target = adj[node_source][i];
            spread.push([node_target, node_source]);
            if (visited.includes(node_target) === false) {
                q.push(node_target);
                visited.push(node_target);
                previous[node_target] = node_source;
            }
        }
    }

    var n = adj.length-1;
    while (n !== 0) {
        path.push(n);
        n = previous[n];
    }
    path.push(0);
    animations[0] = spread;
    animations[1] = path;

    return animations;
}