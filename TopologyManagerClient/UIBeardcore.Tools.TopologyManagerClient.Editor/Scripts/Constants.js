Type.registerNamespace("UIBeardcore.Tools.TopologyManagerClient");

Tridion.Constants.UIBeardcoreTopologyManagerClientEditorName = "UIBeardcore.Tools.TopologyManagerClient";

UIBeardcore.Tools.TopologyManagerClient.Popups =
{
	TTM_CLIENT_DIALOG:
	{
		URL: $config.expandEditorPath("/Views/Popups/TopologyManagerClientDialog.aspx", Tridion.Constants.UIBeardcoreTopologyManagerClientEditorName),
		PARAMETERS: { width: 600, height: 450 }
	}
};