Type.registerNamespace("UIBeardcore.Tools.Rename");

UIBeardcore.Tools.Rename.MultipleOperations = function MultipleOperations(id)
{
	Tridion.OO.enableInterface(this, "UIBeardcore.Tools.Rename.MultipleOperations");
	this.addInterface("Tridion.ContentManager.MultipleOperations", [id]);
};

// Start Multiple Operations
UIBeardcore.Tools.Rename.MultipleOperations.prototype.rename = function MultipleOperations$rename(items, instructions, skipOnErrors)
{
	var p = this.properties;
	if (!p.active)
	{
		this._initializeOperations(items, "rename");
		this._executeMultipleRename(items, instructions, skipOnErrors, this.getDelegate(this._onUpdateR6), this.getDelegate(this._onError));
	}
	else
	{
		$log.error("Multiple operations object is already active.");
	}
};

UIBeardcore.Tools.Rename.MultipleOperations.prototype._executeMultipleRename = function MultipleOperations$_executeMultipleRename(items, instructions, skipOnError, success, failure)
{
	//tridion.Web.UI.ContentManager.MultipleOperations.MultipleLocalize(items, skipOnError || false, success, failure);
	uibeardcore.Tools.Rename.Model.UIBeardcoreToolsManager.MultipleRename(items, instructions, success, failure);
};

// ------- end of marshallableObject overrides