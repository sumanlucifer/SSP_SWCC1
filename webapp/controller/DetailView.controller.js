sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.swcc.Template.controller.DetailView", {
		onInit: function () {

			this.oRouter = this.getOwnerComponent().getRouter();

		},
		onback: function () {

			this.getOwnerComponent().getTargets().display("LandingView");

		}
	})
})