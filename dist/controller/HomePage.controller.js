sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","sap/m/MessageBox"],function(e,t,s){"use strict";return e.extend("com.swcc.Template.controller.HomePage",{onInit:function(){this.oRouter=this.getRouter();var e=sap.ui.core.UIComponent.getRouterFor(this);e.attachRouteMatched(function(e){var t=e.getParameter("name");if(t==="RouteApp"||t==="HomePage"){this._createTileDataModel();this.BPFlagCheckAPI();this.getViewRequestDetails()}},this)},_onObjectMatched:function(){this._createTileDataModel();this.BPFlagCheckAPI();this.getViewRequestDetails()},_createTileDataModel:function(){this.getModel().setData({busy:false,TileData:{Header:{},subTile:{}}})},BPFlagCheckAPI:function(){var e=this.getCurrentUserLoggedIn();var t=this.getCurrentLogInUserName();this.getModel().setProperty("/LoginUser",t);this.getModel().setProperty("/busy",true);var s=`/CheckUserSet(UserName='${e}')`;this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"),"GET",s).then(function(e){this.getModel().setProperty("/TileData/Header/",e);this.getModel().setProperty("/busy",false)}.bind(this)).catch(function(e){this._handleError(e);this.getModel().setProperty("/busy",false)}.bind(this))},onPressCreateRequest:function(){this.oRouter.navTo("AppHomePage")},onPressUserRequest:function(){this.oRouter.navTo("UserProfile")},onPressBpRequest:function(){this.oRouter.navTo("CustomerRegistration")},onPressSlaRequest:function(){this.oRouter.navTo("SlaCreation")},onPressUserManagement:function(){this.oRouter.navTo("UserManagementRequest")},onPressUserViewRequest:function(){this.oRouter.navTo("ViewRequest",{StatusId:"NA"})},getViewRequestDetails:function(){this.getModel().setProperty("/busy",true);var e=[{path:"Username",value:this.getCurrentUserLoggedIn(),group:"SubmitStatusFilter",useOR:true},{path:"Status",value:"Request Submitted",group:"SubmitStatusFilter"},{path:"Username",value:this.getCurrentUserLoggedIn(),group:"CompleteFilter",useOR:true},{path:"Status",value:"Request Completed",group:"CompleteFilter"},{path:"Username",value:this.getCurrentUserLoggedIn(),group:"ProcessFilter",useOR:true},{path:"Status",value:"Request under Process",group:"ProcessFilter"}];var t=this.getFilters(e);Promise.allSettled([this.readChecklistEntity("/ViewRequestSet/$count",t.SubmitStatusFilter),this.readChecklistEntity("/ViewRequestSet/$count",t.CompleteFilter),this.readChecklistEntity("/ViewRequestSet/$count",t.ProcessFilter)]).then(this.buildChecklist.bind(this)).catch(function(e){}.bind(this))},readChecklistEntity:function(e,t){return new Promise(function(s,i){this.getOwnerComponent().getModel("ZSSP_COMMON_SRV").read(e,{filters:[t],success:function(e){s(e)},error:function(e){i(e)}})}.bind(this))},buildChecklist:function(e){this.getModel().setProperty("/busy",false);this.getModel().setProperty("/TileData/subTile/openRequest/",parseInt(e[0].value));this.getModel().setProperty("/TileData/subTile/inProgressRqt/",parseInt(e[2].value));this.getModel().setProperty("/TileData/subTile/doneReqst/",parseInt(e[1].value))},onPressSubTile:function(e){debugger;this.oRouter.navTo("ViewRequest",{StatusId:e.getSource().getId().split("--")[1]})}})});