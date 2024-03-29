/*------------------------------------------------------------------------------------------------------------------------------------------
 * OrderInfoMangnt.tsx
 * WRITER : 박진실
 * DATE : 2023-03-29
 * DISCRIPTION : 발주정보관리
 * TYPE : Page
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import React from 'react';
import ERPDesign from 'container/ERPDesign';
import { DivisionBox } from 'module/AmzPack/component';
import { IChildren, IDataPage } from 'module/AmzPack/interface';
import { DatePicker, DatePickerProps, FormInstance, Input, Select } from 'antd';
import axios, { AxiosResponse } from 'axios';
import {
  Column,
  DataSheetGrid,
  DataSheetGridRef,
  checkboxColumn,
  dateColumn,
  floatColumn,
  intColumn,
  isoDateColumn,
  keyColumn,
  textColumn,
  createTextColumn,
  percentColumn,
} from 'react-datasheet-grid';
import classNames from 'classnames';

interface OrderInfoMangntProps {}

function OrderInfoMangnt (props: OrderInfoMangntProps) { 
  /* ――――――――――――――― Variable ――――――――――――――― */
  /* Props ――――― */
  const {} = props;

  /* State ――――― */
    /* API ――――――― */

  /* ―――――――――――――――― Method ―――――――――――――――― */
   /* ―――――――――――――――― Return ―――――――――――――――― */
   return (
    <div data-page="orderInfoManagement">
      <Ord01 />
    </div>
  );
  
};

/* Ord-01 */
type Row = {
  checkbox: boolean;
  text: string | null;
  int: number | null;
  float: number | null;
  date: Date | null;
  isoDate: string | null;
  percent: number | null;
  custom: string | null;
};

type searchValue = {
  prjNm: string;
  ctrctGb: string;
}

type gridColumn = {
  checkbox         : boolean;
  bsntyp           : string | null; // 업종
  orderCompn       : string | null; // 발주사
  biddn            : string | null; // 입찰
  ctrctCompn       : string | null; // 계약회사
  prjNm            : string | null; // 프로젝트명
  busnssContn      : string | null; // 사업내용
  devEnv           : string | null; // 개발환경
  orderSchdDt      : string   | null; // 발주예정일자
  prgsStatInfo     : string | null; // 진행상태정보
  startSchdDt      : string   | null; // 시작예정일자 (착수예정일자)
  expctPrjPerd     : number | null; // 예상프로젝트기간
  expctCmtmtNumppl : number | null; // 예상투입인원수
  expctMemmn       : string | null; // 예상투입공수
  mainCmtmtMem     : string | null; // 주요투입인력
  expctSalesPrc    : string | null; // 예상매출금액
  subcnForm        : string | null; // 하도급형태
  mangr            : string | null; // 담당자
  mangrTel         : string | null; // 담당자연락처
  salesReprs       : string | null; // 영업대표
  ctrctGb          : string | null; // 계약구분
  actcmtMem        : number | null; // 실투입인력
  ctrctPrc         : string | null; // 계약금액
  ctrctStartDt     : string | null; // 계약시작일자
  ctrctEndDt       : string | null; // 계약+종료일자
  ctrctPerd        : string | null; // 계약기간
  ctrctForm        : string | null; // 계약형태
  ctrctAttch       : string | null; // 계약서첨부
  finalCorrcDt     : string | null; // 최종수정일자
  finalModfr       : string | null; // 최종수정자
  finalRegst       : string | null; // 최종등록자
  kind             : string | null; // 종류
}



interface Ord01 {}
function Ord01(props: Ord01){
  // const [data, setData] = React.useState<Row[]>([
  //   { checkbox: true, text: 'text 1', int: 1, float: 1.0, date: new Date(), isoDate: '2022-01-01', percent: 0.1, custom: '커스텀(이메일)' },
  //   { checkbox: false, text: 'text 2', int: 2, float: 2.0, date: new Date(), isoDate: '2022-01-01', percent: 0.2, custom: null },
  // ]);

  const [rowData, setRowData] = React.useState<gridColumn[]>([]);
  const [noDataState, setNoDataState] = React.useState<boolean>(true);

  // React.useEffect(() => {
  //   console.log("noDataState", noDataState);
  // }, [noDataState])

  /* Const ――――― */
  // 사용자 지정 Colum
  const emailColum = createTextColumn<string | null>({
    placeholder: '이메일을 입력해 주세요',

    // alignRight: true
  });
  const formRef = React.useRef<FormInstance>(null);
  const erpDesing = ERPDesign.useERPDesign(
    (values: searchValue) => {
      console.log('[Values]', values);

      axiosCall('get', FUND_ORDER_INFO, (response) => {
        console.log('[response]', response, response.data.results);
        let tempRowData = response.data.results;

        setNoDataState(!!(tempRowData.length == 0));

        setRowData(tempRowData);
      },{...values})
    },
    () => {},
  );
  // const columns: Column<ERPDesign.Row>[] = [
  const columns: Column<gridColumn>[] = [
    {
      ...keyColumn<gridColumn, 'checkbox'>('checkbox', checkboxColumn),
      title: '선택',
      grow: 1,
      minWidth: 50, // 최소 width
      maxWidth: 100, // 최대 width
    },
  
    {
      ...keyColumn<gridColumn, 'bsntyp'>('bsntyp', textColumn),
      title: '업종',
      grow: 1, // 넓이 증가 비율 (Default: 1), "grow: 0" -> 증가율 0
      minWidth: 50, // 최소 width
      maxWidth: 100, // 최대 width
    },
    {
      ...keyColumn<gridColumn, 'orderCompn'>('orderCompn', textColumn),
      title: '발주사',
    },
    {
      ...keyColumn<gridColumn, 'biddn'>('biddn', textColumn),
      title: '입찰',
      grow: 1,
      minWidth: 50, // 최소 width
      maxWidth: 100, // 최대 width
    },
    {
      ...keyColumn<gridColumn, 'ctrctCompn'>('ctrctCompn', textColumn),
      title: '계약사',
    },
    {
      ...keyColumn<gridColumn, 'prjNm'>('prjNm', textColumn),
      title: '프로젝트명칭',
      grow: 2,
    },
    {
      ...keyColumn<gridColumn, 'busnssContn'>('busnssContn', textColumn),
      title: '사업내용',
    },
    {
      ...keyColumn<gridColumn, 'devEnv'>('devEnv', textColumn),
      title: '개발환경',
    },
    {
      ...keyColumn<gridColumn, 'orderSchdDt'>('orderSchdDt', textColumn),
      title: '발주예정일자',
      maxWidth: 100, // 최대 width
    },
    {
      ...keyColumn<gridColumn, 'prgsStatInfo'>('prgsStatInfo', textColumn),
      title: '진행상태정보',
    },

    {
      ...keyColumn<gridColumn, 'startSchdDt'>('startSchdDt', textColumn),
      title: '착수예정일자',
      maxWidth: 100, // 최대 width
    },
    {
      ...keyColumn<gridColumn, 'expctPrjPerd'>('expctPrjPerd', intColumn),
      title: '예상프로젝트기간(M)',
    },
    {
      ...keyColumn<gridColumn, 'expctCmtmtNumppl'>('expctCmtmtNumppl', intColumn),
      title: '예상투입인원수',
    },
    {
      ...keyColumn<gridColumn, 'expctMemmn'>('expctMemmn', textColumn),
      title: '예상투입공수(M/M)',
    },

    {
      ...keyColumn<gridColumn, 'mainCmtmtMem'>('mainCmtmtMem', textColumn),
      title: '주요투입인력',
    },
    {
      ...keyColumn<gridColumn, 'expctSalesPrc'>('expctSalesPrc', textColumn),
      title: '예상매출금액(억)',
    },
    {
      ...keyColumn<gridColumn, 'subcnForm'>('subcnForm', textColumn),
      title: '하도급 형태',
    },
    {
      ...keyColumn<gridColumn, 'mangr'>('mangr', textColumn),
      title: '고객사 담당',
    },
    {
      ...keyColumn<gridColumn, 'mangrTel'>('mangrTel', textColumn),
      title: '고객사 담당 연락처',
    },
    {
      ...keyColumn<gridColumn, 'salesReprs'>('salesReprs', textColumn),
      title: '영업대표',
    },
    {
      ...keyColumn<gridColumn, 'ctrctGb'>('ctrctGb', textColumn),
      title: '계약구분',
    },
    {
      ...keyColumn<gridColumn, 'actcmtMem'>('actcmtMem', intColumn),
      title: '실투입인원',
    },
    {
      ...keyColumn<gridColumn, 'ctrctPrc'>('ctrctPrc', textColumn),
      title: '계약금액(억원, VAT포함)',
    },
    {
      ...keyColumn<gridColumn, 'ctrctStartDt'>('ctrctStartDt', textColumn),
      title: '계약시작일',
    },
    {
      ...keyColumn<gridColumn, 'ctrctEndDt'>('ctrctEndDt', textColumn),
      title: '계약종료일',
    },
    {
      ...keyColumn<gridColumn, 'ctrctForm'>('ctrctForm', textColumn),
      title: '계약형태',
    },
    {
      ...keyColumn<gridColumn, 'ctrctAttch'>('ctrctAttch', textColumn),
      title: '계약서첨부',
    },
    {
      ...keyColumn<gridColumn, 'finalCorrcDt'>('finalCorrcDt', textColumn),
      title: '최종수정일',
    },
    {
      ...keyColumn<gridColumn, 'finalModfr'>('finalModfr', textColumn),
      title: '최종수정자',
    },
    {
      ...keyColumn<gridColumn, 'finalRegst'>('finalRegst', textColumn),
      title: '최초등록자',
    },
    
  ];

  const ref = React.useRef<DataSheetGridRef>(null);
  // const API_URL = 'https://apierp.koreaats.com';
  const API_URL = 'http://localhost:8001';
  const FUND_ORDER_INFO = '/order/find-order_list';
  function axiosCall(method: 'get' | 'post' | 'put' | 'delete', uri: string, callback: (response: AxiosResponse<any, any>) => void, params: object) {
    axios
      .request({
        url: `${API_URL}${uri}`,
        method,
        params,
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

    axiosCall('get', FUND_ORDER_INFO, (response) => {
      let rowData = response.data.results;
      setRowData(rowData);
    },{
      prjNm:formRef.current?.getFieldsValue().prjNm || undefined,
      ctrctGb:formRef.current?.getFieldsValue().ctrctGb || undefined,
    })
  }

/* ―――――――――――――― Use Effect ―――――――――――――― */
   React.useEffect(() => {}, []);
/* ―――――――――――――――― Return ―――――――――――――――― */

  
  return (
    <ERPDesign data-page="orderInfoManagement" formref={formRef}>
      {/* 조회조건 영역 */}
      <ERPDesign.ConditionArea size={'1fr 1fr 2fr'}>
        <ERPDesign.Condition label="프로젝트명" name="prjNm">
          <Input />
        </ERPDesign.Condition>
        <ERPDesign.Condition label="계약구분" name="ctrctGb">
          <Select options={[
            { value: '', label: '선택' },
            { value: '11.계약완료', label: '계약완료' },
            { value: '12.계약진행', label: '계약진행' },
          ]} />
        </ERPDesign.Condition>
      </ERPDesign.ConditionArea>
      {/* 컨트롤 버튼 영역 */}
      <ERPDesign.ControlArea>
        <ERPDesign.Submit onClick={selectEvent}>조회</ERPDesign.Submit>
        <ERPDesign.Submit>저장</ERPDesign.Submit>
      </ERPDesign.ControlArea>
      {/* 테이블 영역 */}
      <ERPDesign.TableArea className={classNames(noDataState ? "nodata" : "data")}>
        <ERPDesign.Table
          columns={columns}
          data={{
            row: rowData,
            set: setRowData,
          }}
        />
      </ERPDesign.TableArea>
    </ERPDesign>
  );
}
  
  

namespace OrderInfoMangnt {

  interface OdProps extends IChildren {
    title: string;
    render?: boolean;
  }
  export function Lab(props: OdProps) {
    const { title, render = true, children } = props;
    return render ? (
      <div data-container="order.lab">
        <DivisionBox className="title-area" verticalAlign={'center'}>
          <em>{title}</em>
        </DivisionBox>
        <div className="contents-area">{children}</div>
      </div>
    ) : (
      <></>
    );
  }
};

export default OrderInfoMangnt;
