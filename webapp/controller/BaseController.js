sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/core/BusyIndicator',
	'com/swcc/Template/util/api',
	"sap/ui/model/json/JSONModel"
], function (Controller, BusyIndicator, api, JSONModel) {
	"use strict";

	return Controller.extend("com.swcc.Template.controller.BaseController", {
		getAPI: api,
		getRouter: function () {

			return sap.ui.core.UIComponent.getRouterFor(this);

		},

		CallValueHelpAPI: function (entity) {

			return new Promise(function (resolve, reject) {

				// Use bracket notation to call the dynamic function
				this.getOwnerComponent().getModel("ZSSP_COMMON_SRV")["read"](entity, {

					success: function (oData) {

						resolve(oData);
					},
					error: function (oResult) {

						reject(oResult);
					}
				});
			}.bind(this));
		},
		getFilters: function (filterParams) {

			var dynamicFilters = {};

			filterParams.forEach(function (filterParam) {
				var filter = new sap.ui.model.Filter({
					path: filterParam.path,
					operator: sap.ui.model.FilterOperator.EQ,
					value1: filterParam.value
				});

				if (!dynamicFilters[filterParam.group]) {
					dynamicFilters[filterParam.group] = [];
				}

				dynamicFilters[filterParam.group].push(filter);
			});

			return dynamicFilters;
		},

		addContentDensityClass: function () {
			return this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */

		getModel: function () {
			return this.getOwnerComponent().getModel();
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		}

	});

});