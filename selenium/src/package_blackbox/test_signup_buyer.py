from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from common.util import log_format

"""────────────────────────────────────────
[Test] 일반회원 회원가입
────────────────────────────────────────"""
def test (driver: WebDriver, id: str, pw: str, phone: str):
    print('─> 일반회원 회원가입')

    # web 로드 - 로그인 페이지
    driver.get("https://dev0.koreaats.com/login")

    driver.implicitly_wait(5) # max wait time

    # 일반회원 로그인 탭 클릭
    log_format('일반회원 로그인 탭 클릭')
    driver.find_element(By.XPATH, '//div[contains(text(), "일반회원 로그인")]').click()

    # 회원가입 버튼 클릭
    log_format('회원가입 버튼 클릭')
    driver.find_element(By.XPATH, '//span[contains(text(), "회원가입")]').click()

    driver.implicitly_wait(5) # max wait time

    # 모두 동의합니다 버튼 클릭
    log_format('모두 동의합니다 버튼 클릭')
    driver.find_element(By.XPATH, '//span[contains(text(), "모두 동의합니다")]').click()

    # 동의하고 진행하기 버튼 클릭
    log_format('동의하고 진행하기 버튼 클릭')
    driver.find_element(By.XPATH, '//button[text()="동의하고 진행하기"]').click()

    driver.implicitly_wait(5) # max wait time

    # 일반회원 정보 입력
    log_format('일반회원 정보 입력')
    formElements = driver.find_elements(By.CSS_SELECTOR, 'div.sign-up-content > div.input-form > div[data-component="input"]') # form list 가져오기

    list = [f'{id}@test.com', f'{id}_nick', f'{id}_name', f'19960323', f'{phone}', f'{pw}', f'{pw}'] # 아이디, 닉네임, 이름, 생년월일, 휴대폰번호, 비밀번호, 비밀번호 확인
    for element in formElements:
        pop = list.pop(0)
        if pop is not None:
            element.find_element(By.CSS_SELECTOR, 'input').send_keys(pop) # Form 데이터 입력


    # 회원가입 완료 버튼 클릭
    log_format('회원가입 완료 버튼 클릭')
    #driver.find_element(By.XPATH, '//button[contains(text(), "회원가입 완료")]').click()


# __all__ 정의
__all__ = ['test']
