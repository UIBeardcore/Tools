<%@ Page Language="C#" AutoEventWireup="true" Inherits="UIBeardcore.Tools.Rename.Views.Popups.RenameDialog" ClassName="RenameDialog" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html class="tridion popupdialog" id="RenameDialog" xmlns="http://www.w3.org/1999/xhtml" xmlns:c="http://www.sdltridion.com/web/ui/controls" >
	<head>
		<title>Rename</title>
		<cc:TridionManager runat="server" Editor="CME" IsStandAloneView="false">
			<dependencies runat="server">		
				<dependency runat="server">Tridion.Web.UI.Editors.CME</dependency>
			</dependencies>
		</cc:TridionManager>
	</head>
	<body id="Stack" class="stack horizontal fixed">
		<div class="dialogtitle stack-elem" id="DialogTitle">Rename</div>
		<div class="stack-calc form fieldgroup line fieldbuilder">
			<div class="field">
				<div id="ElementsSelectedLabel"></div>
			</div>

			<div class="sub-header">Rename Files</div>

			<div class="field">
				<label for="NewFileName">File Name</label>
				<div>
					<input id="NewFileName" tabIndex="1" maxlength="250" runat="server" class="text" disabled="disabled" type="text" value="" />
				</div>
			</div>

			<div class="field">
				<div>
					<input id="ReplaceExisting" name="modify-existing" tabIndex="1" type="radio" class="checkbox" disabled="disabled" checked="checked"/>
					<label for="ReplaceExisting">Replace existing File Name</label>
				</div>
			</div>

			<div class="field">
				<div>
					<input id="PredeceExisting" name="modify-existing" tabIndex="1" type="radio" class="checkbox" disabled="disabled"/>
					<label for="PredeceExisting">Predece existing File Name</label>
				</div>
			</div>

			<div class="field">
				<div>
					<input id="FollowExisting" name="modify-existing" tabIndex="1" type="radio" class="checkbox" disabled="disabled"/>
					<label for="FollowExisting">Follow existing File Name</label>
				</div>
			</div>
			
			<div class="sub-header" id="AddSequentialNumbers-Section">Automatic Numbering</div>
			
			<div class="field">
				<div>
					<input id="AddSequentialNumbers" tabIndex="1" type="checkbox" class="checkbox" disabled="disabled"/>
					<label for="AddSequentialNumbers">Add sequential numbers</label>
				</div>
			</div>
			
			<div class="field">
				<div class="sequential-numbers">
					<div>
						<input id="NumberOfDigits" tabIndex="1" maxlength="1" runat="server" class="text" disabled="disabled" type="text" value="1" />
						<label for="NumberOfDigits">Number of Digits</label>
					</div>
					<div>					
						<input id="StartNumberingAt" tabIndex="1" maxlength="5" runat="server" class="text" disabled="disabled" type="text" value="0" />
						<label for="StartNumberingAt">Start numbering at</label>
					</div>
				</div>
			
				<div class="sequential-position">
					<div>
						<input id="BeginningOf" name="display-position" tabIndex="1" type="radio" class="checkbox" disabled="disabled" checked="checked"/>
						<label for="BeginningOf">Beginning of file name</label>
					</div>
					<div>
						<input id="EndOf" name="display-position" tabIndex="1" type="radio" class="checkbox" disabled="disabled"/>
						<label for="EndOf">End of file name</label>
					</div>
				</div>
			</div>
			
			<div class="sub-header" id="Preview-Area-Section">Preview</div>			
			
			<pre class="field" id="PreviewArea"></pre>

		</div>
		<div class="BtnWrapper touchButtonWrapper stack-elem">
			<div class="rightbuttons">
				<c:Button ID="Rename" class="button2013 touchButton green" runat="server" Label="Rename" />
				<c:Button ID="Cancel" class="button2013 touchButton gray" runat="server" Label="<%$ Resources: Tridion.Web.UI.Strings, Cancel %>" />
			</div>
		</div>
	</body>
</html>