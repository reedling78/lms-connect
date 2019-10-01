/**
 * @description retrieves current lane
 *
 * @param data - data retrieved from the pos when order is placed
 * @returns lane - current lane
 */
export default function getLane(data: { data }): string {
    let hasProps = checkProps(data)

    if (hasProps) {
        
        let labels = data.data.attributes.labels,
        
        length = labels.length,
        
        lane = ''

        for (let ind = 0; ind < length; ind++) {

            const label = labels[ind]

            // it will test if the POS message labels contains 
            // "cod-lane-xxxx" where xxxx should be a number
            if((/^cod-lane-[0-9]*$/gm).test(label)) {
                lane = label
                break
            }

        }

        return lane
    }

    return 'error'
}

// TODO: comment
export function checkProps(data: object, propList: Array<string> = ['data', 'attributes', 'labels']): any {
    if (Array.isArray(propList)) {
        if (!propList.length) {
            return true
        } else {
            return data.hasOwnProperty(propList[0])
                ? checkProps(data[propList[0]], propList.slice(1))
                : false
        }
    } else {
        return 'not array'
    }
}
