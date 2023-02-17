from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from common.util import log_format
from common.enum import LogType

"""────────────────────────────────────────
[Test] 로그아웃
────────────────────────────────────────"""
def test (driver: WebDriver):
    log_format('로그아웃', LogType.TITLE)

    # web 로드 - 메인 페이지
    driver.get("https://dev0.koreaats.com")

    # 로그아웃
    log_format('로그아웃')
    driver.find_element(By.CSS_SELECTOR, '.fa-id-card').click() # 닉네임 클릭
    driver.find_element(By.XPATH, '//span[text()="로그아웃"]').click() # 로그아웃 버튼 클릭


# __all__ 정의
__all__ = ['test']