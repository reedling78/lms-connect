import * as _ from "lodash";

import {
    Product, SubProduct, Extras,
    IntProduct, IntSubProduct, IntExtras
} from '../product'

export default class {
    private static _prevProductsList = []

    /**
     * @description maps correct properties to create product instance
     *
     * @param data - data retrieved from the pos when order is placed
     * @returns product instance
     */
    public static clean(data: any[]) {
        let modifiedData = data.map(item => {

            let obj = <IntProduct>{}

            obj.Name = item.$.Name
            obj.Price = item.$.Price
            obj.Code = item.$.Cod
            obj.Qty = parseInt(String(Math.abs(item.$.QtyVoided - item.$.Qty)))
            obj.subProducts = []
            obj.extras = []
            obj.currentSelected = false
            obj.transformed = false
            obj.qtyPromo = item.$.hasOwnProperty('QtyPromo') ? parseInt(item.$.QtyPromo) : 0
            obj.rmVoided = item.$.QtyVoided !== '0' && parseInt(item.$.QtyVoided) - parseInt(item.$.Qty) === 0 ? true : false

            if (item.hasOwnProperty('Grill')){
                obj.subProducts = this.cleanSubProduct(item.Grill.filter(grill => !grill.$.hasOwnProperty('ModifiedQty')))
                obj.extras = this.cleanSubExtras(item.Grill.filter(grill => grill.$.hasOwnProperty('ModifiedQty')))

                obj.subProducts = obj.subProducts.length
                    ? this.sortSubProducts(obj.subProducts)
                    : obj.subProducts
            }

            return new Product(obj)
        })

        return this.findSelected(modifiedData)
    }

    /**
     * @description maps correct properties to create extra instance
     *
     * @param data - data retrieved from the pos when order is placed
     * @returns extra instance
     */
    private static cleanSubExtras(data: any) {
        return data.map(grill => {
            let obj = <IntExtras>{}

            obj.Code = grill.$.Cod
            obj.Name = grill.$.Name
            obj.Price = grill.$.TotalPrice
            obj.Qty = grill.$.Qty
            obj.Level = grill.$.Level
            obj.Type = grill.$.Type
            obj.subProducts = []
            obj.extras = []
            obj.ModifiedQty = grill.$.ModifiedQty

            return new Extras(obj)
        })
    }

    /**
     * @description maps correct properties to create sub product
     *
     * @param data - data retrieved from the pos when order is placed
     * @returns sub product instance
     */
    private static cleanSubProduct(data: any) {
        return data.map(grill => {
            let obj = <IntSubProduct>{}

            obj.Code = grill.$.Cod
            obj.Name = grill.$.Name
            obj.Price = grill.$.TotalPrice
            obj.Qty = grill.$.Qty
            obj.Level = grill.$.Level
            obj.Type = grill.$.Type
            obj.subProducts = []
            obj.extras = []

            return new SubProduct(obj)
        })
    }

    /**
     * @description this function sorts the sub product as we receive data information in
     * unorder state
     *
     * @param subProducts - data retrieved from the pos when order is placed
     * @returns newSubProducts - sorted sub products
     */
    private static sortSubProducts(subProducts: any[]): any[] {
        let newSubProducts = [],
            length = subProducts.length

        for (let ind = 0; ind < length; ind++){
            subProducts[ind].Type == 'Recipe'
                ? newSubProducts.unshift(subProducts[ind])
                : newSubProducts.push(subProducts[ind])
        }

        return newSubProducts
    }

    /**
     * @description determines current product based on previous history
     *
     * @param products - product instance
     * @returns products - with current selected property
     */
    private static findSelected(products: any[]): any[] {

        const prodLength = products.length
        
        // remove products without valid product code from the previous list
        // Ecran trigger are triggered as products, so we remove it here to avoid
        // comparing the wrong products length in the basket
        const prevProdLength = this._prevProductsList.filter(p => p.code !== '').length
        
        if (!prevProdLength || prodLength === 1 || prodLength > prevProdLength) {
            // if the previous list and the current list has only one item, 
            // it means that the product was transformed
            if(prevProdLength === 1 && prodLength === 1) {
                products[prodLength - 1].transformed = true
            }

            products[prodLength - 1].selected = true
        }

        else {
            // get list of product codes
            const prevProductCodes = this._prevProductsList.map(product => product.code)

            // find transformed products, if any
            const transformedProducts = products.filter(p => prevProductCodes.indexOf(p.code) === -1)

            // if any modified product, get the first
            let selectedTransformed = transformedProducts && transformedProducts.length ? transformedProducts[0] : undefined
            
            // if any modified product
            if(selectedTransformed) {

                // this is the current selected
                selectedTransformed.transformed = true
                selectedTransformed.selected = true

            } else {

                const currentProductCodes = products.map(product => product.code)

                // remove modified products from the previous list (if the file was modified we don't need to compare)
                this._prevProductsList = this._prevProductsList.filter(prev => currentProductCodes.indexOf(prev.code) > -1)

                // if there is no modified products, we check the other props to see what changed
                // sort both list to compare with correct index in the following for loop
                this._prevProductsList = this._prevProductsList.sort((a, b) => a.code - b.code)
                products = products.sort((a, b) => a.code - b.code)

                for (let ind = 0; ind < prodLength; ind++) {
                    
                    // check if the product changed using the previous state,
                    // but exclude the selected prop when comparing
                    const isProductEqual = _.isEqual(
                        _.omit(products[ind], ['selected']),
                        _.omit(this._prevProductsList[ind], ['selected'])
                    )
                        
                    // if product not equal
                    if(!isProductEqual) {
                        // this is the selected product
                        products[ind].selected = true
                        break
                    }
                }
            }
        }

        // clone deep will create new references, 
        // so whoever is connected can handle the results
        // without changing the history of LMS connect
        this._prevProductsList = _.cloneDeep(products)
        return _.cloneDeep(products)
    }

    /**
     * Clean the order history on POS complete status
     */
    public static cleanOrderHistory() {
        this._prevProductsList = []
    }
}
