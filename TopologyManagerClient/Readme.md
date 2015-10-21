UIBeardcore Tools | TopologyManagerClient
================================================
	
## Version
This extension is intended for SDL Tridion 2013 SP1. It was not tested in previous versions

## Description
This extension allows you to do multiple items rename in CME

## Installation

1. Do build solutions (Editor and Model)

2. Look at `\UIBeardcore.Tools.TopologyManagerClient.Editor\Configuration\add_to_cme.ps1` and run it 

3. Look at `\UIBeardcore.Tools.TopologyManagerClient.Models\Configuration\add_to_cme.ps1` and run it 

4. Open `%TRIDION_HOME%\web\WebUI\WebRoot\Configuration\System.config` file

5. Locate `\Configuration\servicemodel\server` node in System.config file and increase the value of its `modification` attribute to notify client browsers to update their cache

## Disclaimer
This extensions intended to show you extensibility mechanisms you can find useful in your further development. It does not have intention to provide complete functionality as a final product. However, if you feel this might be interesting and useful, do not hesitate to commit to this project. 