FROM node:18-alpine

WORKDIR /app

# Install only production deps first
COPY package*.json ./
RUN npm ci --omit=dev

# Copy RDS cert into image
COPY rds-combined-ca-bundle.pem /usr/local/share/ca-certificates/rds-combined-ca-bundle.pem

# Copy the rest of the app
ARG CACHEBUST=20250919210342
COPY . .

# Set Node to trust this cert
ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/rds-combined-ca-bundle.pem

EXPOSE 3000

CMD ["node","index.js"]
