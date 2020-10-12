export const gridColumns = (ctrl) => {

    const columns = [
      {
        resizeable: true,
        sortable: false,
        draggable: false,
        canAutoResize: false,
        width: 30,
        cellTemplate: ctrl.idxTpl,
        checked: true
      },
      {
        name: ctrl._translate('LABEL_NAME'),
        prop: 'name',
        gridIdx: ctrl.grid.apiIdx,
        headerTemplate: ctrl.hdrTpl,
        cellTemplate: ctrl.cellTpl,
        checked: true
      },
      {
        name: ctrl._translate('LABEL_NUMBER_DEPLOYED'),
        prop: 'quantumCount',
        gridIdx: ctrl.grid.apiIdx,
        headerTemplate: ctrl.hdrTpl,
        cellTemplate: ctrl.cellTpl,
        checked: true
      }
    ];
  
    return columns;
  };
  