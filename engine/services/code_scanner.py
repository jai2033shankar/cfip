"""
Code Scanner — Directory traversal, file classification, and code metrics.
"""

import os
from typing import Optional


LANGUAGE_MAP = {
    ".py": "python",
    ".js": "javascript",
    ".jsx": "javascript",
    ".ts": "typescript",
    ".tsx": "typescript",
    ".java": "java",
    ".cs": "csharp",
    ".go": "go",
    ".kt": "kotlin",
    ".sql": "sql",
    ".rb": "ruby",
    ".rs": "rust",
    ".cpp": "cpp",
    ".c": "c",
    ".h": "c",
    ".cob": "cobol",
    ".cbl": "cobol",
}

EXCLUDE_DIRS = {
    "node_modules", ".git", "__pycache__", ".venv", "venv", "env",
    "build", "dist", ".next", ".cache", "target", "bin", "obj",
    ".idea", ".vscode", ".gradle",
}


class CodeScanner:
    """Scans directories and classifies source files."""

    def scan_directory(self, directory: str) -> dict:
        """Scan a directory and return file metadata."""
        files = []
        metrics = {
            "total_files": 0,
            "total_loc": 0,
            "languages": {},
            "largest_file": {"path": "", "loc": 0},
            "file_types": {},
        }

        for root, dirs, filenames in os.walk(directory):
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

            for filename in filenames:
                filepath = os.path.join(root, filename)
                ext = os.path.splitext(filename)[1].lower()
                language = LANGUAGE_MAP.get(ext)

                if not language:
                    continue

                try:
                    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                        lines = f.readlines()

                    loc = len(lines)
                    blank_lines = sum(1 for l in lines if l.strip() == "")
                    comment_lines = self._count_comments(lines, language)
                    code_lines = loc - blank_lines - comment_lines

                    file_info = {
                        "path": filepath,
                        "relative_path": os.path.relpath(filepath, directory),
                        "filename": filename,
                        "language": language,
                        "extension": ext,
                        "loc": loc,
                        "code_lines": code_lines,
                        "blank_lines": blank_lines,
                        "comment_lines": comment_lines,
                        "comment_ratio": round(comment_lines / max(loc, 1) * 100, 1),
                        "size_bytes": os.path.getsize(filepath),
                    }
                    files.append(file_info)

                    # Update metrics
                    metrics["total_files"] += 1
                    metrics["total_loc"] += loc
                    metrics["languages"][language] = metrics["languages"].get(language, 0) + 1
                    metrics["file_types"][ext] = metrics["file_types"].get(ext, 0) + 1

                    if loc > metrics["largest_file"]["loc"]:
                        metrics["largest_file"] = {"path": filepath, "loc": loc}

                except (OSError, UnicodeDecodeError):
                    continue

        return {"files": files, "metrics": metrics}

    def _count_comments(self, lines: list, language: str) -> int:
        """Count comment lines based on language."""
        count = 0
        in_block = False

        for line in lines:
            stripped = line.strip()

            if language in ("python", "ruby"):
                if stripped.startswith("#"):
                    count += 1
                elif stripped.startswith('"""') or stripped.startswith("'''"):
                    in_block = not in_block
                    count += 1
                elif in_block:
                    count += 1
            elif language in ("javascript", "typescript", "java", "csharp", "go", "kotlin", "cpp", "c", "rust"):
                if stripped.startswith("//"):
                    count += 1
                elif "/*" in stripped:
                    in_block = True
                    count += 1
                elif "*/" in stripped:
                    in_block = False
                    count += 1
                elif in_block:
                    count += 1
            elif language == "sql":
                if stripped.startswith("--"):
                    count += 1

        return count

    def detect_anti_patterns(self, filepath: str, language: str) -> list:
        """Detect common anti-patterns in source code."""
        patterns = []
        try:
            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                source = f.read()

            # SQL Injection risk
            if language in ("python", "java", "javascript"):
                if "execute(" in source and "+" in source and ("SELECT" in source or "INSERT" in source):
                    patterns.append({
                        "type": "security",
                        "name": "Potential SQL Injection",
                        "severity": "critical",
                        "description": "String concatenation detected in SQL query construction",
                    })

            # Hardcoded secrets
            secret_patterns = ["password =", "api_key =", "secret =", "token ="]
            for sp in secret_patterns:
                if sp in source.lower() and ("'" in source or '"' in source):
                    patterns.append({
                        "type": "security",
                        "name": "Potential Hardcoded Secret",
                        "severity": "high",
                        "description": f"Possible hardcoded credential detected: {sp.strip()}",
                    })

            # Large function detection
            if language == "python":
                import ast as _ast
                try:
                    tree = _ast.parse(source)
                    for node in _ast.walk(tree):
                        if isinstance(node, _ast.FunctionDef):
                            func_len = getattr(node, "end_lineno", node.lineno) - node.lineno
                            if func_len > 100:
                                patterns.append({
                                    "type": "maintainability",
                                    "name": "Oversized Function",
                                    "severity": "medium",
                                    "description": f"Function {node.name} is {func_len} lines long",
                                })
                except SyntaxError:
                    pass

        except (FileNotFoundError, UnicodeDecodeError):
            pass

        return patterns
