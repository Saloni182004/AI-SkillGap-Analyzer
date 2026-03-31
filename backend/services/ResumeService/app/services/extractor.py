import fitz  
import docx
import re
from io import BytesIO

async def extract_clean_text(file_bytes: bytes, content_type: str) -> str:
    extracted_text = ""

    if content_type == "application/pdf":
        pdf_doc = fitz.open(stream=file_bytes, filetype="pdf")
        for page in pdf_doc:
            extracted_text += page.get_text()
            
    elif content_type in [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
        "application/msword"
    ]:
        word_doc = docx.Document(BytesIO(file_bytes))
        extracted_text = "\n".join([para.text for para in word_doc.paragraphs])
        
    else:
        raise ValueError("Unsupported file type. Please upload a PDF or DOCX.")
    clean_text = re.sub(r'\s+', ' ', extracted_text).strip()
    
    return clean_text