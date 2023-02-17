from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

from common.util import log_format, wait_element

"""────────────────────────────────────────
[Test] 중개사회원 회원가입
────────────────────────────────────────"""
def test (driver: WebDriver, id: str, pw: str, phone: str):
    print('─> 중개사회원 회원가입')

    # web 로드 - 로그인 페이지
    driver.get("https://dev0.koreaats.com/login")

    driver.implicitly_wait(5) # max wait time

    # 중개사회원 로그인 탭 클릭
    log_format('중개사회원 로그인 탭 클릭')
    driver.find_element(By.XPATH, '//div[contains(text(), "중개회원 로그인")]').click()

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

    # 중개사무소 조회하기 버튼 클릭
    log_format('중개사무소 조회하기')
    driver.find_element(By.XPATH, '//button[text()="조회하기"]').click()

    wait_element(driver, By.CSS_SELECTOR, 'div[data-container="findBroker"].open', 5) # wait element - 중개사무소 조회 Modal

    # 중개사무소 검색
    log_format('중개사무소 검색')
    brokerageOfficeInput = driver.find_element(By.CSS_SELECTOR, 'input[placeholder*="검색어를 입력하세요"]') # 중개사무소 검색 Input
    brokerageOfficeInput.send_keys('온택') # '온택' 입력
    brokerageOfficeInput.send_keys(Keys.RETURN) # 엔터키 입력

    wait_element(driver, By.XPATH, '//span[text()="온택부동산중개법인주식회사"]', 5) # wait element - 중개사무소 조회 대기

    # 온택부동산 중개사무소 선택
    driver.find_element(By.XPATH, '//span[text()="온택부동산중개법인주식회사"]').click() # 온택부동산 중개사무소 클릭
    driver.find_element(By.XPATH, '//button[text()="완료"]').click() # 완료 버튼 클릭

    # 다음 버튼 클릭
    log_format('다음 버튼 클릭')
    driver.find_element(By.XPATH, '//button[text()="다음"]').click()

    driver.implicitly_wait(5) # max wait time

    # 중개사회원 정보 입력
    log_format('중개사회원 정보 입력')
    formElements = driver.find_elements(By.CSS_SELECTOR, 'div.sign-up-content > div.input-form > div[data-component="input"]') # form list 가져오기

    list = [id, '직급', None, f'{id}@test.com', pw, pw, phone]
    for element in formElements:
        pop = list.pop(0)
        if pop is not None:
            element.find_element(By.CSS_SELECTOR, 'input').send_keys(pop) # Form 데이터 입력

    # 회원가입 완료 버튼 클릭
    log_format('회원가입 완료 버튼 클릭')
    #driver.find_element(By.XPATH, '//button[contains(text(), "회원가입 완료")]').click() 


# __all__ 정의
__all__ = ['test']