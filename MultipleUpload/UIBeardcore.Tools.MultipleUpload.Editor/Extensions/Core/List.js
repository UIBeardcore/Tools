/**
 * WARNING:  Register the namespace of what you are going to extend.
 */
Tridion.Type.registerNamespace("Tridion.Controls");

/**
 * WARNING:  Check if Object is initialized already
 */
if (Tridion.Controls.List)
{
	/**
	 * WARNING: Hide implementation in local scope, 
	 * so it won`t mess up with other extensions, ot other variables
	 */
	(function ()
	{
		Tridion.Controls.List.prototype.setDragAllowed$UIBeardcore = function List$setDragAllowed$UIBeardcore(isAllowed)
		{
			var p = this.properties;
			if (p.isDragAllowed$UIBeardcore !== isAllowed)
			{
				p.isDragAllowed$UIBeardcore = (isAllowed == true);
			}
		};

		Tridion.Controls.List.prototype.isDragAllowed$UIBeardcore = function List$isDragAllowed$UIBeardcore()
		{
			return this.properties.isDragAllowed$UIBeardcore;
		};

	})();
}