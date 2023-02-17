from enum import Enum

# 회원 종류
class UserType (Enum):
    BUYER  = 1
    SELLER = 2
    OWNER  = 3


# 로그 출력 종류
class LogType (Enum):
    DEFAULT = 1
    TITLE = 2

# __all__ 정의
__all__ = ['UserType']