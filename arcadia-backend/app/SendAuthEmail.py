from fastapi import APIRouter, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client, Client
import smtplib
import jwt
import os
import traceback
from email.message import EmailMessage

# Load environment variables
load_dotenv()

router = APIRouter()

# ENV VARS
JWT_SECRET = os.getenv("JWT_SECRET")
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://13.212.24.184")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Request body schema
class EmailRequest(BaseModel):
    email: str
    firstName: str
    lpuID: str

# Generate JWT token
def generate_token(payload: dict) -> str:
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

# Verify token
def verify_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])

# Send email function
def send_verification_email(to_email: str, first_name: str, token: str):
    link = f"{FRONTEND_URL}/auth-complete?token={token}"
    msg = EmailMessage()
    msg.set_content(f"Hello, {first_name}. Verify your account here: {link}")
    msg["Subject"] = "Account Verification"
    msg["From"] = EMAIL_USER
    msg["To"] = to_email

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(EMAIL_USER, EMAIL_PASS)
        server.send_message(msg)

# Endpoint to send email
@router.post("/send-email")
async def send_email(payload: EmailRequest):
    if not payload.email or not payload.firstName or not payload.lpuID:
        raise HTTPException(status_code=400, detail="Missing required fields")

    token = generate_token({
        "email": payload.email,
        "lpuID": payload.lpuID
    })

    try:
        send_verification_email(payload.email, payload.firstName, token)
        return {"message": "Email sent successfully."}
    except Exception as e:
        print("Email error:", e)
        raise HTTPException(status_code=500, detail="Failed to send email")

# Endpoint to verify token
@router.get("/verify")
async def verify(request: Request):
    token = request.query_params.get("token")
    print(f"Received token: {token}")

    if not token:
        raise HTTPException(status_code=400, detail="Token is missing")

    try:
        payload = verify_token(token)
        print(f"Decoded payload: {payload}")
        email = payload["email"]
        lpuID = payload["lpuID"]

        result = supabase.table("user_accounts") \
            .update({"userVerifyStatus": True}) \
            .eq("userEmail", email) \
            .execute()

        print(f"Supabase update result: {result}")

        if not result.data:
            raise HTTPException(status_code=404, detail="User not found.")

        session_token = generate_token({
            "email": email,
            "lpuID": lpuID
        })

        return {
            "message": "Account successfully verified.",
            "sessionToken": session_token
        }

    except jwt.ExpiredSignatureError:
        print("Expired token.")
        raise HTTPException(status_code=400, detail="Token has expired")
    except jwt.InvalidTokenError:
        print("Invalid token.")
        raise HTTPException(status_code=400, detail="Invalid token")
    except Exception as e:
        print("Verification error:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error")