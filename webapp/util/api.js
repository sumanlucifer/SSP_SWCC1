sap.ui.define(["sap/m/MessageBox"], function (MessageBox) {
	"use strict";
	return {
		crudOperations_REST(oOptions) {
			oOptions.url = this.baseURL(oOptions);
			return new Promise(function (resolve, reject) {
				oOptions = $.extend(oOptions, {
					cache: false,
					success: function (response) {
						resolve(response);
					},
					error: function (e) {
						console.log(e);
						reject(e);
					}
				});
				$.ajax(oOptions);
			});
		},

		//	call API below for REST

		// 		this.getAPI.crudOperations(oOptions)
		// 				.then(function (oResponse) {
		// 					var aData = oResponse.data;
		// 					this.getModel().setProperty("/userRecommendation/getRecommendations", aData);
		// 				}.bind(this));

		//	call API below for REST

		crudOperations_ODATA: function (entity, filter, apiCall) {
			return new Promise(function (resolve, reject) {
				const oModel = this.getOwnerComponent().getModel("UserAction");

				// Use bracket notation to call the dynamic function
				oModel[apiCall](entity, {
					filters: [filter],
					success: function (oData) {
						resolve(oData);
					},
					error: function (oResult) {
						reject(oResult);
					}
				});
			}.bind(this));
		},

		//	call API below: 

		// 		this.crudOperations_ODATA("YourEntitySet", oFilter, "read").then(function (result) {
		// 			// Handle success
		// 		}).catch(function (error) {
		// 			// Handle error
		// 		});
		//	call API below: 
		baseURL: function (oOptions) {
			//return "../EIFA-NODE_api/" + oOptions.url;
			return "/CPI/" + oOptions.url;
		}

	};
});