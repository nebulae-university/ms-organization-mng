import React from 'react';
import { Redirect } from 'react-router-dom';
import i18n from './i18n'

const auth = ["USER_READ"];

export const MicroFrontendConfig = {
    settings: {
        layout: {}
    },
    auth,
    routes: [
        { 
            path: '/user-mng/users/:userId/:userHandle?',
            component: React.lazy(() => import('./user/User'))
        },
        {
            path: '/user-mng/users',
            component: React.lazy(() => import('./users/Users'))
        },
        {
            path: '/user-mng',
            component: () => <Redirect to="/user-mng/users" />
        }
    ],
    navigationConfig: [
        {
            'id': 'organization-mng',
            'type': 'group',
            'icon': 'manage_accounts',
            'priority': 14000,
            children: [{
                'id': 'organization-mng-user-management-management',
                'type': 'item',
                'icon': 'person',
                'url': '/user-mng',
                'priority': 8000,
                auth
            }]
        }
    ],
    i18nLocales: i18n.locales
};

