using System.Runtime.Serialization;

namespace UIBeardcore.Tools.Rename.Model.DTO
{
	[DataContract(Namespace = "http://schemas.datacontract.org/2004/07/UIBeardcore.Tools.Rename.Model")]
	public struct RenameOptions
	{
		[DataMember]
		public string NewNameMarkup;

		[DataMember]
		public RenameFileNameOptions RenameOption;

		[DataMember]
		public bool AddSequentialNumbers;

		[DataMember]
		public int NumberOfDigits;

		[DataMember]
		public int StartNumberingAt;

		[DataMember]
		public bool DisplayNumbersAtTheEndOfFile;
	}
}