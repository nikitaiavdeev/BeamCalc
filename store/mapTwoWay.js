import { mapState } from 'vuex'

export default function mapStatesTwoWay (states, updateCb) {
    const mappedStates = mapState(states)
    const res = {}
    for (const key in mappedStates) {
        res[key] = {
            set (update) {
                updateCb.call(this, { [key]: update })
            },
            get () {
                return mappedStates[key].call(this)
            }
        }
    }
    return res
}