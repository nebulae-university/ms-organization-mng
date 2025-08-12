import * as Actions from '../actions';

const initialState = {
    data: [],
    totalDataCount: 0,
    filters: {
        active: true,
    },
    searchText: '',
    page: 0,
    rowsPerPage: 10,
    order: {
        direction: 'asc',
        id: null
    }
};

const organizationsReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.SET_ORGANIZATIONS:
            {
                const { listing, queryTotalResultCount } = action.payload;
                return {
                    ...state,
                    data: listing,
                    totalDataCount: queryTotalResultCount ? queryTotalResultCount : (listing || []).length > 0 ? state.totalDataCount : 0,
                };
            }
        case Actions.SET_ORGANIZATIONS_SEARCH_TEXT:
            {
                return {
                    ...state,
                    searchText: action.searchText
                };
            }
        case Actions.SET_ORGANIZATIONS_PAGE:
            {
                return {
                    ...state,
                    page: action.page
                };
            }
        case Actions.SET_ORGANIZATIONS_ROWS_PER_PAGE:
            {
                return {
                    ...state,
                    rowsPerPage: action.rowsPerPage,
                    page: 0
                };
            }
        case Actions.SET_ORGANIZATIONS_ORDER:
            {
                return {
                    ...state,
                    order: action.order
                };
            }
        case Actions.SET_ORGANIZATIONS_FILTERS_ACTIVE:
            {
                return {
                    ...state,
                    filters: { ...state.filters, active: action.active },
                    page: 0
                };
            }
        default:
            {
                return state;
            }
    }
};

export default organizationsReducer;
