#!/bin/bash
set -euo pipefail

echo "=== Starting server setup ==="

sudo apt update && sudo apt upgrade -y

if [ ! -f /swapfile ]; then
  echo "=== Creating 1GB swap file ==="
  sudo fallocate -l 1G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
  echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf
  sudo sysctl -p
fi

if ! command -v node &> /dev/null; then
  echo "=== Installing Node.js 20 ==="
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi
echo "Node: $(node -v), NPM: $(npm -v)"

if ! command -v pm2 &> /dev/null; then
  echo "=== Installing PM2 ==="
  sudo npm install -g pm2
  pm2 startup systemd -u ubuntu --hp /home/ubuntu | tail -1 | sudo bash
fi

if ! command -v nginx &> /dev/null; then
  echo "=== Installing Nginx ==="
  sudo apt install -y nginx
  sudo systemctl enable nginx
fi

if ! command -v certbot &> /dev/null; then
  echo "=== Installing Certbot ==="
  sudo apt install -y certbot python3-certbot-nginx
fi

mkdir -p /home/ubuntu/furniture/{frontend,backend}
mkdir -p /home/ubuntu/agency/{frontend,backend}
mkdir -p /home/ubuntu/portfolio

if [ ! -f /home/ubuntu/furniture/backend/.env ]; then
  cat > /home/ubuntu/furniture/backend/.env << 'ENVEOF'
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/furniture
JWT_SECRET=change-this-to-a-random-string
JWT_EXPIRE=30d
FRONTEND_URL=https://your-furniture-domain.com
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
ENVEOF
  echo "=== Created .env template — edit with real values ==="
fi

sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save 2>/dev/null || true

echo ""
echo "=== Setup complete! ==="
echo "Next steps:"
echo "  1. Edit /home/ubuntu/furniture/backend/.env with real values"
echo "  2. Point your domains (DNS A records) to: $(curl -s ifconfig.me)"
echo "  3. Copy deploy/nginx.conf to /etc/nginx/sites-available/default"
echo "  4. Run: sudo certbot --nginx"
echo "  5. Add GitHub secrets: VPS_SSH_KEY, VITE_API_URL, VITE_RAZORPAY_KEY_ID"
