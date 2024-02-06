sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/core/BusyIndicator',
	'com/swcc/Template/util/api',
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/Device"
], function (Controller, BusyIndicator, api, JSONModel, MessageBox, History, Device) {
	"use strict";

	return Controller.extend("com.swcc.Template.controller.BaseController", {
		getAPI: api,

		// 	___________________________________________________Router Method_________________________________________________________
		getRouter: function () {

			return sap.ui.core.UIComponent.getRouterFor(this);

		},

		getCurrentUserLoggedIn: function () {
			try {
				var sLoginID = new sap.ushell.services.UserInfo().getId();
				return sLoginID;
			} catch (error) {
				var sLoginID = "WT_POWER";
				//WT_POWER
				//SC_ZMOHAMMED
				// Handle the error gracefully, such as using a default value or logging the error
				return sLoginID;
			}
		},
		getCurrentLogInUserName: function () {

			try {
				var sUserName = new sap.ushell.services.UserInfo().getUser().getFirstName();;
				return sUserName;
			} catch (error) {
				var sUserName = "User";
				// Handle the error gracefully, such as using a default value or logging the error
				return sUserName;
			}
		},
		// 	___________________________________________________Dynamic Valuehelp Method_________________________________________________________

		onHandleValueHelpRequest: function (oModel, aColumns, sPath, sFragName) {
			this._oMultiInput = this.getView().byId("multiInput");
			this.oColModel = new JSONModel({
				cols: aColumns,
			});

			var aCols = this.oColModel.getData().cols;

			this._oValueHelpDialog = sap.ui.xmlfragment(
				sFragName,
				this
			);
			this.getView().addDependent(this._oValueHelpDialog);

			this._oValueHelpDialog.getTableAsync().then(
				function (oTable) {
					if (Device.system.desktop) {
						this._oValueHelpDialog.addStyleClass("sapUiSizeCompact");
					}
					oTable.setModel(oModel);
					oTable.setModel(this.oColModel, "columns");

					if (oTable.bindRows && sPath) {
						oTable.bindAggregation("rows", {
							path: sPath,
							events: {
								dataReceived: function () {
									this._oValueHelpDialog.update();
								}.bind(this),
							},
						});
					}

					if (oTable.bindItems && sPath) {
						oTable.bindAggregation("items", sPath, function () {
							return new sap.m.ColumnListItem({
								cells: aCols.map(function (column) {
									return new sap.m.Label({
										text: "{" + column.template + "}",
									});
								}),
							});
						});
					}
					oTable.setSelectionMode("Single");
					this._oValueHelpDialog.update();
				}.bind(this)
			);

			this._oValueHelpDialog.open();
		},
		onHandleValueHelpOkPress: function (oModel, sModelPath, aTokens, sKeyProperty, sTextProperty) {
			var oData = [];
			var xUnique = new Set();

			aTokens.forEach(function (ele) {
				if (xUnique.has(ele.getKey()) == false) {
					var dataObject = {};
					var sKeyText = ele.getText().split("(")[0].trim();;
					// ele.getText();
					dataObject[sTextProperty] = sKeyText;
					dataObject[sKeyProperty] = ele.getKey();
					oData.push(dataObject);
					xUnique.add(ele.getKey());
				}
			});

			// Adjust the property path and model based on your use case
			oModel.setProperty(sModelPath, oData.length === 0 ? "" : `${oData[0][sKeyProperty]}- ${oData[0][sTextProperty]}`);
			this._oValueHelpDialog.close();
		},
		onHandleValueHelpCancelPress: function () {
			this._oValueHelpDialog.close();
		},
		// 		handleVHFilterTable: function (oFilter, sType) {
		// 			var oValueHelpDialog = this._oValueHelpDialog;

		// 			oValueHelpDialog.getTableAsync().then(function (oTable) {
		// 				if (oTable.bindRows) {
		// 					oTable.getBinding("rows").filter(oFilter, sType || "Application");
		// 				}

		// 				if (oTable.bindItems) {
		// 					oTable
		// 						.getBinding("items")
		// 						.filter(oFilter, sType || "Application");
		// 				}

		// 				oValueHelpDialog.update();
		// 			});
		// 		},

		handleVHFilterTable: function (oFilter, sType) {
			var oValueHelpDialog = this._oValueHelpDialog;

			oValueHelpDialog.getTableAsync().then(function (oTable) {
				if (oTable) {
					var oBinding;

					if (oTable.bindRows) {
						oBinding = oTable.getBinding("rows");
					} else if (oTable.bindItems) {
						oBinding = oTable.getBinding("items");
					}

					if (oBinding) {
						oBinding.filter(oFilter, sType || "Application");
					}

					oValueHelpDialog.update();
				}
			});
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

		// 			___________________________________________________Navigation Back Method_________________________________________________________
		navigationBack: function () {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("HomePage", {}, true);

			}

		},
		// 			___________________________________________________Dynamic Filters for API Method_________________________________________________________

		getFilters: function (filterParams, orderBy) {
			var dynamicFilters = {};

			filterParams.forEach(function (filterParam) {
				if (filterParam.value !== undefined && filterParam.value !== "") {
					var filter = new sap.ui.model.Filter({
						path: filterParam.path,
						operator: filterParam.operator ? filterParam.operator : sap.ui.model.FilterOperator.EQ,
						value1: filterParam.value
					});

					if (!dynamicFilters[filterParam.group]) {
						dynamicFilters[filterParam.group] = {
							filters: [],
							useOR: filterParam.useOR || false // Default to AND if not specified
						};
					}

					dynamicFilters[filterParam.group].filters.push(filter);
				}
			});

			// Transform dynamicFilters into an object with group names as properties
			var finalFilters = {};
			Object.keys(dynamicFilters).forEach(function (group) {
				var groupFilters = dynamicFilters[group].filters;
				var useOR = dynamicFilters[group].useOR;
				finalFilters[group] = new sap.ui.model.Filter(groupFilters, useOR); // useOR controls AND (false) or OR (true)
			});
			// Add the order by clause if provided
			if (orderBy) {
				debugger;
				finalFilters.$orderby = orderBy;
			}
			return finalFilters;
		},

		// _________________________________Dynamic Suceess Message and ok Trigger function for API _________________________________________________________
		createMessageBoxHandler: function (onPressFunction) {

			return function (params) {
				var sMessage = params && params.sMessage ? params.sMessage : '';
				var icon = params && params.icon ? params.icon : MessageBox.Icon.SUCCESS;
				var title = params && params.title ? params.title : "Success";
				var actions = params && params.actions ? params.actions : [MessageBox.Action.OK];
				var emphasizedAction = params && params.emphasizedAction ? params.emphasizedAction : MessageBox.Action.YES;
				sap.m.MessageBox.success(sMessage, {
					icon: icon,
					title: title,
					actions: actions,
					emphasizedAction: emphasizedAction,
					onClose: function (oAction) {
						if (oAction === MessageBox.Action.OK && onPressFunction && typeof onPressFunction === 'function') {
							onPressFunction();
						}
					}
				});
			};
		},
		// ________________________________________________________Dynamic Confirm(YES or NO) Message and ok Trigger function for API _________________________________________________________
		handleConfirmMessage: function (apiFunction) {
			return function (params) {

				var dialog = new sap.m.Dialog({
					title: 'Confirm',
					type: 'Message',
					content: [

						new sap.ui.core.Icon({
							src: "sap-icon://alert",
							size: "2rem", // Adjust the size as needed
							color: "red" // Adjust the color as needed
						}),
						new sap.m.Text({
							text: params.sMsgTxt,
						}),
					],
					beginButton: new sap.m.Button({
						text: params.sBtnTxt,
						press: function () {
							apiFunction.call(this, params.sRequestID);
							dialog.close();
						}.bind(this),
					}),
					endButton: new sap.m.Button({
						text: 'Cancel',
						press: function () {
							dialog.close();
						},
					}),
					afterClose: function () {
						dialog.destroy();
					},
				});
				if (Device.system.desktop) {
					dialog.addStyleClass("sapUiSizeCompact");
				}
				dialog.open();
			};
		},
		// 	___________________________________________________Adding glossy css to Application ___________________________________________________________
		addContentDensityClass: function () {
			return this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},

		// 	___________________________________________________Get Component  Method_________________________________________________________
		getModel: function () {
			return this.getOwnerComponent().getModel();
		},

		// **********************************************************File Handling*********************************************************		
		// ___________________________File to Binary format from Base 64 _______________________________
		base64ToBlob: function (base64String, contentType) {
			contentType = contentType || '';
			const byteCharacters = atob(base64String);
			const byteNumbers = new Array(byteCharacters.length);
			for (let i = 0; i < byteCharacters.length; i++) {
				byteNumbers[i] = byteCharacters.charCodeAt(i);
			}
			const byteArray = new Uint8Array(byteNumbers);
			return new Blob([byteArray], {
				type: contentType
			});
		},
		// ___________________________File to Base 64 format from filecontent _______________________________
		_getImageData: function (url, callback, fileName) {
			var reader = new FileReader();
			reader.onloadend = function (evt) {
				if (evt.target.readyState === FileReader.DONE) {

					var binaryString = evt.target.result,
						base64file = btoa(binaryString);

					callback(base64file);
				}
			};
			reader.readAsBinaryString(url);
		},
		// ___________________________File Error _______________________________
		handleFileMissmatch: function () {
			return MessageBox.error("Please upload only PDF and WORD document File.");
		},
		// ___________________________File Exceed Error _______________________________
		handleFileSizeExceed: function () {
			return MessageBox.error("File size exceeded, Please upload file upto 2MB.");
		},
		// ____________________________________________________set local session storage___________________________________________________
		handleSetLocalStaorage: function (sProperty, sVal) {
			// Get access to local storage
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);

			// Define your data object
			// var payloadObject = {
			// 	"UserName": "JohnDoe123",
			// 	"P2_Represen": "JaneSmith456",
			// 	"P2_Rep_Pos": "Representative",
			// 	"P2_CorName": "CorporationX",
			// 	// ... rest of your payload
			// };

			// Convert the object to string before storing
			//		var jsonString = JSON.stringify(payloadObject);

			// Store the data
			oStorage.put(sProperty, sVal);

			// Retrieve the data
			//	var retrievedData = oStorage.get("myDataKey");

			// If you want to parse the retrieved data back to an object
			// if (retrievedData) {
			// 	var parsedData = JSON.parse(retrievedData);
			// 	// Use the parsedData object as needed
			// }
		},
		handlegetlocalStorage: function (sProperty) {
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			return oStorage.get(sProperty);
		},
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},
		handleDateFormat: function (date) {
			const day = String(date.getDate()).padStart(2, '0');
			const month = String(date.getMonth() + 1).padStart(2, '0'); // Month starts from 0
			const year = date.getFullYear();

			return `${day}-${month}-${year}`;
		},

		handleTimeFormat: function (date) {
			// Assuming you have a SAPUI5 date object
			var sapUIDate = date; // Replace this with your SAPUI5 date object

			// Get hours, minutes, and seconds
			var hours = sapUIDate.getHours();
			var minutes = sapUIDate.getMinutes();
			var seconds = sapUIDate.getSeconds();

			// Format hours, minutes, and seconds to ensure they have two digits
			var formattedHours = String(hours).padStart(2, '0');
			var formattedMinutes = String(minutes).padStart(2, '0');
			var formattedSeconds = String(seconds).padStart(2, '0');

			// Create a string in HH:mm:ss format
			var formattedTime = formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;
			return formattedTime;

		},

		handleOdataDateFormat: function (sDate) {
			// Parse the date string
			var dateString = sDate;
			var parts = dateString.split('/');
			var day = parseInt(parts[0], 10);
			var month = parseInt(parts[1], 10); // Months are zero-based in JavaScript
			var year = parseInt(parts[2], 10);

			// Create a Date object with the parsed date
			var myDate = new Date(year, month, day);

			// Get the current time
			var currentTime = new Date();

			// Set the time part of myDate to the current time
			myDate.setHours(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());

			return myDate;

		},

		handleReturnDateonly: function (oDate) {
			var sapUIDate = oDate; // Replace this with your SAPUI5 date object
			var year = sapUIDate.getFullYear();
			var month = sapUIDate.getMonth();
			var day = sapUIDate.getDate() + 1;

			var dateWithoutTime = new Date(year, month, day);
			return dateWithoutTime;
		},

		formatBytesToMB: function (bytes) {
			var megabytes = bytes / (1024 * 1024);
			return megabytes.toFixed(2) + ' MB';
		},

		extractIndexFromPath: function (path) {
			// Use regular expression to extract the last numeric value from the path
			var match = path.match(/\/(\d+)$/);

			// Check if a match is found
			if (match && match[1]) {
				// Convert the matched value to an integer and return
				return parseInt(match[1], 10);
			}

			// Return null if no match is found
			return null;
		},

		/**
		 * Getter for the resource bundle.
	
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		}

	});

});