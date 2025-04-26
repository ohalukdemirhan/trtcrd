from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.models import User, UserRole, Base
from app.core.security import get_password_hash

# Database connection
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@postgres:5432/trtcrd"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create tables
Base.metadata.create_all(bind=engine)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

# Create admin user
admin = User(
    email='admin@example.com',
    hashed_password=get_password_hash('admin123'),  # Change this password!
    full_name='Admin User',
    role=UserRole.ADMIN,
    is_active=True
)

# Add to database
db.add(admin)
db.commit()
db.close()

print("Admin user created successfully!") 