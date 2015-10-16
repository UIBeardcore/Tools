param (
    [string]$siteName = $(throw "-siteName is required.")
)

# $tridionSiteName = "`"81 SDL Tridion`"" by default


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

    Write-Output "PROGRESS: Configuring Model extension"

    $xml = [xml](Get-Content ([string](Get-Location) + "\System.config.sample.xml"))
	$xmlModel = $xml.Configuration.models.model;
	$vdirPath = "IIS:\Sites\$appname\Models\" + $xmlModel.vdir

	Write-Output "PROGRESS: Adding virtual directory.."

	if (Test-Path $vdirPath) {
		Write-Output "PROGRESS: Virtual directory already exists"
	} else{
		New-Item $vdirPath -type VirtualDirectory -physicalPath $xmlModel.installpath -Force
		Write-Output "PROGRESS: Virtual directory was added"
	}

#endregion

#region Config xml

	Write-Output "PROGRESS: Adding System.config section.."

    $systemConfigPath = $webRoot + "\Configuration\System.config"
    $systemXml = [xml](Get-Content $systemConfigPath)

	$modelsNode = $systemXml.Configuration.models;

	[System.Xml.XmlNamespaceManager] $nsm = new-object System.Xml.XmlNamespaceManager $xml.NameTable
	$nsm.AddNamespace("ns", "http://www.sdltridion.com/2009/GUI/Configuration")
	$nsm.AddNamespace("ext", "http://www.sdltridion.com/2009/GUI/extensions")

	if ([string]::IsNullOrEmpty($modelsNode.SelectSingleNode("ns:model[@name='"+ $xmlModel.name+"']", $nsm))){

		$modelsNode.AppendChild($systemXml.CreateComment("   UIBeardcore TopologyManagerClient Section   "))
		$modelsNode.AppendChild($systemXml.ImportNode($xmlModel, $true))
		$systemXml.Save($systemConfigPath);

		Write-Output "PROGRESS: System.config section was added"
	} else {
		Write-Output "PROGRESS: System.config section already exists"
	}

	Write-Output "PROGRESS: Configuration is Set"

#endregion

