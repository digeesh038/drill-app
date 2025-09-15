# Use Node 20 LTS image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all backend code
COPY . .

# Expose port 3001
EXPOSE 3001

# Start the server
CMD ["node", "index.js"]
