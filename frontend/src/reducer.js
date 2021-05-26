export const initialState = {
    len: 0,
    Items: {}
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            return {
                len: state.len + action.len,
                Items: { ...state.Items, ...action.item }
            }

        case 'REMOVE_FROM_CART':
            const key = Object.keys(action.item)
            console.log('key', key)
            if (action.item[key[0]].quantity === 0) {
                let item = { ...state.Items };
                delete item[key[0]];
                return {
                    len: state.len - action.len,
                    Items: item
                }
            }
            return {
                len: state.len - action.len,
                Items: { ...state.Items, ...action.item }
            }

        case 'UPDATE_CART':
            return {
                len: action.len,
                Items: { ...action.item }
            }

        case 'EMPTY':
            return {
                len: 0,
                Items: {}
            }

        default:
            console.log('invalid type');
    }
}

export default reducer;