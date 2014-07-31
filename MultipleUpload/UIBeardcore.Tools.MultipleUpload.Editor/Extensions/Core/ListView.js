/**
 * WARNING:  Register the namespace of what you are going to extend.
 */
Tridion.Type.registerNamespace("Tridion.Controls");

/**
 * WARNING:  Check if Object is initialized already
 */
if (Tridion.Controls.ListView)
{
	/**
	 * WARNING: Hide implementation in local scope, 
	 * so it won`t mess up with other extensions, ot other variables
	 */
	(function ()
	{
		//	Clearly identify the method you override, and an extension where you are doing so.
		//	I`d suggest the following pattern "_overridden${original function name}${extension name}"
		/**
		 * Clearly identify the method you override, 
		 * and an extension where you are doing this.
		 *
		 * I`d suggest the following pattern "_overridden${original function name}${extension name}"
		 */
		var _overridden$ListView$_initializeBodyEvents$UIBeardcore = Tridion.Controls.ListView.prototype._initializeBodyEvents;
		Tridion.Controls.ListView.prototype._initializeBodyEvents = function ListView$_initializeBodyEvents$UIBeardcore(request)
		{
			/**
			 * WARNING: Use apply(this, arguments) unless you don`t want to modify arguments.
			 */
			_overridden$ListView$_initializeBodyEvents$UIBeardcore.apply(this, arguments);


			var p = this.properties;
			p.hasFileDragAndDropSupport$UIBeardcore = undefined;
			p.isMarkedDragable$UIBeardcore = false;
			p.unmarkTimeout = undefined;


			if (this._hasDragAndDropFileSupport$UIBeardcore())
			{
				var ifrdoc = this._getDocument();

				$evt.removeEventHandler(ifrdoc, "dragover", this.getDelegate(this._onDragOver$UIBeardcore));
				$evt.removeEventHandler(ifrdoc, "dragenter", this.getDelegate(this._onDragEnter$UIBeardcore));
				$evt.removeEventHandler(ifrdoc, "dragleave", this.getDelegate(this._onDragLeave$UIBeardcore));
				$evt.removeEventHandler(ifrdoc, "drop", this.getDelegate(this._onDrop$UIBeardcore));

				$evt.addEventHandler(ifrdoc, "dragover", this.getDelegate(this._onDragOver$UIBeardcore));
				$evt.addEventHandler(ifrdoc, "dragenter", this.getDelegate(this._onDragEnter$UIBeardcore));
				$evt.addEventHandler(ifrdoc, "dragleave", this.getDelegate(this._onDragLeave$UIBeardcore));
				$evt.addEventHandler(ifrdoc, "drop", this.getDelegate(this._onDrop$UIBeardcore));

			}
		};

		Tridion.Controls.ListView.prototype._isDragAllowed$UIBeardcore = function ListView$_isDragAllowed$UIBeardcore()
		{
			var ownerList = this.properties.list;
			return ownerList && ownerList.isDragAllowed$UIBeardcore();
		};

		Tridion.Controls.ListView.prototype._hasDragAndDropFileSupport$UIBeardcore = function ListView$_hasDragAndDropFileSupport$UIBeardcore()
		{
			var p = this.properties;
			if (p.hasFileDragAndDropSupport$UIBeardcore === undefined)
			{
				// check if browser supports HTML5 drag and drop
				// problems with detecting support for FILE drag and drop... will assume it's supported, otherwise it will be catched later on
				// https://github.com/Modernizr/Modernizr/wiki/Undetectables
				p.hasFileDragAndDropSupport$UIBeardcore = (window.ondrop !== undefined && window.ondragstart !== undefined && typeof (FileReader) !== "undefined" && typeof (FormData) !== "undefined");
			}

			return p.hasFileDragAndDropSupport$UIBeardcore;
		};

		Tridion.Controls.ListView.prototype._markDragable$UIBeardcore = function ListView$_markDragable$UIBeardcore()
		{
			if (this._isDragAllowed$UIBeardcore() && !this.isDisabled())
			{
				var p = this.properties;
				if (p.isMarkedDragable$UIBeardcore)
				{
					if (p.unmarkTimeout)
					{
						clearTimeout(p.unmarkTimeout);
						p.unmarkTimeout = undefined;
					}
				}
				else
				{
					var ifrdoc = this._getDocument();
					ifrdoc && $css.addClass(ifrdoc.documentElement, "ui-beardcore-draggable");
					p.isMarkedDragable$UIBeardcore = true;
				}
			}
		};

		Tridion.Controls.ListView.prototype._demarkDragable$UIBeardcore = function ListView$_demarkDragable$UIBeardcore()
		{
			var p = this.properties;
			if (p.isMarkedDragable$UIBeardcore && !p.unmarkTimeout)
			{
				p.unmarkTimeout = setTimeout(this.getDelegate(function _demarkDragable_Timeout$UIBeardcore()
				{
					var ifrdoc = this._getDocument();
					ifrdoc && $css.removeClass(ifrdoc.documentElement, "ui-beardcore-draggable");
					p.isMarkedDragable$UIBeardcore = false;
				}), 100);
			}
		};

		Tridion.Controls.ListView.prototype._onDragOver$UIBeardcore = function ListView$_onDragOver$UIBeardcore(event)
		{
			$e.cancel(event);
			this._markDragable$UIBeardcore();

			this.fireEvent("ui-beardcore-listdragover", { sourceEvent: event });
		};

		Tridion.Controls.ListView.prototype._onDragEnter$UIBeardcore = function ListView$_onDragEnter$UIBeardcore(event)
		{
			$e.cancel(event);

			this.fireEvent("ui-beardcore-listdragenter", { sourceEvent: event });
		};

		Tridion.Controls.ListView.prototype._onDragLeave$UIBeardcore = function ListView$_onDragLeave$UIBeardcore(event)
		{
			$e.cancel(event);
			this._demarkDragable$UIBeardcore();

			this.fireEvent("ui-beardcore-listdragleave", { sourceEvent: event });
		};

		Tridion.Controls.ListView.prototype._onDrop$UIBeardcore = function ListView$_onDrop$UIBeardcore(event)
		{
			$e.cancel(event);
			this._demarkDragable$UIBeardcore();

			this.fireEvent("ui-beardcore-listdrop", { sourceEvent: event });
		};

	})();
}