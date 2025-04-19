import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import useGithubData from '../hooks/useGithubData';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { PieChart, Pie } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Github as GithubIcon } from 'lucide-react';

export default function Github() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { data: githubData, isLoading, error } = useGithubData();
  
  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  // Placeholder data for when the real data is loading
  const placeholderStats = {
    repoCount: 0,
    stars: 0,
    forks: 0,
    followers: 0,
    commits: 0,
    languages: [],
    contributions: []
  };
  
  // Generate colors for charts
  const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];
  
  // Format contribution data for chart
  const contributionChartData = githubData?.contributions.slice(-28) || [];
  
  // Language data for pie chart
  const languageData = githubData?.languages || [];
  
  // Placeholder repositories for when data is loading
  const placeholderRepos = [
    { name: 'Loading...', stars: 0, language: 'JavaScript', description: 'Loading project description...' },
    { name: 'Loading...', stars: 0, language: 'Python', description: 'Loading project description...' },
    { name: 'Loading...', stars: 0, language: 'TypeScript', description: 'Loading project description...' }
  ];
  
  return (
    <section id="github" ref={ref} className="py-20 bg-card relative">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-orbitron font-bold text-3xl md:text-5xl mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-foreground">MY </span>
          <span className="text-primary neon-text-primary">GITHUB </span>
          <span className="text-foreground">ACTIVITY</span>
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* GitHub Stats Card */}
          <motion.div 
            className="bg-background p-6 rounded-lg border border-primary"
            variants={itemVariants}
          >
            <h3 className="font-orbitron text-xl mb-4 text-primary">Stats Overview</h3>
            
            <div className="space-y-4">
              {isLoading ? (
                // Show skeleton loaders while loading
                Array(5).fill(0).map((_, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))
              ) : error ? (
                <div className="text-red-500">Error loading GitHub data</div>
              ) : (
                // Display actual stats
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Repositories</span>
                    <span className="text-primary font-orbitron">{githubData?.repoCount || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Stars</span>
                    <span className="text-secondary font-orbitron">{githubData?.stars || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Forks</span>
                    <span className="text-accent font-orbitron">{githubData?.forks || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Followers</span>
                    <span className="text-primary font-orbitron">{githubData?.followers || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Commits</span>
                    <span className="text-secondary font-orbitron">
                      {githubData?.commits.toLocaleString() || 0}
                    </span>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-6 flex justify-center">
              <a 
                href="https://github.com/chigivera" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-primary hover:text-foreground transition-colors"
              >
                <GithubIcon className="mr-2 h-4 w-4" /> Visit Profile
              </a>
            </div>
          </motion.div>
          
          {/* Contribution Graph */}
          <motion.div 
            className="bg-background p-6 rounded-lg border border-secondary col-span-1 md:col-span-2"
            variants={itemVariants}
          >
            <h3 className="font-orbitron text-xl mb-4 text-secondary">Contribution Activity</h3>
            
            <div className="h-48 mb-6">
              {isLoading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contributionChartData}>
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      tickFormatter={(date) => {
                        const parsedDate = new Date(date);
                        return `${parsedDate.getDate()}/${parsedDate.getMonth() + 1}`;
                      }}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} contributions`, 'Count']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.375rem',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Bar dataKey="count" name="Contributions">
                      {contributionChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            
            {/* Language Usage Chart */}
            <div className="mt-8">
              <h4 className="font-orbitron text-secondary mb-3">Language Distribution</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-48">
                  {isLoading ? (
                    <Skeleton className="w-full h-full rounded-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={languageData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="percentage"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {languageData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={chartColors[index % chartColors.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${Number(value * 100).toFixed(1)}%`, 'Percentage']}
                          contentStyle={{ 
                            background: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '0.375rem',
                            color: 'hsl(var(--foreground))'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 content-center">
                  {isLoading ? (
                    Array(6).fill(0).map((_, index) => (
                      <div key={index} className="flex items-center">
                        <Skeleton className="w-3 h-3 mr-2 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))
                  ) : (
                    languageData.map((lang, index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="w-3 h-3 mr-2 rounded-full" 
                          style={{ backgroundColor: chartColors[index % chartColors.length] }}
                        ></div>
                        <span className="text-xs text-muted-foreground">
                          {lang.name} ({(lang.percentage * 100).toFixed(0)}%)
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Pinned Repositories */}
          <motion.div 
            className="col-span-1 md:col-span-3 mt-8"
            variants={itemVariants}
          >
            <h3 className="font-orbitron text-xl mb-6 text-accent">Pinned Repositories</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                // Placeholder cards while loading
                Array(3).fill(0).map((_, index) => (
                  <Card key={index} className="bg-background p-4 rounded-lg border border-primary">
                    <div className="flex justify-between items-start mb-3">
                      <Skeleton className="h-6 w-24" />
                      <div className="flex items-center">
                        <Skeleton className="h-4 w-8" />
                      </div>
                    </div>
                    
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Skeleton className="w-2 h-2 rounded-full mr-1" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <div className="flex space-x-2">
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                    </div>
                  </Card>
                ))
              ) : error ? (
                <div className="col-span-3 text-red-500 text-center">
                  Error loading GitHub repositories
                </div>
              ) : (
                // Replace with actual pinned repos when fetched
                ['primary', 'secondary', 'accent'].map((color, index) => (
                  <motion.div 
                    key={index}
                    className={`bg-background p-4 rounded-lg border border-${color} hover:neon-border-${color} transition-colors`}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className={`font-orbitron text-${color}`}>
                        {['AI-ChatBot', 'ReactCRM', 'DataVizLib'][index]}
                      </h4>
                      <div className="flex items-center">
                        <span className={`text-${color} mr-1`}>★</span>
                        <span className="text-muted-foreground text-sm">{[86, 64, 53][index]}</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4">
                      {[
                        'Advanced conversational AI chatbot with natural language processing capabilities',
                        'Open-source CRM solution built with React, Redux, and Firebase',
                        'Comprehensive data visualization library with interactive charts and graphs'
                      ][index]}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 bg-${color} rounded-full mr-1`}></div>
                        <span className="text-xs text-muted-foreground">
                          {['Python', 'JavaScript', 'TypeScript'][index]}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <i className="fas fa-code-branch mr-1"></i> {[24, 18, 12][index]}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <i className="fas fa-code mr-1"></i> {['15k', '22k', '18k'][index]}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
