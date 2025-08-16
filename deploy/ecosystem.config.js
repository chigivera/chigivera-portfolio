module.exports = {
  apps: [
    {
      name: 'neon-portfolio',
      script: 'dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        HOST: '0.0.0.0',
        GMAIL_USER: 'ayman.benchamkha@gmail.com',
        GMAIL_APP_PASSWORD: 'xlwblcccybeodiwf'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
        HOST: '0.0.0.0',
        GMAIL_USER: 'ayman.benchamkha@gmail.com',
        GMAIL_APP_PASSWORD: 'xlwblcccybeodiwf'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
