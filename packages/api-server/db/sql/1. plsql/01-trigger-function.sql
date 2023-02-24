/* 트리거 함수 정의 */

-- ---------------------------------------------------------------------------------------------
-- UPDATED_AT 컬럼용 트리거 함수
-- ---------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION UPDATE_MODIFIED_COLUMN()   
RETURNS TRIGGER AS $$
BEGIN
    NEW.UPTD_AT = now();
    RETURN NEW;
END; $$
LANGUAGE 'plpgsql';


-- ---------------------------------------------------------------------------------------------
-- Serial 컬럼용 트리거 함수
-- - Serial을 AUTO_INCREMENT로 만들어준다.
-- - 사용법 : 
-- CREATE TRIGGER {트리거명} AFTER INSERT OR UPDATE OR DELETE ON {테이블명} FOR EACH ROW 
-- EXECUTE PROCEDURE TRIGGER_READJUST_SERIAL('{테이블명}', '{컬럼명}');
-- ---------------------------------------------------------------------------------------------
-- DROP FUNCTION IF EXISTS TRIGGER_READJUST_SERIAL;
CREATE OR REPLACE FUNCTION TRIGGER_READJUST_SERIAL()
RETURNS TRIGGER AS $$
    DECLARE maxVal INT;
    DECLARE _tabName TEXT;
    DECLARE _colName TEXT;
BEGIN
    _tabName := TG_ARGV[0];
    _colName := TG_ARGV[1];
    
    EXECUTE(FORMAT('SELECT COALESCE(MAX(%s), 0) + 1 FROM %s;', _colName, _tabName)) INTO maxVal;
    EXECUTE(FORMAT('ALTER SEQUENCE %s_%s_SEQ RESTART WITH %s;', _tabName, _colName, maxVal));
    RETURN NEW;
END; $$
LANGUAGE 'plpgsql';


-- ---------------------------------------------------------------------------------------------
-- Serial 컬럼용 트리거 함수 - Serial 시퀀스 값을 1로 리셋한다.
-- ---------------------------------------------------------------------------------------------
-- DROP FUNCTION IF EXISTS TRIGGER_RESET_SERIAL;
CREATE OR REPLACE FUNCTION TRIGGER_RESET_SERIAL()
RETURNS TRIGGER AS $$
    DECLARE _tabName TEXT;
    DECLARE _colName TEXT;
BEGIN
    _tabName := TG_ARGV[0];
    _colName := TG_ARGV[1];
    
    EXECUTE(FORMAT('ALTER SEQUENCE %s_%s_SEQ RESTART WITH 1;', _tabName, _colName));
    RETURN NEW;
END; $$
LANGUAGE 'plpgsql';


-- ---------------------------------------------------------------------------------------------
-- Serial 컬럼용 트리거 함수 간편 생성 프로시저
-- - Serial을 AUTO_INCREMENT로 만들어준다.
-- - 사용법 : 
-- CALL SET_SERIAL_TO_AUTO_INCREMENT('{테이블명}', '{컬럼명}');
-- ---------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS SET_SERIAL_TO_AUTO_INCREMENT;
CREATE PROCEDURE SET_SERIAL_TO_AUTO_INCREMENT 
(
    _tabName TEXT
   ,_colName TEXT
)
AS $$
    DECLARE _trgName1 TEXT;
    DECLARE _trgName2 TEXT;
BEGIN
    _trgName1 := 'TRG' || '_' || _tabName || '_' || _colName || '_EACH';
    _trgName2 := 'TRG' || '_' || _tabName || '_' || _colName || '_RESET';
    
    EXECUTE(FORMAT('CREATE TRIGGER %s AFTER INSERT OR UPDATE OF %s OR DELETE ON %s FOR EACH ROW EXECUTE PROCEDURE TRIGGER_READJUST_SERIAL(''%s'', ''%s'');',
                   REPLACE(_trgName1, '.', '_'), _colName, _tabName, _tabName, _colName));
    
    EXECUTE(FORMAT('CREATE TRIGGER %s AFTER TRUNCATE ON %s EXECUTE PROCEDURE TRIGGER_RESET_SERIAL(''%s'', ''%s'');',
                   REPLACE(_trgName2, '.', '_'),           _tabName, _tabName, _colName));
END; $$
LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------------------------
-- AUTO_INCREMENT 컬럼을 테이블에 간편히 추가한다.
-- CALL ADD_AUTO_INCREMENT_COLUMN_TO_TABLE('{테이블명}', '{컬럼명}');
-- ---------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS ADD_AUTO_INCREMENT_COLUMN_TO_TABLE;
CREATE PROCEDURE ADD_AUTO_INCREMENT_COLUMN_TO_TABLE 
(
    _tabName TEXT
   ,_colName TEXT
)
AS $$
BEGIN
    EXECUTE(FORMAT('ALTER TABLE %s ADD COLUMN %s SERIAL;', _tabName, _colName));
    CALL SET_SERIAL_TO_AUTO_INCREMENT(_tabName, _colName);
END; $$
LANGUAGE plpgsql;


