// inherit constructor
Product.prototype = Object.create(Base.prototype)
SubProduct.prototype = Object.create(Base.prototype)
Extras.prototype = Object.create(SubProduct.prototype)

// point to the correct constructor not the inherited one
Product.prototype.constructor = Product
SubProduct.prototype.constructor = SubProduct
Extras.prototype.constructor = Extras

/**
 * @description function to clean empty/unused properties and functions
 *
 * @returns non empty properties and functions
 */
function activeProps(){
    let activeProp = {}

    for (let prop in this){
        // removes undefined and function properties
        if (this[prop] !== undefined && typeof this[prop] !== 'function'){
            activeProp[prop] = this[prop]
        }
    }

    return activeProp
}

/**
 * @description base constructor function that contains the common properties
 *
 * @param { object } obj - product common properties
 * @returns new stance and cleans empty properties
 */
function Base(obj){
    if (!(this instanceof Base)){
        return new Base(obj)
    }

    this.code = obj.Code
    this.name = obj.Name
    this.price = obj.Price
    this.quantity = obj.Qty

    return activeProps.call(this)
}

/**
 * @description creates main product instances, inherits from Base
 *
 * @export { constructor function }
 * @param { object } obj - object of product properties
 * @returns product instance
 */
export function Product(obj){
    // if new keyword isn't used, then return with new keyword
    // eg. let product1 = Product(obj) will return new Product(obj)
    if (!(this instanceof Product)){
        return new Product(obj)
    }

    Base.call(this, obj)
    this.selected = obj.currentSelected
    this.subProduct = obj.subProducts
    this.extras = obj.extras
    this.rmVoided = obj.rmVoided

    return activeProps.call(this)
}

/**
 * @description creates sub product instances, inherits from Base
 *
 * @export { constructor function }
 * @param { object } obj - object of sub product properties
 * @returns sub product instance
 */
export function SubProduct(obj){
    if (!(this instanceof SubProduct)){
        return new SubProduct(obj)
    }

    Base.call(this, obj)
    this.level = obj.Level
    this.type = obj.Type
    this.subProduct = obj.subProducts

    // TODO: might not be needed
    this.extra = obj.extras

    return activeProps.call(this)
}

/**
 * @description creates extras instances, inherits from SubProduct
 *
 * @export { constructor function }
 * @param { object } obj - object of extras properties
 * @returns extras instance
 */
export function Extras(obj){
    if (!(this instanceof Extras)){
        return new Extras(obj)
    }

    delete obj.extras

    SubProduct.call(this, obj)
    this.modifiedQty = obj.ModifiedQty

    return activeProps.call(this)
}

export default {
    Product,
    SubProduct,
    Extras,
}
