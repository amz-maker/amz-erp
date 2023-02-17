from selenium import webdriver
from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

from package_blackbox import *
from common import *
import time
import clipboard

def main(driver: WebDriver):
    id = 'buyer0929_01'
    pw = '1q2w3e4r!'
    phone = '01009290001'

    """
    # [Test] 일반회원 회원가입
    test_signup_buyer.test(driver, id, pw, phone)

    # [Test] 일반회원 로그인
    test_login.test(driver, enum.UserType.BUYER, 'a@test.com', '1q2w3e4r!')

    # [Test] 로그아웃
    test_logout.test(driver)
    """

    """
    # [Test] 중개회원 회원가입
    test_signup_seller.test(driver, id, pw, phone)

    # [Test] 중개회원 로그인
    test_login.test(driver, enum.UserType.SELLER, 'b@test.com', '1q2w3e4r!')

    # [Test] 로그아웃
    test_logout.test(driver)
    """


    # [Test] 중개회원 로그인
    test_login.test(driver, enum.UserType.SELLER, 'seller@test.com', '1q2w3e4r!')

    # [Test] 매물 등록
    for i in range(1, 17):
        test_registration.test(driver, '마곡벽산아파트', f'101동', f'{i}층', f'{i}01호', f'{i*10000}')


if __name__ == "__main__":
    chromeOptions = webdriver.ChromeOptions()
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chromeOptions)

	# 브라우저 최대화
    driver.maximize_window()

    print('────────────────────────────────────────')
    print('          SELENIUM UI TESTING           ')
    print('────────────────────────────────────────')
    main(driver) # main
    print('────────────────────────────────────────')

    time.sleep(3000)
    driver.quit()