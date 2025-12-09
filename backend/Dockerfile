FROM node:20-alpine

WORKDIR /app

# Install dependencies first to leverage cache
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port (default for Express)
EXPOSE 3000

# Start the application using ts-node (as configured in package.json start script)
CMD ["npm", "start"]
