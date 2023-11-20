sap.ui.define([
		"./BaseController",
		"sap/ui/model/json/JSONModel"
	],

	function (BaseController, JSONModel, Sorter) {
		"use strict";
		return BaseController.extend("com.swcc.Template.controller.MouleSelect", {
			onInit: function () {
				this.oRouter = this.getRouter();
				// this.testAPI2();

				var oOptions = {
					url: "http/sf",
					type: "GET"
				};
				this.getAPI.crudOperations_REST(oOptions)
					.then(function (oResponse) {
						var aData = oResponse.data;

					}.bind(this));

			},
			onback: function () {
				this.getOwnerComponent().getTargets().display("LandingView");

			},

			onSearch: function () {

				this.oRouter.navTo("LandingView");

			},

			testAPI2: function () {
				var oModel = new sap.ui.model.json.JSONModel();
				var that = this;
				var aData = jQuery.ajax({
					type: "GET",
					contentType: "application/json",
					url: "/CPI/http/sf",
					dataType: "json",
					async: false,
					success: function (data, textStatus, jqXHR) {
						// 		oModel.setData(data);
						var myJSON = JSON.stringify(data);
						console.log(myJSON);
					}
				});
				this.getView().setModel(oModel);
			}

		})
	})