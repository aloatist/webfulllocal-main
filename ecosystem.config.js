/**
 * PM2 ecosystem configuration
 * Khởi động:
 *   pm2 start ecosystem.config.js --env production
 *   pm2 save
 */

module.exports = {
  apps: [
    // ==== BACKEND (NestJS REST API) ====
    {
      name: 'backend',
      cwd: './backend',
      script: 'npm',
      args: 'run start:prod',
      interpreter: 'none',
      exec_mode: 'fork',
      instances: 1,
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      out_file: './logs/backend-out.log',
      error_file: './logs/backend-error.log',
      pid_file: './logs/backend.pid',
      env: {
        NODE_ENV: 'development',
        PORT: 4000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      env_local: {
        NODE_ENV: 'local',
        PORT: 4000
      },
      post_update: [
        'npm install',
        'npm run build'
      ]
    },

    // ==== FRONTEND (Next.js) ====
    {
      name: 'conphung',
      cwd: './conphung',
      script: 'npm',
      args: 'run start',
      interpreter: 'none',
      exec_mode: 'fork',
      instances: 1,
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      out_file: './logs/frontend-out.log',
      error_file: './logs/frontend-error.log',
      pid_file: './logs/frontend.pid',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_local: {
        NODE_ENV: 'local',
        PORT: 3000
      },
      post_update: [
        'npm install',
        'npm run build'
      ]
    }
  ]
};
