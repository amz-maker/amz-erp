-- 컬럼: 16개
-- 매출계약정보
INSERT INTO SL001M1
(
 CTRCT_NO         -- 계약번호
,BSNTYP_NM        -- 업종명
,ORDER_COMPN      -- 발주사
,CTRCT_COMPN      -- 계약사 (거래처)
,PRJCT_NM         -- 프로젝트명
,PRJCT_CONTN      -- 프로젝트내용
,TOTAL_CTRCT_PRC  -- 총계약금
,CTRCT_TYPE_CD    -- 계약유형코드
,CHNG_YN          -- 변경여부
,PAY_GB_CD        -- 지급구분코드
,ISSUE_SCHD_GB_CD -- 발행일구분코드
,ISSUE_SCHD_DAY   -- 발행예정일
,RVRS_ISSUE_YN    -- 역발행여부
,DPST_SCHD_DAY    -- 입금예정일
,CTRCT_START_DT   -- 계약시작일자
,CTRCT_END_DT     -- 계약종료일자
)
VALUES
 ('2022001', '증권', '한국투자증권', 'SKCC'      , '인프라 ITO_Yr4'          , '3'            ,    '14,905,000', 'CT10', 'N', 'PA01', 'IS01', '24', 'Y', '10' , '20221001', '20230930')
,('2022002', '증권', '하나증권'    , '하나금융TI', '계정계OS'                , '계정계 운영'  ,    '33,330,000', 'CT10', 'N', 'PA01', 'IS02', NULL, 'N', '14' , '20230101', '20231231')
,('2022003', '증권', 'SK증권'      , 'SK증권'    , '금융투지소득세'          , ''             , '3,054,975,000', 'CT10', 'N', 'PA02', 'IS01', NULL, 'N', '14' , '20220216', '20230214')
,('2022004', '증권', 'SK증권'      , 'SK증권'    , '상품주식'                , ''             ,   '388,850,000', 'CT10', 'N', 'PA02', 'IS01', NULL, 'N', '14' , '20220801', '20230531')
,('2023001', '증권', '하나증권'    , '하나금융TI', '계정계OS(변경)'          , '계정계 운영'  ,   '297,660,000', 'CT10', 'Y', 'PA01', 'IS02', NULL, 'N', '14' , '20230101', '20231231')
,('2023002', '증권', '한국투자증권', 'SKCC'      , '인프라 ITO_Yr4(변경)'    , 'VDI(중급추가)',   '282,869,400', 'CT10', 'Y', 'PA01', 'IS01', '24', 'Y', '10' , '20221001', '20230930')
,('2023003', '증권', 'KB증권'      , 'SKCC'      , '마켓캐스터 플랫폼 사업화', '현물주문/시세',    '46,200,000', 'CT22', 'N', 'PA01', 'IS03', NULL, 'Y', '14' , '20230201', '20230331')
;

