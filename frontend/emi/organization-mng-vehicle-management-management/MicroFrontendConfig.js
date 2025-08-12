import React from 'react';
import { Redirect } from 'react-router-dom';
import i18n from './i18n'

const auth = ["VEHICLE_READ"];

export const MicroFrontendConfig = {
    settings: {
        layout: {}
    },
    auth,
    routes: [
        { 
            path: '/vehicle-mng/vehicles/:vehicleId/:vehicleHandle?',
            component: React.lazy(() => import('./vehicle/Vehicle'))
        },
        {
            path: '/vehicle-mng/vehicles',
            component: React.lazy(() => import('./vehicles/Vehicles'))
        },
        {
            path: '/vehicle-mng',
            component: () => <Redirect to="/vehicle-mng/vehicles" />
        }
    ],
    navigationConfig: [
        {
            'id': 'organization-mng',
            'type': 'group',
            'icon': 'manage_accounts',
            'priority': 14000,
            children: [{
                'id': 'organization-mng-vehicle-management-management',
                'type': 'item',
                'icon': 'directions_bus',
                'url': '/vehicle-mng',
                'priority': 6000,
                auth
            }]
        }
    ],
    i18nLocales: i18n.locales
};

