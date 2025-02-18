FROM node:20-bullseye

# Install Python
RUN apt-get update && apt-get install -y \
  chromium-browser \
  libnss3 \
  libatk1.0-0 \
  libx11-xcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm-dev \
  libpango-1.0-0 \
  # libasound2 \
  libpangocairo-1.0-0 \
  libatk-bridge2.0-0 \
  libxkbcommoncommon-x11-0 \
  libcups2 \
  python3 \
  python3-pip \ 
  && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the application port (change as needed)
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]
