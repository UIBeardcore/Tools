Type.registerNamespace("UIBeardcore.Tools.Rename");

Tridion.Constants.UIBeardcoreRenameEditorName = "UIBeardcore.Tools.Rename.Editor";

UIBeardcore.Tools.Rename.Popups =
{
	RENAME_DIALOG:
	{
		URL: $config.expandEditorPath("/Views/Popups/RenameDialog.aspx", Tridion.Constants.UIBeardcoreRenameEditorName),
		PARAMETERS: { width: 400, height: 600 }
	}
};