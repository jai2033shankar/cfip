"""
AST Parser — Multi-language Abstract Syntax Tree analysis
Extracts functions, classes, imports, and call relationships from source code.
"""

import ast
import os
import re
from typing import Optional


class ASTParser:
    """Parses source files and extracts structural information."""

    def parse_file(self, filepath: str, language: str) -> list:
        """Parse a file and return extracted code elements."""
        if language == "python":
            return self._parse_python(filepath)
        elif language in ("javascript", "typescript"):
            return self._parse_js_ts(filepath)
        elif language == "java":
            return self._parse_java(filepath)
        else:
            return self._parse_generic(filepath, language)

    def _parse_python(self, filepath: str) -> list:
        """Parse Python files using the ast module."""
        nodes = []
        try:
            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                source = f.read()
            tree = ast.parse(source, filename=filepath)

            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef) or isinstance(node, ast.AsyncFunctionDef):
                    calls = []
                    for child in ast.walk(node):
                        if isinstance(child, ast.Call):
                            if hasattr(child.func, "id"):
                                calls.append(child.func.id)
                            elif hasattr(child.func, "attr"):
                                calls.append(child.func.attr)

                    nodes.append({
                        "id": f"{filepath}:{node.name}",
                        "label": f"{node.name}()",
                        "type": "function",
                        "file": filepath,
                        "line_start": node.lineno,
                        "line_end": getattr(node, "end_lineno", node.lineno),
                        "language": "python",
                        "calls": calls,
                        "args": [arg.arg for arg in node.args.args],
                        "complexity": self._estimate_complexity(node),
                        "decorators": [
                            self._get_decorator_name(d) for d in node.decorator_list
                        ],
                    })

                elif isinstance(node, ast.ClassDef):
                    methods = [
                        n.name
                        for n in ast.walk(node)
                        if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef))
                    ]
                    nodes.append({
                        "id": f"{filepath}:{node.name}",
                        "label": node.name,
                        "type": "class",
                        "file": filepath,
                        "line_start": node.lineno,
                        "line_end": getattr(node, "end_lineno", node.lineno),
                        "language": "python",
                        "methods": methods,
                        "bases": [self._get_name(b) for b in node.bases],
                    })

                elif isinstance(node, ast.Import):
                    for alias in node.names:
                        nodes.append({
                            "id": f"{filepath}:import:{alias.name}",
                            "label": alias.name,
                            "type": "import",
                            "file": filepath,
                            "language": "python",
                        })

                elif isinstance(node, ast.ImportFrom):
                    module = node.module or ""
                    for alias in node.names:
                        nodes.append({
                            "id": f"{filepath}:import:{module}.{alias.name}",
                            "label": f"{module}.{alias.name}",
                            "type": "import",
                            "file": filepath,
                            "language": "python",
                        })

        except (SyntaxError, FileNotFoundError, UnicodeDecodeError):
            pass

        return nodes

    def _parse_js_ts(self, filepath: str) -> list:
        """Parse JavaScript/TypeScript files using regex-based extraction."""
        nodes = []
        try:
            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                source = f.read()
                lines = source.split("\n")

            # Extract functions
            func_patterns = [
                r"(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(",
                r"(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\(",
                r"(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?function",
                r"(\w+)\s*:\s*(?:async\s+)?\(",
            ]

            for pattern in func_patterns:
                for match in re.finditer(pattern, source):
                    line_num = source[: match.start()].count("\n") + 1
                    nodes.append({
                        "id": f"{filepath}:{match.group(1)}",
                        "label": f"{match.group(1)}()",
                        "type": "function",
                        "file": filepath,
                        "line_start": line_num,
                        "language": "typescript" if filepath.endswith(".ts") or filepath.endswith(".tsx") else "javascript",
                    })

            # Extract classes
            class_pattern = r"(?:export\s+)?class\s+(\w+)"
            for match in re.finditer(class_pattern, source):
                line_num = source[: match.start()].count("\n") + 1
                nodes.append({
                    "id": f"{filepath}:{match.group(1)}",
                    "label": match.group(1),
                    "type": "class",
                    "file": filepath,
                    "line_start": line_num,
                    "language": "typescript" if filepath.endswith((".ts", ".tsx")) else "javascript",
                })

            # Extract imports
            import_pattern = r"import\s+.*?from\s+['\"](.+?)['\"]"
            for match in re.finditer(import_pattern, source):
                nodes.append({
                    "id": f"{filepath}:import:{match.group(1)}",
                    "label": match.group(1),
                    "type": "import",
                    "file": filepath,
                    "language": "typescript" if filepath.endswith((".ts", ".tsx")) else "javascript",
                })

        except (FileNotFoundError, UnicodeDecodeError):
            pass

        return nodes

    def _parse_java(self, filepath: str) -> list:
        """Parse Java files using regex-based extraction."""
        nodes = []
        try:
            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                source = f.read()

            # Extract classes
            class_pattern = r"(?:public|private|protected)?\s*(?:abstract|final)?\s*class\s+(\w+)"
            for match in re.finditer(class_pattern, source):
                line_num = source[: match.start()].count("\n") + 1
                nodes.append({
                    "id": f"{filepath}:{match.group(1)}",
                    "label": match.group(1),
                    "type": "class",
                    "file": filepath,
                    "line_start": line_num,
                    "language": "java",
                })

            # Extract methods
            method_pattern = r"(?:public|private|protected)\s+(?:static\s+)?(?:\w+(?:<[^>]+>)?)\s+(\w+)\s*\("
            for match in re.finditer(method_pattern, source):
                line_num = source[: match.start()].count("\n") + 1
                nodes.append({
                    "id": f"{filepath}:{match.group(1)}",
                    "label": f"{match.group(1)}()",
                    "type": "function",
                    "file": filepath,
                    "line_start": line_num,
                    "language": "java",
                })

        except (FileNotFoundError, UnicodeDecodeError):
            pass

        return nodes

    def _parse_generic(self, filepath: str, language: str) -> list:
        """Generic parser that extracts basic file info."""
        try:
            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                lines = f.readlines()
            return [{
                "id": filepath,
                "label": os.path.basename(filepath),
                "type": "file",
                "file": filepath,
                "language": language,
                "loc": len(lines),
            }]
        except (FileNotFoundError, UnicodeDecodeError):
            return []

    def _estimate_complexity(self, node) -> int:
        """Estimate cyclomatic complexity of a function."""
        complexity = 1
        for child in ast.walk(node):
            if isinstance(child, (ast.If, ast.While, ast.For, ast.ExceptHandler)):
                complexity += 1
            elif isinstance(child, ast.BoolOp):
                complexity += len(child.values) - 1
        return complexity

    def _get_decorator_name(self, decorator) -> str:
        if hasattr(decorator, "id"):
            return decorator.id
        elif hasattr(decorator, "attr"):
            return decorator.attr
        return str(decorator)

    def _get_name(self, node) -> str:
        if hasattr(node, "id"):
            return node.id
        elif hasattr(node, "attr"):
            return node.attr
        return str(node)
