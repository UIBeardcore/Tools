Type.registerNamespace("UIBeardcore.Tools.Rename");

if (!$config.isModelFacadeClient)
{
	$models.$beardcore = UIBeardcore.Tools.Rename.ModelFactory = new (function ()
	{
		// 'implements' Tridion.ModelsFacade.getItemType
		this.getItemType = function Model$getItemType(item)
		{
			if (item)
			{
				if (Type.isString(item))
				{
					if (item == UIBeardcore.Tools.Rename.Constants.TM_LIST_ROOT)
					{
						return $const.ItemType.JOBLIST;
					}
				}
				//else if (Tridion.OO.implementsInterface(item, "Tridion.IdentifiableObject"))
				//{
				//	return item.getItemType();
				//}
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
			//if (Type.implementsInterface(item, "Tridion.IdentifiableObject") && item.getId())
			//{
			//	//this will initialize the item with static data, if found in any of the loaded lists
			//	$models.updateItemData(item);
			//}
			return item;
		};

		// 'implements' Tridion.ModelsFacade.createNewItem
		this.createNewItem = function Model$createNewItem(type)
		{
			var tempId = "bc:" + $models.getUniqueId();

			var item = $models.createInRepository(tempId, type);
			if (item)
			{
				item.setTemporaryId(tempId);
				return item;
			}
		};

		this.createMultipleOperations = function Model$createMultipleOperations()
		{
			return this.createNewItem($const.ItemType.BEARDCORE_MULTIPLE_OPERATIONS);
		};

	})();
}