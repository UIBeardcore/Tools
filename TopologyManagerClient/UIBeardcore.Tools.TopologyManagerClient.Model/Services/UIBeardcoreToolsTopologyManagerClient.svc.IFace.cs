using System.ServiceModel;

namespace UIBeardcore.Tools.TopologyManagerClient.Model.Services
{
	/// <summary>
	/// Defines the types of TTM entities
	/// </summary>
	public enum TTMEntityType
	{
		Undefined,
		CdTopologyType,
		CdEnvironment,
		CdTopology,
		Website,
		WebApplication,
		CmEnvironment,
		Mapping
	}

	public interface IUIBeardcoreToolsManager
	{
		string GetTtmList(string ttmItemsType);
		string GetTtmListObject(string ttmItemsType);
		string GetFieldStructure(string ttmItemsType);
        void DeleteTtmItem(string ttmItemsType, string ttmItemId);
		void AddTtmItem(string ttmItemsType, string data);
		
	}
}