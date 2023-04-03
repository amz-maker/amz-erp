
class ObjBuilder<T extends Record<string, unknown> = {}> {

    private constructor(private readonly obj: T) {}

    static create(): ObjBuilder {
        return new ObjBuilder({});
    }

    private set<K extends string, V>(key: K, value: V)
        : ObjBuilder<{ [Key in keyof (T & {[k in K]: V})]: (T & {[k in K]: V})[Key] }> {

        const next = { [key]: value } as { [k in K]: V };
        return new ObjBuilder({ ...this.obj, ...next });
    }

    build(): T {
        return this.obj;
    }

    // setter methods
    setName(name: string) {
        return this.set('name', name);
    }

    setUrl(url: string) {
        return this.set('url', url);
    }
}

(() => {
    const apple = ObjBuilder.create();
    const apple2 = apple.setName('myName');
    const apple3 = apple2.setUrl('http://123');

    const a2 = apple2.build(); // name
    const a3 = apple3.build(); // name, url

    const grape = ObjBuilder.create();
    const grape2 = grape.setUrl('http://123');
    const grape3 = grape2.setName('myName');

    const g2 = grape2.build(); // url
    const g3 = grape3.build(); // name, url

})