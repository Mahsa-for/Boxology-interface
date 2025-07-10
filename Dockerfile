# Use official Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Expose port Vite dev server uses
EXPOSE 5173

# Default Vite dev script (adjust if using another port or build setup)
CMD ["npm", "run", "dev", "--", "--host"]
