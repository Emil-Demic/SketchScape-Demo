ARG PYTHON_VERSION=3.13
FROM python:$PYTHON_VERSION-slim

####### Add your own installation commands here #######
RUN pip install onnxruntime faiss-cpu pillow
# RUN wget https://path/to/some/data/or/weights
# RUN apt-get update && apt-get install -y <package-name>

WORKDIR /app
COPY . /app

# Install litserve and requirements
RUN pip install --no-cache-dir litserve==0.2.15 
EXPOSE 7860
CMD ["python", "/app/main.py"]
