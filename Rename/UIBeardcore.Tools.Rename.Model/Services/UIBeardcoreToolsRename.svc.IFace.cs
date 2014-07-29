using System.ServiceModel;

namespace UIBeardcore.Tools.Rename.Model.Services
{
	public interface IUIBeardcoreToolsManager
	{
		string MultipleRename(string[] items, DTO.RenameOptions options);
	}
}