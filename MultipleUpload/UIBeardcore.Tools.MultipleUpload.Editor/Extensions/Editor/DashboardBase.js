/**
 * WARNING:  Register the namespace of what you are going to extend.
 */
Tridion.Type.registerNamespace("Tridion.Cme.Views");

/**
 * WARNING:  Check if Object is initialized already
 */
if (Tridion.Cme.Views.DashboardBase)
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
		var _overridden$DashboardBase$initializeControls$UIBeardcore = Tridion.Cme.Views.DashboardBase.prototype.initializeControls;
		Tridion.Cme.Views.DashboardBase.prototype.initializeControls = function DashboardBase$initializeControls$UIBeardcore(request)
		{
			/**
			 * WARNING: Use apply(this, arguments) unless you don`t want to modify arguments.
			 */
			_overridden$DashboardBase$initializeControls$UIBeardcore.apply(this, arguments);

			var p = this.properties;
			var c = p.controls;

			var list = c.list;
			if (list)
			{
				$evt.addEventHandler(list, "ui-beardcore-listdrop", this.getDelegate(this._onListDrop$UIBeardcore));
			}
		};

		/**
		 * Updates related controls
		 */
		var _overridden$DashboardBase$updateControls$UIBeardcore = Tridion.Cme.Views.DashboardBase.prototype.updateControls;
		Tridion.Cme.Views.DashboardBase.prototype.updateControls = function DashboardBase$updateControls()
		{
			/**
			 * WARNING: Use apply(this, arguments) unless you don`t want to modify arguments.
			*/
			_overridden$DashboardBase$updateControls$UIBeardcore.apply(this, arguments);

			var c = this.properties.controls;

			var command = $commands.getCommand("NewBasicMultimediaComponent");
			c.list.setDragAllowed$UIBeardcore(command && command.isEnabled(this.getListSelection()));
		};


		Tridion.Cme.Views.DashboardBase.prototype._onListDrop$UIBeardcore = function DashboardBase$_onListDrop$UIBeardcore(event)
		{
			var sourceEvent = event && event.data.sourceEvent;
			var dataTransfer = sourceEvent && sourceEvent.dataTransfer;

			// if browser doesn't support this feature (file drag and drop) then don't support it
			if (!dataTransfer || dataTransfer.files === undefined)
			{
				return;
			}

			var selection = this.getListSelection();
			var parentItemUri = selection && selection.getParentItemUri();
			if (parentItemUri)
			{
				var fileUploader = $models.$beardcoreuploader.getFilesUploader();

				var length = dataTransfer.files.length;
				var msg = $messages.registerProgress(String.format("Uploading {0} items...", [length]), null, true);
				msg.setOnSuccessMessage(String.format("{0} items are uploaded.", [length]));
				msg.setOnCancelMessage("Uploading Canceled");

				function BeardcoreMultipleUpload$_onMessageUpdated(args)
				{
					// This is auto triggered
					var itemsDone = args.data.itemsSucceed || msg.getItemsDoneCount();
					msg.setTitle("Uploading items... {0}/{1} done.".format(itemsDone, length));
				};

				$evt.addEventHandler(msg, "update", BeardcoreMultipleUpload$_onMessageUpdated);

				msg.setContinuousIterationObject(fileUploader.getId(), length);

				fileUploader.upload(parentItemUri, dataTransfer, true);
			}
		};
	})();
}