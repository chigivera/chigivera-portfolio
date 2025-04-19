import { useQuery } from "@tanstack/react-query";
import { fetchGitHubStats, GitHubStats } from "../lib/gitHubApi";

export function useGithubData() {
  return useQuery<GitHubStats>({ 
    queryKey: ['/api/github/stats'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export default useGithubData;