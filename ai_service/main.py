from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
import pdfplumber
import requests # ✅ Added to fetch the file from the cloud
import io       # ✅ Added to hold the file in memory
import os

app = FastAPI()

# Load model once
model = SentenceTransformer('all-MiniLM-L6-v2')

class GradeRequest(BaseModel):
    # ✅ Changed from paths to URLs
    student_file_url: str
    reference_file_url: str = None 
    question_description: str = ""
    max_marks: int = 100 

def extract_text_from_url(file_url: str):
    """Utility to safely extract text from a PDF URL securely held in memory"""
    if not file_url:
        return ""
    
    text = ""
    try:
        # 1. Download the PDF from Supabase
        response = requests.get(file_url, timeout=15)
        response.raise_for_status() # Raises an error if the download fails (e.g., 404)
        
        # 2. Wrap the downloaded bytes in a "File-like" object in RAM
        pdf_stream = io.BytesIO(response.content)
        
        # 3. Read it with pdfplumber just like a local file!
        with pdfplumber.open(pdf_stream) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
                
    except requests.exceptions.RequestException as e:
        print(f"Error downloading PDF from {file_url}: {e}")
    except Exception as e:
        print(f"Error reading PDF content: {e}")
        
    return text.strip()

@app.post("/analyze")
async def analyze_submission(data: GradeRequest):
    # 1. Get Student Text (using the new URL extractor)
    student_text = extract_text_from_url(data.student_file_url)
    if not student_text:
        raise HTTPException(status_code=400, detail="Student PDF is empty or unreadable")

    # 2. Get Reference Text
    reference_text = ""
    if data.reference_file_url:
        reference_text = extract_text_from_url(data.reference_file_url)
    
    if not reference_text:
        reference_text = data.question_description

    if not reference_text:
         raise HTTPException(status_code=400, detail="No reference content to grade against.")

    # 3. Calculate Similarity
    embedding_student = model.encode(student_text, convert_to_tensor=True)
    embedding_ref = model.encode(reference_text, convert_to_tensor=True)

    similarity = util.cos_sim(embedding_student, embedding_ref).item()

    # 4. Scoring Logic (Scaled to Max Marks)
    percentage = 0.0
    
    if similarity > 0.6:
        percentage = 1.0
    elif similarity < 0.2:
        percentage = 0
    else:
        # Normalize the score between 0 and 1 based on the range 0.2 -> 0.85
        # Note: I kept your exact math logic here!
        percentage = (similarity-0.2) / (0.6-0.2)

    # Calculate final marks based on Teacher's Max Marks
    awarded_marks = percentage * data.max_marks

    return {
        "score": round(awarded_marks, 1), 
        "max_marks": data.max_marks,
        "percentage": round(percentage * 100, 1),
        "similarity_raw": round(similarity, 2),
        "feedback": f"AI calculated {int(percentage*100)}% match based on semantic similarity."
    }