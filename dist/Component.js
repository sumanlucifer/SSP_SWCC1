sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","com/swcc/Template/model/models","./controller/ErrorHandler"],function(e,t,n,s){"use strict";return e.extend("com.swcc.Template.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this._oErrorHandler=new s(this);this.getRouter().initialize();this.setModel(n.createDeviceModel(),"device");var t=this.getLanguage();sap.ui.getCore().getConfiguration().setLanguage(t)},getErrorHandler:function(){return this._oErrorHandler},getLanguage:function(){var e=sap.ui.getCore().getConfiguration().getLanguage();if(e==="AR"){e="AR"}else{var e=sap.ui.getCore().getConfiguration().getLanguage()}return e},destroy:function(){this._oErrorHandler.destroy();e.prototype.destroy.apply(this,arguments)},getContentDensityClass:function(){if(this._sContentDensityClass===undefined){if(document.body.classList.contains("sapUiSizeCozy")||document.body.classList.contains("sapUiSizeCompact")){this._sContentDensityClass=""}else if(!t.support.touch){this._sContentDensityClass="sapUiSizeCompact"}else{this._sContentDensityClass="sapUiSizeCozy"}}return this._sContentDensityClass}})});