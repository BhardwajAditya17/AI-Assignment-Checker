from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
import pdfplumber
import os

app = FastAPI()

# Load model once
model = SentenceTransformer('all-MiniLM-L6-v2')

class GradeRequest(BaseModel):
    student_file_path: str
    reference_file_path: str = None 
    question_description: str = ""
    max_marks: int = 100  # ✅ NEW FIELD (Default to 100 if not sent)

def extract_text(file_path):
    """Utility to safely extract text from PDF"""
    if not file_path or not os.path.exists(file_path):
        return ""
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
    except Exception as e:
        print(f"Error reading PDF {file_path}: {e}")
    return text.strip()

@app.post("/analyze")
async def analyze_submission(data: GradeRequest):
    # 1. Get Student Text
    student_text = extract_text(data.student_file_path)
    if not student_text:
        raise HTTPException(status_code=400, detail="Student PDF is empty or unreadable")

    # 2. Get Reference Text
    reference_text = ""
    if data.reference_file_path:
        reference_text = extract_text(data.reference_file_path)
    
    if not reference_text:
        reference_text = data.question_description

    if not reference_text:
         raise HTTPException(status_code=400, detail="No reference content to grade against.")

    # 3. Calculate Similarity
    embedding_student = model.encode(student_text, convert_to_tensor=True)
    embedding_ref = model.encode(reference_text, convert_to_tensor=True)

    similarity = util.cos_sim(embedding_student, embedding_ref).item()

    # 4. Scoring Logic (Scaled to Max Marks)
    # Thresholds:
    # > 0.85 similarity = 100% of marks
    # < 0.20 similarity = 0% of marks
    # Between = Linear Scale
    
    percentage = 0.0
    
    if similarity > 0.85:
        percentage = 1.0
    elif similarity < 0.2:
        percentage = 0.0
    else:
        # Normalize the score between 0 and 1 based on the range 0.2 -> 0.85
        percentage = (similarity - 0.2) / (0.85 - 0.2)

    # Calculate final marks based on Teacher's Max Marks
    awarded_marks = percentage * data.max_marks

    return {
        "score": round(awarded_marks, 1), # e.g., 18.5 (out of 20)
        "max_marks": data.max_marks,
        "percentage": round(percentage * 100, 1),
        "similarity_raw": round(similarity, 2),
        "feedback": f"AI calculated {int(percentage*100)}% match based on semantic similarity."
    }