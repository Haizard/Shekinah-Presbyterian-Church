#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment process for Shekinah Presbyterian Church Website...${NC}"

# Step 1: Add all changes to git
echo -e "${GREEN}Step 1: Adding changes to git...${NC}"
git add .

# Step 2: Commit changes
echo -e "${GREEN}Step 2: Committing changes...${NC}"
read -p "Enter commit message: " commit_message
git commit -m "$commit_message"

# Step 3: Push to GitHub
echo -e "${GREEN}Step 3: Pushing to GitHub...${NC}"
git push

# Step 4: Provide instructions for Render deployment
echo -e "${GREEN}Step 4: Deploying to Render${NC}"
echo -e "${YELLOW}Your changes have been pushed to GitHub.${NC}"
echo -e "${YELLOW}To deploy to Render:${NC}"
echo -e "1. Go to your Render dashboard: https://dashboard.render.com/"
echo -e "2. Select your web service"
echo -e "3. Click on 'Manual Deploy' and select 'Clear build cache & deploy'"
echo -e "4. Wait for the deployment to complete"
echo -e "5. Your site will be available at your Render URL"

echo -e "${GREEN}Deployment process completed!${NC}"
