import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment.developement';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  authUrl: string = environment.authUrl;
  appUrl: string = environment.appUrl;
  masterUrl : string = environment.masterUrl;
  // masterUrl: string = environment.masterUrl;
  // masterUrlWithouOcelet: string = environment.masterUrlWithoutOcelet;
  // caseManagementUrl : string = environment.caseManagementUrl;
  // caseManagementUrl: string = environment.caseManagementUrl;
  // reportUrl: string = environment.reportUrl;

  // hcUrl: string = environment.hcUrl;
  // ecUrl: string = environment.ecUrl;
  // authUrl: string = environment.authUrl;
  // litesUrl : string =environment.litesUrl;

  constructor() { }

  getSSOLoginUrl(){
    return `${this.authUrl}/gateway/SSOAuthNew`;
  }

  getLoginLogs(){
    return `${this.appUrl}/UserLogin/LoginLogs`;
  }

  getUserDetailsFromSSO(){
    return `${this.authUrl}/gateway/SsoProfileDt`
  }



  // AUTH URL's Without Token


  getLevelAuthDropdown(){
    return `${this.authUrl}/gateway/LevelDropdown`
  }
  
  
  getRoleAuthDropdown(){
    return `${this.authUrl}/gateway/RolesDropdown`
  }
  
  
  getDivisionAuthDropdown(){
    return `${this.authUrl}/gateway/DivisionsDropdown`
  }
  
  
  getDistrictAuthDropdown(){
    return `${this.authUrl}/gateway/DistrictsDropdown`
  }
  
  
  getOfficeAuthDropdown(){
    return `${this.authUrl}/gateway/OfficesDropdown`
  }
  
  
  getDesignationAuthDropdown(){
    return `${this.authUrl}/gateway/DesignationDropdown`
  }
  
  
  getCourtAuthDropdown(){
    return `${this.authUrl}/gateway/CourtNamesDropdown`
  }

  addUserMappingReq(){
    return `${this.authUrl}/gateway/AddEditUserMapReq`
  }

  
  

  // MASTER URL's

  mapUserBySa(){
    return `${this.masterUrl}/Users/MappedBySA`
  }


  getPermissionMappingList(){
   return `${this.masterUrl}/Users/UserMapReqList` 
  }


  getRolesDropdown(){
    return `${this.masterUrl}/Roles/GetDropdown`
  }


  getadminDeptList(){
    return `${this.masterUrl}/AdminDepartment/Get`
  }

  addEditAdminDept(){
    return `${this.masterUrl}/AdminDepartment/AddEdit`
  }

  getAdminDeptDropdown() {
    return `${this.masterUrl}/AdminDepartment/GetDropdown`
  }

  activeDeaciveAdminDept() {
    return `${this.masterUrl}/AdminDepartment/ActiveDeactive`
  }

  
  getOfficeList() {
    return `${this.masterUrl}/Offices/Get`
  }

  getOfficeDropdown() {
    return `${this.masterUrl}/Offices/GetDropdown`
  }

  getOfficeDropdownByUnitId(unitId: number) {
    return `${this.masterUrl}/Offices/GetDropdown?UnitId=${unitId}`
  }

  addEditOffice() {
    return `${this.masterUrl}/Offices/AddEdit`
  }

  activeDeactiveOffice() {
    return `${this.masterUrl}/Offices/ActiveDeactive`
  }

  getDivisionListRajMaster() {
    return `${this.masterUrl}/State/DivisionsList`
  }

  getDivisionDropdown() {
    return `${this.masterUrl}/State/GetDivisions`
  }


  getDesignationList() {
    return `${this.masterUrl}/Designation/Get`
  }

  getDesignationDropDown() {
    return `${this.masterUrl}/Designation/GetDropdown`
  }


  getDesignationRajMasterDropDown() {
    return `${this.masterUrl}/Designation/GetDropdownRaj`
  }


  addEditDesignation() {
    return `${this.masterUrl}/Designation/AddEdit`
  }

  activeDeactiveDesignation() {
    return `${this.masterUrl}/Designation/ActiveDeactive`
  }

  getDistrictListRajMaster() {
    return `${this.masterUrl}/State/DistrictsList`
  }

  getDistrictDropDown() {
    return `${this.masterUrl}/State/GetDistricts`
  }

  getStateDropDown() {
    return `${this.masterUrl}/State/Get`
  }

  getCourtTypesList() {
    return `${this.masterUrl}/CourtTypes/Get`
  }

  getCourtTypesDropdown() {
    return `${this.masterUrl}/CourtTypes/GetDropdown`
  }

  activeDeactiveCourtType() {
    return `${this.masterUrl}/CourtTypes/ActiveDeactive`
  }

  addEditCourtType() {
    return `${this.masterUrl}/CourtTypes/AddEdit`
  }

    getCourtsList() {
    return `${this.masterUrl}/CourtNames/GetList`
  }

  activeDeactiveCourt() {
    return `${this.masterUrl}/CourtNames/ActiveDeactive`
  }

  addEditCourt() {
    return `${this.masterUrl}/CourtNames/AddEdit`
  }

  getCourtDropdown() {
    return `${this.masterUrl}/CourtNames/GetDropdown`
  }

  getPoliceRangeList(){
    return `${this.masterUrl}/PoliceThana/GetPRange`
  }
  
  
  getPoliceRangeDropdown(){
    return `${this.masterUrl}/PoliceThana/PRangeDropdown`
  }

  getPoliceDistrictList(){
    return `${this.masterUrl}/PoliceThana/GetPDistrict`
  }
  
  
  getPoliceDistrictDropdown(){
    return `${this.masterUrl}/PoliceThana/PDistrictDropdown`
  }

  getPoliceCircleList(){
    return `${this.masterUrl}/PoliceThana/GetPCircle`
  }
  
  
  getPoliceCircleDropdown(){
    return `${this.masterUrl}/PoliceThana/PCircleDropdown`
  }

  getPoliceStationList(){
    return `${this.masterUrl}/PoliceThana/GetPStation`
  }
  
  
  getPoliceStationDropdown(){
    return `${this.masterUrl}/PoliceThana/PStationDropdown`
  }
  
  
  getLevelList(){
    return `${this.masterUrl}/Level/Get`
  }
  
  
  getLevelDropdown(){
    return `${this.masterUrl}/Level/Dropdown`
  }
  
  
  addEditLevel(){
    return `${this.masterUrl}/Level/AddEdit`
  }
  
  
  activeDeactiveLevel(){
    return `${this.masterUrl}/Level/ActiveDeactive`
  }


  getCrimeClassificationList(){
    return `${this.masterUrl}/CrimeClassification/Get`
  }
  
  
  getCrimeClassificationDropdown(){
    return `${this.masterUrl}/CrimeClassification/Dropdown`
  }

  addEditCrimeClassification(){
    return `${this.masterUrl}/CrimeClassification/AddEdit`
  }
  
  
  activeDeactiveCrimeClassification(){
    return `${this.masterUrl}/CrimeClassification/ActiveDeactive`
  }
  
  
  getCrimeActList(){
    return `${this.masterUrl}/CrimeAct/Get`
  }
  
  
  getCrimeActDropdown(){
    return `${this.masterUrl}/CrimeAct/Dropdown`
  }

  addEditCrimeAct(){
    return `${this.masterUrl}/CrimeAct/AddEdit`
  }
  
  
  activeDeactiveCrimeAct(){
    return `${this.masterUrl}/CrimeAct/ActiveDeactive`
  }
  
  
  getCrimeSubActList(){
    return `${this.masterUrl}/CrimeSubAct/Get`
  }
  
  
  getCrimeSubActDropdown(){
    return `${this.masterUrl}/CrimeSubAct/Dropdown`
  }

  addEditSubCrimeAct(){
    return `${this.masterUrl}/CrimeSubAct/AddEdit`
  }
  
  
  activeDeactiveSubCrimeAct(){
    return `${this.masterUrl}/CrimeSubAct/ActiveDeactive`
  }
  
  
  getFirStatusList(){
    return `${this.masterUrl}/FirStatus/Get`
  }
  
  getFirStatusDropdown(){
    return `${this.masterUrl}/FirStatus/Dropdown`
  }

  addEditFirStatus(){
    return `${this.masterUrl}/FirStatus/AddEdit`
  }
  
  activeDeactiveFirStatus(){
    return `${this.masterUrl}/FirStatus/ActiveDeactive`
  }

}
