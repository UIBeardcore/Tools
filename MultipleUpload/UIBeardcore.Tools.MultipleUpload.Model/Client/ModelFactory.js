Type.registerNamespace("UIBeardcore.Tools.MultipleUpload");

if (!$config.isModelFacadeClient)
{
	$models.$beardcoreuploader = UIBeardcore.Tools.MultipleUpload.ModelFactory = new (function ()
	{
		// 'implements' Tridion.ModelsFacade.getItemType
		this.getItemType = function Model$getItemType(item)
		{
			if (Tridion.OO.implementsInterface(item, "Tridion.IdentifiableObject"))
			{
				return item.getItemType();
			}
		};

		// 'implements' Tridion.ModelsFacade.getItem
		this.getItem = function Model$getItem(id)
		{
			var item = $models.getFromRepository(id);
			if (!item)
			{
				item = $models.createInRepository(id, this.getItemType(id), id);
			}
			
			// We don`t have any items with any info associated which need to be updated
			return item;
		};

		// 'implements' Tridion.ModelsFacade.createNewItem
		this.createNewItem = function Model$createNewItem(type)
		{
			var tempId = "bc:" + $models.getUniqueId();
			var item = $models.createInRepository(tempId, type, tempId);
			return item;
		};

		this.getFilesUploader = function Model$getFilesUploader()
		{
			return this.createNewItem($const.ItemType.BEARDCORE_UPLOADER);
		};

	})();
}