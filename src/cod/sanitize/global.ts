import {
    Product, SubProduct, Extras,
    IntProduct, IntSubProduct, IntExtras
} from '../product'

export default class {
    /**
     * @description maps correct properties to create product instance
     *
     * @param data - data retrieved from the pos when order is placed
     * @param itemSubscriber - a function to manipulate prduct object before handling sub products and extras
     * @returns product instance
     */
    public static clean(data: any[], itemSubscriber: Function) {
        let modifiedData = data.map(item => {
            let obj = <IntProduct>{}
            if (itemSubscriber) {
                item = itemSubscriber(item, item.Product[0], data);
                if (!item){
                    throw 'lms.cod.subscribe returned undefined value';
                }
            }
            obj.Code = item.Product[0].$.code
            obj.Name = item.Product[0].$.name
            obj.Qty = parseInt(item.Product[0].$.qty)
            obj.Price = item.Product[0].$.totalPrice
            obj.currentSelected = item.$.currentSelected == 'true' ? true : false
            obj.rmVoided = item.$.voided
            obj.subProducts = item.Product[0].hasOwnProperty('Product')
                ? this.cleanSubProduct(item.Product[0].Product)
                : []
            obj.extras = item.Product[0].hasOwnProperty('Grill')
                ? this.cleanExtras(item.Product[0].Grill)
                : []

            return new Product(obj)
        })

        return modifiedData
    }

    /**
     * @description maps correct properties to create extra instance
     *
     * @param data - data retrieved from the pos when order is placed
     * @returns extras instance
     */
    private static cleanExtras(data: any[]){
        return data.map(item => {
            let obj = <IntExtras>{}

            obj.Code = item.$.code
            obj.Price = item.$.totalPrice
            obj.ModifiedQty = this.handleExtras(item.$.modifier)
            obj.Name = item.$.name
            obj.Qty = item.$.qty

            return new Extras(obj)
        })
    }

    /**
     * @description maps correct properties to create sub product instance
     *
     * @param { object } data -  data retrieved from the pos when order is placed
     * @returns sub product instance
     */
    private static cleanSubProduct(data){
        return data.map(item => {
            let obj = <IntSubProduct>{}

            obj.Code = item.$.code
            obj.Name = item.$.name
            obj.Qty = item.$.qty
            obj.Price = item.hasOwnProperty('ReferencePrice')
                ? item.ReferencePrice[0]
                : item.$.totalPrice

            if (item.hasOwnProperty('Product')){
                obj.subProducts = this.cleanSubProduct(item.Product)
            }

            // TODO: might not be needed
            if (item.hasOwnProperty('Grill')){
                obj.extras = this.cleanExtras(item.Grill)
            }

            return new SubProduct(obj)
        })
    }

    /**
     * @description maps extra value
     *
     * @param data - data retrieved from the pos when order is placed
     * @returns type
     */
    private static handleExtras(data: number): string{
        let type = 'no'

        if (data == 2){
            type = 'only'
        } else if (data == 1){
            type = 'light'
        } else if (data > 0){
            type = 'extras'
        }

        return type
    }
}
