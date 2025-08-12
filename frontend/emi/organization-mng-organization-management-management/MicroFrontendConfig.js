import React from 'react';
import { Redirect } from 'react-router-dom';
import i18n from './i18n'

const auth = ["ORGANIZATION_READ"];

export const MicroFrontendConfig = {
    settings: {
        layout: {}
    },
    auth,
    routes: [
        { 
            path: '/organization-mng/organizations/:organizationId/:organizationHandle?',
            component: React.lazy(() => import('./organization/Organization'))
        },
        {
            path: '/organization-mng/organizations',
            component: React.lazy(() => import('./organizations/Organizations'))
        },
        {
            path: '/organization-mng',
            component: () => <Redirect to="/organization-mng/organizations" />
        }
    ],
    navigationConfig: [
        {
            'id': 'organization-mng',
            'type': 'group',
            'icon': 'manage_accounts',
            'priority': 14000,
            children: [{
                'id': 'organization-mng-organization-management-management',
                'type': 'item',
                'icon': 'monetization_on',
                'url': '/organization-mng',
                'priority': 10000,
                auth
            }]
        }
    ],
    i18nLocales: i18n.locales
};

