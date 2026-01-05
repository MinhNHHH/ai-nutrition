from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session, Session

from src import cfgs

############################### DB ###############################
engine = create_engine(cfgs.get_default("DATABASE_CONNECTION_URI"),
    # http://docs.sqlalchemy.org/en/latest/core/pooling.html
    pool_size=20, max_overflow=-1)

session_factory = sessionmaker(bind=engine)
SessionLocal = scoped_session(session_factory)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()