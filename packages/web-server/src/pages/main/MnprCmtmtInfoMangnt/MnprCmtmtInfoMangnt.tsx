/*------------------------------------------------------------------------------------------------------------------------------------------
 * MnprCmtmtInfoMangnt.tsx
 * WRITER : 박건률
 * DATE : 2023-04-05
 * DISCRIPTION : 
 * TYPE : Page
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import React from 'react';
import ERPDesign from 'container/ERPDesign';
import { DivisionBox } from 'module/AmzPack/component';
import { IChildren, IDataPage } from 'module/AmzPack/interface';
import { DatePicker, DatePickerProps, FormInstance, Input } from 'antd';
import axios, { AxiosResponse } from 'axios';
import {
  checkboxColumn,
  Column,
  createTextColumn,
  DataSheetGridRef,
  dateColumn,
  floatColumn,
  intColumn,
  isoDateColumn,
  keyColumn,
  percentColumn,
  textColumn,
} from 'react-datasheet-grid';

import { apiConfig } from 'config/api-config'
import Util from 'common/util';
import { useRecoilState } from 'recoil';
import { TableStateSelector } from 'container/ERPDesign/store/selector';

interface MnprCmtmtInfoMangntProps {}
function MnprCmtmtInfoMangnt(props: MnprCmtmtInfoMangntProps) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  /* Props ――――― */
  const {} = props;
  /* State ――――― */
  /* Const ――――― */
  /* API ――――――― */

  /* ―――――――――――――――― Method ―――――――――――――――― */

  /* ―――――――――――――― Use Effect ―――――――――――――― */

  /* ―――――――――――――――― Return ―――――――――――――――― */
  return (
    <div data-page="mnprCmtmtInfoMangnt">
      <MnprCmtmtInfoGrid />
    </div>
  );
}

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
  ctrctStartDt  : string | null;
  ctrctEndDt    : string | null;
  totalPrchsPrc : string | null;
  totalMnm      : string | null;
};

interface MnprCmtmtInfoGrid {}
function MnprCmtmtInfoGrid(props: MnprCmtmtInfoGrid) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  const {} = props;
  const API_URL = apiConfig.url;
  const FUND_MNPR_CMTMT_INFO = '/mnpr/find-mnpr-cmtmt-info';
  const TABLE_NAME = "mnprCmtmtInfo"

  const formRef = React.useRef<FormInstance>(null);

  const [rowData, setRowData] = React.useState<Row[]>([]);
  const [table,setTable] = useRecoilState(TableStateSelector.tableSelector(TABLE_NAME));
  const [updateRows,setUpdateRows] = useRecoilState(TableStateSelector.updateRowsSelector(TABLE_NAME));

  const columns: Column<Row>[] = [
    ERPDesign.defineColumn('checkbox', '체크박스', checkboxColumn, { 
      grow: 1,
      minWidth: 50, // 최소 width
      maxWidth: 100, // 최대 width
    }),
    ERPDesign.defineColumn('ctrctNo'      , '계약번호'    , textColumn, { pk: true }),
    ERPDesign.defineColumn('bsntypNm'     , '업종명'      , textColumn, { }),
    ERPDesign.defineColumn('orderCompn'   , '발주사'      , textColumn, { }),
    ERPDesign.defineColumn('ctrctCompn'   , '계약사'      , textColumn, { }),
    ERPDesign.defineColumn('prjctNm'      , '프로젝트명'  , textColumn, { }),
    ERPDesign.defineColumn('prjctContn'   , '프로젝트내용', textColumn, { }),
    ERPDesign.defineColumn('totalCtrctPrc', '총계약금'    , textColumn, { }),
    ERPDesign.defineColumn('ctrctTypeCd'  , '계약유형코드', textColumn, { }),
    ERPDesign.defineColumn('chngYn'       , '변경여부'    , textColumn, { }),
    ERPDesign.defineColumn('ctrctStartDt' , '계약시작일자', textColumn, { }),
    ERPDesign.defineColumn('ctrctEndDt'   , '계약종료일자', textColumn, { }),
    ERPDesign.defineColumn('totalPrchsPrc', '총매입금액'  , textColumn, { }),
    ERPDesign.defineColumn('totalMnm'     , '총계약공수'  , textColumn, { }),
  ];

  /* ―――――――――――――――― Method ―――――――――――――――― */
  
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

    axiosCall('get', FUND_MNPR_CMTMT_INFO, (response) => {
      let rowData = response.data.results;
      setTable(rowData);
    },{
      orderCompn:formRef.current?.getFieldsValue().orderCompn || undefined,
      ctrctCompn:formRef.current?.getFieldsValue().ctrctCompn || undefined,
      ctrctStartDt:dateSet? Util.format.date(dateSet[0].toDate(),'YMD') : undefined,
      ctrctEndDt:dateSet? Util.format.date(dateSet[1].toDate(),'YMD') : undefined
    })
  }

  /* ―――――――――――――― Use Effect ―――――――――――――― */
  React.useEffect(() => {
    // Row Data 설정
    // setRowData([
    //   { checkbox: true, text: 'text 1', int: 1, float: 1.0, date: new Date(), isoDate: '2022-01-01', percent: 0.1, custom: '커스텀(이메일)' },
    //   { checkbox: false, text: 'text 2', int: 2, float: 2.0, date: new Date(), isoDate: '2022-01-01', percent: 0.2, custom: null },
    // ]);

    // console.log("Test Log Form Data");
    
      axiosCall('get', FUND_MNPR_CMTMT_INFO, (response) => {
        let rowData = response.data.results;
        setTable(rowData);
      },{})
  }, []);

  /* ―――――――――――――――― Return ―――――――――――――――― */
  return (
    <ERPDesign data-page="mnprCmtmtInfoMangnt" formref={formRef}>
      {/* 조회조건 영역 */}
      <ERPDesign.ConditionArea size={3}>
        <ERPDesign.Condition label="계약기간" name="date">
          <DatePicker.RangePicker />
        </ERPDesign.Condition>
        <ERPDesign.Condition label="발주사" name="orderCompn">
          <Input />
        </ERPDesign.Condition>
        <ERPDesign.Condition label="계약사" name="ctrctCompn">
          <Input />
        </ERPDesign.Condition>
        <ERPDesign.Condition label="프로젝트명" name="c"></ERPDesign.Condition>
      </ERPDesign.ConditionArea>
      {/* 컨트롤 버튼 영역 */}
      <ERPDesign.ControlArea>
        <ERPDesign.Submit onClick={selectEvent}>조회</ERPDesign.Submit>
        {/* <ERPDesign.Submit>저장</ERPDesign.Submit> */}
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



namespace MnprCmtmtInfoMangnt {
  export function empty(){}
};

export default MnprCmtmtInfoMangnt;
