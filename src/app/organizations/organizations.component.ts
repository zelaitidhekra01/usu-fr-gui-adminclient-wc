import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ConfirmationDialogComponent } from 'usu-fr-gui-commons/components';
import { DialogData } from 'usu-fr-gui-commons/model';
import { EasyCompanyApp, EasyGrid } from 'usu-fr-gui-commons/tools';
import { Organization } from '../models/organization.model';
import { OrganizationType } from '../models/organization.type.model';
import { OrganizationTypesService } from '../services/organization-types.service';
import { OrganizationsService } from '../services/organizations.service';
import { AddOrganizationDialogComponent } from './add-organization-dialog/add-organization-dialog.component';
import { AddOrganizationTypeDialogComponent } from './add-organization-type-dialog/add-organization-type-dialog.component';
import { OrganizationsComponentService } from './organizations.component.service';




@Component({
    selector: 'app-organizations',
    templateUrl: './organizations.component.html',
    styleUrls: ['./organizations.component.scss']
})

export class OrganizationsComponent implements OnInit, AfterViewInit{
   
    organisationsRows: Organization[] = [];
    organisationChildRows: Map<number, Organization[]> = new Map();
    organisationTypesRows: OrganizationType[] = [];
    companyId: any = this.easyCompanyApp.getCompanyId();
    defaultParams = {'companyId': this.companyId};
    displayed = false;
    reorderable = true;
    swapColumns = false;
    _temp = [];
    _secondeTemp = [];
    filteredOrgs = [];

    @ViewChild('organizationType')_gridApi: DatatableComponent;
    @ViewChild('organizationTable') _seconeGridApi: DatatableComponent;
    //easyCompanyApp: any;

constructor(private organizationsService: OrganizationsService,
    private organizationTypesService: OrganizationTypesService,
    private easyOrganizations: OrganizationsComponentService,
    private easyCompanyApp: EasyCompanyApp,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private easyGrid: EasyGrid) {}
    
    ngOnInit() {
        this.easyGrid.clearArrays();
        this.easyGrid.setup({updateScopeData: this._successCallback}, 0);
        this.easyGrid.setup({updateScopeData: this._successOrgCallback}, 1);
    
        this.loadOrganizations();
        this.loadOrganizationTypes();
      }
    
      ngAfterViewInit() {
       
        this.easyGrid.setGridApi(this._gridApi);
        this.easyGrid.setSecondGridApi(this._seconeGridApi);
      }
    
    
      loadOrganizations() {
        this.organizationsService.query(this.defaultParams).subscribe(res => this._successOrgCallback(res))
      }
    
      _successOrgCallback = (res) => {
        this._secondeTemp = [...res];
        this.easyGrid.setSecondData(this._secondeTemp);
        this.easyGrid.updateFilter(undefined, undefined, this._secondeTemp, this, 'filteredOrgs', 1);
        this._buildOrgAndChildren();
      };
    
      private _buildOrgAndChildren() {
        this.organisationChildRows = new Map();
        this.organisationsRows = this.buildTree(this.filteredOrgs);
        this._addParentToOrgRows();
        this.easyOrganizations.setOrganizations(this.organisationsRows);
        this.displayed = true;
      }
    
      _addParentToOrgRows = () => {
        this.organisationChildRows.forEach((value, key) => {
          const parent = this.organisationsRows.find((org) => {
            return org.identifier === key;
          });
          if (!parent) {
            const org = this._secondeTemp.find(orgParent => orgParent.identifier === key);
            this.organisationsRows.push(org);
          }
        })
      };
    
      loadOrganizationTypes(row?) {
        this.organizationTypesService.query(this.defaultParams).subscribe(res => this._successCallback(res));
      }
    
      _successCallback = (res) => {
        this.organisationTypesRows = res;
        this._temp = [...res];
        this.easyGrid.setData(this.organisationTypesRows);
        this.easyGrid.updateFilter(undefined, undefined, this._temp, this, 'organisationTypesRows', 0);
        this.easyOrganizations.setTypes(this.organisationTypesRows);
        this.displayed = true;
      };
    
      updateFilter = (event, column, rows) => {
        this.easyGrid.updateFilter(event, column, this._temp, this, rows, 0);
      };
    
      organizationUpdateFilter = (event, column, rows) => {
        this.easyGrid.updateFilter(event, column, this._secondeTemp, this, rows, 1);
        this._buildOrgAndChildren();
      };
    
      addType() {
        const data = new OrganizationType();
        this.dialog.open(AddOrganizationTypeDialogComponent, {
          width: '400px', disableClose: true, data
        }).afterClosed().subscribe(res => {
          this.loadGrid();
        })
      };
    
      editType(row) {
        const data = new OrganizationType(row);
        this.dialog.open(AddOrganizationTypeDialogComponent, {
          width: '400px', disableClose: true, data
        }).afterClosed().subscribe(res => {
          this.loadGrid();
        })
      }
    
      deleteType(row) {
        if (!row.toBeDeleted) {
          const dialogData: DialogData = {
            title: 'LABEL_DELETE',
            message: 'INFO_DELETE_CONFIRM',
            buttonLabel: 'LABEL_DELETE',
            lineName: row.name,
            callBack: (hideDialog) => {
              this.organizationTypesService.delete(row).subscribe(res => {
                this.loadGrid();
                hideDialog();
              });
            }
          };
          this.dialog.open(ConfirmationDialogComponent, {disableClose: true, data: dialogData});
        }
      }
    
    
      addOrganization() {
        const data = new Organization();
        this.dialog.open(AddOrganizationDialogComponent, {
          width: '800px', disableClose: true, data
        }).afterClosed().subscribe(res => {
          this.loadGrid();
        })
      }
    
    
      updateOrganization(row) {
        const data = new Organization(row);
        this.dialog.open(AddOrganizationDialogComponent, {
          width: '800px', disableClose: true, data
        }).afterClosed().subscribe(res => {
          this.loadGrid();
        })
      };
    
      loadGrid() {
        this.loadOrganizations();
        this.loadOrganizationTypes();
      }
    
      deleteOrganization(row) {
        if (!row.toBeDeleted) {
          const dialogData: DialogData = {
            title: 'LABEL_DELETE',
            message: 'INFO_DELETE_CONFIRM',
            buttonLabel: 'LABEL_DELETE',
            lineName: row.name,
            callBack: (hideDialog) => {
              this.organizationsService.delete(this.defaultParams, row.identifier).subscribe(res => {
                this.loadGrid();
                hideDialog();
              });
            }
          };
          this.dialog.open(ConfirmationDialogComponent, {disableClose: true, data: dialogData});
        }
      }
    
      toggleExpandRow(row) {
        this._seconeGridApi.rowDetail.rowHeight = (this.organisationChildRows.get(row.identifier).length * 55) + 20;
        this._seconeGridApi.rowDetail.toggleExpandRow(row);
      }
    
      buildTree(result: Organization[]) {
        let childList = new Array<Organization>();
        const resultInTree = [];
        if (result !== undefined && result.length > 0) {
    
          // Map build with key "undefined" for each row without parent, and key "parentId" for hierarchy
          for (const org of result) {
            if (org.parentId !== undefined) {
              childList = this.organisationChildRows.get(org.parentId) === undefined ?
                new Array<Organization>() : this.organisationChildRows.get(org.parentId);
    
              childList.push(org);
              this.organisationChildRows.set(org.parentId, childList);
            }
          }
    
          for (const org of result) {
    
            childList = this.organisationChildRows.get(org.identifier);
            if (childList !== undefined) {
              resultInTree.push(org);
            } else if (org.parentId === undefined) {
              resultInTree.push(org);
            }
          }
        }
        return resultInTree;
      }
    }