Tridion.Type.registerNamespace("UIBeardcore.Tools.TopologyManagerClient.Model");

UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider = function TtmClientProvider(id) {
	Tridion.OO.enableInterface(this, "UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider");
	this.addInterface("Tridion.CacheableObject");

	var p = this.properties;
	p.id = id;
};

UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider.IDENTIFIER = "uibc-ttm-client-provider";
UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider.callSequenceId = 42;

UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider.getInstance = function TtmClientProvider$getInstance()
{
	var identifier = UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider.IDENTIFIER;
	return $models.getFromRepository(identifier) || $models.createInRepository(identifier, "UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider", identifier);
};


UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider.prototype.getId = function TtmClientProvider$getId()
{
	return this.properties.id;
};


UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider.prototype.loadFieldStructure = function TranslationJobCreationOptions$loadFieldStructure(ttmEntityType, onLoad, onFail)
{
	var callSequenceId = ++UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider.callSequenceId;

	UIBeardcore.Tools.TopologyManagerClient.Model.Services.UIBeardcoreToolsManager.GetFieldStructure(
		ttmEntityType,
		this.getDelegate(function TtmClientProvider$_onLoad(data)
		{
			if (callSequenceId === UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider.callSequenceId)
			{
				Type.isFunction(onLoad) && onLoad(this.getItemXml(Object.deserialize(data), ttmEntityType));
			}
		}),
		this.getDelegate(function TtmClientProvider$_onLoadFailed(error)
		{
			$log.warn(error && error.Message);
			if (callSequenceId == UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider.callSequenceId)
			{
				Type.isFunction(onFail) && onFail(error);
			}
		}));
};

UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider.prototype.loadTtmList = function TranslationJobCreationOptions$loadTtmList(ttmEntityType, onLoad, onFail)
{
	var callSequenceId = ++UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider.callSequenceId;

	UIBeardcore.Tools.TopologyManagerClient.Model.Services.UIBeardcoreToolsManager.GetTtmListObject(
		ttmEntityType,
		this.getDelegate(function TtmClientProvider$_onLoad(data)
		{
			if (callSequenceId === UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider.callSequenceId)
			{
				Type.isFunction(onLoad) && onLoad(this.getListXml(Object.deserialize(data), ttmEntityType));
			}
		}),
		this.getDelegate(function TtmClientProvider$_onLoadFailed(error)
		{
			$log.warn(error && error.Message);
			if (callSequenceId === UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider.callSequenceId)
			{
				Type.isFunction(onFail) && onFail(error);
			}
		}));
};

UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider.prototype.getListXml = function TranslationJobCreationOptions$getListXml(listJson, ttmEntityType)
{
	return String.format(
		"<ListItems>{0}</ListItems>",
		Array.fromArguments(listJson).map(this.getDelegate(function(item)
		{
			return this.getItemXml(item, ttmEntityType);
		})).join(""));
};

//UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider.prototype.getItemXml = function TranslationJobCreationOptions$getListXml(item, ttmEntityType)
//{
//	return String.format(
//		"<{0}>{1}</{0}>",
//		ttmEntityType,
//		Object.keys(item).map(function (key)
//		{
//			var value = item[key] || "";
//			var type = 'text';
//			if (Type.isArray(value))
//			{
//				type = "array";
//				value = value.map("".format, "<i>{0}</i>").join("");
//			}
//			else if (Type.isObject(value))
//			{
//				type = "object";
//				value = Object.keys(value).map(function (key)
//				{
//					return "<i key='{0}'>{1}</i>".format(key, value[key]);
//				}).join("");
//			}
//			//else if (Type.isString(value))
//			//{
//			//	type = "text";
//			//	//value = $xml.escape(value);
//			//}
//			return String.format("<{0} type='{2}'>{1}</{0}>", key, value, type);
//		}).join(""));
//};

UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider.prototype.getItemXml = function TranslationJobCreationOptions$getListXml(item, ttmEntityType)
{
	return String.format(
		"<{0}>{1}</{0}>",
		ttmEntityType,
		Object.keys(item).map(function (key)
		{
			var value = item[key] || "";
			var type = 'text';
			if (Type.isArray(value))
			{
				type = "array";
				value = value.join(", ");
			}
			else if (Type.isObject(value))
			{
				type = "object";
				value = Object.serialize(value);
			}
			return String.format("<{0} type='{2}'>{1}</{0}>", key, $xml.escape(value), type);
		}).join(""));
};

UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider.prototype.deleteTtmItem = function TranslationJobCreationOptions$deleteTtmItem(ttmEntityType, ttmId, onLoad, onFail)
{
	UIBeardcore.Tools.TopologyManagerClient.Model.Services.UIBeardcoreToolsManager.DeleteTtmItem(
		ttmEntityType,
		ttmId,
		this.getDelegate(function TtmClientProvider$_onLoad(data) {
			Type.isFunction(onLoad) && onLoad(data);
		}),
		this.getDelegate(function TtmClientProvider$_onLoadFailed(error) {
			$log.warn(error && error.Message);
			Type.isFunction(onFail) && onFail(error);
		}));
};

UIBeardcore.Tools.TopologyManagerClient.Model.TtmClientProvider.prototype.addTtmItem = function TranslationJobCreationOptions$addTtmItem(ttmEntityType, data, onLoad, onFail)
{
	UIBeardcore.Tools.TopologyManagerClient.Model.Services.UIBeardcoreToolsManager.AddTtmItem(
		ttmEntityType,
		Object.serialize(data),
		this.getDelegate(function TtmClientProvider$_onLoad(data)
		{
			Type.isFunction(onLoad) && onLoad(data);
		}),
		this.getDelegate(function TtmClientProvider$_onLoadFailed(error)
		{
			$log.warn(error && error.Message);
			Type.isFunction(onFail) && onFail(error);
		}));
};

