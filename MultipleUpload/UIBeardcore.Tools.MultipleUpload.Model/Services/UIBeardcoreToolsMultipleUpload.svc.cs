using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;

using Tridion.Web.UI.Core.Extensibility;

namespace UIBeardcore.Tools.MultipleUpload.Model.Services
{
	[ServiceContract(Namespace = "http://UIBeardcore/Tools/MultipleUpload/Model", Name = "UIBeardcoreToolsManager")]
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
		public string CreateBeardcoreItemFromFile(string orgItemId, string fileName, string fileData, bool doneEditing)
		{
			return WSImpl.CreateBeardcoreItemFromFile(orgItemId, fileName, fileData, doneEditing);
		}

		#endregion
	}
}
