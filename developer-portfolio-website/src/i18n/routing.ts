import { defineRouting } from 'next-intl/routing';
 
export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['sk', 'en'],
    
    // Used when no locale matches
    defaultLocale: 'sk'
});