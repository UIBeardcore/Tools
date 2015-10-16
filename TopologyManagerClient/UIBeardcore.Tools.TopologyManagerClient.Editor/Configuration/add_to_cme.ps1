param (
    [string]$siteName = $(throw "-siteName is required.")
)

# $tridionSiteName = "`"SDL Web`"" by default


#region Adding Virtual directories

Import-Module "WebAdministration"

$webRoot = $env:ANGUILLA_WEBROOT

if ([string]::IsNullOrEmpty($webRoot)){
    Write-Warning "ANGUILLA_WEBROOT is not set"
    return
}

$sourcepath =  Convert-Path "$webRoot\.."
$appname = "$siteName\WebUI"

#region Adding Virtual directories

    Write-Output "PROGRESS: Configuring Editor extension"

    $xml = [xml](Get-Content ([string](Get-Location) + "\System.config.sample.xml"))
	$xmlEditor = $xml.Configuration.editors.editor;
	$vdirPath = "IIS:\Sites\$appname\Editors\" + $xmlEditor.vdir

	Write-Output "PROGRESS: Adding virtual directory.."

	if (Test-Path $vdirPath) {
		Write-Output "PROGRESS: Virtual directory already exists"
	} else{
		New-Item $vdirPath -type VirtualDirectory -physicalPath $xmlEditor.installpath -Force
		Write-Output "PROGRESS: Virtual directory was added"
	}

#endregion

#region Config xml

	Write-Output "PROGRESS: Adding System.config section.."

    $systemConfigPath = $webRoot + "\Configuration\System.config"
    $systemXml = [xml](Get-Content $systemConfigPath)

	$editorsNode = $systemXml.Configuration.editors;

	[System.Xml.XmlNamespaceManager] $nsm = new-object System.Xml.XmlNamespaceManager $xml.NameTable
	$nsm.AddNamespace("ns", "http://www.sdltridion.com/2009/GUI/Configuration")
	$nsm.AddNamespace("ext", "http://www.sdltridion.com/2009/GUI/extensions")

	if ([string]::IsNullOrEmpty($editorsNode.SelectSingleNode("ns:editor[@name='"+ $xmlEditor.name+"']", $nsm))){

		$editorsNode.AppendChild($systemXml.CreateComment("   UIBeardcore TopologyManagerClient Section   "))
		$editorsNode.AppendChild($systemXml.ImportNode($xmlEditor, $true))
		$systemXml.Save($systemConfigPath);

		Write-Output "PROGRESS: System.config section was added"
	} else {
		Write-Output "PROGRESS: System.config section already exists"
	}

	Write-Output "PROGRESS: Configuration is Set"

#endregion

