import getLane, { checkProps } from '../src/cod/get-lane'

class Data {
    constructor(lane) {
        this.lane = lane
    }

    getData() {
        return {
            data: {
                attributes: {
                    labels: this.lane
                }
            }
        }
    }
}

describe('retrieves lane information', () => {
    it('able to retrieve lane 1', () => {
        expect(getLane(new Data('1').getData())).toBe('cod-lane-1')
    })

    it('able to retrieve lane 2', () => {
        expect(getLane(new Data('2').getData())).toBe('cod-lane-2')
    })

    it('able to handle errors', () => {
        expect(getLane({data: {}})).toBe('error')
    })
})

describe('checks lane properties', () => {
    it('handles valid props', () => {
        expect(checkProps(new Data('1').getData())).toBeTruthy()
    })

    it('handles invalid props', () => {
        expect(checkProps({data: {}}, ['data', 'attributes', 'labels'])).toBeFalsy()
    })
})
