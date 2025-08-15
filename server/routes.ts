import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";

// Get GitHub token from environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

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
const GITHUB_USERNAME = "chigivera";

// GitHub API base URL
const GITHUB_API = "https://api.github.com";

// Sanity configuration
const SANITY_PROJECT_ID = "lkszte6x";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2024-01-01";
const SANITY_API_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;

// Configure request headers with authentication if token is available
const getGitHubHeaders = () => {
  const headers: Record<string, string> = {
    "Accept": "application/vnd.github+json"
  };
  
  if (GITHUB_TOKEN) {
    headers["Authorization"] = `token ${GITHUB_TOKEN}`;
  }
  
  return { headers };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // GitHub API proxy endpoints
  
  // Get GitHub user profile
  app.get("/api/github/user", async (req, res) => {
    try {
      const response = await axios.get<GitHubUser>(
        `${GITHUB_API}/users/${GITHUB_USERNAME}`,
        getGitHubHeaders()
      );
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
        `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
        getGitHubHeaders()
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
        `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100`,
        getGitHubHeaders()
      );
      
      let totalContributions = 0;
      const contributionWeeks: Array<{w: string, days: number[]}> = [];
      
      // Get commit activity for the user's most active repos
      for (const repo of reposResponse.data.slice(0, 5)) {
        try {
          const commitResponse = await axios.get<ContributionData>(
            `${GITHUB_API}/repos/${GITHUB_USERNAME}/${repo.name}/stats/commit_activity`,
            getGitHubHeaders()
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
        `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100`,
        getGitHubHeaders()
      );
      
      const languageCounts: {[key: string]: number} = {};
      let totalBytes = 0;
      
      // Get languages for each repository
      for (const repo of reposResponse.data.slice(0, 10)) {
        try {
          const langResponse = await axios.get<LanguageData>(
            `${GITHUB_API}/repos/${GITHUB_USERNAME}/${repo.name}/languages`,
            getGitHubHeaders()
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
      const userResponse = await axios.get<GitHubUser>(
        `${GITHUB_API}/users/${GITHUB_USERNAME}`,
        getGitHubHeaders()
      );
      
      // Get repositories
      const reposResponse = await axios.get<GitHubRepo[]>(
        `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100`,
        getGitHubHeaders()
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
            `${GITHUB_API}/repos/${GITHUB_USERNAME}/${repo.name}/languages`,
            getGitHubHeaders()
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
      
      // Get actual contribution data
      let totalCommits = 0;
      const contributionDates: Array<{ date: string; count: number }> = [];
      
      try {
        // Try to get contribution data from commit activity
        // For the user's top repository
        if (reposResponse.data.length > 0) {
          const topRepo = reposResponse.data[0];
          const commitResponse = await axios.get<ContributionData>(
            `${GITHUB_API}/repos/${GITHUB_USERNAME}/${topRepo.name}/stats/commit_activity`,
            getGitHubHeaders()
          );
          
          if (commitResponse.data && commitResponse.data.weeks) {
            // Convert to the format we need and get the most recent 4 weeks
            const weeks = commitResponse.data.weeks.slice(-4);
            totalCommits = weeks.reduce((sum, week) => {
              return sum + week.days.reduce((daySum, count) => daySum + count, 0);
            }, 0);
            
            // Generate dates for these weeks
            weeks.forEach(week => {
              const weekStart = new Date(parseInt(week.w) * 1000);
              
              for (let i = 0; i < 7; i++) {
                const date = new Date(weekStart);
                date.setDate(weekStart.getDate() + i);
                
                contributionDates.push({
                  date: date.toISOString().split('T')[0],
                  count: week.days[i]
                });
              }
            });
          }
        }
      } catch (error) {
        console.error("Error fetching detailed contribution data:", error);
        
        // Fallback to a simplified version without random numbers
        const today = new Date();
        
        // Clear existing array and refill with fallback data
        contributionDates.length = 0;
        
        for (let i = 27; i >= 0; i--) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          
          contributionDates.push({
            date: date.toISOString().split('T')[0],
            count: 0 // Use 0 instead of random numbers
          });
        }
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

  // Sanity API proxy endpoints
  
  // Get all projects
  app.get("/api/sanity/projects", async (req, res) => {
    try {
      const query = `*[_type == "project"] | order(order asc, featured desc, stars desc) {
        _id,
        name,
        description,
        language,
        stars,
        forks,
        category,
        featured,
        type,
        demoUrl,
        codeUrl,
        color,
        order,
        technologies,
        "imageUrl": image.asset->url,
        createdAt,
        updatedAt
      }`;
      
      const response = await axios.get(SANITY_API_URL, {
        params: {
          query,
          returnQuery: false
        }
      });
      
      res.json(response.data.result || []);
    } catch (error) {
      console.error("Error fetching projects from Sanity:", error);
      res.status(500).json({ message: "Error fetching projects from Sanity" });
    }
  });

  // Get featured projects only
  app.get("/api/sanity/projects/featured", async (req, res) => {
    try {
      const query = `*[_type == "project" && featured == true] | order(order asc, stars desc) {
        _id,
        name,
        description,
        language,
        stars,
        forks,
        category,
        featured,
        type,
        demoUrl,
        codeUrl,
        color,
        order,
        technologies,
        "imageUrl": image.asset->url,
        createdAt,
        updatedAt
      }`;
      
      const response = await axios.get(SANITY_API_URL, {
        params: {
          query,
          returnQuery: false
        }
      });
      
      res.json(response.data.result || []);
    } catch (error) {
      console.error("Error fetching featured projects from Sanity:", error);
      res.status(500).json({ message: "Error fetching featured projects from Sanity" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
