export const gridColumns = (ctrl) => {

    const props = 
    [['ADC.USER.LOGIN', 'username'], ['ADC.USER.FIRSTNAME', 'preferences.firstName'], ['ADC.USER.LASTNAME', 'preferences.lastName'],
      ['ADC.USER.EMAIL', 'preferences.email'], ['ADC.USER.PHONE', 'preferences.phone'], ['LABEL_ACTIONS']];

    const columns = [];
    props.forEach((prop) => {
        const column = {};
        column['name'] = ctrl.translate.instant(prop[0]);
        column['prop'] = prop[1];
        column['gridIdx'] = ctrl.grid.apiIdx;
        if (prop[0] === 'LABEL_ACTIONS'){
            column['cellTemplate'] = ctrl.actionTpl;
        } else {
            column['headerTemplate'] = ctrl.hdrTpl;
        }
        column['isVisible'] = true;
        column['checked'] = true;
        columns.push(column);
    });
  return columns;
}