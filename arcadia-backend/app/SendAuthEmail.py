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
import datetime
import secrets
from passlib.hash import bcrypt
from email.message import EmailMessage
from email.utils import make_msgid
import smtplib
from pathlib import Path
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from sib_api_v3_sdk.configuration import Configuration

# Load environment variables
load_dotenv()
router = APIRouter()

# ENV VARS
JWT_SECRET = os.getenv("JWT_SECRET")
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://arcadialib.site")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Request body schema
class EmailRequest(BaseModel):
    userEmail: str
    userFName: str
    userLPUID: str

# Generate JWT token
def generate_token(payload: dict) -> str:
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

# Verify token
def verify_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])

# Send email function
def send_verification_email(to_email: str, first_name: str, token: str):
    configuration = Configuration()
    configuration.api_key['api-key'] = os.getenv("BREVO_API_KEY")

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
    link = f"{FRONTEND_URL}/auth-complete?token={token}"

    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": to_email, "name": first_name}],
        subject="Account Verification",
        html_content=f"""
        <html>
            <body>
                <p>Hello, {first_name}.</p>
                <p>To activate your account, click the link below:</p>
                <p><a href="{link}">Verify Account</a></p>
                <p>Thank you,<br/>Arcadia</p>
            </body>
        </html>
        """,
        sender={"name": "Arcadia", "email": EMAIL_USER}
    )

    try:
        api_instance.send_transac_email(send_smtp_email)
    except ApiException as e:
        print("Brevo email error:", e)
        raise HTTPException(status_code=500, detail="Failed to send verification email")

    """msg = EmailMessage()
    
    # Generate a Content-ID for the image
    image_cid = make_msgid(domain="xyz.com")  # You can use your own domain
    
    # Set HTML content with embedded image
    msg.set_content(f"Hello, {first_name}. Verify your account here: {link}")  # Fallback plain text
    msg.add_alternative(f
    <html>
        <body>
            <p>Hello, {first_name}.</p>
            <p>Thank you for registering in Arcadia!</p>
            <p>To activate your account and access all library services, please verify your email by clicking the button below:</p>
            <p><a href="{link}">Verify Account</a></p>
            <p>If you did not register for this account, please ignore this message.</p>
            <p>Thank you,</p>
            <p><strong>Arcadia</strong></p>
            <img src="cid:{image_cid[1:-1]}" alt="Verification Image" style="width:500px;" />
        </body>
    </html>
    , subtype='html')
    
    msg["Subject"] = "Account Verification"
    msg["From"] = EMAIL_USER
    msg["To"] = to_email

    # Load and attach the image
    image_path = Path("../arcadia-project/public/image/arclogtex.png")
    with image_path.open("rb") as img:
        msg.get_payload()[1].add_related(
            img.read(),
            maintype='image',
            subtype='png',
            cid=image_cid
        )

    with smtplib.SMTP("smtp.office365.com", 587) as server:
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.send_message(msg)"""

# Endpoint to send email
@router.post("/send-email")
async def send_email(payload: EmailRequest):
    if not payload.userEmail or not payload.userFName or not payload.userLPUID:
        raise HTTPException(status_code=400, detail="Missing required fields")

    token = generate_token({
        "userEmail": payload.userEmail,
        "userLPUID": payload.userLPUID
    })

    try:
        send_verification_email(payload.userEmail, payload.userFName, token)
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
        userEmail = payload["userEmail"]
        userLPUID = payload["userLPUID"]

        result = supabase.table("user_accounts") \
            .update({"userVerifyStatus": True}) \
            .eq("userEmail", userEmail) \
            .execute()

        print(f"Supabase update result: {result}")

        if not result.data:
            raise HTTPException(status_code=404, detail="User not found.")

        session_token = generate_token({
            "userEmail": userEmail,
            "userLPUID": userLPUID
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
    
    # Request body schema for forgot password
class ForgotPasswordRequest(BaseModel):
    userEmail: str

# Request body schema for reset password
class ResetPasswordRequest(BaseModel):
    token: str
    newPassword: str

# Generate a secure random token
def generate_reset_token():
    return secrets.token_urlsafe(32)

# Send password reset email
def send_password_reset_email(to_email: str, reset_token: str):
    configuration = Configuration()
    configuration.api_key['api-key'] = os.getenv("BREVO_API_KEY")

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

    reset_link = f"{FRONTEND_URL}/user/resetpassword?token={reset_token}"

    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": to_email}],
        subject="Password Reset Request - Arcadia",
        html_content=f"""
        <html>
            <body>
                <p>You requested to reset your password. Click below:</p>
                <p><a href="{reset_link}">Reset Password</a></p>
                <p>This link expires in 1 hour.</p>
                <p>If you didn’t request this, ignore it.</p>
            </body>
        </html>
        """,
        sender={"name": "Arcadia", "email": EMAIL_USER}
    )

    try:
        api_instance.send_transac_email(send_smtp_email)
    except ApiException as e:
        print("Brevo password reset error:", e)
        raise HTTPException(status_code=500, detail="Failed to send password reset email")
    
    """reset_link = f"{FRONTEND_URL}/user/resetpassword?token={reset_token}"
    msg = EmailMessage()
    msg.set_content(
        f"Hello,\n\nYou have requested to reset your password. Please click the link below to proceed:\n\n{reset_link}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email."
    )
    msg["Subject"] = "Password Reset Request"
    msg["From"] = EMAIL_USER  # Use the EMAIL_USER from your .env file
    msg["To"] = to_email

    try:
        with smtplib.SMTP("smtp.office365.com", 587) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)
        print("Password reset email sent successfully via Gmail!")
    except Exception as e:
        print(f"Error sending email via Gmail: {e}")
        raise  # Re-raise the exception to be handled by the caller"""

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest):
    if not payload.userEmail:
        raise HTTPException(status_code=400, detail="Email is required")

    try:
        # Check if the email exists in the database
        user = supabase.table("user_accounts").select("userEmail, userFName").eq("userEmail", payload.userEmail).single().execute()

        if not user.data:
            return {"message": "If an account with this email exists, we have sent a password reset link."}

        reset_token = generate_reset_token()
        expiry_time = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        expiry_time_iso = expiry_time.isoformat()  # Convert to ISO 8601 string

        # Store the reset token in the database
        insert_result = supabase.table("password_reset_tokens").insert({
            "userEmail": payload.userEmail,
            "reset_token": reset_token,
            "expiry_time": expiry_time_iso  # Use the ISO string
        }).execute()
        print("Supabase insert result:", insert_result)

        # Send the password reset email
        send_password_reset_email(payload.userEmail, reset_token)
        return {"message": "Password reset link sent successfully. Please check your email."}

    except HTTPException as e:
        raise e  # Re-raise HTTPExceptions (these are intentional)
    except Exception as e:  # Catch *any* other exception
        print("Forgot password error:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Failed to initiate password reset: " + str(e))
      
@router.get("/verify-reset-token")
async def verify_reset_token(token: str):
    if not token:
        raise HTTPException(status_code=400, detail="Token is missing")
    try:
        # 1.  Verify the token against your database
        reset_record = supabase.table("password_reset_tokens").select("email, expiry_time").eq("reset_token", token).single().execute()

        if not reset_record.data:
            raise HTTPException(status_code=400, detail="Invalid reset token.")

        # 2. Check if the token has expired
        expiry_time_str = reset_record.data["expiry_time"]
        expiry_time = datetime.datetime.fromisoformat(expiry_time_str.replace("Z", "+00:00")) #correct
        if datetime.datetime.utcnow() > expiry_time:
            raise HTTPException(status_code=400, detail="Reset token has expired.")

        # 3.  If the token is valid, return a JSON response
        return {"message": "Token is valid"}  # <--- VERY IMPORTANT: JSON!

    except HTTPException as e:
        raise e  # Re-raise the HTTPException
    except Exception as e:
        print(f"Error in /verify-reset-token: {e}")  # Log the error
        raise HTTPException(status_code=500, detail="Internal server error")

# Endpoint to handle password reset
@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest):
    if not payload.token or not payload.newPassword:
        raise HTTPException(status_code=400, detail="Token and new password are required.")

    try:
        # Verify the token again
        reset_record = supabase.table("password_reset_tokens").select("userEmail, expiry_time").eq("reset_token", payload.token).single().execute()

        if not reset_record.data:
            raise HTTPException(status_code=400, detail="Invalid reset token.")

        expiry_time_str = reset_record.data["expiry_time"]
        expiry_time = datetime.datetime.fromisoformat(expiry_time_str.replace("Z", "+00:00"))
        if datetime.datetime.utcnow() > expiry_time:
            raise HTTPException(status_code=400, detail="Reset token has expired.")

        email_to_reset = reset_record.data["userEmail"]
        hashed_password = bcrypt.hash(payload.newPassword)

        # Update the user's password in the database
        update_result = supabase.table("user_accounts").update({"userPassword": hashed_password}).eq("userEmail", email_to_reset).execute()

        if update_result.error:
            print("Error updating password:", update_result.error)
            raise HTTPException(status_code=500, detail="Failed to update password.")

        # Optionally, delete the used reset token
        delete_result = supabase.table("password_reset_tokens").delete().eq("reset_token", payload.token).execute()
        if delete_result.error:
            print("Error deleting reset token:", delete_result.error) # Non-critical error, log it

        return {"message": "Password reset successfully."}

    except HTTPException as e:
        raise e
    except Exception as e:
        print("Error resetting password:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error")
