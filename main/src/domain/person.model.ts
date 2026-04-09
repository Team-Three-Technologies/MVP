export class Person{
    constructor(
        private name:string,
        private surname:string,
        private cf:string)
    {}
    public getName():string{
        return this.name;
    }
    public getSurname():string{
        return this.surname;
    }
    public getCF():string{
        return this.cf;
    }
    public setName(_name: string):void{
        this.name = _name;
    }
    public setSurname(_surname:string):void{
        this.surname = _surname;
    }
    public setCF(_cf:string):void{
        this.cf = _cf;
    }
}
