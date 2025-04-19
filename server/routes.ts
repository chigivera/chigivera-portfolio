import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";

// GitHub API interfaces
interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

interface ContributionData {
  total: number;
  weeks: Array<{
    w: string;
    days: number[];
  }>;
}

interface LanguageData {
  [key: string]: number;
}

// Formatted stats for display
interface GitHubStats {
  repoCount: number;
  stars: number;
  forks: number;
  followers: number;
  commits: number;
  languages: Array<{ name: string; percentage: number }>;
  contributions: Array<{ date: string; count: number }>;
}

// GitHub username
const GITHUB_USERNAME = "chicigvera";

// GitHub API base URL
const GITHUB_API = "https://api.github.com";

export async function registerRoutes(app: Express): Promise<Server> {
  // GitHub API proxy endpoints
  
  // Get GitHub user profile
  app.get("/api/github/user", async (req, res) => {
    try {
      const response = await axios.get<GitHubUser>(`${GITHUB_API}/users/${GITHUB_USERNAME}`);
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching GitHub user:", error);
      res.status(500).json({ message: "Error fetching GitHub user" });
    }
  });

  // Get GitHub repositories
  app.get("/api/github/repos", async (req, res) => {
    try {
      const response = await axios.get<GitHubRepo[]>(
        `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
      );
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching GitHub repos:", error);
      res.status(500).json({ message: "Error fetching GitHub repositories" });
    }
  });

  // Get GitHub user contributions (commit activity)
  app.get("/api/github/contributions", async (req, res) => {
    try {
      // For contribution data, we need to check stats for each repository
      const reposResponse = await axios.get<GitHubRepo[]>(
        `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100`
      );
      
      let totalContributions = 0;
      const contributionWeeks: Array<{w: string, days: number[]}> = [];
      
      // Get commit activity for the user's most active repos
      for (const repo of reposResponse.data.slice(0, 5)) {
        try {
          const commitResponse = await axios.get<ContributionData>(
            `${GITHUB_API}/repos/${GITHUB_USERNAME}/${repo.name}/stats/commit_activity`
          );
          
          if (commitResponse.data && commitResponse.data.weeks) {
            // Combine weeks data
            commitResponse.data.weeks.forEach(week => {
              const existingWeek = contributionWeeks.find(w => w.w === week.w);
              if (existingWeek) {
                // Add days contributions
                week.days.forEach((count, i) => {
                  existingWeek.days[i] += count;
                });
              } else {
                contributionWeeks.push({...week});
              }
            });
            
            totalContributions += commitResponse.data.total;
          }
        } catch (error) {
          console.error(`Error fetching commit activity for ${repo.name}:`, error);
          // Continue with other repos
        }
      }
      
      res.json({
        total: totalContributions,
        weeks: contributionWeeks
      });
    } catch (error) {
      console.error("Error fetching GitHub contributions:", error);
      res.status(500).json({ message: "Error fetching GitHub contributions" });
    }
  });

  // Get GitHub languages data
  app.get("/api/github/languages", async (req, res) => {
    try {
      const reposResponse = await axios.get<GitHubRepo[]>(
        `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100`
      );
      
      const languageCounts: {[key: string]: number} = {};
      let totalBytes = 0;
      
      // Get languages for each repository
      for (const repo of reposResponse.data.slice(0, 10)) {
        try {
          const langResponse = await axios.get<LanguageData>(
            `${GITHUB_API}/repos/${GITHUB_USERNAME}/${repo.name}/languages`
          );
          
          // Sum up languages
          for (const [lang, bytes] of Object.entries(langResponse.data)) {
            languageCounts[lang] = (languageCounts[lang] || 0) + bytes;
            totalBytes += bytes;
          }
        } catch (error) {
          console.error(`Error fetching languages for ${repo.name}:`, error);
          // Continue with other repos
        }
      }
      
      // Convert to percentages
      const languages = Object.entries(languageCounts).map(([name, bytes]) => ({
        name,
        percentage: bytes / totalBytes
      }));
      
      // Sort by percentage descending
      languages.sort((a, b) => b.percentage - a.percentage);
      
      res.json(languages);
    } catch (error) {
      console.error("Error fetching GitHub languages:", error);
      res.status(500).json({ message: "Error fetching GitHub languages" });
    }
  });

  // Get all GitHub stats in one call
  app.get("/api/github/stats", async (req, res) => {
    try {
      // Get user data
      const userResponse = await axios.get<GitHubUser>(`${GITHUB_API}/users/${GITHUB_USERNAME}`);
      
      // Get repositories
      const reposResponse = await axios.get<GitHubRepo[]>(
        `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100`
      );
      
      // Calculate total stars and forks
      let totalStars = 0;
      let totalForks = 0;
      
      reposResponse.data.forEach(repo => {
        totalStars += repo.stargazers_count;
        totalForks += repo.forks_count;
      });
      
      // Language data
      const languageCounts: {[key: string]: number} = {};
      let totalBytes = 0;
      
      // Get languages for top repositories
      for (const repo of reposResponse.data.slice(0, 10)) {
        try {
          const langResponse = await axios.get<LanguageData>(
            `${GITHUB_API}/repos/${GITHUB_USERNAME}/${repo.name}/languages`
          );
          
          // Sum up languages
          for (const [lang, bytes] of Object.entries(langResponse.data)) {
            languageCounts[lang] = (languageCounts[lang] || 0) + bytes;
            totalBytes += bytes;
          }
        } catch (error) {
          console.error(`Error fetching languages for ${repo.name}:`, error);
          // Continue with other repos
        }
      }
      
      // Convert to percentages and format
      const languages = Object.entries(languageCounts)
        .map(([name, bytes]) => ({
          name,
          percentage: bytes / totalBytes
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5); // Top 5 languages
      
      // Get contribution data (simplified for performance)
      // In a real implementation, you would process more detailed contribution data
      const contributionDates = [];
      const today = new Date();
      let totalCommits = 0;
      
      // Generate sample dates for the last 4 weeks
      for (let i = 27; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        // Get a random count between 0-10 for demo purposes
        // In real implementation, fetch actual contribution counts
        const count = Math.floor(Math.random() * 10);
        totalCommits += count;
        
        contributionDates.push({
          date: date.toISOString().split('T')[0],
          count
        });
      }
      
      // Create combined stats object
      const stats: GitHubStats = {
        repoCount: userResponse.data.public_repos,
        stars: totalStars,
        forks: totalForks,
        followers: userResponse.data.followers,
        commits: totalCommits,
        languages,
        contributions: contributionDates
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching GitHub stats:", error);
      res.status(500).json({ message: "Error fetching GitHub statistics" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
