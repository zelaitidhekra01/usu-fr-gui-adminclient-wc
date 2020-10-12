export const gridColumns = (ctrl) => {

    const columns = [
      {
        name: ctrl._translate('LABEL_SMARTCOLLECTOR'),
        prop: 'quantumName',
        headerTemplate: ctrl.hdrTpl,
        cellTemplate: ctrl.quantumTpl,
        checked: true
      },
      {
        name: ctrl._translate('LABEL_TARGET_DEVICE'),
        prop: 'serverName',
        headerTemplate: ctrl.hdrTpl,
        cellTemplate: ctrl.serverTpl,
        checked: true
      },
      {
        name: ctrl._translate('LABEL_COLLECTOR'),
        prop: 'collectorName',
        headerTemplate: ctrl.hdrTpl,
        checked: true
      },
      {
        name: ctrl._translate('LABEL_LAST_EXECUTION_DATE'),
        prop: 'modificationDate',
        headerTemplate: ctrl.hdrDateTpl,
        checked: true
      },
      {
        name: ctrl._translate('LABEL_DETAILS'),
        headerTemplate: ctrl.hdrDetailTpl,
        cellTemplate: ctrl.detailMessageTpl,
        checked: true
      },
      {
        name: ctrl._translate('LABEL_TYPE'),
        prop: 'collectedDataType',
        headerTemplate: ctrl.hdrTpl,
        checked: true
      },
      {
        name: ctrl._translate('LABEL_ERROR_CODE'),
        headerTemplate: ctrl.hdrDetailTpl,
        cellTemplate: ctrl.errorMessageTpl,
        checked: true
      }
    ];
  
    return columns;
  };
  