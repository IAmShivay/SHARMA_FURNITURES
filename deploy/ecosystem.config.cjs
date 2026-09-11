module.exports = {
  apps: [
    {
      name: "furniture-api",
      cwd: "/home/ubuntu/furniture/backend",
      script: "dist/server.js",
      node_args: "-r dotenv/config --max-old-space-size=256",
      max_memory_restart: "200M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "agency",
      cwd: "/home/ubuntu/agency",
      script: "node_modules/.bin/next",
      args: "start -p 3001",
      node_args: "--max-old-space-size=256",
      max_memory_restart: "200M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
