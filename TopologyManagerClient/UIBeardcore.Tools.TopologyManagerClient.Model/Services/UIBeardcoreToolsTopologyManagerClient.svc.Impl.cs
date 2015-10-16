using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml;
using System.Xml.Linq;
using System.Net;
using System.Reflection;
using System.Web.Script.Serialization;
using Microsoft.OData.Client;
using TTM = Tridion.TopologyManager.Client;

namespace UIBeardcore.Tools.TopologyManagerClient.Model.Services
{
	public class UIBeardcoreToolsManagerImpl : IUIBeardcoreToolsManager
	{
		private TTM.TopologyManagerClient _ttmClient;

		private string _unsupportedItemTypeExcepton = "Item Type ({0}) is not supported";

		public TTM.TopologyManagerClient TtmClient
		{
			get
			{
				if (_ttmClient == null)
				{
					_ttmClient = new TTM.TopologyManagerClient
					{
						Credentials = CredentialCache.DefaultCredentials
					};
				}
				return _ttmClient;
			}
		}

		#region ITranslationInfoManager Members

		public string GetTtmListObject(string ttmItemsType)
		{
			try
			{
				return new JavaScriptSerializer().Serialize(GetTtmObjectsList(ttmItemsType));
			}
			catch (Exception ex)
			{
				throw new Exception(String.Format(_unsupportedItemTypeExcepton, ttmItemsType), ex);
			}
		}

		public string GetTtmList(string ttmItemsType)
		{
			try
			{
				IEnumerable <TTM.TopologyItemData> list = GetTtmObjectsList(ttmItemsType);
				return SerializeResoponce(list).ToString();
			}
            catch (Exception ex)
			{
				throw new Exception(String.Format(_unsupportedItemTypeExcepton, ttmItemsType), ex);
			}
		}

		public string GetFieldStructure(string ttmItemsType)
		{
			try
			{
				return new JavaScriptSerializer().Serialize(GetFieldData(ttmItemsType));
			}
			catch (Exception ex)
			{
				throw new Exception(String.Format(_unsupportedItemTypeExcepton, ttmItemsType), ex);
			}
		}

		public void DeleteTtmItem(string ttmItemsType, string ttmItemId)
		{
			try
			{
				IEnumerable<TTM.TopologyItemData> list = GetTtmObjectsList(ttmItemsType);
				var item = list?.First(x => x.Id == ttmItemId);
				if (item != null)
				{
					TtmClient.DeleteObject(item);
                    TtmClient.SaveChanges(SaveChangesOptions.None);
				}
			}
			catch (Exception ex)
			{
				throw new Exception(String.Format(_unsupportedItemTypeExcepton, ttmItemsType), ex);
			}
		}

		public void AddTtmItem(string ttmItemsType, string data)
		{
			try
			{
				switch (GetTtmType(ttmItemsType))
				{
					case TTMEntityType.CdEnvironment:
						var cdData = GetTtmObjectFromJson<TTM.CdEnvironmentData>(data);
						if (TtmClient.CdEnvironments.First(x => x.Id == cdData.Id) != null)
						{
							TtmClient.UpdateObject(cdData);
						}
						else
						{
							TtmClient.AddToCdEnvironments(cdData);
						}

						break;

					//case TTMEntityType.CdTopology:
					//	ttmItemData = GetTtmObjectFromJson<TTM.CdTopologyData>(data);
					//	break;
					//case TTMEntityType.CdTopologyType:
					//	ttmItemData = GetTtmObjectFromJson<TTM.CdTopologyTypeData>(data);
					//	break;
					//case TTMEntityType.CmEnvironment:
					//	ttmItemData = GetTtmObjectFromJson<TTM.CmEnvironmentData>(data);
					//	break;
					//case TTMEntityType.Mapping:
					//	ttmItemData = GetTtmObjectFromJson<TTM.MappingData>(data);
					//	break;
					//case TTMEntityType.WebApplication:
					//	ttmItemData = GetTtmObjectFromJson<TTM.WebApplicationData>(data);
					//	break;
					//case TTMEntityType.Website:
					//	ttmItemData = GetTtmObjectFromJson<TTM.WebsiteData>(data);
					//	break;
				}

				//System.Diagnostics.Debugger.Break();
				//var ttmItemData = new JavaScriptSerializer().Deserialize<TTM.TopologyItemData>(data);

				//IEnumerable<TTM.TopologyItemData> list = GetTtmObjectsList(ttmItemsType);

				//var item = list?.First(x => x.Id == ttmItemData.Id);
				//if (item != null)// Update
				//{
				//	TtmClient.UpdateObject(data);
				//}
				//else // Add
				//{
				//	switch (GetTtmType(ttmItemsType))
				//	{
				//		case TTMEntityType.CdEnvironment:
				//			TtmClient.AddToCdEnvironments(GetTtmObjectFromJson<TTM.CdEnvironmentData>(data));
				//			break;
				//		case TTMEntityType.CdTopology:
				//			TtmClient.AddToCdTopologies(GetTtmObjectFromJson<TTM.CdTopologyData>(data));
				//			break;
				//		case TTMEntityType.CdTopologyType:
				//			TtmClient.AddToCdTopologyTypes(GetTtmObjectFromJson<TTM.CdTopologyTypeData>(data));
				//			break;
				//		case TTMEntityType.CmEnvironment:
				//			TtmClient.AddToCmEnvironments(GetTtmObjectFromJson<TTM.CmEnvironmentData>(data));
				//			break;
				//		case TTMEntityType.Mapping:
				//			TtmClient.AddToMappings(GetTtmObjectFromJson<TTM.MappingData>(data));
				//			break;
				//		case TTMEntityType.WebApplication:
				//			TtmClient.AddToWebApplications(GetTtmObjectFromJson<TTM.WebApplicationData>(data));
				//			break;
				//		case TTMEntityType.Website:
				//			TtmClient.AddToWebsites(GetTtmObjectFromJson<TTM.WebsiteData>(data));
				//			break;
				//	}
				//}

				TtmClient.SaveChanges(SaveChangesOptions.None);
			}
			catch (Exception ex)
			{
				throw new Exception(String.Format(_unsupportedItemTypeExcepton, ttmItemsType), ex);
			}
		}

		#endregion

		#region private functions

		private T GetTtmObjectFromJson<T>(string data)
		{
			return (T)(new JavaScriptSerializer().Deserialize<T>(data));
		}

		private object GetFieldData(string ttmItemsType)
		{
			// TODO: Refactor this ugly code
			switch (GetTtmType(ttmItemsType))
			{
				case TTMEntityType.CdEnvironment:
					// TODO: Does not work so far because of serialization
					return new TTM.CdEnvironmentData();
				case TTMEntityType.CdTopology:
					return new TTM.CdTopologyData();
				case TTMEntityType.CdTopologyType:
					return new TTM.CdTopologyTypeData();
				case TTMEntityType.CmEnvironment:
					// TODO: Does not work so far because of serialization
					return new TTM.CmEnvironmentData();
				case TTMEntityType.Mapping:
					return new TTM.MappingData();
				case TTMEntityType.WebApplication:
					return new TTM.WebApplicationData();
				case TTMEntityType.Website:
					return new TTM.WebsiteData();
				default:
					return null;
			}
		}

		private IEnumerable<TTM.TopologyItemData> GetTtmObjectsList(string ttmItemsType)
		{
			// TODO: Refactor this ugly code
			switch (GetTtmType(ttmItemsType))
			{
				case TTMEntityType.CdEnvironment:
					// TODO: Does not work so far because of serialization
					return TtmClient.CdEnvironments;
				case TTMEntityType.CdTopology:
					return TtmClient.CdTopologies;
				case TTMEntityType.CdTopologyType:
					return TtmClient.CdTopologyTypes;
				case TTMEntityType.CmEnvironment:
					// TODO: Does not work so far because of serialization
					return TtmClient.CmEnvironments;
				case TTMEntityType.Mapping:
					return TtmClient.Mappings;
				case TTMEntityType.WebApplication:
					return TtmClient.WebApplications;
				case TTMEntityType.Website:
					return TtmClient.Websites;
				default:
					return null;
			}
		}

		#endregion

		#region helper functions

		public static TTMEntityType GetTtmType(string type)
		{
			var itemType = TTMEntityType.Undefined;
			if (!String.IsNullOrEmpty(type))
			{
				if (!Enum.TryParse(type, out itemType))
				{
					itemType = TTMEntityType.Undefined;
				}
			}

			return itemType;
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
