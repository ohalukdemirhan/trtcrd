from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.security import get_password_hash
from app.models.models import User, UserRole

def create_admin_user(db: Session) -> None:
    admin = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin:
        admin = User(
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            role=UserRole.ADMIN,
            is_active=True
        )
        db.add(admin)
        db.commit()
        print("Admin user created successfully!")
    else:
        print("Admin user already exists.")

def main() -> None:
    db = SessionLocal()
    try:
        create_admin_user(db)
    finally:
        db.close()

if __name__ == "__main__":
    main() 