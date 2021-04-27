export default class BaseToken {
    public type: String
    public value: any

    public constructor(value: any, type: String) {
        this.value = value
        this.type = type
    }

    public getType() {
        return this.type
    }

    public getValue() {
        return this.value
    }

    public get() {
        return this as BaseToken
    }

    public calculate() {
        return this as BaseToken
    }

    public call(_args: Array<BaseToken>) {
        return this as BaseToken
    }

    public compare(other: BaseToken): Number {
        if (other.type < this.type) {
            return 1
        }

        if (other.type > this.type) {
            return -1
        }

        if (other.value < this.value) {
            return 1
        }

        if (other.value > this.value) {
            return -1
        }

        return 0
    }

    public request(type: String): any {
        switch (type) {
            case "string":
                return this.value.toString()

            default:
                throw new Error(`Resquested a ${type} for a ${this.type}`)
        }
    }

    public update() { }
}