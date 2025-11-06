sap.ui.define(['sap/ui/core/mvc/ControllerExtension'], function (ControllerExtension) {
	'use strict';

	return ControllerExtension.extend('com.redbull.sb.umdlpartner4.umdlpartner4.ext.controller.MyExtensionTable', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf com.redbull.sb.umdlpartner4.umdlpartner4.ext.controller.MyExtensionTable
             */
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();

			},
			onBeforeRendering: function (oEvent) {

				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oBindingParams = oEvent.getParameter("bindingParams");
				// add new sorters
				//oBindingParams.sorter.push(new sap.ui.model.Sorter("MyNewField", false));
			},
			onAfterRendering: function (oEvent) {

				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oBindingParams = oEvent.getParameter("bindingParams");
				// add new sorters
				//oBindingParams.sorter.push(new sap.ui.model.Sorter("MyNewField", false));

				var oView = this.getView();
				var oTable1 = oView.byId("fe::table::Partner4::LineItem::Table");
				oTable1.getBinding("content");
				var oTable = oView.byId('fe::table::Partner4::LineItem');
				oTable.attachModelContextChange(function () {

				});
				this.base.getExtensionAPI().getModel().attachDataReceived(this._onDataReceived.bind(this));
			}
		},
		_onDataReceived: function (oEvent) {

			var Context = //oEvent.getSource().getContexts()[0];
				oEvent.getSource().getCurrentContexts()[0];

			var oView = this.getView();
			//var oTable1 = oView.byId("fe::table::Partner4::LineItem::Table");
			var oTable = oView.byId('fe::table::Partner4::LineItem');
			debugger;
			oTable.getColumns().forEach(function (oColumn) {
				var hidden = Context.getProperty('HD' + oColumn.getProperty('dataProperty'));
				if (hidden) {
										oColumn.getTable().removeColumn(oColumn);
					oColumn.setWidth("0px");
					oColumn.setVisible(false);

				}
			});

		},
		uploadExcelDialog: async function () {
			const extensionApi = this.base.getExtensionAPI();
			let uploadFileDialog = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("idFileDialog", "idFileDialog"));
			if (!uploadFileDialog) {
				uploadFileDialog = await extensionApi.loadFragment({
					id: "idFileDialog",
					name: "com.redbull.sb.umdlpartner3.ext.fragment.uploadFileDialog",
					type: "XML",
					controller: this
				});
			}
			uploadFileDialog.open();
		},
		onCancelPress: function () {
			const extensionApi = this.base.getExtensionAPI();
			const oDialog1 = this.byId(sap.ui.core.Fragment.createId("idFileDialog", "idFileDialog"));
			const oDialog2 = this.byId("idFileDialog");
			const oDialog3 = sap.ui.core.Fragment.byId("idFileDialog", "idFileDialog");
			const oDialog = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("idFileDialog", "idFileDialog"));
			oDialog.close();
		},
		FileContent: {
			fileTYpe: null,
			fileName: null,
			fileContent: null
		},
		onFileChange: function (oEvent) {
			debugger;
			var file = oEvent.getParameter("files")[0];
			if (file === undefined) {
				return;
			}
			this.FileContent.fileType = file.type;  //mimetype or file type
			this.FileContent.fileName = file.name;
			//Instantiate JavaScript FileReader API
			let fileReader = new FileReader();
			//Read file content using JavaScript FileReader API
			let readFile = function onReadFile(file) {
				return new Promise(function (resolve) {
					fileReader.onload = function (loadEvent) {
						resolve(loadEvent.target.result.match(/,(.*)$/)[1]);
					};
					fileReader.readAsDataURL(file);
				});
			};
			debugger;
			readFile(file).then(function (result) {
				this.FileContent.fileContent = result;
			}.bind(this));
			//Assign the file content to variable
			//new Action(readFile(file)).executeWithBusyIndicator().then(function (result) {
			//	fileContent = result;
			//})
		},
		onUploadPress: function (oEvent) {
			var oResourceBundle = this.base.getView().getModel("i18n").getResourceBundle();
			//check file has been entered
			if (this.FileContent === undefined || this.FileContent.fileContent === undefined || this.FileContent.fileContent === "") {
				MessageToast.show(oResourceBundle.getText("uploadFileErrMsg"));
				return;
			}

			var oModel = this.base.getExtensionAPI().getModel();
			debugger;
			var oOperation = oModel.bindContext("/Partner4" + "/com.sap.gateway.srvd.y0sd_umdl_partner.v0001." + "fileUpload(...)");

			var fnSuccess = function () {
				oModel.refresh();
				MessageToast.show(oResourceBundle.getText("uploadFileSuccMsg"));
				const oDialog = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("idFileDialog", "idFileDialog"));
				oDialog.close();
				sap.ui.getCore().byId(sap.ui.core.Fragment.createId("idFileDialog", "idFileUpload")).clear()
				oDialog.destroy();
				window.location.reload();
			}.bind(this);

			var fnError = function (oError) {
				this.base.editFlow.securedExecution(
					function () {
						Messaging.addMessages(
							new sap.ui.core.message.Message({
								message: oError.message,
								target: "",
								persistent: true,
								type: sap.ui.core.MessageType.Error,
								code: oError.error.code
							})
						);
						var aErrorDetail = oError.error.details;
						aErrorDetail.forEach((error) => {
							Messaging.addMessages(
								new sap.ui.core.message.Message({
									message: error.message,
									target: "",
									persistent: true,
									type: sap.ui.core.MessageType.Error,
									code: error.code
								})
							);
						})
					}
				);
				const oDialog = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("idFileDialog", "idFileDialog"));
				oDialog.close();
				sap.ui.getCore().byId(sap.ui.core.Fragment.createId("idFileDialog", "idFileUpload")).clear()
				oDialog.destroy();
				//fileContent = undefined;
			}.bind(this);

			oOperation.setParameter("MimeType", this.FileContent.fileType);
			oOperation.setParameter("FileName", this.FileContent.fileName);
			oOperation.setParameter("FileContent", this.FileContent.fileContent);
			
			oOperation.setParameter("FileExtension", this.FileContent.fileName);
			

			//oOperation.setParameter("process", sProcess);
			oOperation.execute().then(fnSuccess, fnError);
		},
		onTempDownload: function (oEvent) {
			var oModel = this.base.getExtensionAPI().getModel(),
				oResourceBundle = this.base.getView().getModel("i18n").getResourceBundle();

			var oModel = this.base.getExtensionAPI().getModel(),
				oResourceBundle = this.base.getView().getModel("i18n").getResourceBundle();

			var oOperation = oModel.bindContext("/Partner4" + "/com.sap.gateway.srvd.y0sd_umdl_partner.v0001." + "fileDownload(...)");

			//Success function to display success messages from OData Operation
			var fnSuccess = function () {
				var oResults = oOperation.getBoundContext().getObject();

				var aUint8Array = Uint8Array.from(atob(oResults.FileContent), c => c.charCodeAt(0)),
					oblob = new Blob([aUint8Array], { type: oResults.MimeType });

				File.save(oblob, oResults.FileName, oResults.FileExtension, oResults.MimeType);
				MessageToast.show(oResourceBundle.getText("downloadSuccMsg"));
			}.bind(this);

			//Error function to display error messages from OData Operation
			var fnError = function () {
				this.base.editFlow.securedExecution(
					function () {
						Messaging.addMessages(
							new sap.ui.core.message.Message({
								message: oError.message,
								target: "",
								persistent: true,
								type: sap.ui.core.MessageType.Error,
								code: oError.error.code
							})
						);
						var aErrorDetail = oError.error.details;
						aErrorDetail.forEach((error) => {
							Messaging.addMessages(
								new sap.ui.core.message.Message({
									message: error.message,
									target: "",
									persistent: true,
									type: sap.ui.core.MessageType.Error,
									code: error.code
								})
							);
						})
					}
				);
			}.bind(this);

			// Execute OData V4 operation i.e a static function 'downloadFile' to download the excel template
			oOperation.execute().then(fnSuccess, fnError)
                        // From UI5 version 1.123.0 onwards use invoke function
			//oOperation.invoke().then(fnSuccess, fnError);
		}
	});
});
