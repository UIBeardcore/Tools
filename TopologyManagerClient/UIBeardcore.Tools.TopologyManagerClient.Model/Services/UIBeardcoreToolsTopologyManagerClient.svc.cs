using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;

using Tridion.Web.UI.Core.Extensibility;

namespace UIBeardcore.Tools.TopologyManagerClient.Model.Services
{
	[ServiceContract(Name = "UIBeardcoreToolsManager", Namespace = "UIBeardcore.Tools.TopologyManagerClient.Model.Services")]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class UIBeardcoreToolsManager : IUIBeardcoreToolsManager
	{
		private readonly IUIBeardcoreToolsManager WSImpl = new UIBeardcoreToolsManagerImpl() as IUIBeardcoreToolsManager;

		#region ITranslationInfoManager Members

		[OperationContract]
		[DataExtenderBehavior(TreatReturnValueAsXml = true)]
		[WebInvoke(Method = "POST",
					RequestFormat = WebMessageFormat.Json,
					ResponseFormat = WebMessageFormat.Json)]
		public string GetTtmList(string ttmItemsType)
		{
			return WSImpl.GetTtmList(ttmItemsType);
		}

		[OperationContract]
		//[DataExtenderBehavior(TreatReturnValueAsXml = false)]
		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json)]
		public string GetTtmListObject(string ttmItemsType)
		{
			return WSImpl.GetTtmListObject(ttmItemsType);
		}

		[OperationContract]
		[WebInvoke(Method = "POST",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json)]
		public string GetFieldStructure(string ttmItemsType)
		{
			return WSImpl.GetFieldStructure(ttmItemsType);
		}

		[OperationContract]
		[WebInvoke(Method = "POST",
					RequestFormat = WebMessageFormat.Json,
					ResponseFormat = WebMessageFormat.Json)]
		public void DeleteTtmItem(string ttmItemsType, string ttmItemId)
		{
			WSImpl.DeleteTtmItem(ttmItemsType, ttmItemId);
		}

		[OperationContract]
		[WebInvoke(Method = "POST",
					RequestFormat = WebMessageFormat.Json,
					ResponseFormat = WebMessageFormat.Json)]
		public void AddTtmItem(string ttmItemsType, string data)
		{
			WSImpl.AddTtmItem(ttmItemsType, data);
		}


		#endregion
	}
}
