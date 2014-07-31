using System;
using System.Runtime.Serialization;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml;
using System.Xml.Linq;
using Tridion.ContentManager;
using Tridion.ContentManager.CoreService.Client;
using Tridion.Web.CMUtils;
using Tridion.Web.UI.Core;

namespace UIBeardcore.Tools.Rename.Model.Services
{
	public class UIBeardcoreToolsManagerImpl : IUIBeardcoreToolsManager
    {
        #region ITranslationInfoManager Members

		public string MultipleRename(string[] itemsIds, DTO.RenameOptions options)
		{
			SessionAwareCoreServiceClient coreClient = CMSession.GetInstance().CoreServiceClient;

			ParametersDictionary operationParameters = new ParametersDictionary();
			operationParameters.Add("NewNameMarkup", options.NewNameMarkup);
			operationParameters.Add("RenameOption", options.RenameOption.ToString());
			operationParameters.Add("DisplayNumbersAtTheEndOfFile", options.DisplayNumbersAtTheEndOfFile.ToString());
			operationParameters.Add("AddSequentialNumbers", options.AddSequentialNumbers.ToString());

			//operationParameters.Add("NumberOfDigits", options.NumberOfDigits.ToString());
			//operationParameters.Add("StartNumberingAt", options.StartNumberingAt.ToString());

			if (options.AddSequentialNumbers)
			{
				int sequanceId = 0;
				foreach (string itemId in itemsIds)
				{
					operationParameters.Add(String.Format("NewNameSequanceMarkup::{0}", itemId), GetSequanceMarkup(sequanceId++, options));
				}
			}

			BatchData batchData = new BatchData();
			batchData.Id = TcmUri.UriNull;
	
			batchData.Operations = new BatchOperationData[] { new BatchOperationData()
			{
				Operation = "BeardcoreMultipleRename",
				SubjectLinks = itemsIds.AsQueryable().Select<string, WeakLink>((entry) => new WeakLink() {IdRef = entry}).ToArray(),
				Parameters = operationParameters
			} };

			IdentifiableObjectData batchObject = coreClient.Save(batchData, new ReadOptions());
			return SerializeResoponce(batchObject).ToString();
		}
		
        #endregion

		#region helper functions

		private string GetSequanceMarkup(int sequanceId, DTO.RenameOptions options)
		{
			string numberMarkup = "0";
			if (options.AddSequentialNumbers)
			{
				numberMarkup = (options.StartNumberingAt + sequanceId).ToString();
				int numLength = options.NumberOfDigits - numberMarkup.Length;
				if (numLength > 0)
				{
					numberMarkup = (new String('0', numLength)) + numberMarkup;
				}
			}

			return numberMarkup;
		}

		private static XElement SerializeResoponce(object objectToSerialize)
		{
			DataContractSerializer dSer = new DataContractSerializer(objectToSerialize.GetType());

			using (MemoryStream ms = new MemoryStream())
			using (XmlTextWriter sW = new XmlTextWriter(ms, Encoding.UTF8))
			{
				dSer.WriteObject(sW, objectToSerialize);
				sW.Flush();

				ms.Position = 0;

				using (XmlTextReader xReader = new XmlTextReader(ms))
				{
					xReader.MoveToContent();
					return XElement.Parse(xReader.ReadOuterXml());
				}
			}
		}

		#endregion
    }
}
