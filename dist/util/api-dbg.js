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

		oDataACRUDAPICall: function (oModel, httpMethod, entity, payload, filter, urlParams, sortParams, searchString) {
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
				// Add sort parameters to queryOptions if provided
				// Add sorters to queryOptions if provided
				if (sortParams) {
					// Convert sortParams to a string for $orderby
					queryOptions.urlParameters = {
						"$orderby": sortParams.map(sorter => `${sorter.sPath} ${sorter.bDescending ? 'desc' : 'asc'}`).join(',')
					};
				}
				if (urlParams) {
					if (!queryOptions.urlParameters) {
						queryOptions.urlParameters = {};
					}
					Object.assign(queryOptions.urlParameters, urlParams);
				}
				if (searchString) {
					if (!queryOptions.urlParameters) {
						queryOptions.urlParameters = {};
					}
					queryOptions.urlParameters["search"] = searchString;
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