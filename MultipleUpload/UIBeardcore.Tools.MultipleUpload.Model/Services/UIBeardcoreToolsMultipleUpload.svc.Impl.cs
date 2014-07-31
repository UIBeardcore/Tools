using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using Tridion.ContentManager;
using Tridion.ContentManager.CoreService.Client;
using Tridion.Web.CMUtils;
using Tridion.Web.UI.Core;

namespace UIBeardcore.Tools.MultipleUpload.Model.Services
{
	public class UIBeardcoreToolsManagerImpl : IUIBeardcoreToolsManager
    {
        #region ITranslationInfoManager Members

		public string CreateBeardcoreItemFromFile(string orgItemId, string fileName, string fileData, bool doneEditing)
		{
			SessionAwareCoreServiceClient coreClient = CMSession.GetInstance().CoreServiceClient;

			Match regExMatch = Regex.Match(fileData, @"data:(?<mimetype>.+?);base64,(?<data>.+)");

			//fileData = "data:image/jpeg;base64,/9j/4AAQSkZJRgA...

			var base64MimeType = regExMatch.Groups["mimetype"].Value;
			var base64Data = regExMatch.Groups["data"].Value;
			var byteData = Convert.FromBase64String(base64Data);

			TcmUri orgItemUri = new TcmUri(orgItemId);
			if (orgItemUri == TcmUri.UriNull)
			{
				throw new Exception("Upload location is not defined");
			}

			TcmUri pubUri = new TcmUri(orgItemUri.PublicationId, Tridion.ContentManager.ItemType.Publication);

			Task<TcmUri> determineSchemaToUseTask = Task.Factory.StartNew<TcmUri>(
							() =>
							{
								// Determine the default schema for the component to be created.
								TcmUri schemaUri = TcmUri.UriNull;

								// Folder's linked schema takes precedence
								FolderData folderData = null;
								lock (coreClient)
								{
									folderData = coreClient.Read(orgItemUri.ToString(), null) as FolderData;
								}
								if (folderData.LinkedSchema != null)
								{
									TcmUri linkedSchemaUri = new TcmUri(folderData.LinkedSchema.IdRef);
									if (!linkedSchemaUri.IsUriNull)
									{
										schemaUri = linkedSchemaUri;
									}
								}
								if (schemaUri.IsUriNull)
								{
									// use the default schema from the publication
									PublicationData pubData = null;
									lock (coreClient)
									{
										pubData = coreClient.Read(pubUri.ToString(), null) as PublicationData;
									}
									schemaUri = new TcmUri(pubData.DefaultMultimediaSchema.IdRef);
								}
								return schemaUri;
							}
						);

			InstanceData schemaInstanceData = coreClient.GetInstanceData(determineSchemaToUseTask.Result,
				orgItemUri.ToString(),
				new ReadOptions() { LoadFlags = LoadFlags.KeywordXlinks | LoadFlags.Expanded }
				) as InstanceData;

			Task<MultimediaTypeData> determineMultiMediaTypeTask = Task.Factory.StartNew<MultimediaTypeData>(
							() =>
							{
								IEnumerable<IdentifiableObjectData> mmList = null;
								lock (coreClient)
								{
									mmList = coreClient.GetSystemWideList(new MultimediaTypesFilterData());
								}

								MultimediaTypeData mmType = null;
								mmType = mmList.FirstOrDefault<IdentifiableObjectData>(
																				(entry) =>
																				{
																					MultimediaTypeData mmEntry = (MultimediaTypeData)entry;
																					return mmEntry.MimeType == base64MimeType;
																				}
																			) as MultimediaTypeData;

								return mmType;
							}
						);

			// Wait for completion
			Task.WaitAll(determineMultiMediaTypeTask, determineSchemaToUseTask);
			if (determineMultiMediaTypeTask.Result == null)
			{
				throw new Exception(String.Format("Can not identify '{0}' MimeType of the file.", base64MimeType));
			}
			if (determineSchemaToUseTask.Result.IsUriNull)
			{
				throw new Exception("Can not identify associated schema.");
			}

			// upload binary content to cms 
			string uploadFilePath;
			using (Stream contentStream = new MemoryStream(byteData))
			using (StreamUploadClient uploadClient = new StreamUploadClient("streamUpload_netTcp_201401"))
			{
				// use the content stream from your original component 
				// by creating a new MemoryStream using a byte[] for example
				//uploadFilePath = uploadClient.UploadBinaryByteArray(fileName, byteData);

				uploadFilePath = uploadClient.UploadBinaryContent(fileName, contentStream);
			}

			ComponentData compData = (ComponentData)coreClient.GetDefaultData(
							Tridion.ContentManager.CoreService.Client.ItemType.Component,
							orgItemUri.ToString(),
							new ReadOptions());

			compData.Metadata = schemaInstanceData.Metadata;
			compData.Schema = new LinkToSchemaData() { IdRef = determineSchemaToUseTask.Result };
			compData.Title = fileName;
			compData.BinaryContent = new BinaryContentData();
			compData.BinaryContent.UploadFromFile = uploadFilePath;
			compData.BinaryContent.Filename = fileName;
			compData.BinaryContent.IsExternal = false;
			compData.BinaryContent.MultimediaType = new LinkToMultimediaTypeData()
			{
				IdRef = determineMultiMediaTypeTask.Result.Id, 
				Title = determineMultiMediaTypeTask.Result.Title,
			};

			IdentifiableObjectData savedComponent;

			ReadOptions readOptions = new ReadOptions() {};


			savedComponent = coreClient.Save(compData, readOptions);

			if (doneEditing)
			{
				savedComponent = coreClient.CheckIn(savedComponent.Id, true, null, readOptions);
			}

			return SerializeResponce(savedComponent).ToString();
		}
		
        #endregion

		#region helper functions

		private static XElement SerializeResponce(object objectToSerialize)
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
