from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "EduSphere AI Backend"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "d0b28e2fa516082c9f564348507c376d49cb005a92a5d911e389e1ab326c2cf5" # In production, this should be loaded from .env
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 days
    ALGORITHM: str = "HS256"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
