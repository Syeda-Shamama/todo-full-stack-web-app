from datetime import datetime, timedelta
from typing import Optional
import os
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlmodel import Session, select
from models import User
from db import get_session

# Load environment variables
load_dotenv()

# Get SECRET_KEY from environment
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
if not SECRET_KEY:
    raise ValueError("BETTER_AUTH_SECRET environment variable is required")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 7 * 24 * 60  # 7 days

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/token")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None  # Changed back to email

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        print(f"[AUTH] Decoding token: {token[:30]}...")  # Debug
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"[AUTH] Token payload: {payload}")  # Debug
        
        # Extract email from "sub" field
        email: str = payload.get("sub")
        if email is None:
            print("[AUTH] ERROR: No 'sub' in token payload")  # Debug
            raise credentials_exception
            
        print(f"[AUTH] Extracted email: {email}")  # Debug
        token_data = TokenData(email=email)
        
    except JWTError as e:
        print(f"[AUTH] JWT Error: {e}")  # Debug
        raise credentials_exception
    
    # Query user by EMAIL (not ID)
    user = session.exec(select(User).where(User.email == token_data.email)).first()
    
    if user is None:
        print(f"[AUTH] ERROR: User not found with email: {token_data.email}")  # Debug
        raise credentials_exception
    
    print(f"[AUTH] SUCCESS: User authenticated: {user.email} (ID: {user.id})")  # Debug
    return user

# Helper function - extract user_id without DB query
def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    """Extract user_id from JWT without database query."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        return email
    except JWTError:
        raise credentials_exception