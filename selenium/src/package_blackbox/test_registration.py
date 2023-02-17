from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

from common.util import *
from common.enum import LogType
import clipboard

"""────────────────────────────────────────
[Test] 매물 등록
────────────────────────────────────────"""
def test (driver: WebDriver, apt: str='마곡벽산아파트', dong: str='101동', floor: str='1층', ho: str='101호', price: str='10000'):
    # 『 매물 등록 』 
    log_format('매물 등록', LogType.TITLE)

    # web 로드 - product/form
    driver.get('https://dev0.koreaats.com/product/form')

    # 주소검색 팝업 열기
    log_format('주소검색 팝업 열기')
    driver.find_element(By.CSS_SELECTOR, f'.fa-magnifying-glass').click()

    wait_sleep(1)
    wait_element(driver, By.CSS_SELECTOR, 'div[data-component="address"].open', 5) # wait until load element
    popup = driver.find_element(By.CSS_SELECTOR, 'div[data-component="address"].open')

    # 지번주소로 검색
    log_format('지번주소로 검색')
    popup.find_element(By.XPATH, f'//div[text()="지번주소로 검색"]').click()
    wait_element(driver, By.XPATH, f'//li[text()="서울특별시"]', 5) # wait until load element
    
    # 주소정보 선택
    log_format('주소정보 선택')
    popup.find_element(By.XPATH, f'//span[text()="시/도"]').click()
    popup.find_element(By.XPATH, f'//li[text()="서울특별시"]').click()

    wait_element(driver, By.XPATH, f'//li[text()="강서구"]', 5) # wait until load element

    popup.find_element(By.XPATH, f'//span[text()="시/군/구"]').click()
    popup.find_element(By.XPATH, f'//li[text()="강서구"]').click()

    wait_element(driver, By.XPATH, f'//li[text()="마곡동"]', 5) # wait until load element

    popup.find_element(By.XPATH, f'//span[text()="읍/면/동"]').click()
    popup.find_element(By.XPATH, f'//li[text()="마곡동"]').click()

    # 주소정보 검색 버튼 클릭
    log_format('주소정보 검색 버튼 클릭')
    popup.find_element(By.CSS_SELECTOR, f'.fa-magnifying-glass').click()

    wait_element(driver, By.XPATH, f'//span[text()="{apt}"]', 5) # wait until load element

    popup.find_element(By.XPATH, f'//span[text()="{apt}"]').click()

    # 주소 상세정보 선택
    log_format('주소 상세정보 선택')
    popup.find_element(By.XPATH, f'//span[text()="동 선택"]').click()
    popup.find_element(By.XPATH, f'//li[text()="{dong}"]').click()

    wait_element(driver, By.XPATH, f'//li[text()="{floor}"]', 5) # wait until load element

    popup.find_element(By.XPATH, f'//span[text()="층 선택"]').click()
    popup.find_element(By.XPATH, f'//li[text()="{floor}"]').click()

    wait_element(driver, By.XPATH, f'//li[text()="{ho}"]', 5) # wait until load element

    popup.find_element(By.XPATH, f'//span[text()="호 선택"]').click()
    popup.find_element(By.XPATH, f'//li[text()="{ho}"]').click()

    # 검색완료 버튼 클릭
    log_format('검색완료 버튼 클릭')
    popup.find_element(By.XPATH, f'//button[text()="검색완료"]').click()

    # 유형 - 아파트 클릭
    log_format('유형 - 아파트 클릭')
    driver.find_element(By.XPATH, f'//button[text()="아파트"]').click()

    # 추가정보 입력 - 옵션항목:인덕션
    log_format('추가정보 입력 - 옵션항목:인덕션')
    driver.find_element(By.CSS_SELECTOR, f'div[data-component="dropdown"].multiple').click()
    driver.find_element(By.XPATH, f'//li[text()="인덕션"]').click()
    driver.find_element(By.XPATH, f'//span[text()="옵션항목:"]').click()

    driver.find_element(By.XPATH, f'//button[text()="즉시 입주"]').click() # 입주가능일: 즉시입주

    # 매물설명 입력
    log_format('매물설명 입력')
    driver.find_element(By.CSS_SELECTOR, f'input[placeholder*="신논현역 도보 5분거리"]').send_keys(f'{apt} {dong} {floor} {ho}') # 제목
    driver.find_element(By.CSS_SELECTOR, f'textarea[placeholder*="상세설명 작성 주의사항"]').send_keys('상세설명') # 상세설명
    driver.find_element(By.CSS_SELECTOR, f'input[placeholder*="외부에 공개되지 않으며"]').send_keys('비공개메모') # 비공개메모
    driver.find_element(By.CSS_SELECTOR, f'input[placeholder*="34평, 남향, 올수리, 공원뷰, 깔끔한집"]').send_keys('매물특징') # 매물특징

    clipboard.copy(price)
    # 거래입력 - 월세
    # log_format('거래입력 - 월세')
    # driver.find_element(By.XPATH, f'//button[text()="월세"]').click() # 월세
    # inputList = driver.find_elements(By.CSS_SELECTOR, f'span.product-type-0 ~ div input')
    # for ele in inputList:
    #     ele.click()
    #     ele.send_keys(Keys.CONTROL, 'v')

    # driver.find_element(By.CSS_SELECTOR, f'span.product-type-0 ~ div ~ div div.dropdown-object ul').click()
    # driver.find_element(By.CSS_SELECTOR, f'span.product-type-0 ~ div ~ div div.dropdown-list ul').find_element(By.XPATH, f'//li[text()="매일"]').click()

    # 거래입력 - 전세
    # log_format('거래입력 - 전세')
    # driver.find_element(By.XPATH, f'//button[text()="전세"]').click() # 전세
    # driver.find_element(By.CSS_SELECTOR, f'span.product-type-1 ~ div input').send_keys(Keys.CONTROL, 'v')
    # driver.find_element(By.CSS_SELECTOR, f'span.product-type-1 ~ div ~ div div.dropdown-object ul').click()
    # driver.find_element(By.CSS_SELECTOR, f'span.product-type-1 ~ div ~ div div.dropdown-list ul > li:first-child').click()

    # 거래입력 - 매매
    log_format('거래입력 - 매매')
    driver.find_element(By.XPATH, f'//button[text()="매매"]').click() # 매매
    driver.find_element(By.CSS_SELECTOR, f'span.product-type-2 ~ div input').send_keys(Keys.CONTROL, 'v')
    driver.find_element(By.CSS_SELECTOR, f'span.product-type-2 ~ div ~ div div.dropdown-object ul').click()
    driver.find_element(By.CSS_SELECTOR, f'span.product-type-2 ~ div ~ div div.dropdown-list ul > li:first-child').click()

    # 집주인 정보 입력
    log_format('집주인 정보 입력')
    driver.find_element(By.XPATH, f'//*[@id="root"]/div/div/div[2]/div/div[1]/div/div/div[1]/div[2]/div[2]/section[8]/div/div[2]/div[1]/div/div[2]/div[2]/div[1]/div[2]/div/div/div/div/input').send_keys('집주인')
    driver.find_element(By.XPATH, f'//span[text()="통신사"]').click()
    driver.find_element(By.XPATH, f'//li[text()="KT"]').click()

    clipboard.copy('01010123333')
    driver.find_element(By.CSS_SELECTOR, f'input[placeholder*="제외하고 숫자만 입력"]').send_keys(Keys.CONTROL, 'v')

    driver.find_element(By.XPATH, f'//*[@id="root"]/div/div/div[2]/div/div[1]/div/div/div[1]/div[2]/div[2]/section[8]/div/div[2]/div[1]/div/div[2]/div[2]/div[3]/div[2]/div/div[1]/div/div/div/input').send_keys('owner')
    driver.find_element(By.XPATH, f'//*[@id="root"]/div/div/div[2]/div/div[1]/div/div/div[1]/div[2]/div[2]/section[8]/div/div[2]/div[1]/div/div[2]/div[2]/div[3]/div[2]/div/div[2]/div/div/div/input').send_keys('test.com')

    # 등록
    log_format('등록')
    driver.find_element(By.XPATH, f'//button[text()="등록"]').click() # 등록 버튼 클릭
    wait_sleep(0.5)
    driver.find_element(By.CSS_SELECTOR, f'div.alert-wrapper > footer > div:nth-child(2) > button').click() # 팝업 확인 버튼 클릭
    wait_sleep(0.5)
    driver.find_element(By.CSS_SELECTOR, f'div.alert-wrapper > footer > div:nth-child(2) > button').click() # 팝업 확인 버튼 클릭

    # 광고료 결재
    log_format('광고료 결재')
    driver.find_element(By.CSS_SELECTOR, f'div[data-component="dropdown"]').click()
    driver.find_element(By.XPATH, f'//li[text()="3개월"]').click()
    driver.find_element(By.XPATH, f'//button[text()="다음"]').click()
    wait_sleep(0.5)
    driver.find_element(By.CSS_SELECTOR, f'div.alert-wrapper > footer > div:nth-child(2) > button').click() # 팝업 확인 버튼 클릭
    wait_sleep(0.5)
    driver.find_element(By.CSS_SELECTOR, f'div.alert-wrapper > footer > div:nth-child(1) > button').click() # 팝업 확인 버튼 클릭


# __all__ 정의
__all__ = ['test']