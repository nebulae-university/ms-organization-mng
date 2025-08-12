import * as Actions from '../actions';

const initialState = {
    data: [],
    totalDataCount: 0,
    page: 0,
    rowsPerPage: 10,
    order: {
        direction: 'asc',
        id: null
    },
    filters: {
        name: '',
        active: true,
        organizationId: undefined
    }
};

const companiesReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.SET_COMPANYS:
            {
                const { listing, queryTotalResultCount } = action.payload;
                return {
                    ...state,
                    data: listing,
                    totalDataCount: queryTotalResultCount ? queryTotalResultCount : (listing || []).length > 0 ? state.totalDataCount : 0,
                };
            }
        case Actions.SET_COMPANYS_PAGE:
            {
                return {
                    ...state,
                    page: action.page
                };
            }
        case Actions.SET_COMPANYS_ROWS_PER_PAGE:
            {
                return {
                    ...state,
                    rowsPerPage: action.rowsPerPage,
                    page: 0
                };
            }
        case Actions.SET_COMPANYS_ORDER:
            {
                return {
                    ...state,
                    order: action.order
                };
            }
        case Actions.SET_COMPANYS_FILTERS_ORGANIZATION_ID:
            {
                return {
                    ...state,
                    filters: { ...state.filters, organizationId: action.organizationId }
                };
            }
        case Actions.SET_COMPANYS_FILTERS_NAME:
            {
                return {
                    ...state,
                    filters: { ...state.filters, name: action.name },
                    page: 0
                };
            }
        case Actions.SET_COMPANYS_FILTERS_ACTIVE:
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

export default companiesReducer;
