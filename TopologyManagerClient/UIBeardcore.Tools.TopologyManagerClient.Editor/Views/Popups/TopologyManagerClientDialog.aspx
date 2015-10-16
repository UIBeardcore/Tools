<%@ Page Language="C#" AutoEventWireup="true" Inherits="UIBeardcore.Tools.TopologyManagerClient.Views.Popups.TopologyManagerClientDialog" ClassName="TopologyManagerClientDialog" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html class="tridion popupdialog" id="TopologyManagerClientDialog" xmlns="http://www.w3.org/1999/xhtml" xmlns:c="http://www.sdltridion.com/web/ui/controls" >
	<head>
		<title>Topology Manager Client</title>
		<cc:TridionManager runat="server" Editor="CME" IsStandAloneView="true">
			<dependencies runat="server">		
                <dependency runat="server">SDL.Web.UI.Editors.CME</dependency>
				<dependency runat="server">SDL.Web.UI.Editors.CME.CommandSets.All</dependency>
                <dependency runat="server">UIBeardcore.Tools.TopologyManagerClient.Editor</dependency>
			</dependencies>
		</cc:TridionManager>
	</head>
	<body>
        <div class="dialogtitle">Topology Manager Client</div>
        <div class="container">
            <div data-ttm-type="CdTopologyType">Topology Types</div>
            <div data-ttm-type="CdEnvironment">Cd Environments</div>
            <div data-ttm-type="CdTopology">Cd Topologies</div>
            <div data-ttm-type="Website">Websites</div>
            <div data-ttm-type="WebApplication">WebApplications</div>
            <div data-ttm-type="CmEnvironment">Cm Environments</div>
            <div data-ttm-type="Mapping" class="cicrle">Mappings</div>
		</div>
        <div class="listcontainer">
            <c:Button ID="BackToSection" runat="server" class="uibc-list-buttons imageButton button2013 touchButton gray noTextButton"/>
            <c:Button ID="AddNewItem" runat="server" class="uibc-list-buttons at-right imageButton button2013 touchButton gray noTextButton"/>
            <c:DrilldownList runat="server" ID="TtmList" MultiSelect="false" ShowViewModeButtons="false" ShowRefreshButton="true" />
		</div>
        <div class="itemdialog">
            <c:Button ID="ItemConfirm" runat="server" class="uibc-list-buttons at-right imageButton button2013 touchButton gray noTextButton"/>
            <div class="fields"></div>
		</div>
        <div class="error-message">
            <c:Button ID="CloseError" runat="server" class="uibc-list-buttons imageButton button2013 touchButton gray noTextButton"/>
            <div class="error-message-text"></div>
		</div>
        <div class="BtnWrapper">
            <c:Button ID="Close" runat="server" Label="<%$ Resources: Tridion.Web.UI.Editors.Base.Strings, Close %>" />
        </div>
	</body>
</html>