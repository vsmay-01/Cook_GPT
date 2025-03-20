from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from chatbot import *  # Import chatbot functions
from ingestion import *  # Import ingestion functions

app = Flask(__name__)
load_dotenv()

@app.route("/upload", methods=["POST"])
def upload_file():
    user = request.form.get("user")
    collection = request.form.get("collection")
    if not user:
        return jsonify({"error": "User identifier is required"}), 400
    if not collection:
        return jsonify({"error": "Collection identifier is required"}), 400
    
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    
    file_path = os.path.join("uploads", file.filename)
    file.save(file_path)
    
    # Ensure user has a Pinecone index
    create_pinecone_index(user)
    
    success, message = ingest_file(file_path, user, collection)
    if not success:
        return jsonify({"error": message}), 500
    
    return jsonify({"message": "File processed and stored successfully"})

@app.route("/query", methods=["POST"])
def query():
    data = request.get_json()
    user = data.get("user")
    collection = data.get("collection")
    query_text = data.get("query", "")
    
    if not user:
        return jsonify({"error": "User identifier is required"}), 400
    if not collection:
        return jsonify({"error": "Collection identifier is required"}), 400
    if not query_text:
        return jsonify({"error": "Query text is required"}), 400
    
    response = query_pinecone(query_text, user, collection)
    return jsonify({"response": response})

if __name__ == "__main__":
    os.makedirs("uploads", exist_ok=True)
    app.run(debug=True)
