Tridion.Type.registerNamespace("UIBeardcore.Tools.TopologyManagerClient.ListTranslators");

UIBeardcore.Tools.TopologyManagerClient.ListTranslators.PopulateListItemInfo = function List$Translators$PopulateListItemInfo(value, context)
{

	return value;
};

UIBeardcore.Tools.TopologyManagerClient.ListTranslators.TranslateUpdateIcon = function List$Translators$TranslateUpdateIcon(value, context)
{

	return value;
};

UIBeardcore.Tools.TopologyManagerClient.ListTranslators.TranslateDelete = function List$Translators$TranslateDelete(value, context)
{
	var element = $("div", context);
	$css(element, "backgroundImage", "url({0})".format($config.getIconPath("delete", 32)));
	$css.replaceClass(element, "text", "icon");
	$evt.addEventHandler(element, "click", function ()
	{
		$display.getView().deleteTtmItem(value);

	});
	return null;
};

UIBeardcore.Tools.TopologyManagerClient.ListTranslators.DeserializeConcat = function List$Translators$DeserializeConcat(value, context)
{
	return value && value.replace(/\|+$/g, "").replace(/\|/g, "<br/>");
};