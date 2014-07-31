Type.registerNamespace("UIBeardcore.Tools.MultipleUpload");

UIBeardcore.Tools.MultipleUpload.FileUploader = function FileUploader(id)
{
	Tridion.OO.enableInterface(this, "UIBeardcore.Tools.MultipleUpload.FileUploader");
	this.addInterface("Tridion.ContinuousIterationObject", arguments);
};

UIBeardcore.Tools.MultipleUpload.FileUploader.prototype.getItemType = function FileUploader$getItemType()
{
	return $const.ItemType.BEARDCORE_UPLOADER;
};

UIBeardcore.Tools.MultipleUpload.FileUploader.prototype.upload = function FileUploader$upload(orgItemId, dataTransfer, doneEditing)
{
	var p = this.properties;
	if (!p.active)
	{
		//if (dataTransfer instanceof DataTransfer)
		{
			var filesToUpload = dataTransfer.files;

			this._initializeOperation(orgItemId, filesToUpload);
			for (var i = 0; i < filesToUpload.length; i++)
			{
				this._uploadFile(filesToUpload[i], doneEditing);
			}
		}
	}
	else
	{
		$log.error("Multiple operations object is already active.");
	}
};

UIBeardcore.Tools.MultipleUpload.FileUploader.prototype._initializeOperation = function FileUploader$_initializeOperation(sourceId, items)
{
	var p = this.properties;
	var count = items ? items.length : 0;
	p.sourceId = sourceId;
	p.itemsCount = count;
	p.itemsDoneCount = 0;
	p.errorsCount = 0;
	p.errors = [];
	p.active = true;
	p.cancelled = false;
	p.toCancel = false;
};

UIBeardcore.Tools.MultipleUpload.FileUploader.prototype._uploadFile = function FileUploader$_uploadFile(uploadFile, doneEditing)
{
	var p = this.properties;
	if (p.active && !p.cancelled)
	{
		//if (uploadFile instanceof File)
		{
			var fileName = uploadFile.name;
			var fileReader = new FileReader();

			function FileUploader$onError(error)
			{
				p.itemsDoneCount++;
				p.errors.push({
					"FileName": fileName,
					"ErrorMessage": error.Message || error.message
				});

				this._onUpdate();
			}

			fileReader.onerror = this.getDelegate(FileUploader$onError);

			fileReader.onload = this.getDelegate(function fileReader$onload(e)
			{
				if (p.active && !p.cancelled)
				{
					this.executeCreateItemFromFileContent(
						this.properties.sourceId,
						fileName,
						fileReader.result,
						doneEditing,
						this.getDelegate(this.onUpload),
						this.getDelegate(FileUploader$onError));
				}
			});

			fileReader.readAsDataURL(uploadFile);
		}
	}
};

UIBeardcore.Tools.MultipleUpload.FileUploader.prototype.onUpload = function FileUploader$onUpload(event)
{
	var p = this.properties;
	p.itemsDoneCount++;

	this._onUpdate();
};


UIBeardcore.Tools.MultipleUpload.FileUploader.prototype.getXml = function FileUploader$getXml()
{
	var p = this.properties;
	// We`d emulate multiple operations error
	var errorLines = [];
	for (var i = 0, l = p.errors && p.errors.length; i < l; i++)
	{
		var error = p.errors[i];
		errorLines.push("<tcm:Item xlink:type=\"simple\" xlink:href=\"tcm:0\" xlink:title=\"{0}\" error=\"{1}\"/>".format(error.FileName, error.ErrorMessage));
	}

	return (errorLines.length > 0)
		&& "<tcm:MultipleOperations xmlns:tcm=\"{0}\" xmlns:xlink=\"{1}\"><tcm:Data><tcm:Operations><tcm:Error>{2}</tcm:Error></tcm:Operations></tcm:Data></tcm:MultipleOperations>".format($const.Namespaces.tcm, $const.Namespaces.xlink, errorLines.join(""))
		|| null;
};

/**
 * Return the operation errors count.
 * @return {Number} The number of errors.
 */
UIBeardcore.Tools.MultipleUpload.FileUploader.prototype.getErrorsCount = function ContinuousIterationObject$getErrorsCount()
{
	return this.properties.errors.length;
};

UIBeardcore.Tools.MultipleUpload.FileUploader.prototype._onUpdate = function MultipleOperations$_onUpdate(result)
{
	var p = this.properties;
	if (this.getItemsDoneCount() == this.getItemsCount())
	{
		p.active = false;

		if ((this.getItemsDoneCount() - this.getErrorsCount()) > 0)
		{
			var source = $models.getItem(p.sourceId);
			source.unloadLists();
		}
	}
	else
	{
		if (p.toCancel)
		{
			p.cancelled = true;
			p.toCancel = false;
		}
	}

	this.callBase("Tridion.ContinuousIterationObject", "_onUpdate", [result]);
};

/**
 * Server call to create a Component from a file.
 * @param {String} file The file name.
 * @param {String} title The title for Component.
 * @param {String} orgItemId The Id of organizational Item.
 * @param {String} pubId The id of the Publication.
 * @param {Boolean} doneEditing Specifies if editing the Item has finished.
 * @param {Function} success The callback to be caled on creation success.
 * @param {Function} failure the callback to be called on creation failure.
 */
UIBeardcore.Tools.MultipleUpload.FileUploader.prototype.executeCreateItemFromFileContent = function FileUploader$executeCreateItemFromFileContent(fileName, fileData, orgItemId, doneEditing, success, failure)
{
	uibeardcore.Tools.MultipleUpload.Model.UIBeardcoreToolsManager.CreateBeardcoreItemFromFile(fileName, fileData, orgItemId, doneEditing || false, success, failure);
};