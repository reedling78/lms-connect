export function getEnvLane() {
    const sbEnvs = window.top['Switchboard']

    if(sbEnvs) {
        if(sbEnvs['environmentData'] !== undefined) {
            const screenSetName = sbEnvs['environmentData']['screen-set-name']

            // It will return the lane using the screen set name
            if(screenSetName && screenSetName.match(/\d+/g)) {
                return `cod-lane-${screenSetName.match(/\d+/g)[0]}`
            }
        }
    }

    return ''
}
