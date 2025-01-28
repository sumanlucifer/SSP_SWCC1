sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	'sap/ui/core/BusyIndicator',
	'com/swcc/Template/util/api',
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/Device",
	"sap/m/library",
	"sap/m/MessageStrip",
	"sap/ui/core/Fragment",
	"sap/m/MessageToast",
	"sap/ui/export/Spreadsheet",
        "sap/ui/export/library"
], function (Controller, UIComponent, BusyIndicator, api, JSONModel, MessageBox, History, Device, mobileLibrary, MessageStrip, Fragment, MessageToast, Spreadsheet, exportLibrary) {
	"use strict";

	return Controller.extend("com.swcc.Template.controller.BaseController", {
		getAPI: api,

		// 	___________________________________________________Router Method_________________________________________________________
		getRouter: function () {

			return UIComponent.getRouterFor(this);

		},

		getCurrentUserLoggedIn: function () {
			try {
				var sLoginID = new sap.ushell.services.UserInfo().getId();
				return sLoginID;
			} catch (error) {
				var sLoginID = "WT_POWER";
				//WT_POWER
				//SC_ZMOHAMMED
				//DV_AVERMA
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
		onHandleValueHelpOkPress: function (oModel, sModelPath, aTokens, sKeyProperty, sTextProperty, service) {
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

			//below if else condition i added coz i missed they key value split with ":" which should be with unique
			if (service === "SSA-FIN-3007-1") {
				oModel.setProperty(sModelPath, oData.length === 0 ? "" : `${oData[0][sKeyProperty]}: ${oData[0][sTextProperty]}`);
			} else if (service === "SSA-FIN-3007-2") {
				oModel.setProperty(sModelPath, oData.length === 0 ? "" : `${oData[0][sKeyProperty]}: ${oData[0][sTextProperty]}`);
			} else if (service === "SSA-FIN-3007-3") {
				oModel.setProperty(sModelPath, oData.length === 0 ? "" : `${oData[0][sKeyProperty]}: ${oData[0][sTextProperty]}`);
			} else if (service === "SSA-FIN-3007-4") {
				oModel.setProperty(sModelPath, oData.length === 0 ? "" : `${oData[0][sKeyProperty]}: ${oData[0][sTextProperty]}`);
			} else {
				// Adjust the property path and model based on your use case
				oModel.setProperty(sModelPath, oData.length === 0 ? "" : `${oData[0][sKeyProperty]}- ${oData[0][sTextProperty]}`);
			}

			this._oValueHelpDialog.close();
		},
		onHandleValueHelpCancelPress: function () {
			this._oValueHelpDialog.close();
		},

		handleVHFilterTable: function (oFilter, sType, oTable) {
			var oValueHelpDialog = this._oValueHelpDialog;
			if (!Array.isArray(oTable)) {
				oTable = [oTable];
			}

			if (oValueHelpDialog) {
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
			} else if (oTable) {
				oTable.forEach(function (oTable) {
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
					}
				});

			}

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


		
        /*
          Method for  opening message pop over
              Author: Suman S
              messagePopover, // Instance of the MessagePopover control
              buttonId,       // ID of the button that triggers the MessagePopover
              cReference      // Controller reference where the button and popover are used
  
        */

        openMessagePopover : function (options) {
            const {
                
                buttonId,       // ID of the button that triggers the MessagePopover
                cReference      // Controller reference where the button and popover are used
            } = options;

            const oButton = cReference.byId(buttonId); // Get the button by its ID from the controller

            if (cReference._MessagePopover && oButton) {
                // Check if the button is rendered
                if (!oButton.getDomRef()) {
                    // Attach delegate to open popover after rendering
                    oButton.addEventDelegate({
                        onAfterRendering: function () {
                            cReference._MessagePopover.toggle(oButton);
                        }
                    });
                } else {
                    // Button is already rendered, open or toggle the popover directly
                    cReference._MessagePopover.toggle(oButton);
                }
            }
        },


        /*
           Method for load Fragment
           Author: Suman S
           fragmentPath:  // (string) Path to the fragment file, e.g., "com.example.fragments.MyFragment"
           fragmentId:  // (string) Unique identifier for the fragment instance, used for reference and storage
           cReference:  // (string) Unique identifier for the fragment instance, used for reference and storage
           fragmentType:  // (string, optional) Type of fragment, defaults to "XML"; can be "JS", "HTML" etc.
   
       */

        loadFragment : function (options) {
            const {
                fragmentPath,
                fragmentId,
                cReference,
                fragmentType = "XML"
            } = options;

            const oView = cReference.getView();
            let oFragment = cReference[`_${fragmentId}`];

            if (!oFragment) {
                oFragment = sap.ui[`${fragmentType.toLowerCase()}fragment`](
                    oView.getId(),
                    fragmentPath,
                    cReference
                );
                oView.addDependent(oFragment);
                cReference[`_${fragmentId}`] = oFragment;
            }

            return oFragment;
        },


        /*
            Method to OpenFragment
            Author: Suman S
            fragmentPath: Path of the fragment
            fragmentId: FragmentId to be passed from controller or view
            cReference: Controller Reference
            oEvent: Event of an control
            Ispopover: Set true if to load popover
        */
        openFragment : function (fragmentPath, fragmentId, cReference, oEvent, Ispopover) {
            let oView = cReference.getView(),
            oEventSource;
                if (oEvent) {
                    oEventSource = oEvent.getSource();
                }
            if (!cReference.byId(fragmentId)) {
                Fragment.load({
                    id: oView.getId(),
                    name: fragmentPath,
                    controller: cReference,
                    event: oEvent
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    if (Ispopover) {
                        oDialog.openBy(oEventSource);
                    } else {
                        oDialog.open();
                    }
                });
            } else {
                cReference.byId(fragmentId).open();
            }
        },

        /*
            Method to CloseFragment
            oEvent: Event of an control
        */
        closeFragment : function (oEvent) {
            let dialog = oEvent.getSource().getParent();

            if (!dialog.isOpen)
                dialog = dialog.getParent();

            dialog.close();
            sap.ui.getCore().byId(dialog.sId).destroy(true);
        },

		 /*
            Method to update button Icon Dynamically
            Author: Suman S
            sModelName   (string): The name of the model that contains the messages array.
            sPath        (string): The path to the messages array within the specified model.
            sButtonId    (string): The ID of the button whose icon and type will be updated based on message types.
            cReference   (object): The controller reference, used to access the view and model.
        */

        _updateIcon : function (sModelName, sPath, sButtonId, cReference) {
            // Get the array of messages from the specified model and path
            const aMessages = cReference.getView().getModel(sModelName).getProperty(sPath);
            const oButton = cReference.byId(sButtonId);

            // Filter messages based on MessageType
            const iErrors = aMessages.filter(oMessage => oMessage.MessageType === "E").length; // Errors
            const iWarnings = aMessages.filter(oMessage => oMessage.MessageType === "W").length; // Warnings
            const iSuccess = aMessages.filter(oMessage => oMessage.MessageType === "S").length; // Success

            // Set default icon and type
            let sIcon = "sap-icon://message-information";
            let sButtonType = "Default";  // Default button type

            // Determine the icon and button type based on the message types
            if (iErrors > 0) {
                sIcon = "sap-icon://message-error"; // Error icon
                sButtonType = "Negative"; // Error type (Negative)
            } else if (iWarnings > 0) {
                sIcon = "sap-icon://message-warning"; // Warning icon
                sButtonType = "Attention"; // Warning type (Attention)
            } else if (iSuccess > 0) {
                sIcon = "sap-icon://message-success"; // Success icon
                sButtonType = "Accept"; // Success type (Accept)
            }

            // Update the icon and type of the button
            oButton.setIcon(sIcon);
            oButton.setType(sButtonType);

            // Update the text of the button to show the total number of messages (Errors + Warnings + Success)
            const iTotalMessages = iErrors + iWarnings + iSuccess;
            oButton.setText(iTotalMessages > 0 ? iTotalMessages.toString() : "");
        },

            // error handler method
        handleError : function (oError,cReference) {
            let text;

            try {
                let errorObject = JSON.parse(oError.responseText);
                text = errorObject.error.message.value;
            } catch (e) {
                text = oError.responseText;
            }
            this.getFilterValidations('', { Type: "msgDialog", icon: "error", State: "Error", class: "Error", Text: text }, cReference);
        },


      /*
            Method to read Filter Validations before read or post data
            text: i18n Properties
            msgType: Refers to a types of message as "msgToast", "msgStrip", "msgDialog", "msgBox"
            cReference: Reference Controller
            sCallbackFn: Callback Function
        */
        getFilterValidations : function (text, msgType, cReference, sCallbackFn, title) {
            if (msgType === "msgToast") {
                cReference.oresponse = commonMethod.geti18nText(text, cReference);
                MessageToast.show(cReference.oresponse, {
                    duration: 4500,
                    width: "30rem",
                });
            }
            if (msgType.Type === "msgStrip") {
                MessageStrip({
                    text: msgType.Text,
                    type: "Success"
                })
            }
            if (msgType.Type === "msgDialog") {
                let icon = "sap-icon://" + msgType.icon,
                    that = this;
                if (msgType.Text) {
                    cReference.oresponse = msgType.Text;
                } else {
                    cReference.oresponse = commonMethod.geti18nText(text, cReference);
                }
                this.oDialog = new sap.m.Dialog({
                    content: new sap.m.Text({ text: cReference.oresponse }).addStyleClass("sapUiSmallMarginBottom"),
                    state: msgType.State,
                    customHeader: new sap.m.Bar({
                        contentLeft: [
                            new sap.ui.core.Icon({ src: icon }).addStyleClass("sapMDialogIcon"),
                            new sap.m.Title({ text: that.geti18nText(msgType.State) })
                        ],
                        contentRight: [
                            new sap.ui.core.Icon({
                                color: '#32363a',
                                src: "sap-icon://decline",
                                tooltip: that.geti18nText("close"),
                                press: function (oEvent) {
                                    oEvent.getSource().getParent().getParent().close();
                                }
                            }).addStyleClass("sapUiTinyMarginEnd")
                        ]
                    }).addStyleClass("zDialogBar"),
                    resizable: false,
                    verticalScrolling: false,
                }).addStyleClass("sapMMessageDialog").addStyleClass(msgType.class);
                this.oDialog.open();
            }
            if (msgType === "msgBox") {
                this.msgBoxValidations(text, msgType, cReference, sCallbackFn, title);
            }
        },

        msgBoxValidations : function (text, msgType, cReference, sCallbackFn, title) {
            if (title === "Confirm") {
                MessageBox.confirm(text, {
                    title: "Confirmation",
                    onClose: function (oAction) {
                        if (oAction === "OK" && sCallbackFn) {
                            sCallbackFn(cReference);
                        }
                    },
                    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    emphasizedAction: sap.m.MessageBox.Action.OK,
                    initialFocus: null,
                    textDirection: sap.ui.core.TextDirection.Inherit
                });
            }

            if (title === 'Success') {
                MessageBox.success(text, {
                    title: "title",
                    onClose: function (oAction) {
                        if (oAction === "OK" && sCallbackFn) {
                            sCallbackFn(cReference);
                        }
                    },
                    actions: [sap.m.MessageBox.Action.OK],
                    emphasizedAction: sap.m.MessageBox.Action.OK,
                    initialFocus: null,
                    textDirection: sap.ui.core.TextDirection.Inherit
                });
            }
        },
        /*
            Method to get count of table line item
            tableId: Id of a table
            mName: Model name
            cReference: Controller Reference
        */
        handleTableCount : function (tableId, mName, cReference) {
            let oTable = cReference.getView().byId(tableId);
            let Tablecount;
            let oBinding;
            if (tableId === "idRORTable") {
                oBinding = oTable.getBinding("rows").getContexts();
                if (oBinding.length > 0)
                    Tablecount = oBinding.length;
            } else if (tableId === "idPackingTable") {
                oBinding = oTable.getTable().getItems();
                Tablecount = oBinding.length;
            }
            else {
                oBinding = oTable.getBinding("items");
                if (!oBinding)
                    Tablecount = oBinding.getLength();
            }
            cReference.getOwnerComponent().getModel(mName).setProperty("/Tablelength", Tablecount);
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
             //   Binary content to PDF
	       convertingBinarytoPDF :  function(binaryContent){
            let fileContent = binaryContent;
            let decodedPdfContent = atob(fileContent);
            let byteArray = new Uint8Array(decodedPdfContent.length);
            for (let i = 0; i < decodedPdfContent.length; i++) {
                byteArray[i] = decodedPdfContent.charCodeAt(i);
            }
            let blob = new Blob([byteArray.buffer], {
                type: 'application/pdf',
            });
            let _pdfurl = URL.createObjectURL(blob);
            commonMethod.printPdf(_pdfurl);
        },
               // to print PDF 
	 printPdf : function (sUrl) {
            try {
                let iframe = document.createElement("iframe");
                iframe.setAttribute('id', 'pdfPreviewFrame');
                iframe.style.display = "none";
                iframe.src = sUrl;
                document.body.appendChild(iframe);

                iframe.onload = () => {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                }

            } catch (err) {
                MessageBox.error(err);
            }
        },

        /*
            Method to read I18n Texts either from Library/Controller message bundle
            idText: I18n property name
            cReference: Reference Controller (To be passed if text to be fetched from controller message bundle)
        */
        geti18nText = function (idText, cReference, ...[param1, param2]) {
            let that;
            if (!cReference) {
                //If controller reference is not passed, get library's resource bundle
                if (!this.resourceBundle) {
                    this.resourceBundle = sap.ui.getCore().getLibraryResourceBundle("com.apple.ui.ewm.global.lib.reuselib");
                }
                that = this;
            } else {
                //Controller reference passed, get controller's resource bundle
                if (!cReference.resourceBundle) {
                    cReference.resourceBundle = cReference.getOwnerComponent().getModel("i18n").getResourceBundle();
                }
                that = cReference;
            }
            return that.resourceBundle.getText(idText, ...[param1, param2]);

        },

		
     // Metadata loading check 
      metadataCheck : function (cReference, oModel, successCallBackFn, errorCallBackFn, oRoute) {
            oModel?.metadataLoaded(true).then(
                function () {
                    // model is ready now
                    successCallBackFn(cReference, oRoute);
                },
                function () {
                    errorCallBackFn(cReference);
                });
        },
         // URL search params navigation.
          navigateToUserDefaults = function () {
            let redirectUrl;

            if (window.location.origin.includes('epweb')) {
                redirectUrl = `${window.location.origin}/irj/portal/ewm/default_settings`;
            } else {
                redirectUrl = `${window.location.origin}/userpreferences/index.html`;
            }

            location.replace(redirectUrl);
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
		// ___________________________File Exceed Error _______________________________
		handleFileSizeExceedScm: function () {
			return MessageBox.error("File size exceeded, Please upload file upto 5MB.");
		},

		
		// ____________________________________________________ Excel Direct file posting to backend via Slug___________________________________________________
    handleFileUpload: function (oFileUploader, uploadUrl, appId, token, onSuccess, onError) {
    var file = oFileUploader.oFileUpload.files[0];
    jQuery.ajax({
        type: 'POST',
        url: uploadUrl,
        cache: false,
        useMultipart: false,
        contentType: "application/xlsx",
        processData: false,
        data: file,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-CSRF-Token", token);
            xhr.setRequestHeader("slug", oFileUploader.getValue());
            xhr.setRequestHeader("Content-Type", "application/xlsx");
            xhr.setRequestHeader("appid", appId);
        },
        success: function (data, response) {
            sap.m.MessageToast.show("File upload Successful");
            oFileUploader.setValue('');
            if (onSuccess) onSuccess(data, response);
        },
        error: function (error) {
            sap.m.MessageToast.show("File upload failed");
            oFileUploader.setValue('');
            if (onError) onError(error);
        }
    });
},

// Reusable function to handle upload complete
genericHandleUploadComplete: function (oEvent) {
    var sResponse = oEvent.getParameter("response"),
        iHttpStatusCode = parseInt(/\d{3}/.exec(sResponse)[0]),
        sMessage;

    if (sResponse) {
        sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
        sap.m.MessageToast.show(sMessage);
    }
},

// Example usage for the above method:
// uploadFile: function (oEvent) {
//     var oFileUploader = this.getView().byId("fileUploader");
//     var token = this.getView().getModel().getSecurityToken();
//     var appId = this.getView().getModel("busyModel").getData().appId;
//     var oUploadURL = "/ui5_pp/sap/opu/odata/sap/zod_ac_itc_srv/ITCUploadFileSet";

//     this.handleFileUpload(oFileUploader, oUploadURL, appId, token, function () {
//         this.bFileUploaded = true;
//         this.setRefreshInterval();
//         this.onRefresh();
//     }.bind(this), function (error) {
//         console.error("Upload failed", error);
//     });
// },

// handleUploadComplete: function (oEvent) {
//     this.genericHandleUploadComplete(oEvent);
// }

		
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
			var myDate = new Date(year, month - 1, day);

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

		handleReturnDateonly1: function (oDate) {
			var sapUIDate = oDate; // Replace this with your SAPUI5 date object
			var year = sapUIDate.getFullYear();
			var month = sapUIDate.getMonth();
			var day = sapUIDate.getDate() + 1;
			var sDate = `${day}/${month}/${year}`;
			var sDate = this.handleOdataDateFormat(sDate);
			return sDate;
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
		_handleError: function (error) {
			// Call the error handler object to handle the error
			var errorHandler = this.getOwnerComponent().getErrorHandler();
			if (errorHandler) {
				errorHandler._showServiceError(error);
			}
		},

		handleRegexforremovedash: function (sVal) {

			// Pattern for text2
			const pattern2 = /v-\d+/;
			const match2 = sVal.match(pattern2);

			if (match2) {
				console.log("Match 2:", match2[0]); // Output: v-1010
				return match2[0];
			} else {
				return sVal.split("-")[0];

			}

		},
		/**
			 * Getter for the resource bundle.
	
			 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		}

	});

});
