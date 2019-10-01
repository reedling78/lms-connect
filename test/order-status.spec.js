import getOrderStatus from '../src/cod/order-status'

describe('order state with OrderState property', () => {
    it('handles update order status', () => {
        expect(getOrderStatus({OrderState: '1'}, {})).toBe('update')
    })

    it('handles confirm order status', () => {
        expect(getOrderStatus({OrderState: '2'}, {})).toBe('confirm')
    })

    it('handles complete order status', () => {
        expect(getOrderStatus({OrderState: '3'}, {})).toBe('complete')
        expect(getOrderStatus({OrderState: '5'}, {})).toBe('complete')
    })

    it('handles unknown order status', () => {
        expect(getOrderStatus({OrderState: '69'}, {})).toBe('unknown')
    })

    // it('handles errors', () => {
    //     expect(getOrderStatus({OrderState: '69'}, {})).toBe('1')
    // })
})

describe('order state without OrderState property', () => {
    it('handles update order status', () => {
        expect(getOrderStatus({ksStatus: 3}, {status: 1})).toBe('update')
    })

    it('handles confirm order status', () => {
        expect(getOrderStatus({ksStatus: 2}, {status: 2})).toBe('confirm')
        expect(getOrderStatus({ksStatus: 2}, {status: 8})).toBe('confirm')
        expect(getOrderStatus({ksStatus: 3}, {status: 2})).toBe('confirm')
    })

    it('handles complete order status', () => {
        expect(getOrderStatus({ksStatus: 2}, {status: 64})).toBe('complete')
        expect(getOrderStatus({ksStatus: 3}, {status: 64})).toBe('complete')
    })

    // it('handles errors', () => {
    //     expect(getOrderStatus({ksStatus: 1}, {status: 1})).toBe('1')
    // })
})
