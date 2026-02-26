"""
Graph Builder — Constructs dependency graphs from parsed AST data.
Uses NetworkX for graph operations and exports as JSON for frontend.
"""

import networkx as nx
from typing import Optional


class CodeGraphBuilder:
    def __init__(self):
        self.graph = nx.DiGraph()
        self.current_graph = None

    def build_graph(self, parsed_nodes: list) -> dict:
        """Build a dependency graph from parsed AST nodes."""
        self.graph = nx.DiGraph()

        # Add nodes
        for node in parsed_nodes:
            if node.get("type") in ("function", "class"):
                self.graph.add_node(
                    node["id"],
                    label=node.get("label", ""),
                    type=node.get("type", "unknown"),
                    file=node.get("file", ""),
                    language=node.get("language", ""),
                    line_start=node.get("line_start", 0),
                    complexity=node.get("complexity", 0),
                )

        # Add edges based on call relationships
        node_labels = {n.get("label", "").replace("()", ""): n["id"] for n in parsed_nodes if n.get("type") == "function"}

        for node in parsed_nodes:
            if node.get("type") == "function" and "calls" in node:
                for call in node["calls"]:
                    if call in node_labels:
                        self.graph.add_edge(
                            node["id"],
                            node_labels[call],
                            type="calls",
                            weight=1,
                        )

            # Class inheritance edges
            if node.get("type") == "class" and "bases" in node:
                for base in node["bases"]:
                    class_labels = {n.get("label", ""): n["id"] for n in parsed_nodes if n.get("type") == "class"}
                    if base in class_labels:
                        self.graph.add_edge(
                            node["id"],
                            class_labels[base],
                            type="extends",
                            weight=2,
                        )

        # Add import edges
        for node in parsed_nodes:
            if node.get("type") == "import":
                # Find the source file
                source_file = node.get("file", "")
                for other_node in parsed_nodes:
                    if other_node.get("type") in ("function", "class"):
                        if node.get("label", "") in other_node.get("file", ""):
                            self.graph.add_edge(
                                f"{source_file}:module",
                                other_node["id"],
                                type="depends_on",
                                weight=1,
                            )

        self.current_graph = self.graph

        return self.export_graph()

    def export_graph(self) -> dict:
        """Export graph as JSON-compatible dict."""
        nodes = []
        for node_id, data in self.graph.nodes(data=True):
            node_data = {"id": node_id, **data}

            # Calculate node metrics
            in_degree = self.graph.in_degree(node_id)
            out_degree = self.graph.out_degree(node_id)
            descendants = len(list(nx.descendants(self.graph, node_id))) if self.graph.has_node(node_id) else 0

            node_data["in_degree"] = in_degree
            node_data["out_degree"] = out_degree
            node_data["downstream_count"] = descendants

            nodes.append(node_data)

        edges = []
        for source, target, data in self.graph.edges(data=True):
            edges.append({
                "source": source,
                "target": target,
                **data,
            })

        return {
            "nodes": nodes,
            "edges": edges,
            "metrics": {
                "total_nodes": len(nodes),
                "total_edges": len(edges),
                "density": nx.density(self.graph) if len(self.graph) > 0 else 0,
                "components": nx.number_weakly_connected_components(self.graph) if len(self.graph) > 0 else 0,
                "avg_clustering": 0,
            },
        }

    def get_subgraph(self, node_id: str, depth: int = 2) -> dict:
        """Get a subgraph centered on a node up to specified depth."""
        if not self.graph.has_node(node_id):
            return {"nodes": [], "edges": []}

        # BFS to find nodes within depth
        visited = {node_id}
        frontier = {node_id}
        for _ in range(depth):
            next_frontier = set()
            for n in frontier:
                for neighbor in self.graph.predecessors(n):
                    if neighbor not in visited:
                        visited.add(neighbor)
                        next_frontier.add(neighbor)
                for neighbor in self.graph.successors(n):
                    if neighbor not in visited:
                        visited.add(neighbor)
                        next_frontier.add(neighbor)
            frontier = next_frontier

        subgraph = self.graph.subgraph(visited)
        nodes = [{"id": n, **subgraph.nodes[n]} for n in subgraph.nodes]
        edges = [{"source": u, "target": v, **d} for u, v, d in subgraph.edges(data=True)]

        return {"nodes": nodes, "edges": edges}
