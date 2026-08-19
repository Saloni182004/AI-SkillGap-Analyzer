# Use your exact Python version
FROM python:3.11.5-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the FastAPI app code
COPY . .

# Start Uvicorn (Change port to 8001 for the Resume Service!)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]