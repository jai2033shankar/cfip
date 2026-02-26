"""
GitHub Client — Clone repos, fetch commit history, and manage GitHub integration.
"""

import os
import tempfile
import shutil
from typing import Optional

try:
    from git import Repo
except ImportError:
    Repo = None

try:
    import requests
except ImportError:
    requests = None


class GitHubClient:
    """Handles GitHub repository operations."""

    def __init__(self):
        self.clone_base = os.path.join(tempfile.gettempdir(), "cfip_repos")
        os.makedirs(self.clone_base, exist_ok=True)

    def clone_repo(self, url: str, pat: str) -> str:
        """Clone a GitHub repository using PAT authentication."""
        if Repo is None:
            raise ImportError("GitPython is required for GitHub operations")

        # Extract repo name from URL
        repo_name = url.rstrip("/").split("/")[-1].replace(".git", "")
        target_dir = os.path.join(self.clone_base, repo_name)

        # Clean existing clone
        if os.path.exists(target_dir):
            shutil.rmtree(target_dir)

        # Construct authenticated URL
        if "github.com" in url:
            auth_url = url.replace("https://", f"https://{pat}@")
        else:
            auth_url = url

        try:
            Repo.clone_from(auth_url, target_dir, depth=1)
            return target_dir
        except Exception as e:
            raise RuntimeError(f"Failed to clone repository: {str(e)}")

    def list_repos(self, org: str, pat: str) -> list:
        """List repositories in a GitHub organization."""
        if requests is None:
            return []

        headers = {
            "Authorization": f"token {pat}",
            "Accept": "application/vnd.github.v3+json",
        }

        repos = []
        page = 1
        while True:
            response = requests.get(
                f"https://api.github.com/orgs/{org}/repos?per_page=100&page={page}",
                headers=headers,
                timeout=30,
            )
            if response.status_code != 200:
                break

            data = response.json()
            if not data:
                break

            for repo in data:
                repos.append({
                    "name": repo["name"],
                    "full_name": repo["full_name"],
                    "url": repo["clone_url"],
                    "language": repo.get("language", "Unknown"),
                    "default_branch": repo.get("default_branch", "main"),
                    "size": repo.get("size", 0),
                    "updated_at": repo.get("updated_at", ""),
                })
            page += 1

        return repos

    def get_commit_history(self, repo_dir: str, limit: int = 50) -> list:
        """Get commit history for a cloned repository."""
        if Repo is None:
            return []

        try:
            repo = Repo(repo_dir)
            commits = []
            for commit in repo.iter_commits(max_count=limit):
                commits.append({
                    "hash": commit.hexsha[:8],
                    "message": commit.message.strip().split("\n")[0],
                    "author": str(commit.author),
                    "date": commit.committed_datetime.isoformat(),
                    "files_changed": len(commit.stats.files),
                })
            return commits
        except Exception:
            return []

    def get_contributors(self, repo_dir: str) -> list:
        """Get contributor list for a repository."""
        if Repo is None:
            return []

        try:
            repo = Repo(repo_dir)
            contributors = {}
            for commit in repo.iter_commits(max_count=500):
                author = str(commit.author)
                if author not in contributors:
                    contributors[author] = {"name": author, "commits": 0, "files_touched": set()}
                contributors[author]["commits"] += 1
                contributors[author]["files_touched"].update(commit.stats.files.keys())

            result = []
            for name, data in contributors.items():
                result.append({
                    "name": name,
                    "commits": data["commits"],
                    "files_touched": len(data["files_touched"]),
                })
            return sorted(result, key=lambda x: x["commits"], reverse=True)
        except Exception:
            return []
