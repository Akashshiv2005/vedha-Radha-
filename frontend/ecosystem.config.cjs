/**
 * Vedha Radha — PM2 Process Configuration
 * PM2 keeps node server.js running persistently as a daemon
 *
 * Install PM2:  npm install -g pm2
 * Start:        pm2 start ecosystem.config.cjs
 * Save:         pm2 save
 * Startup:      pm2 startup   (then run the command it prints)
 */

module.exports = {
  apps: [
    {
      name: 'vedharadha',
      script: 'server.js',

      // Node.js args
      node_args: '--experimental-vm-modules',

      // Environment — copy values from your .env file on the server
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,

        // Precious metal rates API key (keep this secret on the server)
        GOLD_API_KEY: 'YOUR_GOLDAPI_KEY_HERE',
        RATE_DATA_PROVIDER: 'goldapi',
        RATE_CACHE_TTL_MINUTES: '10',
        PRECIOUS_RATES_CURRENCY: 'INR'
      },

      // Run in production mode
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },

      // Auto-restart on crash
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',

      // Logging
      log_file: '/var/log/vedharadha/combined.log',
      out_file: '/var/log/vedharadha/out.log',
      error_file: '/var/log/vedharadha/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
