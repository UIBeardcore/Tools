namespace UIBeardcore.Tools.MultipleUpload.Model.Services
{
	public interface IUIBeardcoreToolsManager
	{
		string CreateBeardcoreItemFromFile(string orgItemId, string fileName, string fileData, bool doneEditing);
	}
}