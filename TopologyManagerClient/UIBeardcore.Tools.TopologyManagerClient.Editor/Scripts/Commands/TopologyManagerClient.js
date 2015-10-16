Type.registerNamespace("UIBeardcore.Tools.Commands");

/**
 * Implements the paste command
 */
UIBeardcore.Tools.Commands.BeardcoreTopologyManagerClient = function Commands$BeardcoreTopologyManagerClient(name)
{
	Tridion.OO.enableInterface(this, "UIBeardcore.Tools.Commands.BeardcoreTopologyManagerClient");
	this.addInterface("Tridion.Web.UI.Editors.Base.Commands.CommandBase", [name]);
};

/**
 * Returns a value indicating whether this command can applicable for the selected item(s)
 * @param {Tridion.Core.Selection} selection The current selection
 * @returns {Boolean} <c>true</c> if this command can be executed; otherwise false.
 */
UIBeardcore.Tools.Commands.BeardcoreTopologyManagerClient.prototype._isAvailable = function BeardcoreTopologyManagerClient$_isAvailable(selection)
{
	return Tridion.ContentManager.UserSettings.getInstance().isAdministrator();

	//if (selection && (selection.dataSourceImplementsOneOfInterfaces(["Tridion.ContentManager.ListClassifiedTcmItems",
	//	"Tridion.ContentManager.ListSearchTcmItems", "Tridion.ContentManager.ListProcessAssociations",
	//	"Tridion.ContentManager.ListProcessHistories"])))
	//{
	//	return false;
	//}

	//return this.callBase("Tridion.Cme.Command", "_isAvailable", [selection]);
};

UIBeardcore.Tools.Commands.BeardcoreTopologyManagerClient.prototype._isEnabled = function BeardcoreTopologyManagerClient$_isEnabled(selection)
{
	//return this.callBase("Tridion.Cme.Command", "_isEnabled", arguments);
	return true;
};

/**
 * Executes this command on the selection.
 * @param {Tridion.Core.Selection} selection The current selection.
 */
UIBeardcore.Tools.Commands.BeardcoreTopologyManagerClient.prototype._execute = function BeardcoreTopologyManagerClient$_execute(selection)
{
	//if (selection && selection.getCount() > 0)
	{
		
		var modalPopup = $popupManager.createDisposingExternalContentPopup(
			UIBeardcore.Tools.TopologyManagerClient.Popups.TTM_CLIENT_DIALOG.URL,
			UIBeardcore.Tools.TopologyManagerClient.Popups.TTM_CLIENT_DIALOG.PARAMETERS,
			{
				//itemIds: selection.getItems().slice(),
				popupType: Tridion.Controls.PopupManager.Type.MODAL_IFRAME
			});

		modalPopup.open();
	}
};