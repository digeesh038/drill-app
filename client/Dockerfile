# Use Node image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all frontend code
COPY . .

# Expose port 5173 (Vite default)
EXPOSE 5173

# Start the frontend
CMD ["npm", "run", "start"]
