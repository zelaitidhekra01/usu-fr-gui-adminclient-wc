/**
 * config for common components
 */
export const config = {
    rootContext: 'ihm/',
    urlName: 'admin',
    showCompany: true,
    sidebarOpened: true,
    sidebarLabel: 'HOME.ADMIN.LABEL',
    // IMPORTANT: version need to stay between single quotes, as it is parsed in script.build .js
    version: '5.13.0-SNAPSHOT',
    versionName: 'SmartCollect',
    /**
     * in days
     */
    translateTimeout: 1,
    /**
     * used in http interceptor services
     * list which POST/PUT will be confirmed with a toast
     *
     * NOTICE: all error responces are notified with a toast, no need to decare them in this list
     */
    wsWithToast: [
      '/ws/admin/access-control/companies',
      '/preferences'
    ],
    toastHideTimeout: 3000,
  };
  