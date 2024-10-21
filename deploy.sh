source ~/.nvm/nvm.sh
source ~/.profile
cp bundle.zip deployments/$timestamp
cd deployments/$timestamp
unzip bundle.zip
npm install
npm run build
pm2 del app
pm2 start 'npm start' --name app