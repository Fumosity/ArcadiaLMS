# main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image
import pytesseract
import io
import fitz  # PyMuPDF for PDF handling
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image
import pytesseract
import io
import fitz  # PyMuPDF for PDF handling
from fastapi.middleware.cors import CORSMiddleware
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/extract-text/")
async def extract_text(files: List[UploadFile] = File(...)):
    try:
        total_text = ""
        total_pages = 0  # Total page count for PDFs
        
        for file in files:
            # Check if the file is a PDF or image
            if file.content_type == "application/pdf":
                pdf_text = ""
                pdf_data = await file.read()
                pdf_doc = fitz.open(stream=pdf_data, filetype="pdf")

                # Add PDF page count to total_pages
                total_pages += pdf_doc.page_count
                
                for page_num in range(pdf_doc.page_count):
                    page = pdf_doc.load_page(page_num)
                    pdf_text += page.get_text("text")
                
                total_text += pdf_text + "\n\n"
            else:
                # Assume file is an image
                image = Image.open(io.BytesIO(await file.read()))
                text = pytesseract.image_to_string(image)
                total_text += text + "\n\n"
                total_pages += 1

        print("Extracted Text from Files:", total_text)  # Print to the backend console
        print("Total Pages:", total_pages)  # Print to the backend console

        return JSONResponse(content={
            "text": total_text,
            "total_pages": total_pages,
        })
    
    except Exception as e:
        print("Error:", str(e))  # Print the error message to the backend console
        return JSONResponse(content={"error": str(e)}, status_code=500)
