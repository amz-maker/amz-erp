import { StringUtil } from "../utils/string-util"

(() => {
    const strCamel = 'applePeachGrape';
    const strPasca = 'ApplePeachGrape';
    const strKebab = 'apple-peach-grape';

    console.log(StringUtil.camelToKebab (strCamel));
    console.log(StringUtil.camelToPascal(strCamel));
    console.log(StringUtil.pascalToCamel(strPasca));
    console.log(StringUtil.pascalToKebab(strPasca));
    console.log(StringUtil.kebabToCamel (strKebab));
    console.log(StringUtil.kebabToPascal(strKebab));

    console.log(StringUtil.camelToKebab (strCamel) === strKebab);
    console.log(StringUtil.camelToPascal(strCamel) === strPasca);
    console.log(StringUtil.pascalToCamel(strPasca) === strCamel);
    console.log(StringUtil.pascalToKebab(strPasca) === strKebab);
    console.log(StringUtil.kebabToCamel (strKebab) === strCamel);
    console.log(StringUtil.kebabToPascal(strKebab) === strPasca);
})();