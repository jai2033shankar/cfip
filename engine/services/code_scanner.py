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
    ".cpy": "cobol",
    ".f": "fortran",
    ".f90": "fortran",
    ".f95": "fortran",
    ".f03": "fortran",
    ".for": "fortran",
    ".pli": "pli",
    ".pl1": "pli",
    ".rpg": "rpg",
    ".rpgle": "rpg",
    ".sqlrpgle": "rpg",
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
            elif language == "cobol":
                # Fixed-format: column 7 is '*' for comment
                if len(line) > 6 and line[6] == '*':
                    count += 1
                # Free-format COBOL inline comments
                elif stripped.startswith("*>"):
                    count += 1
            elif language == "fortran":
                # Fixed-format: C/c/* in column 1
                if line and line[0] in ('C', 'c', '*'):
                    count += 1
                # Free-format: ! comments
                elif stripped.startswith("!"):
                    count += 1
            elif language in ("pli",):
                if "/*" in stripped:
                    in_block = True
                    count += 1
                elif "*/" in stripped:
                    in_block = False
                    count += 1
                elif in_block:
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

            # Hardcoded secrets — expanded patterns
            secret_patterns = [
                ("password =", "Hardcoded Password"),
                ("api_key =", "Hardcoded API Key"),
                ("secret =", "Hardcoded Secret"),
                ("token =", "Hardcoded Token"),
                ("aws_access_key", "AWS Access Key"),
                ("private_key", "Private Key Exposure"),
            ]
            for sp, label in secret_patterns:
                if sp in source.lower() and ("'" in source or '"' in source):
                    patterns.append({
                        "type": "security",
                        "name": label,
                        "severity": "critical",
                        "description": f"Possible hardcoded credential: {sp.strip()}",
                    })
                    break  # One per file to avoid noise

            # XSS risk (innerHTML / dangerouslySetInnerHTML)
            if language in ("javascript", "typescript"):
                if "innerHTML" in source or "dangerouslySetInnerHTML" in source:
                    patterns.append({
                        "type": "security",
                        "name": "Potential XSS Vulnerability",
                        "severity": "high",
                        "description": "Direct HTML injection via innerHTML or dangerouslySetInnerHTML",
                    })

            # Command injection risk
            if language == "python":
                if "os.system(" in source or ("subprocess" in source and "shell=True" in source):
                    patterns.append({
                        "type": "security",
                        "name": "Command Injection Risk",
                        "severity": "critical",
                        "description": "Shell command execution with potential user input",
                    })

                # Insecure deserialization
                if "pickle.loads" in source or "yaml.load(" in source:
                    patterns.append({
                        "type": "security",
                        "name": "Insecure Deserialization",
                        "severity": "high",
                        "description": "Unsafe deserialization can lead to remote code execution",
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

        # COBOL-specific anti-patterns
        if language == "cobol":
            try:
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    source = f.read()

                import re
                goto_matches = re.findall(r"\bGO\s+TO\b", source, re.IGNORECASE)
                if len(goto_matches) > 3:
                    patterns.append({
                        "type": "maintainability",
                        "name": "Excessive GOTO Usage",
                        "severity": "high",
                        "description": f"Found {len(goto_matches)} GO TO statements — spaghetti code risk",
                    })

                if_count = len(re.findall(r"\bIF\b", source, re.IGNORECASE))
                end_if_count = len(re.findall(r"\bEND-IF\b", source, re.IGNORECASE))
                if if_count > 0 and end_if_count < if_count * 0.5:
                    patterns.append({
                        "type": "maintainability",
                        "name": "Deeply Nested IF Without END-IF",
                        "severity": "medium",
                        "description": "Many IF statements lack explicit END-IF scope terminators",
                    })

                if "STOP RUN" not in source.upper() and "GOBACK" not in source.upper():
                    patterns.append({
                        "type": "reliability",
                        "name": "Missing STOP RUN / GOBACK",
                        "severity": "medium",
                        "description": "Program has no explicit termination statement",
                    })

                # Y2K-era date patterns (PIC 99 for year fields)
                if re.search(r"PIC\s+9\(2\).*(?:YEAR|YY|DATE)", source, re.IGNORECASE):
                    patterns.append({
                        "type": "compliance",
                        "name": "Y2K-Era Date Pattern Detected",
                        "severity": "high",
                        "description": "2-digit year field detected — potential date overflow risk",
                    })

            except (FileNotFoundError, UnicodeDecodeError):
                pass

        return patterns
