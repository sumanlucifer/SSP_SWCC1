sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","sap/ui/core/routing/History","sap/m/MessageBox"],function(e,t,s,o){"use strict";return e.extend("com.swcc.Template.controller.AppHomePage",{onInit:function(){this.oRouter=this.getRouter();this.getRouter().getRoute("AppHomePage").attachPatternMatched(this._onObjectMatched,this)},_onObjectMatched:function(){this._createDataModel();this.getTileDisplayData()},_createDataModel:function(){this.getModel().setData({busy:false,AppHomeTileDisplay:{Header:{}}})},handleBackPress:function(){var e,t;e=s.getInstance();t=e.getPreviousHash();if(t!==undefined){window.history.go(-1)}else{this.getRouter().navTo("HomePage",{},true)}},getTileDisplayData:function(){this.getModel().setProperty("/busy",true);var e=this.getCurrentUserLoggedIn();var t=`/UserSet(RequestID='',SapID='${e}')`;this.getAPI.oDataACRUDAPICall(this.getOwnerComponent().getModel("ZSSP_USER_SRV"),"GET",t).then(function(e){this.handleAcessissueError(e);this.getModel().setProperty("/AppHomeTileDisplay/Header/",e);this.handleSetLocalStaorage("userType",e.UserType);this.handleSetLocalStaorage("userPlant",e.Plant);this.getModel().setProperty("/busy",false)}.bind(this)).catch(function(e){o.error(e.responseText);this.getModel().setProperty("/busy",false)}.bind(this))},handleAcessissueError:function(e){debugger;const t=e.AccessHR===""&&e.AccessFI===""&&e.AccessIT===""&&e.AccessSC===""&&e.AccessPM==="";if(t){o.error("You do not have permission to access, Please Contact System Administrator ");return}},onPressTile:function(e){var t=jQuery.sap.storage(jQuery.sap.storage.Type.local);var s=e.getSource().getId().split("--")[1];t.put("sMouleType",s);this.oRouter.navTo("ModuleSelect")}})});