sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","sap/ui/core/routing/History","sap/m/MessageBox","sap/ui/core/Fragment","sap/ui/Device","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast"],function(e,t,r,a,i,l,o,s,n){"use strict";return e.extend("com.swcc.Template.controller.PMCreateRequest",{onInit:function(){this.oRouter=this.getRouter();this.getRouter().getRoute("PMCreateServiceRequest").attachPatternMatched(this._onObjectMatched,this)},_onObjectMatched:function(e){debugger;this._createItemDataModel();this.objectType();var t=this.handlegetlocalStorage("sSubServiceType");var r=t.split("_")[0];var a=t.split("_")[1];var i=t.split("_")[3];this.getModel().setProperty("/PMCreateRequest/Header/Material",r);this.getModel().setProperty("/ServiceDescription",a);this.getModel().setProperty("/PMCreateRequest/CustomDisplayData/BaseUnit",i);var l=this.handlegetlocalStorage("OrderID");var o=this.handlegetlocalStorage("EquipmentNo");this.getModel().setProperty("/PMCreateRequest/Header/MaintOrder",l);this.getModel().setProperty("/EquipmentF4",o);var s=this.handlegetlocalStorage("userPlant");this.getModel().setProperty("/PlantF4",s);var n=this.handlegetlocalStorage("userType");n==="E"?this.getModel().setProperty("/RemarksVisibility",true):this.getModel().setProperty("/RemarksVisibility",false)},_createItemDataModel:function(){this.getModel().setData({busy:false,PMCreateRequest:{UploadedData:[],Header:{},CustomDisplayData:{},Attachment:[],PlantF4:[],WorkCenterF4:[]}})},objectType:function(){this.getModel().setProperty("/busy",true);this.CallValueHelpAPI("/C_TechnicalObjectType /").then(function(e){this.getModel().setProperty("/busy",false);this.getModel().setProperty("/PMCreateRequest/ObjectType/",e.results)}.bind(this)).catch(function(e){this.getModel().setProperty("/busy",false);a.error(e.responseText)}.bind(this))},onCheckPlantVal:function(e){e.getSource().getSelectedKey()===""?e.getSource().setValue(null):""},onValueHelpRequest:function(e){var t=e.getSource().getId().split("_")[3];var r=e.getSource().getAriaLabelledBy()[0].split("-")[3];var a=e.getSource().getAriaLabelledBy()[0].split("-")[4];var t=e.getSource().getAriaLabelledBy()[0].split("-")[5];var i=e.getSource().getAriaLabelledBy()[0].split("-")[6];this.getModel().setProperty("/FragModel",i);this.handleFiltersForValueHelp(this.getModel().getProperty("/FragModel"));var l=e.getSource().getCustomData();var o=[];for(var s=0;s<l.length;s++){var n=l[s].getValue();var u=l[s].getKey();if(n&&u){o.push({label:n,template:u})}}this.getModel().setProperty("/dynamicColumns",o);var o=o;var g=this.getOwnerComponent().getModel(r);this.onHandleValueHelpRequest(g,o,a,t)},onValueHelpOkPress:function(e){debugger;var t=this.getModel().getProperty("/dynamicColumns");var r=this.getModel().getProperty("/FragModel");var a=e.getParameter("tokens");var i=t[0].template;var l=t[1].template;var o=this.getModel();var r=r;this.onHandleValueHelpOkPress(o,r,a,i,l)},setDependentFilterData:function(){if(this.getModel().getProperty("/FragModel")==="/InsuranceF4/"){var e=[{path:"Zzinspono",value:this.getModel().getProperty("/InsuranceF4")?this.getModel().getProperty("/InsuranceF4").split("-")[0]:"",group:"InsuranceFilter"}];var t=this.getFilters(e);this.callDependentFilteAPI("ZSSP_FI_SRV","/ZCDSV_INSURANCEVH",t.InsuranceFilter,"/PMCreateRequest/WorkCenterF4/")}else if(this.getModel().getProperty("/FinanceAppVisible/")==="SSA-FIN-3005-3A"&&this.getModel().getProperty("/FragModel")==="/costF4/"){var e=[{path:"CostCenter",value:this.getModel().getProperty("/costF4")?this.getModel().getProperty("/costF4").split("-")[0]:"",group:"RecordAssetFilter"}];var t=this.getFilters(e);this.callDependentFilteAPI("ZSSP_FI_SRV","/ZCDSV_COSTCTRVH",t.RecordAssetFilter,"/AssetLifecycle/RecordAsset/Header/ProfitCentr/")}},callDependentFilteAPI:function(e,t,r,i){this.getModel().setProperty("/busy",true);this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel(e),"GET",t,null,r,null).then(function(e){this.getModel().setProperty(`${i}`,e.results);this.getModel().setProperty("/busy",false)}.bind(this)).catch(function(e){a.error(e.responseText);this.getModel().setProperty("/busy",false)}.bind(this))},onValueHelpCancelPress:function(){this.onHandleValueHelpCancelPress()},onFilterBarSearch:function(e){var t=this.getModel().getProperty("/dynamicColumns");var r=e.getParameter("selectionSet");var a=[{path:t[0].template,value:r[0].getValue(),group:"DynamicF4SearchFilter",useOR:true},{path:t[1].template,value:r[1].getValue(),operator:sap.ui.model.FilterOperator.Contains,group:"DynamicF4SearchFilter",useOR:true},{path:t[2]&&t[2].template?t[2].template:"",value:r[2]&&r[2].getValue()?r[2].getValue().split("-")[0]:"",group:"DynamicF4SearchFilter",useOR:true},{path:t[3]&&t[3].template?t[3].template:"",operator:sap.ui.model.FilterOperator.Contains,value:r[3]&&r[3].getValue()?r[3].getValue():"",group:"DynamicF4SearchFilter"}];var i=this.getFilters(a);this._filterTable(i.DynamicF4SearchFilter)},handleFiltersForValueHelp:function(e){var t=[{path:"Plant",value:this.getModel().getProperty("/PlantF4/")?this.getModel().getProperty("/PlantF4/"):"",group:"WorrkCenterF4Filter",useOR:true},{path:"ServiceProduct",value:this.getModel().getProperty("/PMCreateRequest/Header/Material"),group:"WorrkCenterF4Filter"},{path:"MaintenancePlanningPlant",value:this.getModel().getProperty("/PlantF4/")?this.getModel().getProperty("/PlantF4/"):"",group:"EquipmentF4Filter"}];var r=this.getFilters(t);var a;if(e==="/WorkCenterF4/"){a=this._getfilterforControl(r.WorrkCenterF4Filter)}else if(e==="/EquipmentF4/"){a=this._getfilterforControl(r.EquipmentF4Filter)}else{a=[]}this.getModel().setProperty("/DynamicValuehelpFilter",a.length==0?[]:a)},onFilterValChanged:function(e){var t=e.getParameter("selectionSet");var r=[{path:this.getModel().getProperty("/valueHelpKey1"),value:t[0].getValue(),group:"DynamicF4SearchFilter"},{path:this.getModel().getProperty("/valueHelpKey2"),value:t[1].getValue(),operator:sap.ui.model.FilterOperator.Contains,group:"DynamicF4SearchFilter"},{path:this.getModel().getProperty("/valueHelpKey3"),value:t[2].getValue(),group:"DynamicF4SearchFilter"},{path:this.getModel().getProperty("/valueHelpKey4"),operator:sap.ui.model.FilterOperator.Contains,value:t[3].getValue(),group:"DynamicF4SearchFilter"}];var a=this.getFilters(r);this._filterTable(new o({filters:a.DynamicF4SearchFilter,and:false}))},onClearFilter:function(e){var t=e.getParameter("selectionSet");t[0].setValue(null);t[1].setValue(null);t[2]?t[2].setValue(null):"";t[3]?t[3].setValue(null):"";this._filterTable(new o({filters:[],and:false}))},onValueHelpAfterOpen:function(){var e=this.getModel().getProperty("/DynamicValuehelpFilter");this._filterTable(e,"Control")},_getfilterforControl:function(e){if(!e){return[]}return e},_filterTable:function(e,t){this.handleVHFilterTable(e,t)},onProceed:function(){this.InputValidation()!==true?"":this.CreateFinaceRequestPayload(this.getModel().getProperty("/PMCreateRequest/Header/"))},InputValidation:function(){var e=[{path:"/PMCreateRequest/Header/StartDate/",condition:true},{path:"/PMCreateRequest/Header/EndDate/",condition:true},{path:"/PMCreateRequest/Header/MaterialQty/",condition:true},{path:this.getModel().getProperty("/RemarksVisibility/")===true&&!this.getModel().getProperty("/PMCreateRequest/Header/NotifText/")?"/PMCreateRequest/Header/NotifText/":"/ServiceDescription/",condition:true}];var t=true;e.forEach(e=>{var r=this.getModel().getProperty(e.path);if(!r||e.condition&&!e.condition){this.getModel().setProperty(e.path,"");this.getModel().setProperty("/ValidationFlag/",true);t=false}});if(!t){n.show("Please Enter all Mandatory Fields")}return t},CreateFinaceRequestPayload:function(e){const t=this.getModel().getProperty("/PMCreateRequest/UploadedData").map(({Filesize:e,...t})=>t);var r={Username:this.getCurrentUserLoggedIn(),Material:e.Material,MaterialQty:e.MaterialQty.toString(),Plant:this.getModel().getProperty("/PlantF4/")?this.getModel().getProperty("/PlantF4/"):"",Descript:e.Descript,NotifText:e.NotifText,StartDate:this.handleReturnDateonly(e.StartDate),EndDate:this.handleReturnDateonly(e.EndDate),Equipment:this.getModel().getProperty("/EquipmentF4/")?this.getModel().getProperty("/EquipmentF4/").split("-")[0]:"",PmWkctr:this.getModel().getProperty("/WorkCenterF4/")?this.getModel().getProperty("/WorkCenterF4/").split("-")[0]:"",MaintOrder:e.MaintOrder,ServiceHeadertoItem:[],Attachments:t};this.PMCreateRequestAPI(r)},PMCreateRequestAPI:function(e){debugger;this.getModel().setProperty("/busy",true);this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_COMMON_SRV"),"POST","/ServNotificationSet",e).then(function(e){this._handleMessageBoxProceed(`Service Request has been created : ${e.Notificat}`);this.getModel().setProperty("/busy",false)}.bind(this)).catch(function(e){this._handleError(e);this.getModel().setProperty("/busy",false)}.bind(this))},_handleMessageBoxProceed:function(e){var t={sMessage:e};this.createMessageBoxHandler(this.onPresshomepage.bind(this))(t)},onPresshomepage:function(){this.getOwnerComponent().getRouter().navTo("HomePage")},handleBackPress:function(){this.navigationBack()},handleBackHomePress:function(){this.getRouter().navTo("HomePage",{},true)},onCancel:function(){this.navigationBack()},onSaveRequest:function(){var e=this.getModel().getProperty("/PMCreateRequest/Header/");this.PMCreateaRequestAPI(e)},onFileAdded:function(e){debugger;var t=this;var r=e.getSource();var a=e.getParameter("files");if(a.length===0)return;var i=a[0].name,l=a[0].type,o=a[0],s=a[0].size;this._getImageData(o,function(e){t._addData(e,i,l,s)})},_addData:function(e,t,r,a){debugger;var i=this.getModel().getProperty("/PMCreateRequest/UploadedData");if(i.length>=5){n.show("Upto 5 Documents are allowed to upload");return false}var l=i.map(function(e){return Object.assign({},e)});l.push({Filename:t,Mimetype:r,Value:e,Filesize:a});this.getModel().setProperty("/PMCreateRequest/UploadedData",l)},onDeleteAttachment:function(e){var t=parseInt(e.getSource().getBindingContext().getPath().split("/")[3]);var r=this.getModel().getProperty("/PMCreateRequest/UploadedData");r.splice(t,1);this.getModel().refresh();currentElement.removeStyleClass("remove-table")},handleMissmatch:function(){this.handleFileMissmatch()},onFileSizeExceed:function(){this.handleFileSizeExceed()}})});