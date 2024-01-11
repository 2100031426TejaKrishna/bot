module.exports = {
  apps: [{
    script: 'home/admin/Assessment-tool/rethinkpack/src/App.js',
    watch: '.'
  }],

  deploy: {
    production: {
      user: 'admin',
      host: '149.28.146.77',
      ref: 'origin/Rethinkpack/Assessment-tool/development',
      repo: 'https://github.com/Rethinkpack/Assessment-tool.git',
      path: '/home/admin/Assessment-tool/rethinkpack/',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};