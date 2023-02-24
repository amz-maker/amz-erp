
export namespace StringUtil {

    export function camelToPascal(str: string) : string {
        return str[0].toUpperCase() + str.slice(1);
    }
    
    export function camelToKebab(str: string) : string {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    export function pascalToCamel(str: string) : string {
        return str[0].toLowerCase() + str.slice(1);
    }

    export function pascalToKebab(str: string) : string {
        return str
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
            .toLowerCase();
    }

    export function kebabToCamel(str: string) : string {
        return str.replace(/-([a-z])/g, match => match[1].toUpperCase());
    }

    export function kebabToPascal(str: string) : string {
        return str
            .replace(/-([a-z])/g, match => match[1].toUpperCase())
            .replace(/\b([a-z])/, match => match[0].toUpperCase());
    }
}