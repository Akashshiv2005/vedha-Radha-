from collections import defaultdict
from datetime import datetime, timezone
from typing import Dict, List
import threading
from .config import settings


class InMemoryRateLimiter:
    """Thread-safe sliding-window rate limiter for brute-force protection."""

    def __init__(self, max_attempts: int = 5, window_seconds: int = 60):
        self.max_attempts = max_attempts
        self.window_seconds = window_seconds
        self._attempts: Dict[str, List[float]] = defaultdict(list)
        self._lock = threading.Lock()

    def is_rate_limited(self, key: str) -> bool:
        """Check whether the key has exceeded the rate limit threshold."""
        now = datetime.now(timezone.utc).timestamp()
        cutoff = now - self.window_seconds

        with self._lock:
            # Prune attempts outside the sliding window
            timestamps = [ts for ts in self._attempts[key] if ts > cutoff]
            self._attempts[key] = timestamps

            return len(timestamps) >= self.max_attempts

    def record_attempt(self, key: str) -> None:
        """Record an attempt for the specified key."""
        now = datetime.now(timezone.utc).timestamp()
        cutoff = now - self.window_seconds

        with self._lock:
            timestamps = [ts for ts in self._attempts[key] if ts > cutoff]
            timestamps.append(now)
            self._attempts[key] = timestamps

    def reset(self, key: str) -> None:
        """Reset attempts for a key upon successful authentication."""
        with self._lock:
            if key in self._attempts:
                del self._attempts[key]


login_rate_limiter = InMemoryRateLimiter(
    max_attempts=settings.RATE_LIMIT_LOGIN_MAX_ATTEMPTS,
    window_seconds=settings.RATE_LIMIT_LOGIN_WINDOW_SECONDS,
)
