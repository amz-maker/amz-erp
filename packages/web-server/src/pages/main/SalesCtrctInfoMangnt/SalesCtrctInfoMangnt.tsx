/*------------------------------------------------------------------------------------------------------------------------------------------
 * SalesCtrctInfoMangnt.tsx
 * WRITER : 최정근
 * DATE : 2023-02-14
 * DISCRIPTION : 
 * TYPE : Page
 * 개정이력 : 2023-04-10(박건률)
--------------------------------------------------------------------------------------------------------------------------------------------*/
import React, { useMemo } from 'react';
import ERPDesign from 'container/ERPDesign';
import { DivisionBox } from 'module/AmzPack/component';
import { IChildren, IDataPage } from 'module/AmzPack/interface';
import { DatePicker, DatePickerProps, FormInstance, Input } from 'antd';
import {
  checkboxColumn,
  Column,
  createTextColumn,
  dateColumn,
  floatColumn,
  intColumn,
  isoDateColumn,
  keyColumn,
  percentColumn,
  textColumn,
} from 'react-datasheet-grid';
import { apiConfig } from 'config/api-config';
import axios, { AxiosResponse } from 'axios';
import Util from 'common/util';
import { TableStateSelector } from 'container/ERPDesign/store/selector';
import { useRecoilState, useRecoilValue } from 'recoil';

interface SalesCtrctInfoMangntProps {}

type Row = {
  checkbox      : boolean;
  ctrctNo       : string | null;
  bsntypNm      : string | null;
  orderCompn    : string | null;
  ctrctCompn    : string | null;
  prjctNm       : string | null;
  prjctContn    : string | null;
  totalCtrctPrc : string | null;
  ctrctTypeCd   : string | null;
  chngYn        : string | null;
  payGbCd       : string | null;
  issueSchdGbCd : string | null;
  issueSchdDay  : string | null;
  rvrsIssueYn   : string | null;
  dpstSchdDay   : string | null;
  ctrctStartDt  : string | null;
  ctrctEndDt    : string | null;
};

function SalesCtrctInfoMangnt(props: SalesCtrctInfoMangntProps) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  const {} = props;
  const API_URL = apiConfig.url;
  const FUND_SALES_CTRCT_INFO = '/sales/find-sales-ctrct-info';
  const UPDT_SALES_CTRCT_INFO = '/sales/updt-sales-ctrct-info';
  const TABLE_NAME = "SL001M1"
  
  const erpDesing = ERPDesign.useERPDesign(
    (values) => {
      console.log('[Values]', values);
    },
    () => {},
  );

  const formRef = React.useRef<FormInstance>(null);
  const [rowData, setRowData] = React.useState<Row[]>([]);
  
  const [table,setTable] = useRecoilState(TableStateSelector.tableSelector(TABLE_NAME));
  const [updateRowsArr,setUpdateRows] = useRecoilState(TableStateSelector.updateRowsSelector(TABLE_NAME));
  // const createdRowIds = useMemo(() => new Set(), []);
  // const updatedRowIds = useMemo(() => new Set(), []);
  // const deletedRowIds = useMemo(() => new Set(), []);

  // 사용자 지정 Colum
  const emailColum = createTextColumn<string | null>({
    placeholder: '이메일을 입력해 주세요',

    // alignRight: true
  });

  // 사용자 지정 Colum
  const textNotNullColumn = createTextColumn<string | null>({
    placeholder: 'NOT NULL',

    // alignRight: true
  });

  const columns: Column<Row>[] = [
    {
      ...keyColumn<Row, 'checkbox'>('checkbox', checkboxColumn),
      title: '체크박스',
      grow: 1,
      minWidth: 50, // 최소 width
      maxWidth: 100, // 최대 width
    },
    {
      ...keyColumn<Row, 'ctrctNo'>('ctrctNo', textColumn),
      title : '계약번호',
    },       
    {
      ...keyColumn<Row, 'bsntypNm'>('bsntypNm', textColumn),
      title : '업종명',
    },      
    {
      ...keyColumn<Row, 'orderCompn'>('orderCompn', textColumn),
      title : '발주사',
    },    
    {
      ...keyColumn<Row, 'ctrctCompn'>('ctrctCompn', textColumn),
      title : '계약사',
    },    
    {
      ...keyColumn<Row, 'prjctNm'>('prjctNm', textColumn),
      title : '프로젝트명',
    },       
    {
      ...keyColumn<Row, 'prjctContn'>('prjctContn', textColumn),
      title : '프로젝트내용',
    },    
    {
      ...keyColumn<Row, 'totalCtrctPrc'>('totalCtrctPrc', textColumn),
      title : '총계약금',
    }, 
    {
      ...keyColumn<Row, 'ctrctTypeCd'>('ctrctTypeCd', textNotNullColumn),
      title : '계약유형코드',
    },   
    {
      ...keyColumn<Row, 'chngYn'>('chngYn', textNotNullColumn),
      title : '변경여부',
    },        
    {
      ...keyColumn<Row, 'payGbCd'>('payGbCd', textNotNullColumn),
      title : '지급구분코드',
    },       
    {
      ...keyColumn<Row, 'issueSchdGbCd'>('issueSchdGbCd', textNotNullColumn),
      title : '발행일구분코드',
    }, 
    {
      ...keyColumn<Row, 'issueSchdDay'>('issueSchdDay', textColumn),
      title : '발행예정일',
    },  
    {
      ...keyColumn<Row, 'rvrsIssueYn'>('rvrsIssueYn', textNotNullColumn),
      title : '역발행여부',
    },   
    {
      ...keyColumn<Row, 'dpstSchdDay'>('dpstSchdDay', textColumn),
      title : '입금예정일',
    },   
    {
      ...keyColumn<Row, 'ctrctStartDt'>('ctrctStartDt', textColumn),
      title : '계약시작일자',
    },  
    {
      ...keyColumn<Row, 'ctrctEndDt'>('ctrctEndDt', textColumn),
      title : '계약종료일자',
    },    
    // {
    //   ...keyColumn<Row, 'text'>('text', textColumn),
    //   title: '텍스트',
    //   grow: 2, // 넓이 증가 비율 (Default: 1), "grow: 0" -> 증가율 0
    // },
    // {
    //   ...keyColumn<Row, 'int'>('int', intColumn),
    //   title: '정수',
    // },
    // {
    //   ...keyColumn<Row, 'float'>('float', floatColumn),
    //   title: '실수',
    // },
    // {
    //   ...keyColumn<Row, 'date'>('date', dateColumn),
    //   title: '날짜',
    // },
    // {
    //   ...keyColumn<Row, 'isoDate'>('isoDate', isoDateColumn),
    //   title: 'ISO 날짜',
    // },
    // {
    //   ...keyColumn<Row, 'percent'>('percent', percentColumn),
    //   title: '퍼센트',
    // },
    // {
    //   ...keyColumn<Row, 'custom'>('custom', emailColum),
    //   title: '커스텀',
    // },
  ];

  /* ―――――――――――――――― Method ―――――――――――――――― */
  
  function axiosCall(method: 'get' | 'post' | 'put' | 'delete', uri: string, callback: (response: AxiosResponse<any, any>) => void, params: object,data?: object) {
  axios
      .request({
        url: `${API_URL}${uri}`,
        method,
        params,
        data
      })
      .then((res) => {
        callback(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function selectEvent(){
    let dateSet = formRef.current?.getFieldsValue().date

    axiosCall('get', FUND_SALES_CTRCT_INFO, (response) => {
      let rowData = response.data.results;
      // setRowData(rowData);
      setTable(rowData)
      // console.log(table)
      // createdRowIds.clear()
      // updatedRowIds.clear()
      // deletedRowIds.clear()
    },{
      ctrctStartDt:dateSet? Util.format.date(dateSet[0].toDate(),'YMD') : undefined,
      ctrctEndDt:dateSet? Util.format.date(dateSet[1].toDate(),'YMD') : undefined,
      orderCompn:formRef.current?.getFieldsValue().orderCompn || undefined,
      ctrctCompn:formRef.current?.getFieldsValue().ctrctCompn || undefined,
      prjctNm:formRef.current?.getFieldsValue().prjctNm || undefined,
      ctrctTypeCd:formRef.current?.getFieldsValue().ctrctTypeCd || undefined,
      payGbCd:formRef.current?.getFieldsValue().payGbCd || undefined,
    })
  }


  // api에 넣을때 타입체크를 하기 위함
  type ApiInput = {
    createData : TableColumn[];
    updateData : TableColumn[];
    deleteData : TableColumn[];
  };

  type TableColumn = {
      ctrctNo       : string; // 계약번호
      bsntypNm      : string; // 업종명
      orderCompn    : string; // 발주사
      ctrctCompn    : string; // 계약사
      prjctNm       : string; // 프로젝트명
      prjctContn    : string; // 프로젝트내용
      totalCtrctPrc : number; // 총계약금
      ctrctTypeCd   : string; // 계약유형코드
      chngYn        : string; // 변경여부
      payGbCd       : string; // 지급구분코드
      issueSchdGbCd : string; // 발행일구분코드
      issueSchdDay  : string; // 발행예정일
      rvrsIssueYn   : string; // 역발행여부
      dpstSchdDay   : string; // 입금예정일
      ctrctStartDt  : string; // 계약시작일자
      ctrctEndDt    : string; // 계약종료일자
  }

  function updateEvent(){
    const updateRows = updateRowsArr[0] as Map<number,any>
    // 업데이트하는 행이 없다면 업데이트 진행하지않음.
    if(updateRows == undefined || updateRows.size == 0){
      return;
    }
    const apiInput:ApiInput = {
      ...ERPDesign.dataDivider(updateRows),
    }
    console.log("updateRows - ",updateRows)
    console.log("apiInput - ",apiInput)
    
    // 업데이트 후에 updateRows 초기화
    setUpdateRows([])
    axiosCall('post', UPDT_SALES_CTRCT_INFO, (response) => {
      // let rowData = response.data.results;
      // setRowData(rowData);
      // setTable(rowData)
      console.log("response - ", response)
      selectEvent()
      // createdRowIds.clear()
      // updatedRowIds.clear()
      // deletedRowIds.clear()
    },{}
    ,{...apiInput})


    
    // PgUtil.updateObjectIntoTable({

    // })
  }


  /* ―――――――――――――― Use Effect ―――――――――――――― */
  React.useEffect(() => {
    // Row Data 설정
    // setRowData([
    //   { checkbox: true, text: 'text 1', int: 1, float: 1.0, date: new Date(), isoDate: '2022-01-01', percent: 0.1, custom: '커스텀(이메일)' },
    //   { checkbox: false, text: 'text 2', int: 2, float: 2.0, date: new Date(), isoDate: '2022-01-01', percent: 0.2, custom: null },
    // ]);
    
    axiosCall('get', FUND_SALES_CTRCT_INFO, (response) => {
      let rowData = response.data.results;
      // setRowData(rowData);
      setTable(rowData)
    },{})
  }, []);

  /* ―――――――――――――――― Return ―――――――――――――――― */
  return (
    <ERPDesign data-page="salesCtrctInfoMangnt" formref={formRef}>
      {/* 조회조건 영역 */}
      <ERPDesign.ConditionArea size={4}>
        <ERPDesign.Condition label="계약기간" name="date">
          <DatePicker.RangePicker />
        </ERPDesign.Condition>
        <ERPDesign.Condition label="발주사" name="orderCompn" colSpan={1}>
          <Input />
        </ERPDesign.Condition>
        <ERPDesign.Condition label="계약사" name="ctrctCompn">
          <Input />
        </ERPDesign.Condition>
        <ERPDesign.Condition label="프로젝트명" name="prjctNm">
          <Input />
        </ERPDesign.Condition>
        <ERPDesign.Condition label="계약유형" name="ctrctTypeCd">
          <Input />
        </ERPDesign.Condition>
        <ERPDesign.Condition label="지급구분" name="payGbCd">
          <Input />
        </ERPDesign.Condition>
      </ERPDesign.ConditionArea>

      {/* 컨트롤 버튼 영역 */}
      <ERPDesign.ControlArea>
        <ERPDesign.Submit onClick={selectEvent}>조회</ERPDesign.Submit>
        <ERPDesign.Submit onClick={updateEvent}>저장</ERPDesign.Submit>
      </ERPDesign.ControlArea>
      {/* 테이블 영역 */}
      <ERPDesign.TableArea>
        <ERPDesign.Table
          columns={columns}
          data={{
            row: rowData,
            set: setRowData,
          }}
          tableName={TABLE_NAME}
        />
      </ERPDesign.TableArea>
    </ERPDesign>
  );
}

namespace SalesCtrctInfoMangnt {}

export default SalesCtrctInfoMangnt;
