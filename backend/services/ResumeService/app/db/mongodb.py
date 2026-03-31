import os
from pymongo import MongoClient
from dotenv import load_dotenv, find_dotenv

dotenv_path = find_dotenv()
load_dotenv(dotenv_path, override=True)
MONGO_URI=os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
if not MONGO_URI:
    raise ValueError("MONGO_URI is missing")
db = client["skillgap_analyzer"]
resume_collection = db["resumes"]