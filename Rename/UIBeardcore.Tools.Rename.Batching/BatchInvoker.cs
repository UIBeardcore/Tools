using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tridion.ContentManager;
using Tridion.Web.CMUtils;
using Tridion.ContentManager.Batching;
using Tridion.ContentManager.CoreService.Client;

namespace UIBeardcore.Tools.Rename.Batching
{
	internal class BatchInvoker : IBatchOperationInvoker
    {
		private UserData _user;
        private bool _cacheStarted;
        private SessionAwareCoreServiceClient _coreServiceClient;

        /// <summary>
        /// Invokes the specified operation on the specified subject.
        /// </summary>
        /// <param name="subjectId">The subject id.</param>
        /// <param name="operation">The name of operation.</param>
        /// <param name="parameters">Additional parameters for performing operation.</param>
        /// <param name="warningMessage">Returns text of warning if it presented. By default contains <c>null</c> value.</param>
        /// <returns>Returns <c>true</c> when the operation/subject could be handled.</returns>
        public bool Invoke(string subjectId, string operation, IDictionary<string, string> parameters, out string warningMessage)
        {
            warningMessage = null;

            if (operation != "BeardcoreMultipleRename")
            {
                return false;
            }

			// Subject must be valid tcmUri. In other case CoreServiceInvoker can't invoke this operation.
            if (string.IsNullOrEmpty(subjectId) || !TcmUri.IsValid(subjectId))
            {
                return false;                    
            }

			if (parameters == null)
            {
                throw new Exception("Parameters are not defined");
            }

			string tmp;
	        string titleMarkup;
			
			if (!parameters.TryGetValue("NewNameMarkup", out titleMarkup))
	        {
				throw new Exception("New file name markup is not defined");   
	        }

			string renameOption = "Replace";
			if (parameters.TryGetValue("RenameOption", out tmp))
			{
				renameOption = tmp;
			}

			bool addSequentialNumbers = true;
			if (parameters.TryGetValue("AddSequentialNumbers", out tmp))
			{
				addSequentialNumbers = Convert.ToBoolean(tmp);
			}

			bool displayNumbersAtTheEndOfFile = true;
			if (parameters.TryGetValue("DisplayNumbersAtTheEndOfFile", out tmp))
			{
				displayNumbersAtTheEndOfFile = Convert.ToBoolean(tmp);
			}

			string newNameSequanceMarkup = "";
	        if (addSequentialNumbers)
	        {
		        if (!parameters.TryGetValue(String.Format("NewNameSequanceMarkup::{0}", subjectId), out newNameSequanceMarkup))
		        {
			        throw new Exception("New file name markup is not defined");
		        }
	        }

	        IdentifiableObjectData itemData = _coreServiceClient.Read(subjectId, new ReadOptions()
			{
				LoadFlags = Tridion.ContentManager.CoreService.Client.LoadFlags.None 
			
			});

			switch (renameOption)
			{
				case "Predece":
					titleMarkup = titleMarkup + itemData.Title;
					break;
				case "Follow":
					titleMarkup = itemData.Title + titleMarkup;
					break;
				case "Replace":				
				default:
					//itemData.Title = titleMarkup;
					break;
			}

			if (addSequentialNumbers)
	        {
		        if (displayNumbersAtTheEndOfFile)
		        {
					titleMarkup = titleMarkup + newNameSequanceMarkup;
		        }
		        else
		        {
					titleMarkup = newNameSequanceMarkup + titleMarkup;					
		        }
	        }

			itemData.Title = titleMarkup;

            _coreServiceClient.Update(itemData, null);

            return true;
        }

        /// <summary>
        /// Resolves the titles of a batch operation subjects.
        /// </summary>
        /// <param name="subjectTitles">Dictionary of dependencies between batch operation subject id and title.</param>
        public void ResolveTitles(IDictionary<string, string> subjectTitles)
        {

        }

        /// <summary>
        /// Initializes the invoker for the specified performer.
        /// </summary>
        /// <param name="performer">The performer of batch operation.</param>
        public void Initialize(string performer)
        {
			//_coreServiceClient = CMSession.GetInstance().CoreServiceClient;
			_coreServiceClient = new SessionAwareCoreServiceClient(TcmConstants.LatestCoreServiceNetTcpEndpointName);
            _user = _coreServiceClient.Impersonate(performer);
			_cacheStarted = _coreServiceClient.StartCaching();
        }

        /// <summary>
        /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
        /// </summary>
        public void Dispose()
        {
            if (_coreServiceClient != null)
            {
                if (_cacheStarted)
                {
                    _coreServiceClient.StopCaching();
                    _cacheStarted = false;
                }
                _coreServiceClient.Dispose();
            }
        }
		
	}
}
