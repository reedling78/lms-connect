
export default function getCustomInfo(data: {Header, Order}): any[] {
    
    // is header contains prop CustomInfo and CustomInfo has more than one child
    const isTherecustomInfo = data.Header[0].hasOwnProperty('CustomInfo') &&  data.Header[0]['CustomInfo'].length

    // return the list of c
    return isTherecustomInfo ? mapCustomInfo(data.Header[0]['CustomInfo'][0]['Info']) : undefined
    
}

function mapCustomInfo(info) : any[] {

    return info.reduce( (customInfos, customInfo) => {
        
        return {
            ...customInfos, 
            [customInfo.$['name']]: customInfo.$['value'] 
        }

    }, {});

}
