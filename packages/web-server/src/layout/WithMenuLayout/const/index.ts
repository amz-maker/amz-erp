import { IMenuInfo } from '../define';

export const menuInfo: IMenuInfo[] = [
  {
    name: '매출계약 정보관리',
    icon: {
      name: 'file-signature',
      type: 'solid',
    },
    uri: '/sales',
  },
  {
    name: '발주 정보 관리',
    icon: {
      name: 'pen-to-square',
      type: 'solid',
    },
    uri: '/order',
  },
  {
    name: '계약 정보 관리',
    icon: {
      name: 'pen',
      type: 'solid',
    },
    uri: '/ctrct',
  },
  {
    name: '매출 발행/입금내역 관리',
    icon: {
      name: 'wallet',
      type: 'solid',
    },
    uri: '/',
  },
  {
    name: '인력투입 실적관리',
    icon: {
      name: 'person',
      type: 'solid',
    },
    uri: '/mnpr',
  },
  {
    name: '임직원 급여관리',
    icon: {
      name: 'sack-dollar',
      type: 'solid',
    },
    uri: '/',
  },
  {
    name: '계약직 급여관리',
    icon: {
      name: 'sack-dollar',
      type: 'solid',
    },
    uri: '/',
  },
  {
    name: '기타 매입관리',
    icon: {
      name: 'cart-shopping',
      type: 'solid',
    },
    uri: '/',
  },
  {
    name: '월간 매입내역조회',
    icon: {
      name: 'cart-shopping',
      type: 'solid',
    },
    uri: '/',
  },
  {
    name: '매입-매출현황',
    icon: {
      name: 'comments-dollar',
      type: 'solid',
    },
    uri: '/',
  },
  {
    name: '통장 잔고관리',
    icon: {
      name: 'piggy-bank',
      type: 'solid',
    },
    uri: '/',
  },
];
