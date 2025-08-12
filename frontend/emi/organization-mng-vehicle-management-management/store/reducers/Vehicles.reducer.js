import * as Actions from '../actions';

const initialState = {
    data: [],
    totalDataCount: 0,
    errors:{},
    page: 0,
    rowsPerPage: 10,
    order: {
        direction: 'asc',
        id: null
    },
    filters: {
        keyword: '',
        active: true,
        organizationId: undefined,
        company: undefined
    }
};

const vehiclesReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.SET_VEHICLES:
            {
                const { listing, queryTotalResultCount } = action.payload;
                return {
                    ...state,
                    data: listing,
                    errors:{},
                    totalDataCount: queryTotalResultCount != null ? queryTotalResultCount : (listing || []).length > 0 ? state.totalDataCount : 0,
                };
            }
        case Actions.SET_VEHICLES_PAGE:
            {
                return {
                    ...state,
                    page: action.page
                };
            }
        case Actions.SET_VEHICLES_ROWS_PER_PAGE:
            {
                return {
                    ...state,
                    rowsPerPage: action.rowsPerPage,
                    page: 0
                };
            }
        case Actions.SET_VEHICLES_GET_ERROR:
            {
                return {
                    ...state,
                    errors: action.payload,
                    data: [],
                    totalDataCount: 0,
                };
            }
        case Actions.SET_VEHICLES_ORDER:
            {
                return {
                    ...state,
                    order: action.order
                };
            }
        case Actions.SET_VEHICLES_FILTERS_ORGANIZATION_ID:
            {
                return {
                    ...state,
                    filters: { ...state.filters, organizationId: action.organizationId } 
                };
            }
        case Actions.SET_VEHICLES_FILTERS_KEYWORD:
            {
                return {
                    ...state,
                    filters: { ...state.filters, keyword: action.keyword },
                    page: 0
                };
            }
        case Actions.SET_VEHICLES_FILTERS_ACTIVE:
            {
                return {
                    ...state,
                    filters: { ...state.filters, active: action.active },
                    page: 0
                };
            }
        case Actions.SET_VEHICLE_FILTERS_COMPANY:
            {
                return {
                    ...state,
                    filters: { ...state.filters, company: action.company },
                    page: 0
                };
            }
        default:
            {
                return state;
            }
    }
};

export default vehiclesReducer;
