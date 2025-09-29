# Use Python 3.10 slim image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt ./

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy worker code
COPY . .

# Expose port if needed (not mandatory for worker)
# EXPOSE 5000

# Run the worker
CMD ["python", "worker.py"]
