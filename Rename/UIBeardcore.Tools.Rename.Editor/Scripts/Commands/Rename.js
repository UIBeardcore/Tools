Type.registerNamespace("UIBeardcore.Tools.Commands");

/**
 * Implements the paste command
 */
UIBeardcore.Tools.Commands.BeardcoreRename = function Commands$BeardcoreRename(name)
{
	Type.enableInterface(this, "UIBeardcore.Tools.Commands.BeardcoreRename");
	this.addInterface("Tridion.Cme.Command", [(name || "BeardcoreRename"), $const.AllowedActions.Edit]);
};

/**
 * Returns a value indicating whether this command can applicable for the selected item(s)
 * @param {Tridion.Core.Selection} selection The current selection
 * @returns {Boolean} <c>true</c> if this command can be executed; otherwise false.
 */
UIBeardcore.Tools.Commands.BeardcoreRename.prototype._isAvailable = function BeardcoreRename$_isAvailable(selection)
{
	if (selection && (selection.dataSourceImplementsOneOfInterfaces(["Tridion.ContentManager.ListClassifiedTcmItems",
		"Tridion.ContentManager.ListSearchTcmItems", "Tridion.ContentManager.ListProcessAssociations",
		"Tridion.ContentManager.ListProcessHistories"])))
	{
		return false;
	}

	return this.callBase("Tridion.Cme.Command", "_isAvailable", [selection]);
};

UIBeardcore.Tools.Commands.BeardcoreRename.prototype._isEnabled = function BeardcoreRename$_isEnabled(selection)
{
	return this.callBase("Tridion.Cme.Command", "_isEnabled", arguments);
};

/**
 * Executes this command on the selection.
 * @param {Tridion.Core.Selection} selection The current selection.
 */
UIBeardcore.Tools.Commands.BeardcoreRename.prototype._execute = function BeardcoreRename$_execute(selection)
{
	if (selection && selection.getCount() > 0)
	{
		var modalPopup = $popupManager.createExternalContentPopup(
			UIBeardcore.Tools.Rename.Popups.RENAME_DIALOG.URL,
			UIBeardcore.Tools.Rename.Popups.RENAME_DIALOG.PARAMETERS,
			{
				itemIds: selection.getItems().slice(),
				popupType: Tridion.Controls.Popup.Type.MODAL_IFRAME
			});

		function Translate$_execute$onCreationOptionsLoaded_closePopup(event)
		{
			modalPopup.close();
		};

		function Translate$_execute$onCreationOptionsLoaded_disposePopup(event)
		{
			(event && event.source) && event.source.dispose();
		};

		$evt.addEventHandler(modalPopup, "rename", function Translate$_execute$onCreationOptionsLoaded$_onAddToExisting(event)
		{
			UIBeardcore.Tools.Commands.BeardcoreRename._renameItems(selection, event && event.data);

			Translate$_execute$onCreationOptionsLoaded_closePopup();
		});

		$evt.addEventHandler(modalPopup, "closed", Translate$_execute$onCreationOptionsLoaded_disposePopup);
		$evt.addEventHandler(modalPopup, "cancel", Translate$_execute$onCreationOptionsLoaded_closePopup);

		modalPopup.open();
	}
};


/**
 * Renames items.
 * @param {Tridion.Core.Selection} selection The current selection.
 */
UIBeardcore.Tools.Commands.BeardcoreRename._renameItems = function BeardcoreRename$_renameItems(selection, renameInstructions)
{
	// Multiple items
	var items = selection.getItems();
	var itemsCount = items.length;

	var op = $models.$beardcore.createMultipleOperations(items);

	function Command$BeardcoreRename$execute$onRenameCommandUpdated(args)
	{
		// This is auto triggered
		var itemsDone = args.data.itemsSucceed || msg.getItemsDoneCount();
		msg.setTitle("Renaming items... {0}/{1} done.".format(itemsDone, itemsCount));
	};


	var msg = $messages.registerProgress(
		"Renaming {0} Items.. ".format(itemsCount),
		null,
		true);

	//var jobId = msg.getId();
	msg.setOnSuccessMessage("{0} Items renamed ".format(itemsCount));
	msg.setOnCancelMessage("Rename canceled");

	msg.setContinuousIterationObject(op.getId(), itemsCount);

	//$evt.addEventHandler(msg, "error", onPasteCommandFailed);
	$evt.addEventHandler(msg, "update", Command$BeardcoreRename$execute$onRenameCommandUpdated);

	//public struct RenameOptions
	//{
	//	[DataMember]
	//	public string NewNameMarkup;

	//	[DataMember]
	//	public RenameFileNameOptions RenameOption;

	//	[DataMember]
	//	public bool AddSequentialNumbers;

	//	[DataMember]
	//	public int NumberOfDigits;

	//	[DataMember]
	//	public int StartNumberingAt;

	//	[DataMember]
	//	public bool DisplayNumbersAtTheEndOfFile;
	//}

	op.rename(items, renameInstructions, true);
};