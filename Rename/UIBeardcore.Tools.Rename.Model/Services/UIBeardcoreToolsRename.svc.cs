using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;

using Tridion.Web.UI.Core.Extensibility;

namespace UIBeardcore.Tools.Rename.Model.Services
{
	[ServiceContract(Namespace = "http://UIBeardcore/Tools/Rename/Model", Name = "UIBeardcoreToolsManager")]
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
		public string MultipleRename(string[] items, DTO.RenameOptions options)
		{
			return WSImpl.MultipleRename(items, options);
		}

		#endregion
	}
}
