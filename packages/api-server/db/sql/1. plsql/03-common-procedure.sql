/* 공통 프로시저 정의 */

-- ---------------------------------------------------------------------------------------------
-- 로그(Notice) 출력
-- ---------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS PRINT_LOG;
CREATE PROCEDURE PRINT_LOG(_log VARCHAR) 
AS $$
BEGIN
    RAISE NOTICE '%', _log;
END; $$
LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------------------------
-- 현재 시각 + 로그(Notice) 출력
-- ---------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS PRINT_LOG_T;
CREATE PROCEDURE PRINT_LOG_T(_log VARCHAR) 
AS $$
BEGIN
    RAISE NOTICE '[%] %', LEFT((SELECT clock_timestamp()::VARCHAR), 19), _log;
END; $$
LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------------------------
-- 로그(Notice) + 시간값 출력
-- ---------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS PRINT_LOG_TE;
CREATE PROCEDURE PRINT_LOG_TE(_log VARCHAR, _t TIMESTAMPTZ) 
AS $$
BEGIN
    RAISE NOTICE '% [%]', _log, LEFT(_t::VARCHAR, 19);
END; $$
LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------------------------
-- 로그(Notice) + 시간 간격 출력, 시간 변수 갱신
-- ---------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS PRINT_LOG_TS;
CREATE PROCEDURE PRINT_LOG_TS(_log VARCHAR, INOUT _t TIMESTAMPTZ) 
AS $$
BEGIN
    RAISE NOTICE '% [%]', _log, LEFT((clock_timestamp() - _t)::VARCHAR, 19);
    _t := clock_timestamp();
END; $$
LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------------------------
-- 로그(Notice) + 시간 간격 출력, 시간 변수 갱신 + 개행
-- ---------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS PRINT_LOG_TSN;
CREATE PROCEDURE PRINT_LOG_TSN(_log VARCHAR, INOUT _t TIMESTAMPTZ) 
AS $$
BEGIN
    RAISE NOTICE E'% [%]\n', _log, LEFT((clock_timestamp() - _t)::VARCHAR, 19);
    _t := clock_timestamp();
END; $$
LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------------------------
-- 대상 테이블에 CREATED_AT 컬럼 추가
-- ---------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS ADD_CREATED_AT_ON_TABLE;
CREATE PROCEDURE ADD_CREATED_AT_ON_TABLE
(
    _tableName TEXT
)
AS $$
    DECLARE _fullName TEXT;
BEGIN

    _fullName := REPLACE(_tableName, '.', '_'); -- 테이블명에 스키마가 포함된 경우, 점 치환
    
    EXECUTE FORMAT('ALTER TABLE %s ADD COLUMN CREATED_AT TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP', _tableName);
    EXECUTE FORMAT('CREATE INDEX IDX_%s_CREATED_AT ON %s USING BRIN (CREATED_AT)', _fullName, _tableName);
    
END; $$
LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------------------------
-- 대상 테이블에 CREATED_AT, UPDATED_AT 컬럼 추가
-- ---------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS ADD_TIME_META_COLUMNS_ON_TABLE;
CREATE PROCEDURE ADD_TIME_META_COLUMNS_ON_TABLE
(
    _tableName TEXT
)
AS $$
    DECLARE _fullName TEXT;
BEGIN

    _fullName := REPLACE(_tableName, '.', '_'); -- 테이블명에 스키마가 포함된 경우, 점 치환
    
    EXECUTE FORMAT('ALTER TABLE %s ADD COLUMN CREATED_AT TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP', _tableName);
    EXECUTE FORMAT('ALTER TABLE %s ADD COLUMN UPDATED_AT TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP', _tableName);
    
    EXECUTE FORMAT('CREATE TRIGGER UPDATED_AT BEFORE UPDATE  ON %s FOR EACH ROW EXECUTE PROCEDURE UPDATE_MODIFIED_COLUMN()', _tableName);
    EXECUTE FORMAT('CREATE INDEX IDX_%s_CREATED_AT ON %s USING BRIN (CREATED_AT)', _fullName, _tableName);
    EXECUTE FORMAT('CREATE INDEX IDX_%s_UPDATED_AT ON %s USING BRIN (UPDATED_AT)', _fullName, _tableName);
    
END; $$
LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------------------------
-- 대상 테이블에 PROC_YN 컬럼 추가
-- ---------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS ADD_PROC_YN_COLUMN_ON_TABLE;
CREATE PROCEDURE ADD_PROC_YN_COLUMN_ON_TABLE
(
    _tableName TEXT
)
AS $$
BEGIN
    EXECUTE FORMAT('ALTER TABLE %s ADD COLUMN PROC_YN YN        NOT NULL DEFAULT 0::CHAR(1)', _tableName);
    EXECUTE REPLACE('CREATE INDEX IDX_%s_PROC_YN ON %s (PROC_YN)', '%s', _tableName);
    
END; $$
LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------------------------
-- RC 테이블로부터 복제하여 RD 테이블 생성
-- ---------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS CREATE_RD_TABLE_FROM_RC;
CREATE PROCEDURE CREATE_RD_TABLE_FROM_RC
(
    _tableName TEXT
)
AS $$
BEGIN
    -- 이름 앞에 'RC_'가 들어갈 경우 제거
    IF LEFT(_tableName, 3) = 'RC_'
    THEN _tableName := RIGHT(_tableName, LENGTH(_tableName) - 3);
    END IF;
    
    -- 이름 앞에 'RD_'가 들어갈 경우 제거
    IF LEFT(_tableName, 3) = 'RD_'
    THEN _tableName := RIGHT(_tableName, LENGTH(_tableName) - 3);
    END IF;

    EXECUTE FORMAT('CREATE TABLE RD_%s (LIKE RC_%s INCLUDING INDEXES);', _tableName, _tableName);
    CALL ADD_TIME_META_COLUMNS_ON_TABLE(FORMAT('RD_%s', _tableName));
    CALL ADD_PROC_YN_COLUMN_ON_TABLE   (FORMAT('RD_%s', _tableName));
    
END; $$
LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------------------------
-- RC 테이블로부터 복제하여 RD 테이블 생성 + PK 컬럼 설정
-- ---------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS CREATE_RD_TABLE_FROM_RC_WITH_PK;
CREATE PROCEDURE CREATE_RD_TABLE_FROM_RC_WITH_PK
(
    _tableName TEXT
   ,_columns   TEXT[] -- PK 설정할 컬럼들
)
AS $$
    DECLARE rdTableName TEXT;
BEGIN
    -- 이름 앞에 'RC_'가 들어갈 경우 제거
    IF LEFT(_tableName, 3) = 'RC_'
    THEN _tableName := RIGHT(_tableName, LENGTH(_tableName) - 3);
    END IF;
    
    -- 이름 앞에 'RD_'가 들어갈 경우 제거
    IF LEFT(_tableName, 3) = 'RD_'
    THEN _tableName := RIGHT(_tableName, LENGTH(_tableName) - 3);
    END IF;
    
    
    rdTableName := ('RD_' || _tableName);

    -- 테이블 생성
    EXECUTE FORMAT('CREATE TABLE RD_%s (LIKE RC_%s INCLUDING INDEXES);', _tableName, _tableName);
    CALL ADD_TIME_META_COLUMNS_ON_TABLE(FORMAT('%s', rdTableName));
    CALL ADD_PROC_YN_COLUMN_ON_TABLE   (FORMAT('%s', rdTableName));
    
    -- PK 설정
    EXECUTE FORMAT('ALTER TABLE %s ADD CONSTRAINT PK_%s PRIMARY KEY (%s);', rdTableName, rdTableName, array_to_string(_columns, ','));
    
END; $$
LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------------------------
-- 대상 테이블의 지정 컬럼들을 NOT NULL로 설정
-- ---------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS SET_COLUMNS_NOT_NULL;
CREATE PROCEDURE SET_COLUMNS_NOT_NULL
(
    _tableName TEXT
   ,_columns   TEXT[]
)
AS $$
    DECLARE i INTEGER;
BEGIN
    FOR i IN 1 .. array_upper(_columns, 1)
    LOOP
        EXECUTE FORMAT('ALTER TABLE %s ALTER %s SET NOT NULL;', _tableName, _columns[i]);
    END LOOP;
    
END; $$
LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------------------------
-- 대상 테이블의 지정 컬럼들을 Primary Key로 설정
-- ---------------------------------------------------------------------------------------------
-- 예시 : CALL SET_COLUMNS_PK  ('TABLE_NAME', ARRAY ['COL_A', 'COL_B']);
-- ---------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS SET_COLUMNS_PK;
CREATE PROCEDURE SET_COLUMNS_PK
(
    _tableName TEXT
   ,_columns   TEXT[]
)
AS $$
BEGIN
    EXECUTE FORMAT('ALTER TABLE %s ADD CONSTRAINT PK_%s PRIMARY KEY (%s);', _tableName, _tableName, array_to_string(_columns, ','));
    
END; $$
LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------------------------
-- 대상 테이블의 지정 컬럼들을 Unique로 설정
-- ---------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS SET_COLUMNS_UNIQUE;
CREATE PROCEDURE SET_COLUMNS_UNIQUE
(
    _tableName TEXT
   ,_columns   TEXT[]
)
AS $$
BEGIN
    EXECUTE FORMAT('ALTER TABLE %s ADD CONSTRAINT UNQ_%s UNIQUE (%s);', _tableName, _tableName, array_to_string(_columns, ','));
    
END; $$
LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------------------------
-- 테이블에 성능 민감한 작업 시작(대량 INSERT, UPDATE, DELETE, COPY)
-- 인덱스 무력화
-- NOTE : PK, UNIQUE도 무력화되니 주의
-- ---------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS START_WORK_ON_TABLE;
CREATE PROCEDURE START_WORK_ON_TABLE
(
    _tableName TEXT
)
AS $$
BEGIN
    EXECUTE REPLACE('UPDATE pg_index SET indisready=false WHERE indrelid = ( SELECT oid FROM pg_class WHERE relname=LOWER(''%s''));', '%s', _tableName);
    
END; $$
LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------------------------
-- 테이블에서 작업 종료
-- 인덱스 재설정
-- NOTE : PK, UNIQUE도 무력화되니 주의
-- ---------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS END_WORK_ON_TABLE;
CREATE PROCEDURE END_WORK_ON_TABLE
(
    _tableName TEXT
)
AS $$
BEGIN
    EXECUTE REPLACE('UPDATE pg_index SET indisready=true WHERE indrelid = ( SELECT oid FROM pg_class WHERE relname=LOWER(''%s''));', '%s', _tableName);
    EXECUTE REPLACE('REINDEX TABLE %s;', '%s', _tableName);
    
END; $$
LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------------------------
-- 테이블 내 중복 데이터 제거(중복 데이터를 모두 하나로 병합)
-- ---------------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS REDUCE_DUPLICATES_ON_TABLE;
CREATE PROCEDURE REDUCE_DUPLICATES_ON_TABLE
(
    _tableName TEXT
)
AS $$
    DECLARE _tempTableName TEXT;
BEGIN
    _tempTableName := 'TMP_' || _tableName;

    -- 인덱스, 키 무력화
    EXECUTE REPLACE('UPDATE pg_index SET indisready=false WHERE indrelid = ( SELECT oid FROM pg_class WHERE relname=LOWER(''%s''));', '%s', _tableName);
    
    EXECUTE FORMAT('DROP TABLE IF EXISTS %s', _tempTableName);
    EXECUTE FORMAT('CREATE TEMPORARY TABLE %s AS SELECT DISTINCT * FROM %s', _tempTableName, _tableName);
    EXECUTE FORMAT('TRUNCATE %s', _tableName);
    EXECUTE FORMAT('INSERT INTO %s SELECT * FROM %s', _tableName, _tempTableName);
    EXECUTE FORMAT('DROP TABLE IF EXISTS %s', _tempTableName);

    -- 인덱스 재생성
    EXECUTE REPLACE('UPDATE pg_index SET indisready=true WHERE indrelid = ( SELECT oid FROM pg_class WHERE relname=LOWER(''%s''));', '%s', _tableName);
    EXECUTE REPLACE('REINDEX TABLE %s;', '%s', _tableName);
    
END; $$
LANGUAGE plpgsql;