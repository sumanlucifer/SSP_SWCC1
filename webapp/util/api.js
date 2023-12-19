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

		// 		This below dynamic oDataACRUDCall() Method accepts for all CRUD operation SAP ODATA !!!

		oDataACRUDAPICall: function (oModel, httpMethod, entity, payload, filter, urlParams) {
			return new Promise(function (resolve, reject) {
				const queryOptions = {
					success: function (oData) {
						resolve(oData);
					},
					error: function (oResult) {
						reject(oResult);
					}
				};

				if (filter) {
					queryOptions.filters = [filter];
				}
				if (urlParams) {
					if (!queryOptions.urlParameters) {
						queryOptions.urlParameters = {};
					}
					Object.assign(queryOptions.urlParameters, urlParams);
				}

				// Determine the HTTP method to be used for the request
				switch (httpMethod.toUpperCase()) {
				case 'GET':
					oModel.read(entity, queryOptions);
					break;
				case 'POST':
					oModel.create(entity, payload, queryOptions);
					break;
				case 'PUT':
					oModel.update(entity, payload, queryOptions);
					break;
				case 'DELETE':
					oModel.remove(entity, queryOptions);
					break;
				default:
					reject('Invalid HTTP method');
				}
			});
		},

		baseURL: function (oOptions) {
			//return "../EIFA-NODE_api/" + oOptions.url;
			return "/CPI/" + oOptions.url;
		}

	};
});