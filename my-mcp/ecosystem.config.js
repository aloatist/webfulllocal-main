module.exports = {
    apps: [
      {
        name: 'backend',
        script: 'npm',
        args: 'run start:prod',
        cwd: './backend',
        watch: true,
        env: {
          NODE_ENV: 'production',
          PORT: 4000 // cổng backend, bạn có thể đổi
        }
      },
      {
        name: 'conphung',
        script: 'npm',
        args: 'run start',
        cwd: './conphung',
        watch: true,
        env: {
          NODE_ENV: 'production',
          PORT: 3000 // cổng Next.js
        }
      },
      {
        nname: 'n8n',
        script: '/usr/bin/n8n',
        args: 'start --user-folder /root/n8n',
        cwd: '/root/n8n',
        watch: false,
        env: {
          NODE_ENV: 'production',
          N8N_PORT: 5678,
          N8N_HOST: '0.0.0.0',
          N8N_PROTOCOL: 'http',
          N8N_EDITOR_BASE_URL: 'http://localhost:5678/',
          N8N_ENCRYPTION_KEY: 'your-secret-key'
        
        }
      }
    ]
  };npm