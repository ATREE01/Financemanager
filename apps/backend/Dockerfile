# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Install PNPM globally
RUN npm install -g pnpm

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies using PNPM
RUN pnpm install

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Command to run the app
CMD ["pnpm", "start"]