"""
StudentGameState model for persistent gamification state.
Stores coins, streaks, perks, and daily progress per student.
"""

from backend.database import Base
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, date
import uuid
import json


class StudentGameState(Base):
    __tablename__ = "student_game_state"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    # One-to-one relationship with Student
    student_id = Column(
        String(36),
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True
    )

    # Coins and currency
    coins = Column(Integer, default=0, nullable=False)
    total_coins_earned = Column(Integer, default=0, nullable=False)

    # Streak tracking
    current_streak = Column(Integer, default=0, nullable=False)
    longest_streak = Column(Integer, default=0, nullable=False)
    last_activity_date = Column(DateTime, nullable=True)

    # Daily progress (JSON: {"quizzes_completed": 0, "flashcards_reviewed": 0, "videos_watched": 0})
    daily_progress = Column(Text, default='{}')
    daily_progress_date = Column(DateTime, nullable=True)

    # Purchased perks (JSON list of perk IDs/names)
    purchased_perks = Column(Text, default='[]')

    # Parent dashboard stats
    total_quizzes_completed = Column(Integer, default=0, nullable=False)
    total_flashcards_reviewed = Column(Integer, default=0, nullable=False)
    total_videos_watched = Column(Integer, default=0, nullable=False)
    total_time_spent_minutes = Column(Integer, default=0, nullable=False)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    student = relationship("Student", back_populates="game_state")

    def get_daily_progress(self) -> dict:
        """Parse daily progress JSON."""
        try:
            return json.loads(self.daily_progress or '{}')
        except json.JSONDecodeError:
            return {}

    def set_daily_progress(self, progress: dict):
        """Set daily progress from dict."""
        self.daily_progress = json.dumps(progress)

    def get_purchased_perks(self) -> list:
        """Parse purchased perks JSON."""
        try:
            return json.loads(self.purchased_perks or '[]')
        except json.JSONDecodeError:
            return []

    def add_perk(self, perk_id: str):
        """Add a purchased perk."""
        perks = self.get_purchased_perks()
        if perk_id not in perks:
            perks.append(perk_id)
            self.purchased_perks = json.dumps(perks)

    def add_coins(self, amount: int):
        """Add coins and track total earned."""
        if amount > 0:
            self.coins += amount
            self.total_coins_earned += amount

    def spend_coins(self, amount: int) -> bool:
        """Spend coins if sufficient balance. Returns True if successful."""
        if self.coins >= amount:
            self.coins -= amount
            return True
        return False

    def update_streak(self):
        """Update streak based on last activity date."""
        today = date.today()
        if self.last_activity_date:
            last_date = self.last_activity_date.date() if isinstance(self.last_activity_date, datetime) else self.last_activity_date
            days_diff = (today - last_date).days

            if days_diff == 0:
                # Same day, no change
                pass
            elif days_diff == 1:
                # Consecutive day, increment streak
                self.current_streak += 1
                if self.current_streak > self.longest_streak:
                    self.longest_streak = self.current_streak
            else:
                # Streak broken
                self.current_streak = 1
        else:
            # First activity
            self.current_streak = 1

        self.last_activity_date = datetime.utcnow()

    def reset_daily_progress_if_new_day(self):
        """Reset daily progress if it's a new day."""
        today = date.today()
        if self.daily_progress_date:
            progress_date = self.daily_progress_date.date() if isinstance(self.daily_progress_date, datetime) else self.daily_progress_date
            if progress_date != today:
                self.daily_progress = '{}'
                self.daily_progress_date = datetime.utcnow()
        else:
            self.daily_progress_date = datetime.utcnow()

    def increment_daily_stat(self, stat_name: str, amount: int = 1):
        """Increment a daily progress stat."""
        self.reset_daily_progress_if_new_day()
        progress = self.get_daily_progress()
        progress[stat_name] = progress.get(stat_name, 0) + amount
        self.set_daily_progress(progress)
