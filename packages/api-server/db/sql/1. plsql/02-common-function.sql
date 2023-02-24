/* 공통 함수 정의 */

-- ---------------------------------------------------------------------------------------------
-- DESCRIBE 대체 함수
-- ---------------------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS DESCRIBE_TABLE;
CREATE OR REPLACE FUNCTION DESCRIBE_TABLE
(
    tableName VARCHAR
)
RETURNS
TABLE
(
	column_name information_schema.sql_identifier,
	data_type   information_schema.character_data,
	character_maximum_length information_schema.cardinal_number
)
AS $$
BEGIN
	RETURN QUERY
    SELECT A."column_name", A."data_type", A."character_maximum_length"
    FROM INFORMATION_SCHEMA.COLUMNS A
    WHERE table_name = LOWER(tableName);
END; $$
LANGUAGE 'plpgsql';


-- ---------------------------------------------------------------------------------------------
-- 특정 테이블의 인덱스 확인
-- ---------------------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS SHOW_INDEX;
CREATE OR REPLACE FUNCTION SHOW_INDEX
(
    _tableName VARCHAR
)
RETURNS setof pg_indexes
AS $$
BEGIN
	RETURN QUERY
    SELECT * FROM pg_indexes WHERE tablename = LOWER(_tableName); 
END; $$
LANGUAGE 'plpgsql';


-- ---------------------------------------------------------------------------------------------
-- Mysql INSTR 호환
-- ---------------------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS INSTR;
CREATE FUNCTION INSTR
(
    str    TEXT,
    substr TEXT
)
RETURNS INT
AS $$
BEGIN
    
    RETURN POSITION(substr in str);
END; $$ 
LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------------------------
-- Mysql SUBSTRING_INDEX 호환
-- ---------------------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS SUBSTRING_INDEX;
CREATE OR REPLACE FUNCTION SUBSTRING_INDEX (
  str text,
  delim text,
  count integer = 1,
  out substring_index text
)
RETURNS text AS
$body$
BEGIN
  IF count > 0 THEN
    substring_index = array_to_string((string_to_array(str, delim))[:count], delim);
  ELSE
    DECLARE
      _array TEXT[];
    BEGIN
      _array = string_to_array(str, delim);
      substring_index = array_to_string(_array[array_length(_array, 1) + count + 1:], delim);    
    END;  
  END IF;
END;
$body$
LANGUAGE 'plpgsql'
IMMUTABLE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 5;


-- ---------------------------------------------------------------------------------------------
-- 문자열 내에서 지정 문자의 마지막 위치 찾기
-- ---------------------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS LAST_INDEXOF;
CREATE FUNCTION LAST_INDEXOF
(
    str    TEXT,
    substr TEXT
)
RETURNS INT
AS $$

    DECLARE i INT DEFAULT 0;
    DECLARE k INT DEFAULT 0;
    
BEGIN
    k := INSTR(REVERSE(str), REVERSE(substr));
    
    IF k = 0 THEN
	    i := 0;
    ELSE
        i := (CHAR_LENGTH(str) + 2) - k - CHAR_LENGTH(substr);
	END IF;
    
    RETURN i;
END;
$$ 
LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------------------------
-- 대상 문자열의 모든 문자를 지정 문자로 교체
-- ---------------------------------------------------------------------------------------------
-- TRANSLATE -> 내장 함수로 존재


-- ---------------------------------------------------------------------------------------------
-- 인수로 받은 넘겨받은 데이터에서 숫자에 해당하는 값만 추출하여 리턴
-- ---------------------------------------------------------------------------------------------
-- 2022. 04. 20. 제대로 동작하지 않음
/*
DROP FUNCTION IF EXISTS GET_NUM_DATA;
CREATE FUNCTION GET_NUM_DATA (Data TEXT)
RETURNS INT
AS $$
	DECLARE getNum     TEXT;
	DECLARE data_nonum TEXT;
	DECLARE data_ind   INT;

BEGIN
	data_nonum := TRIM(TRANSLATE(Data, '01234567890',''));
	data_ind   := INSTR(data_nonum, ' ');
	getNum :=
		CASE data_ind WHEN 0 THEN 0
			ELSE CAST(
					TRANSLATE(
						TRANSLATE(Data, RTRIM(LEFT(data_nonum, data_ind - 1)), ''), 
						LTRIM(RIGHT(data_nonum, LENGTH(data_nonum) - data_ind)),
                        ''
					) AS INT
                )
		END;
		
	RETURN(getNum); 
END;
$$ 
LANGUAGE plpgsql;
*/

-- ---------------------------------------------------------------------------------------------
-- 왼쪽 단어 제거
-- ---------------------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS PRUNE_LEFT_PHRASE;
CREATE FUNCTION PRUNE_LEFT_PHRASE(str TEXT)
RETURNS TEXT
AS $$
BEGIN
	-- 우측 공백 제거
	str := TRIM(str);
 
	-- 공백 문자가 없는 경우, 자기 자신 리턴
	IF INSTR(str, ' ') = 0
	THEN RETURN str;
	END IF;
	
    RETURN TRIM(RIGHT(str, CHAR_LENGTH(str) - INSTR(str, ' ')));
END;
$$ 
LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------------------------
-- 오른쪽 단어만 참조
-- ---------------------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS RIGHT_PHRASE;
CREATE FUNCTION RIGHT_PHRASE(str TEXT)
RETURNS TEXT
AS $$
BEGIN
	-- 공백 제거
	str := TRIM(str);
 
	-- 공백 문자가 없는 경우, 자기 자신 리턴
	IF INSTR(str, ' ') = 0
	THEN RETURN str;
	END IF;
	
	RETURN TRIM(RIGHT(str, INSTR(REVERSE(str), ' ') - 1));
END;
$$ 
LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------------------------
-- AABB Min, Max 두 좌표로부터 사각형 폴리곤 생성
-- ---------------------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS POLYGON_AABB;
CREATE FUNCTION POLYGON_AABB (
     _minPos POINT
    ,_maxPos POINT
)
RETURNS POLYGON
AS $$
BEGIN
	
    RETURN
		POLYGON( 
			BOX (_minPos, _maxPos)
		)
	;
END;
$$ 
LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------------------------
-- 문자열 내의 부분 문자열 개수 확인
-- ---------------------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS SUBSTRING_COUNT;
CREATE FUNCTION SUBSTRING_COUNT
(
    srcStr TEXT,
    subStr TEXT
)
RETURNS INT
AS $$
BEGIN
	
    RETURN (LENGTH(srcStr) - LENGTH(REPLACE(srcStr, subStr, ''))) / LENGTH(subStr);
	
END;
$$ 
LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------------------------
-- Binary(16) 형태의 Mapper ID를 스트링으로 보여주기
-- ---------------------------------------------------------------------------------------------
-- SHOW_MID
-- 필요 없음


-- ---------------------------------------------------------------------------------------------
-- 두 값 중 유효한(비어있지 않은) 문자열 반환(좌측 우선)
-- ---------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION IF_LEFT_VALID(_left TEXT, _right TEXT)   
RETURNS TEXT
AS $$
BEGIN
    RETURN CASE WHEN LENGTH(TRIM(_left)) > 0 THEN _left ELSE _right END; 
END; $$
LANGUAGE 'plpgsql';


-- ---------------------------------------------------------------------------------------------
-- 두 값 중 유효한(비어있지 않은) 문자열 반환(우측 우선)
-- ---------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION IF_RIGHT_VALID(_left TEXT, _right TEXT)   
RETURNS TEXT
AS $$
BEGIN
    RETURN CASE WHEN LENGTH(TRIM(_right)) > 0 THEN _right ELSE _left END; 
END; $$
LANGUAGE 'plpgsql';

