import { IconProps } from 'module/AmzPack/component/Icon';

export interface IMenuInfo {
  name: string;
  icon: {
    name: string;
    type: IconProps['type'];
  };
  uri: string;
}
