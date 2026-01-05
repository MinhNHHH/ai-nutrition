import json
from urllib.parse import quote
from pydantic import BaseModel

from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from sqlalchemy.orm import Session

from src.database import get_db
from src.repositories.users import UserRepository
from src.services.auth import AuthService
from src.cfgs import get_default
from src.api.deps import get_current_user
from src.models.users import User

router = APIRouter(prefix="/auth", tags=["auth"])
auth_service = AuthService()


class GoogleLoginRequest(BaseModel):
    id_token: str

# OAuth configuration
oauth = OAuth()
oauth.register(
    name='google',
    client_id=get_default('GOOGLE_CLIENT_ID', required=False),
    client_secret=get_default('GOOGLE_CLIENT_SECRET', required=False),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

@router.get('/login')
async def login(request: Request):
    # Determine the absolute URL for the callback
    # In production, ensure redirect_uri uses https if behind a proxy
    redirect_uri = request.url_for('auth_callback')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get('/callback', name='auth_callback')
async def auth_callback(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to fetch user info from Google")
        
        # Extract fields
        google_id = user_info.get('sub')
        email = user_info.get('email')
        name = user_info.get('name')
        picture = user_info.get('picture')
        
        # Upsert user in repository
        user_repo = UserRepository(db)
        user = user_repo.upsert_google_user(
            google_id=google_id,
            email=email,
            username=name,
            profile_pic=picture
        )
        
        # Create JWT session
        access_token = auth_service.create_access_token(
            data={"sub": str(user.id), "email": user.email}
        )
        
        user_data = {
            "token": access_token,
            "user": {
                "id": str(user.id),
                "email": user.email,
                "username": user.username,
                "profilePic": user.profile_pic
            }
        }
        
        # Redirect back to mobile app
        # Note: 'myapp://' should match your app.json scheme
        # redirect_url = f"localhost:7777/auth?data={quote(json.dumps(user_data))}"
        redirect_url = f"myapp://auth?data={quote(json.dumps(user_data))}"
        return RedirectResponse(url=redirect_url)
        
    except Exception as e:
        print(f"Auth error: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")

@router.get('/logout')
async def logout():
    response = RedirectResponse(url='/')
    response.delete_cookie("access_token")
    return response

@router.get('/me')
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "username": current_user.username,
        "profilePic": current_user.profile_pic
    }


@router.post('/logout')
async def logout(current_user: User = Depends(get_current_user)):
    return {"message": f"Successfully logged out {current_user.email}"}
