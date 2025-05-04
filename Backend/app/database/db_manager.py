from motor.motor_asyncio import AsyncIOMotorClient
from typing import Dict, Optional
from datetime import datetime
import os
from urllib.parse import unquote

class DatabaseManager:
    def __init__(self):
        # Point at your Mongo URI (or default to localhost)
        self.client = AsyncIOMotorClient(
            os.getenv("MONGO_URI", "mongodb://localhost:27017")
        )
        self.db = self.client.website_analyzer

    async def initialize(self):
        """Create indexes for optimal query performance"""
        await self.db.scans.create_index("scan_metadata.scan_date")
        await self.db.scans.create_index([("url", 1), ("created_at", -1)])

    async def insert_scan(self, scan_data: Dict) -> str:
        """Store scan results with timestamp"""
        scan_data["created_at"] = datetime.utcnow()
        result = await self.db.scans.insert_one(scan_data)
        return str(result.inserted_id)

    async def get_previous_scan(self, url: str) -> Optional[Dict]:
        """Retrieve latest scan for comparison (omit screenshot)"""
        return await self.db.scans.find_one(
            {"url": url},
            sort=[("created_at", -1)],
            projection={"_id": 0, "screenshot": 0}
        )

    async def get_scan_by_id(self, scan_id: str) -> Optional[Dict]:
        """Retrieve a scan by its scan_date ID with proper URL decoding"""
        try:
            decoded_scan_id = unquote(scan_id)
            return await self.db.scans.find_one(
                {"scan_metadata.scan_date": decoded_scan_id},
                {"_id": 0}  # Exclude MongoDB ID
            )
        except Exception as e:
            return None

    async def get_scans(self, limit: int = 100) -> list:
        """Get multiple scans for history view"""
        cursor = self.db.scans.find({}, {"_id": 0}).sort("created_at", -1).limit(limit)
        return await cursor.to_list(length=limit)

# Initialize the database manager and create indexes
db_manager = DatabaseManager()