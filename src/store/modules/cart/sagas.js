import { call, select, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '../../../services/api';
import history from '../../../services/history';
import { formatPrice } from '../../../util/format';
import { addToCartSuccess, updateAmountSuccess } from './actions';

function* addToCart({ id }) {
    const productExists = yield select(state =>
        state.cart.find(p => p.id === id)
    );

    const stock = yield call(api.get, `stock/${id}`);
    const stockAmount = stock.data.amount;
    const currentAmount = productExists ? productExists.amount : 0;

    const amount = currentAmount + 1;

    if (amount > stockAmount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
    }
    if (productExists) {
        yield put(updateAmountSuccess(id, amount));
    } else {
        const response = yield call(api.get, `/products/${id}`); // Equivale ao await do js normal
        const data = {
            ...response.data,
            amount: 1,
            priceFormatted: formatPrice(response.data.price),
        };
        yield put(addToCartSuccess(data));
        history.push('/cart');
    }
}

function* updateAmount({ id, amount }) {
    if (amount <= 0) return;

    const stock = yield call(api.get, `stock/${id}`);
    const stockAmount = stock.data.amount;

    if (amount > stockAmount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
    }
    yield put(updateAmountSuccess(id, amount));
}
/* A aplicação saga não está linkada com nada em nossa aplicação principal e por isso precisamos falar que ela escutará
os eventos que forem gerados no redux e fará uma ação.
Ela vai escutar todas as ações e selecionar aquelas que estão dentro do parâmentro e executar a funçao correspondente.
*/
export default all([
    takeLatest('@cart/ADD_REQUEST', addToCart),
    takeLatest('@cart/UPDATE_AMOUNT_REQUEST', updateAmount),
]); //

// function* é umm generate por enquanto vamos pensar nele como se fosse um async
