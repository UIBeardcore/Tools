Type.registerNamespace("UIBeardcore.Tools.Rename.Views.Popups");

UIBeardcore.Tools.Rename.Views.Popups.RenameDialog = function ExternalContentLibrary$RenameDialog()
{
	Tridion.OO.enableInterface(this, "UIBeardcore.Tools.Rename.Views.Popups.RenameDialog");
	this.addInterface("Tridion.Controls.ModalPopupView");
	this.addInterface("Tridion.Cme.View");

	var p = this.properties;

	p.itemIds = undefined;
};

UIBeardcore.Tools.Rename.Views.Popups.RenameDialog.prototype.initialize = function RenameDialog$initialize()
{
    this.callBase("Tridion.Cme.View", "initialize");

    var p = this.properties;
    var c = p.controls;

    var args = window.dialogArguments;
    p.itemIds = args && args.itemIds;

	var itemsCount = p.itemIds && p.itemIds.length;
	if (itemsCount > 0)
	{
		c.elementsSelectedLabel = $("#ElementsSelectedLabel");
		$dom.setInnerText(c.elementsSelectedLabel, "{0} items selected".format(p.itemsCount || 0));

		c.newFileName = $("#NewFileName");
		$evt.addEventHandler(c.newFileName, "valuepropertychange", this.getDelegate(this._generatePreview));

		c.replaceExisting = $("#ReplaceExisting");
		c.predeceExisting = $("#PredeceExisting");
		c.followExisting = $("#FollowExisting");

		$evt.addEventHandler(c.replaceExisting, "change", this.getDelegate(this._updateControlsState));
		$evt.addEventHandler(c.predeceExisting, "change", this.getDelegate(this._updateControlsState));
		$evt.addEventHandler(c.followExisting, "change", this.getDelegate(this._updateControlsState));

		c.addSequentialNumbers = $("#AddSequentialNumbers");
		$evt.addEventHandler(c.addSequentialNumbers, "click", this.getDelegate(this._updateControlsState));

		c.numberOfDigits = $("#NumberOfDigits");
		c.startNumberingAt = $("#StartNumberingAt");
		c.beginningOf = $("#BeginningOf");
		c.endOf = $("#EndOf");

		$evt.addEventHandler(c.beginningOf, "change", this.getDelegate(this._generatePreview));
		$evt.addEventHandler(c.endOf, "change", this.getDelegate(this._generatePreview));

		$evt.addEventHandler(c.numberOfDigits, "valuepropertychange", this.getDelegate(this._generatePreview));
		$evt.addEventHandler(c.startNumberingAt, "valuepropertychange", this.getDelegate(this._generatePreview));

		c.previewArea = $("#PreviewArea");

		$controls.getControl($("#Stack"), "Tridion.Controls.Stack");

		c.BtnRename = $controls.getControl($("#Rename"), "Tridion.Controls.Button");
		c.BtnCancel = $controls.getControl($("#Cancel"), "Tridion.Controls.Button");

		$evt.addEventHandler(c.BtnRename, "click", this.getDelegate(this._onRenameClick));
		$evt.addEventHandler(c.BtnCancel, "click", this.getDelegate(this._onCloseClick));

		this.updateView();
	}
	else
	{
		this._onCloseClick();
	}
};

UIBeardcore.Tools.Rename.Views.Popups.RenameDialog.prototype.getItem = function RenameDialog$getItem()
{
	return $models.getItem(this.properties.itemIds[0]);
};

/**
 * Updating Rating representation in View.
 */
UIBeardcore.Tools.Rename.Views.Popups.RenameDialog.prototype.updateView = function RenameDialog$updateView()
{
	var p = this.properties;
	var c = p.controls;

	var item = this.getItem();
	c.newFileName.value = item && (item.getTitle() || item.getStaticTitle()) || "File Name";
	
	this._updateControlsState();
};

UIBeardcore.Tools.Rename.Views.Popups.RenameDialog.prototype._updateControlsState = function RenameDialog$_updateControlsState()
{
	var p = this.properties;
	var c = p.controls;

	var itemsCount = p.itemIds && p.itemIds.length;
	if (itemsCount > 1)
	{
		c.newFileName.disabled = false;

		c.replaceExisting.disabled = false;
		c.predeceExisting.disabled = false;
		c.followExisting.disabled = false;

		if (c.replaceExisting.checked)
		{
			c.addSequentialNumbers.disabled = true;
			c.addSequentialNumbers.checked = true;
		}
		else
		{
			c.addSequentialNumbers.disabled = false;
		}

		c.numberOfDigits.disabled = !c.addSequentialNumbers.checked;
		c.startNumberingAt.disabled = !c.addSequentialNumbers.checked;
		c.beginningOf.disabled = !c.addSequentialNumbers.checked;
		c.endOf.disabled = !c.addSequentialNumbers.checked;
	}
	else
	{
		c.newFileName.disabled = !(itemsCount > 0);

		c.addSequentialNumbers.disabled = true;

		c.replaceExisting.disabled = true;
		c.predeceExisting.disabled = true;
		c.followExisting.disabled = true;

		c.numberOfDigits.disabled = true;
		c.startNumberingAt.disabled = true;
		c.beginningOf.disabled = true;
		c.endOf.disabled = true;
	}

	this._generatePreview();
};

UIBeardcore.Tools.Rename.Views.Popups.RenameDialog.prototype.getInstructions = function RenameDialog$getInstructions()
{
	var p = this.properties;
	var c = p.controls;
	var instructions = {
		NewNameMarkup: c.newFileName.value,
		ItemsCount: p.itemsCount,
		RenameOption: c.predeceExisting.checked ? -1 : c.followExisting.checked ? 1 : 0,
		AddSequentialNumbers: c.addSequentialNumbers.checked,
		NumberOfDigits: c.numberOfDigits.value | 0,
		StartNumberingAt: c.startNumberingAt.value | 0,
		DisplayNumbersAtTheEndOfFile: !c.beginningOf.checked
	};

	return instructions;
}

UIBeardcore.Tools.Rename.Views.Popups.RenameDialog.prototype._onRenameClick = function RenameDialog$_onRenameClick(e)
{
	this.fireEvent("rename", this.getInstructions());
};

UIBeardcore.Tools.Rename.Views.Popups.RenameDialog.prototype._onCloseClick = function RenameDialog$_onCloseClick(e)
{
	this.fireEvent("cancel");
};

UIBeardcore.Tools.Rename.Views.Popups.RenameDialog.prototype._generatePreview = function RenameDialog$_generatePreview(e)
{
	var p = this.properties;
	var preArea = p.controls.previewArea;

	var instructions = this.getInstructions();

	var previewItems = [];
	var newName = instructions && instructions.NewNameMarkup;
	if (newName)
	{
		for (var i = 0, l = p.itemIds.length; i < l; i++)
		{
			var item = $models.getItem(p.itemIds[i]);
			var titleMarkup = item.getTitle() || item.getStaticTitle() || "Item Title";
			switch (instructions.RenameOption)
			{
				case -1:
					titleMarkup = newName + titleMarkup;
					break;
				case 1:
					titleMarkup = titleMarkup + newName;
					break;
				case 0:
				default:
					titleMarkup = newName;
					break;
			}

			if (instructions.AddSequentialNumbers)
			{
				var numberMarkup = +(instructions.StartNumberingAt || 0) + i;
				var s = instructions.NumberOfDigits - (numberMarkup + "").length;
				if (s > 0)
				{
					numberMarkup = (new Array(1 + s)).join("0") + numberMarkup;
				}

				if (instructions.DisplayNumbersAtTheEndOfFile)
				{
					titleMarkup = titleMarkup + numberMarkup;
				}
				else
				{
					titleMarkup = numberMarkup + titleMarkup;
				}
			}

			previewItems.push(titleMarkup);
		}
	}

	preArea.innerHTML = previewItems.join("\n");
};

UIBeardcore.Tools.Rename.Views.Popups.RenameDialog.prototype.disposeInterface = Tridion.OO.nonInheritable(function RenameDialog$disposeInterface()
{

});

$display.registerView(UIBeardcore.Tools.Rename.Views.Popups.RenameDialog);