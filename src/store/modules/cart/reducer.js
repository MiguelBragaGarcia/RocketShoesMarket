import produce from 'immer'; // immer é uma biblioteca ponte entre a mutabilidade e imutabilidade dentro de códigos imutaveis

export default function cart(state = [], action) {
    switch (action.type) {
        case '@cart/ADD_SUCCESS':
            return produce(state, draft => {
                const { product } = action;
                draft.push(product);
            });
        case '@cart/REMOVE':
            return produce(state, draft => {
                const productIndex = draft.findIndex(p => p.id === action.id);
                if (productIndex >= 0) {
                    draft.splice(productIndex, 1); // Remove 1 item a partir do index retornado
                }
            });
        case '@cart/UPDATE_AMOUNT_SUCCESS': {
            return produce(state, draft => {
                const productIndex = draft.findIndex(p => p.id === action.id);
                if (productIndex >= 0) {
                    draft[productIndex].amount = Number(action.amount); // Remove 1 item a partir do index retornado
                }
            });
        }
        default:
            return state;
    }
}
