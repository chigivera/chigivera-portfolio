import axios from "axios";
import { GITHUB_USERNAME } from "./constants";

const BASE_URL = "/api/github";

// GitHub user profile data
export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

// GitHub repository data
export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

// GitHub languages data
export interface LanguageData {
  [key: string]: number;
}

// GitHub contribution data
export interface ContributionData {
  weeks: Array<{
    w: string;
    days: number[];
  }>;
  total: number;
}

// Formatted stats for display
export interface GitHubStats {
  repoCount: number;
  stars: number;
  forks: number;
  followers: number;
  commits: number;
  languages: Array<{ name: string; percentage: number }>;
  contributions: Array<{ date: string; count: number }>;
}

// Fetch GitHub user profile
export const fetchGitHubUser = async (): Promise<GitHubUser> => {
  try {
    const response = await axios.get(`${BASE_URL}/user`);
    return response.data;
  } catch (error) {
    console.error("Error fetching GitHub user:", error);
    throw error;
  }
};

// Fetch GitHub user repositories
export const fetchGitHubRepos = async (): Promise<GitHubRepo[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/repos`);
    return response.data;
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    throw error;
  }
};

// Fetch GitHub user contribution data
export const fetchGitHubContributions = async (): Promise<ContributionData> => {
  try {
    const response = await axios.get(`${BASE_URL}/contributions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    throw error;
  }
};

// Fetch GitHub languages data
export const fetchGitHubLanguages = async (): Promise<LanguageData> => {
  try {
    const response = await axios.get(`${BASE_URL}/languages`);
    return response.data;
  } catch (error) {
    console.error("Error fetching GitHub languages:", error);
    throw error;
  }
};

// Fetch all GitHub stats in one call
export const fetchGitHubStats = async (): Promise<GitHubStats> => {
  try {
    const response = await axios.get(`${BASE_URL}/stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    throw error;
  }
};
