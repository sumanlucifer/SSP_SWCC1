function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZCDSV_SS_SERVICES_F4_CDS/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}