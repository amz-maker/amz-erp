from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from common.enum import UserType, LogType
from common.util import *

"""────────────────────────────────────────
[Test] 로그인
────────────────────────────────────────"""
def test (driver: WebDriver, userType: UserType, id: str, pw: str):
    key = {
        UserType.BUYER: '일반회원 로그인',
        UserType.SELLER: '중개회원 로그인',
        UserType.OWNER: '비회원 로그인'
    }.get(userType)

    log_format('로그인', LogType.TITLE)

    # web 로드 - 로그인 페이지
    driver.get("https://dev0.koreaats.com/login")

    driver.implicitly_wait(5) # max wait time

    # 일반회원 로그인 탭 클릭
    log_format(f'{key} 탭 클릭')
    driver.find_element(By.XPATH, f'//div[contains(text(), "{key}")]').click()

    # 로그인 정보 입력
    log_format(f'{key} 로그인 정보 입력')
    if userType in [UserType.BUYER, UserType.SELLER]:
        driver.find_element(By.CSS_SELECTOR, 'input[placeholder*="이메일 주소를 입력해주세요"]').send_keys(f'{id}') # id 입력
        driver.find_element(By.CSS_SELECTOR, 'input[placeholder*="비밀번호를 입력해주세요"]').send_keys(f'{pw}') # pw 입력

    elif userType == UserType.OWNER:
        driver.find_element(By.CSS_SELECTOR, 'input[placeholder*="휴대폰번호를 입력해주세요"]').send_keys(f'{id}') # id 입력
        driver.find_element(By.XPATH, '//button[contains(text(), "번호요청")]').click() # 번호요청 버튼 클릭
        driver.find_element(By.CSS_SELECTOR, 'input[placeholder*="인증번호를 입력해주세요"]').send_keys(f'{pw}') # pw 입력

    # 로그인 버튼 클릭
    log_format('로그인 버튼 클릭')
    driver.find_element(By.XPATH, '//button[text()="로그인"]').click() # 로그인 버튼 클릭

    # 확인 버튼 클릭
    log_format('확인 버튼 클릭')
    driver.find_element(By.CSS_SELECTOR, '.button-ok').click() # 확인 버튼 클릭


# __all__ 정의
__all__ = ['test']