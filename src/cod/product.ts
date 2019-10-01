/**
 * @description base constructor function that contains the common properties
 *
 * @param obj - product common properties
 * @returns new stance and cleans empty properties
 */
class Base {
    protected code: string
    protected name: string
    protected price: string
    protected quantity: number

    constructor(obj: IntBase) {
        this.code = obj.Code
        this.name = obj.Name
        this.price = obj.Price
        this.quantity = obj.Qty

        return this//.activeProps.call(this)
    }

    /**
     * @description function to clean empty/unused properties and functions
     *
     * @returns non empty properties and functions
     */
    protected activeProps(): {} {
        let activeProp: any = {}

        for (let prop in this) {
            // removes undefined and function properties
            if (this[prop] !== undefined && typeof this[prop] !== 'function'){
                activeProp[prop] = this[prop]
            }
        }

        return activeProp
    }
}

/**
 * @description creates main product instances, inherits from Base
 *
 * @export { constructor function }
 * @param obj - object of product properties
 * @returns product instance
 */
export class Product extends Base {
    protected selected: boolean
    protected subProduct: Array <any>
    protected extras: Array <any>
    protected rmVoided: boolean
    protected transformed: boolean
    protected qtdPromo: number

    constructor(obj: IntProduct) {
        super(obj)
        this.selected = obj.currentSelected
        this.subProduct = obj.subProducts
        this.extras = obj.extras
        this.rmVoided = obj.rmVoided
        this.transformed = obj.transformed
        this.qtdPromo = obj.qtyPromo

        return super.activeProps.call(this)
    }
}

/**
 * @description creates sub product instances, inherits from Base
 *
 * @export { constructor function }
 * @param obj - object of sub product properties
 * @returns sub product instance
 */
export class SubProduct extends Base {
    protected level: string
    protected type: string
    protected subProduct: Array <any>
    protected extra: Array <any>

    constructor(obj: IntSubProduct) {
        super(obj)
        this.level = obj.Level
        this.type = obj.Type
        this.subProduct = obj.subProducts

        // TODO: might not be needed
        this.extra = obj.extras

        return super.activeProps.call(this)
    }
}

/**
 * @description creates extras instances, inherits from SubProduct
 *
 * @export { constructor function }
 * @param obj - object of extras properties
 * @returns extras instance
 */
export class Extras extends SubProduct {
    protected modifiedQty: string

    constructor(obj: IntExtras) {
        super(obj)
        delete obj.extras

        this.modifiedQty = obj.ModifiedQty

        return super.activeProps.call(this)
    }
}

interface IntBase {
    Code: string,
    Name: string,
    Price: string,
    Qty: number,
}
export interface IntProduct extends IntBase {
    currentSelected: boolean
    subProducts: any[]
    extras: any[]
    rmVoided: boolean,
    transformed: boolean,
    qtyPromo: number,
}

export interface IntSubProduct extends IntBase {
    Level: string
    Type: string
    subProducts: any[]
    extras: any[]
}

export interface IntExtras extends IntSubProduct {
    ModifiedQty: string
}
