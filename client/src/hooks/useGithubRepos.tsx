import { useQuery } from "@tanstack/react-query";
import { fetchGitHubRepos, GitHubRepo } from "../lib/gitHubApi";
import { useState, useMemo } from "react";

// Available filters for repositories
export type FilterType = "all" | "popular" | "recent" | "language";

// New interface for the updated API response
interface GitHubReposResponse {
  repos: GitHubRepo[];
  profileUrl: string;
  totalRepos: number;
  error?: string;
}

export function useGithubRepos(initialFilter: FilterType = "all") {
  const [filter, setFilter] = useState<FilterType>(initialFilter);
  const [languageFilter, setLanguageFilter] = useState<string>("");
  
  // Fetch repositories from GitHub API
  const reposQuery = useQuery<GitHubReposResponse>({ 
    queryKey: ['/api/github/repos'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Get all unique languages from repositories
  const languages = useMemo(() => {
    if (!reposQuery.data?.repos) return [];
    
    // Extract unique languages
    const uniqueLanguages = new Set<string>();
    reposQuery.data.repos.forEach(repo => {
      if (repo.language) {
        uniqueLanguages.add(repo.language);
      }
    });
    
    return Array.from(uniqueLanguages).sort();
  }, [reposQuery.data]);
  
  // Apply filters to repositories
  const filteredRepos = useMemo(() => {
    if (!reposQuery.data?.repos) return [];
    
    let result = [...reposQuery.data.repos];
    
    // Apply main filter
    switch (filter) {
      case "popular":
        // Sort by stars
        result = result.sort((a, b) => b.stargazers_count - a.stargazers_count);
        break;
      case "recent":
        // Already sorted by updated date from the API
        break;
      case "language":
        // Filter by selected language
        if (languageFilter) {
          result = result.filter(repo => repo.language === languageFilter);
        }
        break;
      default:
        // "all" - no additional filtering
        break;
    }
    
    return result;
  }, [reposQuery.data, filter, languageFilter]);
  
  return {
    repos: filteredRepos,
    isLoading: reposQuery.isLoading,
    error: reposQuery.error,
    filter,
    setFilter,
    languages,
    languageFilter,
    setLanguageFilter,
    profileUrl: reposQuery.data?.profileUrl || `https://github.com/chigivera`,
    totalRepos: reposQuery.data?.totalRepos || 0
  };
}

export default useGithubRepos;