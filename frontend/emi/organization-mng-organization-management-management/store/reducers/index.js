import {combineReducers} from 'redux';
import organizations from './Organizations.reducer';

const reducer = combineReducers({
    organizations,
});

export default reducer;
