import 'i18next';
import common from '../locales/vi/common.json';
import auth from '../locales/vi/auth.json';

declare module 'i18next' {
    interface I18TypeOption {
        defaultNS: 'common';
        resources: {
            common: typeof common;
            auth: typeof auth;
        };
    }
}