Type.registerNamespace("UIBeardcore.Tools.TopologyManagerClient.Views.Popups");

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog = function ExternalContentLibrary$TopologyManagerClientDialog()
{
	Tridion.OO.enableInterface(this, "UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog");
	this.addInterface("Tridion.Web.UI.Editors.Base.Views.ViewBase");

	var p = this.properties;
	p.definitionsXml = undefined;
	p.selectedType = undefined;

	var c = p.controls;

	c.buttonClose = undefined;
	c.buttonBackToSection = undefined;
	c.AddNewItem = undefined;
	c.buttonCloseError = undefined;
	c.buttonConfirm = undefined;

	c.listItems = undefined;
	c.elementsBody = undefined;

};

/**
 * Defines the List approval statuses definition Path
 */
UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.definitionsPath = $config.expandEditorPath("Xml/ListDefinitions/ListDefinitions.xml", "UIBeardcore.Tools.TopologyManagerClient");

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype.initialize = function TopologyManagerClientDialog$initialize()
{
    var p = this.properties;
    var c = p.controls;

    c.listItems = $controls.getControl($("#TtmList"), "Tridion.Controls.DrilldownList");
    $evt.addEventHandler(c.listItems, "*", this.getDelegate(this._onListEvent));
    
	c.buttonClose = $controls.getControl($("#Close"), "Tridion.Controls.Button");
	$evt.addEventHandler(c.buttonClose, "click", this.getDelegate(this._onCloseClick));

	c.buttonAddNewItem = $controls.getControl($("#AddNewItem"), "Tridion.Controls.Button");
	$evt.addEventHandler(c.buttonAddNewItem, "click", this.getDelegate(this._onAddNewItemClick));

	c.buttonConfirm = $controls.getControl($("#ItemConfirm"), "Tridion.Controls.Button");
	$evt.addEventHandler(c.buttonConfirm, "click", this.getDelegate(this._onConfirmClick));

	c.buttonBackToSection = $controls.getControl($("#BackToSection"), "Tridion.Controls.Button");
	$evt.addEventHandler(c.buttonBackToSection, "click", this.getDelegate(this._onBackToSectionClick));

	c.buttonCloseError = $controls.getControl($("#CloseError"), "Tridion.Controls.Button");
	$evt.addEventHandler(c.buttonCloseError, "click", this.getDelegate(this._onCloseErrorClick));

	c.listItems.setLoading(true);

	c.elementsBody = $(".container");
	$evt.addEventHandler(c.elementsBody, "click", this.getDelegate(this._onBodyClick));

	c.itemDialog = $(".itemdialog ");
	c.errorDialog = $(".error-message ");

	$dom.disableSelection($("html"));

	if (!p.definitionsXml)
	{
		$xml.loadXmlDocument(UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.definitionsPath,
				this.getDelegate(function TopologyManagerClientDialog$_onListDefinitionLoaded(definition)
				{
					p.definitionXml = definition;
					this._renderList();
				}),
				this.getDelegate(function ApprovalStatus$_onListDefinitionLoadFailed()
				{
					Tridion.Core.MessageLog.message("TopologyManagerClientDialog::_onListDefinitionLoadfailed Failed to load list definition.");
				}));
	}
	else
	{
		this._renderList();
	}

	this.callBase("Tridion.Web.UI.Editors.Base.Views.ViewBase", "initialize");
};

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype.getListProviderInstance = function TopologyManagerClientDialog$getListProviderInstance()
{
	return UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider.getInstance();
};

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype._renderList = function TopologyManagerClientDialog$_renderList()
{
	var p = this.properties;
	if (p.definitionXml && p.selectedType)
	{
		var c = p.controls;
		var listControl = c.listItems;
		listControl.setLoading(true);

		var renderListOnLoad = this.getDelegate(function(listData)
		{
			listControl.draw($xml.getNewXmlDocument(listData), "", true, p.definitionXml, true);
			listControl.setLoading(false);
		});

		this.getListProviderInstance().loadTtmList(p.selectedType,
			renderListOnLoad,
			this.getDelegate(function onLoadFailed(error)
			{
				this._onTtmInfoLoadFailed(error);
				this._deinitializeElements();
			}));
	}
};

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype._onListEvent = function TopologyManagerClientDialog$_onListEvent(e)
{
	switch (e && e.type)
	{
		case "refresh":
			this._renderList();
			break;
		case "itemactivate":
			var list = this.properties.controls.listItems;
			this._activateEditDialog(list.getDefinition().selectNode(list.getContent(), list.getSelection().getItem(0)));
			break;
		default:
			break;
	}
};

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype._activateEditDialog = function TopologyManagerClientDialog$_activateEditDialog(itemNode)
{
	if (!this._isDialogActive() && itemNode)
	{
		var dialog = this.properties.controls.itemDialog;
		$css.addClass(dialog, "active");

		this._populateDialogData(itemNode);
	}
};

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype._activateAddDialog = function TopologyManagerClientDialog$_activateAddDialog(itemType)
{
	if (!this._isDialogActive() && itemType)
	{
		var dialog = this.properties.controls.itemDialog;
		$css.addClass(dialog, "active", "loading");

		this.getListProviderInstance().loadFieldStructure(itemType,
						this.getDelegate(function onLoad(data)
						{
							this._populateDialogData($xml.getNewXmlDocument(data).documentElement);
						}),
						this.getDelegate(this._onTtmInfoLoadFailed));
	}
};

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype._populateDialogData = function TopologyManagerClientDialog$_populateDialogData(itemNode)
{
	if (this._isDialogActive() && itemNode)
	{
		var dialog = this.properties.controls.itemDialog;

		var dialogFieldsSection = $(".fields", dialog);
		var el = $dom.getFirstElementChild(itemNode);
		while (el)
		{
			dialogFieldsSection.appendChild(this.createFieldElement(Tridion.Utils.Dom.getLocalName(el), el));
			el = $dom.getNextElementSibling(el);
		}
	}
};

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype._deactivateDialog = function TopologyManagerClientDialog$_deactivateDialog()
{
	if (this._isDialogActive())
	{
		var dialog = this.properties.controls.itemDialog;
		var dialogFieldsSection = $(".fields", dialog);
		dialogFieldsSection.innerHTML = "";
		$css.removeClass(dialog, "active", "loading");
	}
};


/**
 * Static method for creating control's HTML layout.
 * @param {Object} settings The initial settings values.
 * @returns {HTMLElement} The HTML element which will represent this control.
 */
UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype.createFieldElement = function ExternalLinkControl$createFieldElement(id, node)
{
	var element = document.createElement("div");
	element.className = "field";

	var label = document.createElement("label");
	label.setAttribute("for", id);
	$dom.setInnerText(label, id);
	element.appendChild(label);

	var input = document.createElement("input");
	input.id = id;
	input.value = Array.prototype.map.call(node.childNodes, function(node)
	{
		return $xml.getInnerText(node).trim();
	}).filter(String).join(", ");
	element.appendChild(input);

	var subInfo = document.createElement("span");
	switch (node.getAttribute("type"))
	{
		case "array":
			$dom.setInnerText(subInfo, "Comma separated values");
			break;
		case "object":
			$dom.setInnerText(subInfo, "JSON object notation");
			break;
		case "text":
		default:
			break;
	}

	element.appendChild(subInfo);

	return element;
};


UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype.deleteTtmItem = function TopologyManagerClientDialog$deleteTtmItem(itemId)
{
	var type = this.properties.selectedType;
	if (type && itemId && confirm(Tridion.Utils.String.format("Delete `{0}` with id `{1}` ?", type, itemId)))
	{
		this.getListProviderInstance().deleteTtmItem(
			type,
			itemId,
			this.getDelegate(this._renderList),
			this.getDelegate(this._onTtmInfoLoadFailed));
	}
};

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype._onTtmInfoLoadFailed = function TopologyManagerClientDialog$_onTtmInfoLoadFailed(error)
{
	Tridion.Core.MessageLog.message(error);

	if (!this._isErrorDialogActive())
	{
		var dialog = this.properties.controls.errorDialog;
		var dialogFieldsSection = $(".error-message-text", dialog);
		dialogFieldsSection.innerHTML = error && error.Message;

		$css.addClass(dialog, "active");
	}
};

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype._onAddNewItemClick = function TopologyManagerClientDialog$_onAddNewItemClick()
{
	var type = this.properties.selectedType;
	if (type)
	{
		this._activateAddDialog(type);
	}
};

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype._onConfirmClick = function TopologyManagerClientDialog$_onConfirmClick()
{
	var p = this.properties;
	var type = p.selectedType;
	if (this._isDialogActive() && type)
	{
		var data = {};
		[].forEach.call($$(".fields input", p.controls.itemDialog), function(input)
		{
			data[input.id] = data.value;
		});

		this.getListProviderInstance().addTtmItem(
			type,
			data,
			this.getDelegate(function onItemAdded()
			{
				this._renderList();
				this._deactivateDialog();
			}),
			this.getDelegate(this._onTtmInfoLoadFailed));
	}
};

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype._onBackToSectionClick = function TopologyManagerClientDialog$_onBackToSectionClick()
{
	if (this._isDialogActive())
	{
		this._deactivateDialog();
	}
	else
	{
		this._deinitializeElements();
	}
};

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype._onCloseErrorClick = function TopologyManagerClientDialog$_onCloseErrorClick()
{
	if (this._isErrorDialogActive())
	{
		var dialog = this.properties.controls.errorDialog;
		var dialogFieldsSection = $(".error-message-text", dialog);
		dialogFieldsSection.innerHTML = "";

		$css.removeClass(dialog, "active");
	}
};

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype._isDialogActive = function TopologyManagerClientDialog$_isDialogActive()
{
	return $css.hasClass(this.properties.controls.itemDialog, "active");
};

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype._isErrorDialogActive = function TopologyManagerClientDialog$_isDialogActive()
{
	return $css.hasClass(this.properties.controls.errorDialog, "active");
};

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype._onBodyClick = function TopologyManagerClientDialog$_onBodyClick(e)
{
	var source = Tridion.Utils.Event.srcElement(e);
	Type.isElement(source) && !$css.hasClass(source, "full") && this._initializeElement(source);
};

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype._initializeElement = function TopologyManagerClientDialog$_initializeElement(source)
{
	var ttmType = source.getAttribute("data-ttm-type");
	if (ttmType)
	{
		this._deinitializeElements();

		this.properties.selectedType = ttmType;
		$css.addClass(source, "full");
		$css.addClass($(".listcontainer"), "active");

		this._renderList();
	}
};

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype._deinitializeElements = function _deinitializeElements()
{
	var el = $dom.getFirstElementChild(this.properties.controls.elementsBody);
	while (el)
	{
		$css.removeClass(el, "full");
		el = $dom.getNextElementSibling(el);
	}

	$css.removeClass($(".listcontainer"), "active");

	this.properties.selectedType = null;
};

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype.getItem = function TopologyManagerClientDialog$getItem()
{
	return $display.getItem();
};

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype._onCloseClick = function TopologyManagerClientDialog$_onCloseClick(e)
{
	this.fireEvent("cancel");
};

UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog.prototype.disposeInterface = Tridion.OO.nonInheritable(function TopologyManagerClientDialog$disposeInterface()
{

});

$display.registerView(UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog);
