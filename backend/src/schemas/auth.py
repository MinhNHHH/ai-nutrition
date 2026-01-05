from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    id: int
    email: EmailStr
    username: str
    profile_pic: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserBase
