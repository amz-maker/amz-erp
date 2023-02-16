from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from common.enum import LogType

import time

# log 메세지 포멧
def log_format (str: str, type: LogType = LogType.DEFAULT):
    print({
        LogType.DEFAULT: f'# {str}',
        LogType.TITLE: f'\n『 {str} 』'
    }.get(type)) 


# Element가 존재할 때 까지 기다린다, timeout 시간 초과시 종료
def wait_element (driver: WebDriver, by: By, string: str, time: int):
    try:
        return WebDriverWait(driver, time).until(
            EC.presence_of_element_located((by, string))
        )
    except:
        print('[Error] wait_element function timeout')
        driver.quit()


# Sleep
def wait_sleep (secs: float):
    time.sleep(secs)


# __all__ 정의
__all__ = ['log_format', 'wait_element', 'wait_sleep']